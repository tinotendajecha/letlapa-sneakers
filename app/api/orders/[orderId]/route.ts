// app/api/orders/[orderId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-server";
import { DeliveryWindow, Province } from "@prisma/client";

const ENUM_TO_SA: Record<Province, string> = {
  GAUTENG: "Gauteng",
  WESTERN_CAPE: "Western Cape",
  KWAZULU_NATAL: "KwaZulu-Natal",
  EASTERN_CAPE: "Eastern Cape",
  FREE_STATE: "Free State",
  LIMPOPO: "Limpopo",
  MPUMALANGA: "Mpumalanga",
  NORTH_WEST: "North West",
  NORTHERN_CAPE: "Northern Cape",
};

function deliveryEnumToClient(dw: DeliveryWindow) {
  switch (dw) {
    case "WEEKDAYS_9_17": return "weekdays";
    case "EVENINGS_17_20": return "evenings";
    case "WEEKENDS": return "weekends";
    default: return "anytime";
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const userId = await requireUserId();
    const { orderId } = params;

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId }, // ensure user owns the order
      include: {
        user: { select: { id: true, email: true, name: true } },
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const payload = {
      orderId: order.id,
      status: order.status, // e.g. "PENDING_PAYMENT"
      user: order.user,
      addressSnapshot: {
        line1: order.shipToLine1,
        line2: order.shipToLine2 ?? "",
        suburb: order.shipToSuburb,
        province: ENUM_TO_SA[order.shipToProvince],
        postalCode: order.shipToPostal,
        country: order.shipToCountry ?? "South Africa",
      },
      preferences: {
        instructions: order.deliveryNotes ?? "",
        deliveryWindow: deliveryEnumToClient(order.deliveryWindow),
      },
      items: order.items.map((it) => ({
        productId: it.productId,
        name: it.name,
        brand: it.brand ?? undefined,
        image: it.image ?? "/placeholder.png",
        size: it.size ?? undefined,
        color: it.color ?? undefined,
        quantity: it.quantity,
        unitPrice: it.price, // cents
      })),
      amounts: {
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        discount: order.discount,
        total: order.total,
        currency: order.currency,
      },
      createdAt: order.createdAt.toISOString(),
    };

    return NextResponse.json(payload);
  } catch (e: any) {
    const status = e?.status ?? 500;
    return NextResponse.json(
      { error: e?.message ?? "Failed to load order" },
      { status }
    );
  }
}
