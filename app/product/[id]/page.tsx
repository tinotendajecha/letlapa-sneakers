'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { mockReviews } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/store';
import { fetchProductById } from '@/lib/groq-queries/singleProduct';
import FancyProductLoader from '@/components/FancyProductLoader';

// fixed sizes
const FIXED_SIZES = ['3', '4', '5', '6', '7', '8', '9'] as const;

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, setCartOpen } = useStore();

  // ---- FETCH (runs regardless of render outcome) ----
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        if (!productId) throw new Error('Missing product id.');
        const data = await fetchProductById(productId);
        if (!alive) return;
        setProduct(data ?? null);
        setSelectedImage(0);
      } catch (e: any) {
        if (!alive) return;
        if (e.name !== 'AbortError') setError(e?.message || 'Something went wrong loading this product.');
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [productId]);

  // ---- NORMALIZATION HOOKS (always run, product may be null) ----
  const brand = (product?.brand ?? '').trim() || 'Letlapa';
  const name = (product?.name ?? '').trim() || 'Sneaker';
  const description = (product?.description ?? '').toString() || 'No description available.';

  const price = Number(product?.price);
  const hasPrice = Number.isFinite(price) && price >= 0;

  const originalPrice = product?.originalPrice != null ? Number(product.originalPrice) : undefined;
  const hasOriginal = Number.isFinite(originalPrice) && (originalPrice as number) > (price || 0);

  const rating = Math.max(0, Math.min(5, Number(product?.rating) || 0));
  const reviewsCount = Math.max(0, Number(product?.reviews) || 0);

  const sizes = FIXED_SIZES as readonly string[];

  const colors = useMemo(
    () => (Array.isArray(product?.colors) ? product!.colors.filter(Boolean) : [] as string[]),
    [product?.colors]
  );

  const images = useMemo(() => {
    const arr = Array.isArray(product?.images) ? product!.images.filter(Boolean) : [];
    if (arr.length === 0 && product?.image) arr.push(product.image);
    return arr.length > 0 ? arr : ['/placeholder.png'];
  }, [product?.images, product?.image]);

  const safeSelectedImage = Math.min(Math.max(0, selectedImage), images.length - 1);
  const inStock = Boolean(product?.inStock);
  const inWishlist = product?._id ? isInWishlist(product._id) : false;

  // default selections (safe to run even when product is null)
  useEffect(() => {
    if (!selectedSize) setSelectedSize(sizes[0]);
  }, [selectedSize, sizes]);

  useEffect(() => {
    if (!selectedColor && colors.length > 0) setSelectedColor(colors[0]);
  }, [colors, selectedColor]);

  const canAddToCart = inStock && !!selectedSize && (colors.length === 0 || !!selectedColor);

  const handleAddToCart = () => {
    if (!product || !canAddToCart) return;
    addToCart(product, selectedSize, selectedColor || '', quantity);
    setCartOpen(true);
  };

  const handleToggleWishlist = () => {
    if (!product?._id) return;
    if (inWishlist) removeFromWishlist(product._id);
    else addToWishlist(product);
  };

  const reviews = mockReviews.filter((r) => r.productId === productId);

  // ---- RENDER (now it’s safe to early-return) ----
  if (isLoading) return <FancyProductLoader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Couldn’t load product</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/shop"><Button>Back to Shop</Button></Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/shop"><Button>Back to Shop</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/shop" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-secondary rounded-xl overflow-hidden">
              <Image
                src={images[safeSelectedImage] ?? '/placeholder.png'}
                alt={name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    'aspect-square rounded-lg overflow-hidden border-2 transition-all',
                    safeSelectedImage === index ? 'border-primary' : 'border-transparent'
                  )}
                >
                  <Image
                    src={image}
                    alt={`${name} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground font-medium">{brand}</p>
              <h1 className="text-2xl md:text-3xl font-display font-bold mt-1">{name}</h1>

              <div className="flex items-center space-x-2 mt-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn('h-4 w-4', i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-muted-foreground')}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {rating.toFixed(1)} ({reviewsCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold">
                {hasPrice ? `R${price.toLocaleString()}` : 'Price on request'}
              </span>
              {hasOriginal && (
                <span className="text-xl text-muted-foreground line-through">
                  R{(originalPrice as number).toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>

            {/* Sizes (fixed 3–9) */}
            <div>
              <h3 className="font-medium mb-3">Size</h3>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'p-3 text-sm rounded-lg border transition-all',
                      selectedSize === size
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:bg-secondary'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors (optional) */}
            {colors.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Color</h3>
                <div className="space-y-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'w-full p-3 text-sm rounded-lg border text-left transition-all',
                        selectedColor === color
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:bg-secondary'
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-medium mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-lg border border-border hover:bg-secondary flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded-lg border border-border hover:bg-secondary flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex space-x-4">
              <Button onClick={handleAddToCart} disabled={!canAddToCart} className="flex-1" size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                {inStock ? (canAddToCart ? 'Add to Cart' : 'Select options') : 'Out of Stock'}
              </Button>

              <Button variant="outline" onClick={handleToggleWishlist} size="lg" className="px-6">
                <Heart className={cn('h-5 w-5', inWishlist && 'fill-current text-red-500')} />
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex items-center space-x-3 text-sm">
                <Truck className="h-4 w-4 text-primary" />
                <span>Free delivery nationwide</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span>100% authentic guarantee</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <RotateCcw className="h-4 w-4 text-primary" />
                <span>30-day returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16 border-t border-border pt-16">
          <h2 className="text-2xl font-display font-bold mb-8">Customer Reviews</h2>

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium">{review.user}</span>
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified Purchase</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn('h-4 w-4', i < review.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground')} />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          )}

          <div className="mt-8 bg-muted rounded-xl p-6">
            <h3 className="font-medium mb-4">Write a Review</h3>
            <p className="text-sm text-muted-foreground">
              Review functionality coming soon. For now, contact us directly to share your experience!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
