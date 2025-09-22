// app/checkout/ClientCheckout.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { ProgressSteps } from "@/components/checkout/ProgressSteps";
import { OrderSummaryCard } from "@/components/checkout/OrderSummaryCard";
import { WhatsAppFab } from "@/components/checkout/WhatsappFab";

import { type CheckoutData } from "@/lib/checkout-data";
import { formatZar, computeTotals } from "@/lib/checkout-utils";
import { useStore } from "@/lib/store";

// ---------- Types ----------
type SavedAddress = {
    id: string;
    label?: string;
    line1: string;
    line2?: string;
    suburb?: string;
    province: string;
    postalCode?: string;
    country?: string;
    isDefault: boolean;
};

const SA_PROVINCES = [
    "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape",
] as const;

const NEW_ADDRESS_SENTINEL = "__NEW__";

export default function ClientCheckout() {
    const router = useRouter();
    const { cartItems } = useStore();

    const summaryItems = useMemo(
        () =>
            cartItems.map((ci) => ({
                id: `${ci.product._id}-${ci.size}-${ci.color}`,
                productId: ci.product._id,
                name: ci.product.name,
                brand: ci.product.brand,
                image: ci.product.images?.[0] || "/placeholder.png",
                unitPrice: Math.round((ci.product.price ?? 0) * 100),
                quantity: ci.quantity,
                size: ci.size,
                color: ci.color,
            })),
        [cartItems]
    );

    const [selectedShipping, setSelectedShipping] = useState<"standard" | "express">("standard");
    const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
    const totals = useMemo(
        () => computeTotals(summaryItems, selectedShipping === "standard" ? 9900 : 19900, appliedPromo?.discount || 0),
        [summaryItems, selectedShipping, appliedPromo?.discount]
    );

    const [email, setEmail] = useState("");
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<CheckoutData>({
        contact: { fullName: "", email: "", cellNumber: "", whatsappNumber: "", whatsappSameAsCell: true },
        shipping: {
            useExistingAddress: "", addressLine1: "", addressLine2: "", suburb: "",
            province: "Gauteng", postalCode: "", country: "South Africa", saveAsDefault: false,
        },
        delivery: { deliveryWindow: "anytime", instructions: "" },
    });

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const pRes = await fetch("/api/profile", { cache: "no-store" });
                const pJson = await pRes.json().catch(() => ({}));
                if (!pRes.ok) {
                    toast.error(pJson?.error ?? "Failed to load profile");
                } else if (alive) {
                    const fullName = pJson.name || "";
                    const cell = pJson.phone || "";
                    const wa = pJson.whatsapp || cell || "";
                    setEmail(pJson.email || "");
                    setFormData((prev) => ({
                        ...prev,
                        contact: { fullName, email: pJson.email || "", cellNumber: cell, whatsappNumber: wa, whatsappSameAsCell: wa === cell },
                    }));
                }

                const aRes = await fetch("/api/addresses", { cache: "no-store" });
                const aJson = await aRes.json().catch(() => ({}));
                if (!aRes.ok) {
                    toast.error(aJson?.error ?? "Failed to load addresses");
                } else if (alive) {
                    const addrs: SavedAddress[] = Array.isArray(aJson.addresses) ? aJson.addresses : [];
                    setSavedAddresses(addrs);
                    const def = addrs.find((x) => x.isDefault);
                    if (def) {
                        setFormData((prev) => ({
                            ...prev,
                            shipping: {
                                ...prev.shipping,
                                useExistingAddress: def.id,
                                addressLine1: def.line1,
                                addressLine2: def.line2 || "",
                                suburb: def.suburb || "",
                                province: (SA_PROVINCES.includes(def.province as any) ? def.province : "Gauteng") as typeof SA_PROVINCES[number],
                                postalCode: def.postalCode || "",
                                country: def.country || "South Africa",
                            },
                        }));
                    }
                }

                const sRes = await fetch("/api/shipping-preferences", { cache: "no-store" });
                const sJson = await sRes.json().catch(() => ({}));
                if (!sRes.ok) {
                    toast.error(sJson?.error ?? "Failed to load shipping preferences");
                } else if (alive) {
                    setFormData((prev) => ({
                        ...prev,
                        delivery: {
                            deliveryWindow: (sJson.deliveryWindow ?? "Anytime").toString().toLowerCase(),
                            instructions: sJson.instructions ?? "",
                        },
                    }));
                }
            } catch (err) {
                console.error(err);
                toast.error("Something went wrong while loading checkout");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, []);

    const updateFormData = (section: keyof CheckoutData, field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
        if (errors[`${section}.${field}`]) {
            setErrors((prev) => {
                const copy = { ...prev };
                delete copy[`${section}.${field}`];
                return copy;
            });
        }
    };

    const handleAddressSelect = (value: string) => {
        if (value === "__NEW__") {
            setFormData((prev) => ({
                ...prev,
                shipping: { ...prev.shipping, useExistingAddress: "", addressLine1: "", addressLine2: "", suburb: "", province: "Gauteng", postalCode: "", country: "South Africa" },
            }));
            return;
        }
        const selected = savedAddresses.find((a) => a.id === value);
        if (selected) {
            const validProvince = (SA_PROVINCES.includes(selected.province as any) ? selected.province : "Gauteng") as typeof SA_PROVINCES[number];
            setFormData((prev) => ({
                ...prev,
                shipping: {
                    ...prev.shipping,
                    useExistingAddress: selected.id,
                    addressLine1: selected.line1,
                    addressLine2: selected.line2 || "",
                    suburb: selected.suburb || "",
                    province: validProvince,
                    postalCode: selected.postalCode || "",
                    country: selected.country || "South Africa",
                },
            }));
        }
    };

    const handleWhatsAppToggle = (checked: boolean) => {
        const bool = !!checked;
        updateFormData("contact", "whatsappSameAsCell", bool);
        if (bool) updateFormData("contact", "whatsappNumber", formData.contact.cellNumber);
    };

    const applyPromoCode = () => {
        if (promoCode.trim().toUpperCase() === "LET10") {
            setAppliedPromo({ code: "LET10", discount: 1000 });
            toast.success("Promo code applied! 10% discount");
            setPromoCode("");
        } else if (promoCode.trim()) {
            toast.error("Invalid promo code");
        }
    };

    const validateForm = (): boolean => {
        const errs: Record<string, string> = {};
        if (!formData.contact.fullName?.trim()) errs["contact.fullName"] = "Full name is required";
        if (!formData.contact.email?.trim()) errs["contact.email"] = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) errs["contact.email"] = "Enter a valid email";
        if (!formData.contact.cellNumber?.trim()) errs["contact.cellNumber"] = "Cell number is required";
        if (!formData.shipping.addressLine1?.trim()) errs["shipping.addressLine1"] = "Address is required";
        if (!formData.shipping.suburb?.trim()) errs["shipping.suburb"] = "Suburb/City is required";
        if (!formData.shipping.postalCode?.trim()) errs["shipping.postalCode"] = "Postal code is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handlePayNow = async () => {
        if (!validateForm()) {
            toast.error("Please complete all required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            const totalsNow = computeTotals(
                summaryItems,
                selectedShipping === "standard" ? 9900 : 19900,
                appliedPromo?.discount || 0
            );

            const orderPayload = {
                items: summaryItems.map((i) => ({
                    productId: i.productId, name: i.name, brand: i.brand, image: i.image,
                    size: i.size, color: i.color, price: i.unitPrice, quantity: i.quantity,
                })),
                amounts: {
                    subtotal: totalsNow.subtotal, shippingFee: totalsNow.shipping, discount: totalsNow.discount,
                    total: totalsNow.total, currency: "ZAR",
                },
                contact: { fullName: formData.contact.fullName, cellNumber: formData.contact.cellNumber },
                shipping: {
                    addressLine1: formData.shipping.addressLine1, addressLine2: formData.shipping.addressLine2 || "",
                    suburb: formData.shipping.suburb, province: formData.shipping.province,
                    postalCode: formData.shipping.postalCode, country: formData.shipping.country || "South Africa",
                },
                delivery: { deliveryWindow: formData.delivery.deliveryWindow, instructions: formData.delivery.instructions || "" },
                selectedShipping,
            };

            const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderPayload) });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.error || "Failed to create order");
            }
            const json = await res.json().catch(() => ({}));
            if (!json || !json.orderId) throw new Error("Order response malformed");

            toast.success("Order created. Redirecting to payment...");

            const initRes = await fetch("/api/payments/paystack/init", {
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: json.orderId }),
            });
            if (!initRes.ok) {
                const err = await initRes.json().catch(() => ({}));
                throw new Error(err?.error || "Payment init failed");
            }
            const { accessCode } = await initRes.json().catch(() => ({}));
            if (!accessCode) throw new Error("Missing accessCode");

            // Lazy-load Paystack only in browser
            const { default: PaystackPop } = await import("@paystack/inline-js");
            const popup = new PaystackPop();
            popup.resumeTransaction(accessCode);
        } catch (err: any) {
            console.error(err);
            toast.error(err?.message || "Failed to create order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#faf6f1] dark:bg-[#1a120d]">
                <div className="flex items-center space-x-3 text-[#3b2a1b] dark:text-[#f5f1eb]">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading checkout…</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf6f1] dark:bg-[#1a120d] transition-colors">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <ProgressSteps currentStep="checkout" className="mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT: forms (your existing form sections are unchanged) */}
                    {/* ... your Contact / Shipping / Delivery cards ... */}
                    {/* LEFT: forms */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Contact */}
                        <Card className="bg-white/80 dark:bg-[#241a14] border-[#e5d5c8] dark:border-[#3b2a1b]">
                            <CardHeader>
                                <CardTitle className="text-[#3b2a1b] dark:text-[#f5f1eb]">Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="fullName" className="text-[#3b2a1b] dark:text-[#f5f1eb]">
                                            Full Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="fullName"
                                            value={formData.contact.fullName}
                                            onChange={(e) => updateFormData("contact", "fullName", e.target.value)}
                                            className={`bg-white dark:bg-[#1a120d] border-[#e5d5c8] dark:border-[#3b2a1b] text-[#3b2a1b] dark:text-[#f5f1eb] ${errors["contact.fullName"] ? "border-red-500" : ""
                                                }`}
                                            placeholder="Enter your full name"
                                        />
                                        {errors["contact.fullName"] && <p className="text-red-500 text-sm mt-1">{errors["contact.fullName"]}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="email" className="text-[#3b2a1b] dark:text-[#f5f1eb]">
                                            Email <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.contact.email}
                                            onChange={(e) => updateFormData("contact", "email", e.target.value)}
                                            className={`bg-white dark:bg-[#1a120d] border-[#e5d5c8] dark:border-[#3b2a1b] text-[#3b2a1b] dark:text-[#f5f1eb] ${errors["contact.email"] ? "border-red-500" : ""
                                                }`}
                                            placeholder="your@email.com"
                                        />
                                        {errors["contact.email"] && <p className="text-red-500 text-sm mt-1">{errors["contact.email"]}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="cellNumber" className="text-[#3b2a1b] dark:text-[#f5f1eb]">
                                            Cell Number <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="cellNumber"
                                            value={formData.contact.cellNumber}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                updateFormData("contact", "cellNumber", v);
                                                if (formData.contact.whatsappSameAsCell) updateFormData("contact", "whatsappNumber", v);
                                            }}
                                            className={`bg-white dark:bg-[#1a120d] border-[#e5d5c8] dark:border-[#3b2a1b] text-[#3b2a1b] dark:text-[#f5f1eb] ${errors["contact.cellNumber"] ? "border-red-500" : ""
                                                }`}
                                            placeholder="+27 XX XXX XXXX"
                                        />
                                        {errors["contact.cellNumber"] && <p className="text-red-500 text-sm mt-1">{errors["contact.cellNumber"]}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="whatsappNumber" className="text-[#3b2a1b] dark:text-[#f5f1eb]">WhatsApp Number</Label>
                                        <Input
                                            id="whatsappNumber"
                                            value={formData.contact.whatsappNumber}
                                            onChange={(e) => updateFormData("contact", "whatsappNumber", e.target.value)}
                                            disabled={formData.contact.whatsappSameAsCell}
                                            className="bg-white dark:bg-[#1a120d] border-[#e5d5c8] dark:border-[#3b2a1b] text-[#3b2a1b] dark:text-[#f5f1eb] disabled:opacity-60"
                                            placeholder="+27 XX XXX XXXX"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="whatsappSame"
                                        checked={formData.contact.whatsappSameAsCell}
                                        onCheckedChange={(v) => handleWhatsAppToggle(!!v)}
                                        className="border-[#5b3a1a] data-[state=checked]:bg-[#5b3a1a]"
                                    />
                                    <Label htmlFor="whatsappSame" className="text-sm text-[#3b2a1b] dark:text-[#f5f1eb]">
                                        Same as cell number
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping */}
                        <Card className="bg-white/80 dark:bg-[#241a14] border-[#e5d5c8] dark:border-[#3b2a1b]">
                            <CardHeader>
                                <CardTitle className="text-[#3b2a1b] dark:text-[#f5f1eb]">Shipping Address</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="savedAddress" className="text-[#3b2a1b] dark:text-[#f5f1eb]">Use saved address</Label>
                                    <Select
                                        // Radix: undefined shows placeholder. Never pass empty string.
                                        value={formData.shipping.useExistingAddress || undefined}
                                        onValueChange={handleAddressSelect}
                                    >
                                        <SelectTrigger className="bg-white dark:bg-[#1a120d] border-[#e5d5c8] dark:border-[#3b2a1b] text-[#3b2a1b] dark:text-[#f5f1eb]">
                                            <SelectValue placeholder="Select a saved address" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NEW_ADDRESS_SENTINEL}>Enter new address</SelectItem>
                                            {savedAddresses.map((addr) => (
                                                <SelectItem key={addr.id} value={addr.id}>
                                                    {addr.label || `${addr.line1}, ${addr.suburb}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="addressLine1" className="text-[#3b2a1b] dark:text-[#f5f1eb]">
                                            Address Line 1 <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="addressLine1"
                                            value={formData.shipping.addressLine1}
                                            onChange={(e) => updateFormData("shipping", "addressLine1", e.target.value)}
                                            className={`bg-white dark:bg-[#1a120d] border-[#e5d5c8] dark:border-[#3b2a1b] text-[#3b2a1b] dark:text-[#f5f1eb] ${errors["shipping.addressLine1"] ? "border-red-500" : ""
                                                }`}
                                            placeholder="Street address"
                                        />
                                        {errors["shipping.addressLine1"] && <p className="text-red-500 text-sm mt-1">{errors["shipping.addressLine1"]}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="addressLine2" className="text-[#3b2a1b] dark:text-[#f5f1eb]">Address Line 2 (Optional)</Label>
                                        <Input
                                            id="addressLine2"
                                            value={formData.shipping.addressLine2}
                                            onChange={(e) => updateFormData("shipping", "addressLine2", e.target.value)}
                                            className="bg-white dark:bg-[#1a120d] border-[#e5d5c8] dark:border-[#3b2a1b] text-[#3b2a1b] dark:text-[#f5f1eb]"
                                            placeholder="Apartment, suite, etc."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="suburb" className="text-[#3b2a1b] dark:text-[#f5f1eb]">
                                                Suburb/City <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="suburb"
                                                value={formData.shipping.suburb}
                                                onChange={(e) => updateFormData("shipping", "suburb", e.target.value)}
                                                className={`bg-white dark:bg-[#1a120d] border-[#e5d5c8] dark:border-[#3b2a1b] text-[#3b2a1b] dark:text-[#f5f1eb] ${errors["shipping.suburb"] ? "border-red-500" : ""
                                                    }`}
                                                placeholder="Suburb"
                                            />
                                            {errors["shipping.suburb"] && <p className="text-red-500 text-sm mt-1">{errors["shipping.suburb"]}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="province" className="text-[#3b2a1b] dark:text-[#f5f1eb]">
                                                Province <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={formData.shipping.province}
                                                onValueChange={(v) => updateFormData("shipping", "province", v)}
                                            >
                                                <SelectTrigger className="bg-white dark:bg-[#1a120d] border-[#e5d5c8] dark:border-[#3b2a1b] text-[#3b2a1b] dark:text-[#f5f1eb]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {SA_PROVINCES.map((p) => (
                                                        <SelectItem key={p} value={p}>
                                                            {p}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="postalCode" className="text-[#3b2a1b] dark:text-[#f5f1eb]">
                                                Postal Code <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="postalCode"
                                                value={formData.shipping.postalCode}
                                                onChange={(e) => updateFormData("shipping", "postalCode", e.target.value)}
                                                className={`bg-white dark:bg-[#1a120d] border-[#e5d5c8] dark:border-[#3b2a1b] text-[#3b2a1b] dark:text-[#f5f1eb] ${errors["shipping.postalCode"] ? "border-red-500" : ""
                                                    }`}
                                                placeholder="0000"
                                            />
                                            {errors["shipping.postalCode"] && <p className="text-red-500 text-sm mt-1">{errors["shipping.postalCode"]}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="country" className="text-[#3b2a1b] dark:text-[#f5f1eb]">Country</Label>
                                        <Input
                                            id="country"
                                            value={formData.shipping.country}
                                            readOnly
                                            className="bg-gray-50 dark:bg-[#1a120d] border-[#e5d5c8] dark:border-[#3b2a1b] text-[#3b2a1b] dark:text-[#f5f1eb] cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="saveAddress"
                                            checked={formData.shipping.saveAsDefault}
                                            onCheckedChange={(v) => updateFormData("shipping", "saveAsDefault", !!v)}
                                            className="border-[#5b3a1a] data-[state=checked]:bg-[#5b3a1a]"
                                        />
                                        <Label htmlFor="saveAddress" className="text-sm text-[#3b2a1b] dark:text-[#f5f1eb]">
                                            Save this as my default address
                                        </Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery */}
                        <Card className="bg-white/80 dark:bg-[#241a14] border-[#e5d5c8] dark:border-[#3b2a1b]">
                            <CardHeader>
                                <CardTitle className="text-[#3b2a1b] dark:text-[#f5f1eb]">Delivery Preferences</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="deliveryWindow" className="text-[#3b2a1b] dark:text-[#f5f1eb]">
                                        Preferred delivery window
                                    </Label>
                                    <Select
                                        value={formData.delivery.deliveryWindow}
                                        onValueChange={(v) => updateFormData("delivery", "deliveryWindow", v)}
                                    >
                                        <SelectTrigger className="bg-white dark:bg-[#1a120d] border-[#e5d5c8] dark:border-[#3b2a1b] text-[#3b2a1b] dark:text-[#f5f1eb]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="anytime">Anytime</SelectItem>
                                            <SelectItem value="weekdays">Weekdays 9:00 - 17:00</SelectItem>
                                            <SelectItem value="evenings">Evenings 17:00 - 20:00</SelectItem>
                                            <SelectItem value="weekends">Weekends</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="instructions" className="text-[#3b2a1b] dark:text-[#f5f1eb]">Delivery instructions (Optional)</Label>
                                    <Textarea
                                        id="instructions"
                                        value={formData.delivery.instructions}
                                        onChange={(e) => updateFormData("delivery", "instructions", e.target.value)}
                                        className="bg-white dark:bg-[#1a120d] border-[#e5d5c8] dark:border-[#3b2a1b] text-[#3b2a1b] dark:text-[#f5f1eb]"
                                        placeholder="Any special instructions for delivery..."
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT: summary / pay */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-4 space-y-6">
                            <OrderSummaryCard
                                items={summaryItems}
                                selectedShipping={selectedShipping}
                                onShippingChange={setSelectedShipping}
                                promoCode={promoCode}
                                onPromoCodeChange={setPromoCode}
                                onApplyPromo={applyPromoCode}
                                appliedPromo={appliedPromo}
                                onRemovePromo={() => setAppliedPromo(null)}
                                totals={totals}
                            />
                            <Card className="bg-white/80 dark:bg-[#241a14] border-[#e5d5c8] dark:border-[#3b2a1b]">
                                <CardContent className="pt-6">
                                    <Button
                                        onClick={handlePayNow}
                                        disabled={isSubmitting || Object.keys(errors).length > 0}
                                        className="w-full bg-[#5b3a1a] hover:bg-[#6b4423] text-white py-6 text-lg font-medium"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Creating Order...
                                            </>
                                        ) : (
                                            `Pay Now ${formatZar(totals.total)}`
                                        )}
                                    </Button>
                                    <p className="text-center text-sm text-[#8b7355] dark:text-[#a8956b] mt-4">
                                        By clicking "Pay Now", you agree to our terms and conditions
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <WhatsAppFab />
        </div>
    );
}
