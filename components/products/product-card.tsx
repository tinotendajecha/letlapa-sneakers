'use client';

import { useState, useMemo } from 'react';
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

  // Defensive normalization (never trust CMS)
  const images = useMemo(
    () => (Array.isArray(product?.images) ? product.images.filter((x): x is string => typeof x === 'string' && x.length > 0) : []),
    [product?.images]
  );
  // const imgSrc = images[0] ?? '/placeholder-product.png'; // put this in /public.

  const imgSrc = product.image

  const brand = (product?.brand ?? '').trim() || 'Letlapa';
  const name = (product?.name ?? '').trim() || 'Sneaker';

  const sizes = Array.isArray(product?.sizes) ? product.sizes.filter(Boolean) as string[] : [];
  const colors = Array.isArray(product?.colors) ? product.colors.filter(Boolean) as string[] : [];

  const priceNum = Number(product?.price);
  const hasPrice = Number.isFinite(priceNum) && priceNum >= 0;

  const originalPriceNum = Number(product?.originalPrice);
  const hasOriginal = Number.isFinite(originalPriceNum) && originalPriceNum > priceNum;

  const rating = Math.max(0, Math.min(5, Number(product?.rating) || 5));
  const reviews = Math.max(0, Number(product?.reviews) || 200);

  const inStock = Boolean(product?.inStock);
  const canQuickAdd = inStock && sizes.length > 0 && colors.length > 0;

  const inWishlist = isInWishlist(product?._id ?? '');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canQuickAdd) return;
    addToCart(product, sizes[0], colors[0]);
    setCartOpen(true);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const id = product?._id;
    if (!id) return;

    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(product);
    }
  };

  const salePct =
    hasOriginal && hasPrice && originalPriceNum > 0
      ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100)
      : null;

  return (
    <div className={cn('group product-card', className)}>
      <Link href={`/product/${product?._id ?? ''}`} aria-disabled={!product?._id}>
        <div className="relative bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-secondary">
            <Image
              src={imgSrc}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={cn(
                'object-cover transition-all duration-300 group-hover:scale-105',
                isImageLoading ? 'blur-sm' : 'blur-0'
              )}
              onLoadingComplete={() => setIsImageLoading(false)}
              priority={false}
            />

            {/* Sale Badge */}
            {salePct !== null && (
              <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-medium">
                {salePct}% OFF
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleToggleWishlist}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              className={cn(
                'absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm',
                inWishlist ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              )}
            >
              <Heart className={cn('h-4 w-4', inWishlist && 'fill-current')} />
            </button>

            {/* Quick Add Button - appears on hover */}
            <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Button
                onClick={handleAddToCart}
                disabled={!canQuickAdd}
                size="sm"
                className="w-full glass text-white border-white/20 hover:bg-white/20"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {canQuickAdd ? 'Quick Add' : inStock ? 'Select options' : 'Out of Stock'}
              </Button>
            </div>

            {/* Stock indicator */}
            {!inStock && (
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
                <p className="text-xs text-muted-foreground font-medium">{brand}</p>
                <h3 className="font-medium text-sm truncate mt-1">{name}</h3>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-1 mb-3" aria-label={`Rating ${rating} out of 5`}>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn('h-3 w-3', i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-muted-foreground')}
                  />
                ))}
              </div>
              {/* <span className="text-xs text-muted-foreground">({reviews})</span> */}
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="font-bold text-foreground">
                {hasPrice ? `R${priceNum.toLocaleString()}` : 'Price on request'}
              </span>
              {hasOriginal && (
                <span className="text-xs text-muted-foreground line-through">
                  R{originalPriceNum.toLocaleString()}
                </span>
              )}
            </div>

            {/* Available sizes preview */}
            {sizes.length > 0 && (
              <div className="flex items-center space-x-1 mt-3">
                <span className="text-xs text-muted-foreground">Sizes:</span>
                <div className="flex space-x-1">
                  {sizes.slice(0, 3).map((size) => (
                    <span key={size} className="text-xs bg-secondary px-2 py-1 rounded">
                      {size}
                    </span>
                  ))}
                  {sizes.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{sizes.length - 3}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
