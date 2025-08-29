import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { WishlistDrawer } from '@/components/cart/wishlist-drawer';
import { WhatsAppFloat } from '@/components/ui/whatsapp-float';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import ToastProvider from '@/components/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Letlapa Sneakers | Authentic Kicks from South Africa',
  description: 'Premium sneakers from the heart of South Africa. Rooted in Upington and Pofadder, serving sneakerheads nationwide with authentic, quality footwear.',
  keywords: 'sneakers, South Africa, Upington, Pofadder, authentic, Jordan, Nike, Adidas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="light"
          storageKey="letlapa-theme"
        >
          <div className="min-h-screen bg-background">
            <Header />
            <main>{children}
              <ToastProvider />
            </main>
            <Footer />
            
            {/* Floating Components */}
            <CartDrawer />
            <WishlistDrawer />
            <WhatsAppFloat />
            
            {/* Toast Notifications */}
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}