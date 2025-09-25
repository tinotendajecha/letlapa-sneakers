'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppFloat() {
  const handleWhatsAppClick = () => {
    const phoneNumber = "27612135627"; // TODO: Replace with actual Letlapa WhatsApp number
    const message = "Hi! I'm interested in your sneakers. Can you help me?";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
}