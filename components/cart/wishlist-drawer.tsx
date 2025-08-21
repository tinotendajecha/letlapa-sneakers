'use client';

import { X, Heart, ShoppingCart } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export function WishlistDrawer() {
  const { 
    isWishlistOpen, 
    setWishlistOpen, 
    wishlistItems, 
    removeFromWishlist,
    addToCart,
    setCartOpen
  } = useStore();

  if (!isWishlistOpen) return null;

  const handleAddToCart = (item: any) => {
    // Add with default size and color - in real app, user would select these
    addToCart(item.product, item.product.sizes[0], item.product.colors[0]);
    setCartOpen(true);
    setWishlistOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={() => setWishlistOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-display font-semibold">Wishlist</h2>
          <button
            onClick={() => setWishlistOpen(false)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6">
                Save items you love for later!
              </p>
              <Button onClick={() => setWishlistOpen(false)} asChild>
                <Link href="/shop">Browse Sneakers</Link>
              </Button>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {wishlistItems.map((item) => (
                <div key={item.product.id} className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.product.brand}
                    </p>
                    <p className="font-medium mt-2">R{item.product.price.toLocaleString()}</p>
                    
                    <div className="flex items-center space-x-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.product.inStock}
                        className="flex-1"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        {item.product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                      <button
                        onClick={() => removeFromWishlist(item.product.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div className="border-t border-border p-6">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setWishlistOpen(false)}
              asChild
            >
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}