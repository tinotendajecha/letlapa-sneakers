import { type CartItem } from "./checkout-data";

/**
 * Format cents to ZAR currency string
 * @param cents - Amount in cents
 * @returns Formatted currency string like "R3,999"
 */
export function formatZar(cents: number): string {
  const rands = cents / 100;
  return `R${rands.toLocaleString('en-ZA', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 2 
  })}`;
}

/**
 * Compute order totals
 * @param cart - Cart items
 * @param shippingFee - Shipping fee in cents
 * @param discountCents - Discount amount in cents
 * @returns Object with subtotal, shipping, discount, and total in cents
 */
export function computeTotals(
  cart: CartItem[], 
  shippingFee: number, 
  discountCents: number = 0
) {
  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  
  // Apply discount to subtotal
  const discountAmount = Math.min(discountCents, subtotal);
  const discountedSubtotal = subtotal - discountAmount;
  
  const total = discountedSubtotal + shippingFee;

  return {
    subtotal,
    shipping: shippingFee,
    discount: discountAmount,
    total
  };
}

/**
 * Generate a random order ID
 * @returns Order ID string
 */
export function generateOrderId(): string {
  const prefix = "ord";
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}_${timestamp}${random}`;
}

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate South African phone number
 * @param phone - Phone number string to validate
 * @returns Boolean indicating if phone number is valid
 */
export function isValidSAPhone(phone: string): boolean {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Should be 11 digits starting with 27, or 10 digits starting with 0
  return /^(27\d{9}|0\d{9})$/.test(cleaned);
}

/**
 * Format phone number for display
 * @param phone - Raw phone number
 * @returns Formatted phone number
 */
export function formatSAPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('27') && cleaned.length === 11) {
    return `+27 ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  return phone;
}