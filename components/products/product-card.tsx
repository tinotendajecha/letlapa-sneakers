'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/lib/store';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, setCartOpen } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add with first available size and color
    addToCart(product, product.sizes[0], product.colors[0]);
    setCartOpen(true);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const inWishlist = isInWishlist(product.id);

  return (
    <div className={cn("group product-card", className)}>
      <Link href={`/product/${product.id}`}>
        <div className="relative bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-secondary">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-all duration-300 group-hover:scale-105",
                isImageLoading ? "blur-sm" : "blur-0"
              )}
              onLoadingComplete={() => setIsImageLoading(false)}
            />
            
            {/* Sale Badge */}
            {product.originalPrice && (
              <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-medium">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleToggleWishlist}
              className={cn(
                "absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm",
                inWishlist 
                  ? "bg-red-500 text-white" 
                  : "bg-white/20 text-white hover:bg-white/30"
              )}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
            </button>

            {/* Quick Add Button - appears on hover */}
            <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                size="sm"
                className="w-full glass text-white border-white/20 hover:bg-white/20"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.inStock ? 'Quick Add' : 'Out of Stock'}
              </Button>
            </div>

            {/* Stock indicator */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-background text-foreground px-4 py-2 rounded-lg font-medium">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium">{product.brand}</p>
                <h3 className="font-medium text-sm truncate mt-1">{product.name}</h3>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-1 mb-3">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-muted-foreground"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviews})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="font-bold text-foreground">
                R{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  R{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Available sizes preview */}
            <div className="flex items-center space-x-1 mt-3">
              <span className="text-xs text-muted-foreground">Sizes:</span>
              <div className="flex space-x-1">
                {product.sizes.slice(0, 3).map((size) => (
                  <span key={size} className="text-xs bg-secondary px-2 py-1 rounded">
                    {size}
                  </span>
                ))}
                {product.sizes.length > 3 && (
                  <span className="text-xs text-muted-foreground">+{product.sizes.length - 3}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}