// app/api/payments/paystack/callback/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paystack } from "@/lib/paystack";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");
    if (!reference) return NextResponse.redirect(`${process.env.BASE_URL}/checkout?err=missing_ref`);

    const verify = await paystack<{ data: any }>(`/transaction/verify/${reference}`, {
      method: "GET",
    });

    const data = verify.data;
    const paid = data?.status === "success";

    // find order by reference & sanity check amount/currency
    const order = await prisma.order.findFirst({ where: { payReference: reference } });
    if (!order) return NextResponse.redirect(`${process.env.BASE_URL}/checkout?err=order_missing`);

    // IMPORTANT: match amounts to stop tampering
    const amountOk = Number(data.amount) === Number(order.total);
    const currencyOk = (data.currency || "").toUpperCase() === "ZAR";

    if (paid && amountOk && currencyOk) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "PAID" },
      });
      return NextResponse.redirect(`${process.env.BASE_URL}/checkout/success?orderId=${order.id}`);
    }

    // not paid or mismatch: keep pending / let user retry
    return NextResponse.redirect(`${process.env.BASE_URL}/checkout/success?orderId=${order.id}`);
  } catch (e) {
    return NextResponse.redirect(`${process.env.BASE_URL}/checkout?err=verify_fail`);
  }
}
