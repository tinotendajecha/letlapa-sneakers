'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { mockProducts, mockReviews } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const product = mockProducts.find(p => p.id === productId);
  const reviews = mockReviews.filter(r => r.productId === productId);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, setCartOpen } = useStore();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    
    addToCart(product, selectedSize, selectedColor, quantity);
    setCartOpen(true);
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

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
            {/* Main Image */}
            <div className="aspect-square bg-secondary rounded-xl overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "aspect-square rounded-lg overflow-hidden border-2 transition-all",
                    selectedImage === index ? "border-primary" : "border-transparent"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
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
            {/* Header */}
            <div>
              <p className="text-sm text-muted-foreground font-medium">{product.brand}</p>
              <h1 className="text-2xl md:text-3xl font-display font-bold mt-1">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mt-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold">R{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  R{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-medium mb-3">Size</h3>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "p-3 text-sm rounded-lg border transition-all",
                      selectedSize === size
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:bg-secondary"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-medium mb-3">Color</h3>
              <div className="space-y-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "w-full p-3 text-sm rounded-lg border text-left transition-all",
                      selectedColor === color
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:bg-secondary"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-medium mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-border hover:bg-secondary flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-border hover:bg-secondary flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                variant="outline"
                onClick={handleToggleWishlist}
                size="lg"
                className="px-6"
              >
                <Heart className={cn("h-5 w-5", inWishlist && "fill-current text-red-500")} />
              </Button>
            </div>

            {/* Product Features */}
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

        {/* Reviews Section */}
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
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-muted-foreground"
                            )}
                          />
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

          {/* TODO: Add review form component */}
          <div className="mt-8 bg-muted rounded-xl p-6">
            <h3 className="font-medium mb-4">Write a Review</h3>
            <p className="text-sm text-muted-foreground">
              {/* TODO: Implement review submission */}
              Review functionality coming soon. For now, contact us directly to share your experience!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}