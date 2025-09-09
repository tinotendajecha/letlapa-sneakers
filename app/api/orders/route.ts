// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-server";
import { DeliveryWindow, Province, ShippingMethod, OrderStatus, Currency } from "@prisma/client";
import { z } from "zod";

// ---- validation (payload matches what your checkout sends) ----
const Item = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  brand: z.string().optional(),
  image: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  price: z.number().int().nonnegative(),       // cents
  quantity: z.number().int().positive(),
});

const Amounts = z.object({
  subtotal: z.number().int().nonnegative(),
  shippingFee: z.number().int().nonnegative(),
  discount: z.number().int().nonnegative(),
  total: z.number().int().positive(),
  currency: z.literal("ZAR"),
});

const Body = z.object({
  items: z.array(Item).min(1),
  amounts: Amounts,
  // minimal snapshot fields coming from your checkout page:
  contact: z.object({
    fullName: z.string().min(1),
    cellNumber: z.string().min(3),
  }).optional(), // optional if you want to use profile later
  shipping: z.object({
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional().default(""),
    suburb: z.string().min(1),
    province: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().default("South Africa"),
  }),
  delivery: z.object({
    deliveryWindow: z.enum(["anytime","weekdays","evenings","weekends"]),
    instructions: z.string().optional().default(""),
  }),
  selectedShipping: z.enum(["standard", "express"]),
});

const SA_TO_ENUM: Record<string, Province> = {
  "Gauteng": "GAUTENG",
  "Western Cape": "WESTERN_CAPE",
  "KwaZulu-Natal": "KWAZULU_NATAL",
  "Eastern Cape": "EASTERN_CAPE",
  "Free State": "FREE_STATE",
  "Limpopo": "LIMPOPO",
  "Mpumalanga": "MPUMALANGA",
  "North West": "NORTH_WEST",
  "Northern Cape": "NORTHERN_CAPE",
};

const DELIVERY_TO_ENUM: Record<string, DeliveryWindow> = {
  "anytime": "ANYTIME",
  "weekdays": "WEEKDAYS_9_17",
  "evenings": "EVENINGS_17_20",
  "weekends": "WEEKENDS",
};

// ---- util: recompute totals to avoid client tampering ----
function recomputeTotals(items: z.infer<typeof Item>[], shippingFee: number, discount: number) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = Math.max(subtotal + shippingFee - discount, 0);
  return { subtotal, total };
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();

    const json = await req.json();
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const body = parsed.data;

    // Convert enums
    const provinceEnum = SA_TO_ENUM[body.shipping.province];
    if (!provinceEnum) {
      return NextResponse.json({ error: "Invalid province" }, { status: 400 });
    }
    const deliveryEnum = DELIVERY_TO_ENUM[body.delivery.deliveryWindow];
    const shippingMethod: ShippingMethod =
      body.selectedShipping === "express" ? "EXPRESS" : "STANDARD";

    // Recompute totals server-side
    const { subtotal, total } = recomputeTotals(
      body.items,
      body.amounts.shippingFee,
      body.amounts.discount
    );

    if (subtotal !== body.amounts.subtotal || total !== body.amounts.total) {
      return NextResponse.json(
        { error: "Totals mismatch. Please refresh and try again." },
        { status: 400 }
      );
    }

    // (Optional) Validate product prices from your DB if you have a Product table.
    // For now, we trust the snapshot coming from the client but we already recompute totals.

    // Make a unique reference up-front (Paystack prefers unique per transaction)
    const reference = `LET-${Date.now()}-${userId.slice(0,6)}`;

    const order = await prisma.order.create({
      data: {
        userId,
        subtotal,
        shippingFee: body.amounts.shippingFee,
        discount: body.amounts.discount,
        total,
        currency: "ZAR" as Currency,

        shippingMethod,
        deliveryWindow: deliveryEnum,
        deliveryNotes: body.delivery.instructions || null,

        shipToName: body.contact?.fullName ?? "Customer",
        shipToPhone: body.contact?.cellNumber ?? "",
        shipToLine1: body.shipping.addressLine1,
        shipToLine2: body.shipping.addressLine2 || null,
        shipToSuburb: body.shipping.suburb,
        shipToProvince: provinceEnum,
        shipToPostal: body.shipping.postalCode,
        shipToCountry: body.shipping.country || "South Africa",

        status: "PENDING_PAYMENT" as OrderStatus,
        payReference: reference,       // will also send to Paystack on init
        payGateway: "paystack",

        items: {
          create: body.items.map((i) => ({
            productId: i.productId,
            name: i.name,
            brand: i.brand ?? null,
            image: i.image ?? null,
            size: i.size ?? null,
            color: i.color ?? null,
            price: i.price,
            quantity: i.quantity,
          })),
        },
      },
      select: { id: true, payReference: true },
    });

    return NextResponse.json(
      { orderId: order.id, reference: order.payReference },
      { status: 201 }
    );
  } catch (e: any) {
    const status = e?.status ?? 500;
    return NextResponse.json(
      { error: e?.message ?? "Failed to create order" },
      { status }
    );
  }
}
