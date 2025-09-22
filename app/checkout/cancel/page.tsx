"use client";


export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
// import { ProgressSteps } from "@/components/checkout/ProgressSteps";
import { ProgressSteps } from "@/components/checkout/ProgressSteps";

export default function CheckoutCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const error = searchParams.get("error");

  const handleRetry = () => {
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#faf6f1] dark:bg-[#1a120d] transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProgressSteps currentStep="payment" className="mb-8" />
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-[#3b2a1b] dark:text-[#f5f1eb] mb-2">
            Payment Cancelled
          </h1>
          <p className="text-[#8b7355] dark:text-[#a8956b] max-w-md mx-auto">
            Your payment was cancelled or failed to process. Don't worry - your order information has been saved and you can try again.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto bg-white/80 dark:bg-[#241a14] border-[#e5d5c8] dark:border-[#3b2a1b]">
          <CardHeader>
            <CardTitle className="text-[#3b2a1b] dark:text-[#f5f1eb] text-center">
              What happened?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                Payment Issue
              </h3>
              <p className="text-red-700 dark:text-red-300 text-sm">
                {error === "insufficient_funds" 
                  ? "Your payment method has insufficient funds."
                  : error === "card_declined"
                  ? "Your card was declined by your bank."
                  : error === "expired_card"
                  ? "Your card has expired."
                  : "The payment was cancelled or failed to process. This could be due to insufficient funds, an expired card, or the payment was cancelled."
                }
              </p>
            </div>

            {orderId && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Your Order is Saved
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-2">
                  Order #{orderId} is saved and waiting for payment.
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  You can retry the payment or contact us for assistance.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold text-[#3b2a1b] dark:text-[#f5f1eb]">
                What can you do?
              </h3>
              <ul className="space-y-2 text-[#8b7355] dark:text-[#a8956b]">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#5b3a1a] mt-2"></span>
                  Check that your payment method has sufficient funds
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#5b3a1a] mt-2"></span>
                  Verify your card details are correct and not expired
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#5b3a1a] mt-2"></span>
                  Try using a different payment method
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#5b3a1a] mt-2"></span>
                  Contact your bank if the issue persists
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={handleRetry}
                className="bg-[#5b3a1a] hover:bg-[#6b4423] text-white flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Payment Again
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                className="border-[#5b3a1a] text-[#5b3a1a] hover:bg-[#5b3a1a] hover:text-white flex items-center gap-2"
              >
                <Link href="/cart">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Cart
                </Link>
              </Button>
            </div>

            <div className="pt-4 border-t border-[#e5d5c8] dark:border-[#3b2a1b]">
              <p className="text-center text-sm text-[#8b7355] dark:text-[#a8956b]">
                Need help?{" "}
                <Link 
                  href="https://wa.me/27821234567?text=Hi%20I%20need%20help%20with%20my%20payment" 
                  className="text-[#5b3a1a] hover:text-[#6b4423] underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact us on WhatsApp
                </Link>
                {" "}or email support@example.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}