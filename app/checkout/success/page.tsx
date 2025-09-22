"use client";


export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Package, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { ProgressSteps } from "@/components/checkout/ProgressSteps";
import { formatZar } from "@/lib/checkout-utils";

type Order = {
  orderId: string;
  status: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  addressSnapshot: {
    line1: string;
    line2?: string;
    suburb?: string;
    province: string;
    postalCode?: string;
    country?: string;
  };
  preferences: {
    instructions?: string;
    deliveryWindow: string;
  };
  items: Array<{
    productId: string;
    name: string;
    brand?: string;
    image: string;
    size?: string;
    color?: string;
    quantity: number;
    unitPrice: number;
  }>;
  amounts: {
    subtotal: number;
    shippingFee: number;
    discount: number;
    total: number;
    currency: string;
  };
  createdAt: string;
};

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Order not found");
        }
        const orderData = await response.json();
        setOrder(orderData);
      } catch (err) {
        setError("Failed to load order details");
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getEstimatedDelivery = () => {
    const today = new Date();
    const standardDays = order?.amounts.shippingFee === 9900 ? 3 : 1; // Standard vs Express
    const estimatedDate = new Date(today);
    estimatedDate.setDate(today.getDate() + standardDays);

    return estimatedDate.toLocaleDateString("en-ZA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatDeliveryWindow = (window: string) => {
    switch (window) {
      case "weekdays":
        return "Weekdays 9:00 - 17:00";
      case "evenings":
        return "Evenings 17:00 - 20:00";
      case "weekends":
        return "Weekends";
      default:
        return "Anytime";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf6f1] dark:bg-[#1a120d] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5b3a1a]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#faf6f1] dark:bg-[#1a120d] flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-white/80 dark:bg-[#241a14] border-[#e5d5c8] dark:border-[#3b2a1b]">
          <CardContent className="pt-6 text-center">
            <p className="text-[#3b2a1b] dark:text-[#f5f1eb] mb-4">{error || "Order not found"}</p>
            <Button asChild className="bg-[#5b3a1a] hover:bg-[#6b4423] text-white">
              <Link href="/checkout">Try Again</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f1] dark:bg-[#1a120d] transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProgressSteps currentStep="done" className="mb-8" />

        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-[#3b2a1b] dark:text-[#f5f1eb] mb-2">
            Order Confirmed!
          </h1>
          <p className="text-[#8b7355] dark:text-[#a8956b]">
            Thank you for your purchase. We'll send you a confirmation email shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card className="bg-white/80 dark:bg-[#241a14] border-[#e5d5c8] dark:border-[#3b2a1b]">
            <CardHeader>
              <CardTitle className="text-[#3b2a1b] dark:text-[#f5f1eb] flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#8b7355] dark:text-[#a8956b]">Order Number</span>
                <Badge variant="secondary" className="bg-[#f5f1eb] dark:bg-[#1a120d] text-[#3b2a1b] dark:text-[#f5f1eb]">
                  {order.orderId}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#8b7355] dark:text-[#a8956b]">Status</span>
                <Badge className={order.status === "PAID"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                  : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"}>
                  {order.status === "PAID" ? "Payment Confirmed" : "Payment Pending"}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#8b7355] dark:text-[#a8956b]">Total Amount</span>
                <span className="font-semibold text-[#3b2a1b] dark:text-[#f5f1eb]">
                  {formatZar(order.amounts.total)}
                </span>
              </div>

              <Separator className="bg-[#e5d5c8] dark:bg-[#3b2a1b]" />

              <div>
                <h4 className="font-semibold text-[#3b2a1b] dark:text-[#f5f1eb] mb-2">Items Ordered</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-[#e5d5c8] dark:border-[#3b2a1b] last:border-b-0">
                    <div>
                      <p className="font-medium text-[#3b2a1b] dark:text-[#f5f1eb]">{item.name}</p>
                      {item.brand && (
                        <p className="text-sm text-[#8b7355] dark:text-[#a8956b]">{item.brand}</p>
                      )}
                      {(item.size || item.color) && (
                        <p className="text-sm text-[#8b7355] dark:text-[#a8956b]">
                          {[item.size, item.color].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[#3b2a1b] dark:text-[#f5f1eb]">Qty: {item.quantity}</p>
                      <p className="font-medium text-[#3b2a1b] dark:text-[#f5f1eb]">
                        {formatZar(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card className="bg-white/80 dark:bg-[#241a14] border-[#e5d5c8] dark:border-[#3b2a1b]">
            <CardHeader>
              <CardTitle className="text-[#3b2a1b] dark:text-[#f5f1eb] flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-[#3b2a1b] dark:text-[#f5f1eb] mb-2">
                  Estimated Delivery
                </h4>
                <p className="text-[#8b7355] dark:text-[#a8956b]">{getEstimatedDelivery()}</p>
                <p className="text-sm text-[#8b7355] dark:text-[#a8956b]">
                  {formatDeliveryWindow(order.preferences.deliveryWindow)}
                </p>
              </div>

              <Separator className="bg-[#e5d5c8] dark:bg-[#3b2a1b]" />

              <div>
                <h4 className="font-semibold text-[#3b2a1b] dark:text-[#f5f1eb] mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Shipping Address
                </h4>
                <div className="text-[#8b7355] dark:text-[#a8956b] space-y-1">
                  <p>{order.user.name}</p>
                  <p>{order.addressSnapshot.line1}</p>
                  {order.addressSnapshot.line2 && <p>{order.addressSnapshot.line2}</p>}
                  <p>
                    {order.addressSnapshot.suburb}, {order.addressSnapshot.province} {order.addressSnapshot.postalCode}
                  </p>
                  <p>{order.addressSnapshot.country || "South Africa"}</p>
                </div>
              </div>

              {order.preferences.instructions && (
                <>
                  <Separator className="bg-[#e5d5c8] dark:bg-[#3b2a1b]" />
                  <div>
                    <h4 className="font-semibold text-[#3b2a1b] dark:text-[#f5f1eb] mb-2">
                      Delivery Instructions
                    </h4>
                    <p className="text-[#8b7355] dark:text-[#a8956b]">
                      {order.preferences.instructions}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="border-[#5b3a1a] text-[#5b3a1a] hover:bg-[#5b3a1a] hover:text-white">
            <Link href="/orders">View My Orders</Link>
          </Button>
          <Button asChild className="bg-[#5b3a1a] hover:bg-[#6b4423] text-white">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}