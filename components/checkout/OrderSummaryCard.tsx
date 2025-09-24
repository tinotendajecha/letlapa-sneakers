"use client";

import { useState } from "react";
import Image from "next/image"; // ⬅️ added
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Edit3, Minus, Plus, X, Tag } from "lucide-react";
import { type CartItem } from "@/lib/checkout-data";
import { formatZar } from "@/lib/checkout-utils";

interface OrderSummaryCardProps {
  items: CartItem[];
  selectedShipping: "standard" | "express";
  onShippingChange: (shipping: "standard" | "express") => void;
  promoCode: string;
  onPromoCodeChange: (code: string) => void;
  onApplyPromo: () => void;
  appliedPromo: { code: string; discount: number } | null;
  onRemovePromo: () => void;
  totals: {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
  };
}

// Try to read an image URL from different shapes of cart items
function getItemImage(item: CartItem): string {
  const anyItem = item as any;
  const imageUrl =
    anyItem.image ||
    anyItem.imageUrl ||
    anyItem.product?.images?.[0] ||
    anyItem.images?.[0] ||
    "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg";
    
  console.log("CartItem image for", anyItem.name, ":", imageUrl);
  return imageUrl;
}

export function OrderSummaryCard({
  items,
  selectedShipping,
  onShippingChange,
  promoCode,
  onPromoCodeChange,
  onApplyPromo,
  appliedPromo,
  onRemovePromo,
  totals
}: OrderSummaryCardProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Card className="bg-white/80 dark:bg-[#241a14] border-[#e5d5c8] dark:border-[#3b2a1b]">
      <CardHeader>
        <CardTitle className="text-[#3b2a1b] dark:text-[#f5f1eb] flex items-center justify-between">
          Order Summary
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#5b3a1a] hover:text-[#6b4423] hover:bg-[#f5f1eb] dark:hover:bg-[#1a120d]"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Cart
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md bg-[#faf6f1] dark:bg-[#1a120d] border-[#e5d5c8] dark:border-[#3b2a1b]">
              <SheetHeader>
                <SheetTitle className="text-[#3b2a1b] dark:text-[#f5f1eb]">Your Cart</SheetTitle>
                <SheetDescription className="text-[#8b7355] dark:text-[#a8956b]">
                  Review your items (editing disabled during checkout)
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 bg-white/80 dark:bg-[#241a14] rounded-lg border border-[#e5d5c8] dark:border-[#3b2a1b]"
                  >
                    {/* Thumbnail (sheet) */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#e5d5c8] dark:bg-[#3b2a1b] flex-shrink-0">
                      <Image
                        src={getItemImage(item)}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>

               
                    


                    <div className="flex-1">
                      <h4 className="font-medium text-[#3b2a1b] dark:text-[#f5f1eb]">{item.name}</h4>
                      {item.brand && (
                        <p className="text-sm text-[#8b7355] dark:text-[#a8956b]">{item.brand}</p>
                      )}
                      {(item.size || item.color) && (
                        <p className="text-sm text-[#8b7355] dark:text-[#a8956b]">
                          {[item.size, item.color].filter(Boolean).join(", ")}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" disabled className="h-8 w-8 p-0">
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-[#3b2a1b] dark:text-[#f5f1eb] font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button variant="outline" size="sm" disabled className="h-8 w-8 p-0">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <span className="font-semibold text-[#3b2a1b] dark:text-[#f5f1eb]">
                          {formatZar(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Items List (inline summary) */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-3 py-2">
              {/* Tiny thumbnail (inline) */}
              <div className="w-12 h-12 rounded-md overflow-hidden bg-[#e5d5c8] dark:bg-[#3b2a1b] flex-shrink-0">
                <Image
                  src={getItemImage(item)}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <p className="font-medium text-[#3b2a1b] dark:text-[#f5f1eb]">{item.name}</p>
                {item.brand && (
                  <p className="text-sm text-[#8b7355] dark:text-[#a8956b]">{item.brand}</p>
                )}
                {(item.size || item.color) && (
                  <p className="text-sm text-[#8b7355] dark:text-[#a8956b]">
                    {[item.size, item.color].filter(Boolean).join(", ")}
                  </p>
                )}
                <p className="text-sm text-[#8b7355] dark:text-[#a8956b]">Qty: {item.quantity}</p>
              </div>

              <span className="font-medium text-[#3b2a1b] dark:text-[#f5f1eb]">
                {formatZar(item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <Separator className="bg-[#e5d5c8] dark:bg-[#3b2a1b]" />

        {/* Shipping Options */}
        <div>
          <Label htmlFor="shipping" className="text-[#3b2a1b] dark:text-[#f5f1eb] mb-2 block">
            Shipping Method
          </Label>
          <Select value={selectedShipping} onValueChange={onShippingChange}>
            <SelectTrigger className="bg-white dark:bg-[#1a120d] border-[#e5d5c8] dark:border-[#3b2a1b] text-[#3b2a1b] dark:text-[#f5f1eb]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Delivery (2-4 days) - R99</SelectItem>
              <SelectItem value="express">Express Delivery (1-2 days) - R199</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Promo Code */}
        <div>
          <Label htmlFor="promoCode" className="text-[#3b2a1b] dark:text-[#f5f1eb] mb-2 block">
            Promo Code
          </Label>
          {appliedPromo ? (
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-green-700 dark:text-green-300 font-medium">
                  {appliedPromo.code}
                </span>
                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs">
                  10% OFF
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemovePromo}
                className="text-green-700 hover:text-green-800 dark:text-green-300 dark:hover:text-green-200 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                id="promoCode"
                value={promoCode}
                onChange={(e) => onPromoCodeChange(e.target.value)}
                placeholder="Enter promo code"
                className="bg-white dark:bg-[#1a120d] border-[#e5d5c8] dark:border-[#3b2a1b] text-[#3b2a1b] dark:text-[#f5f1eb]"
              />
              <Button
                onClick={onApplyPromo}
                variant="outline"
                className="border-[#5b3a1a] text-[#5b3a1a] hover:bg-[#5b3a1a] hover:text-white"
              >
                Apply
              </Button>
            </div>
          )}
        </div>

        <Separator className="bg-[#e5d5c8] dark:bg-[#3b2a1b]" />

        {/* Order Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-[#8b7355] dark:text-[#a8956b]">
            <span>Subtotal</span>
            <span>{formatZar(totals.subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-[#8b7355] dark:text-[#a8956b]">
            <span>Shipping</span>
            <span>{formatZar(totals.shipping)}</span>
          </div>
          
          {totals.discount > 0 && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Discount</span>
              <span>-{formatZar(totals.discount)}</span>
            </div>
          )}
          
          <Separator className="bg-[#e5d5c8] dark:bg-[#3b2a1b]" />
          
          <div className="flex justify-between text-lg font-semibold text-[#3b2a1b] dark:text-[#f5f1eb]">
            <span>Total</span>
            <span>{formatZar(totals.total)}</span>
          </div>
          
          <p className="text-xs text-[#8b7355] dark:text-[#a8956b]">
            VAT included where applicable
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
