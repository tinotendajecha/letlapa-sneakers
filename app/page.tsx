'use client';
import Link from 'next/link';
import { ArrowRight, Truck, Shield, Star, RotateCcw } from 'lucide-react';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { fetchFeaturedProducts } from '@/lib/groq-queries/featuredProducts';
import { Product } from '@/lib/store';
import { useState, useEffect } from 'react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const products = await fetchFeaturedProducts();
        setFeaturedProducts(products || []);
      } catch (e) {
        setError('Could not load featured kicks.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const retry = () => {
    setIsLoading(true);
    setError(null);
    fetchFeaturedProducts()
      .then((p) => setFeaturedProducts(p || []))
      .catch(() => setError('Could not load featured kicks.'))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section (unchanged) */}
      {/* ... your hero + badges here ... */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <div 
                  className="w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600')`
                  }}
                />
              </div>
      
              {/* Content */}
              <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <div className="glass rounded-2xl p-8 md:p-12 text-white">
                  <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-balance">
                    Authentic Kicks from the Heart of{' '}
                    <span className="bg-gradient-to-r from-brand-warm-tan to-brand-cream bg-clip-text text-transparent">
                      South Africa
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Rooted in Upington and Pofadder, we bring you premium sneakers with 
                    guaranteed authenticity and fast nationwide delivery.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button size="lg" asChild className="btn-primary">
                      <Link href="/shop" className="flex items-center">
                        Shop Collection
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="glass border-white/20 text-black dark:text-white hover:bg-white/10">
                      <Link href="/about">Our Story</Link>
                    </Button>
                  </div>
                </div>
              </div>
      
              {/* Trust Badges */}
             <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 
        flex flex-col sm:flex-row gap-3 sm:gap-6 px-4 w-full max-w-lg sm:max-w-none 
        justify-center items-center">
        
        <div className="flex items-center space-x-2 glass px-3 py-2 rounded-md w-full sm:w-auto">
          <Truck className="h-5 w-5" />
          <span className="text-sm font-medium">Fast SA delivery</span>
        </div>
        <div className="flex items-center space-x-2 glass px-3 py-2 rounded-md w-full sm:w-auto">
          <Shield className="h-5 w-5" />
          <span className="text-sm font-medium">Authenticity guaranteed</span>
        </div>
        <div className="flex items-center space-x-2 glass px-3 py-2 rounded-md w-full sm:w-auto">
          <Star className="h-5 w-5" />
          <span className="text-sm font-medium">5-star rated</span>
        </div>
      </div>
            </section>

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Featured Kicks
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Handpicked sneakers that define style and authenticity. 
              From classic Jordans to the latest drops.
            </p>
          </div>

          {/* Loading state: spinner + skeleton cards */}
          {isLoading && (
            <>
              <div className="flex justify-center mb-8" role="status" aria-live="polite" aria-busy="true">
                <span className="sr-only">Loading featured kicks…</span>
                <div className="h-10 w-10 rounded-full border-4 border-border border-t-transparent animate-spin" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border bg-card p-4 animate-pulse"
                    aria-hidden="true"
                  >
                    <div className="aspect-square rounded-lg bg-muted mb-4" />
                    <div className="h-4 w-2/3 bg-muted rounded mb-2" />
                    <div className="h-4 w-1/3 bg-muted rounded mb-4" />
                    <div className="h-10 w-full bg-muted rounded" />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Error state */}
          {!isLoading && error && (
            <div className="text-center mb-12">
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <Button onClick={retry} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" /> Try again
              </Button>
            </div>
          )}

          {/* Loaded state */}
          {!isLoading && !error && (
            <>
              {featuredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground mb-12">
                  No featured kicks yet. Check back soon!
                </div>
              )}

              <div className="text-center">
                <Button size="lg" variant="outline" asChild>
                  <Link href="/shop">
                    View All Sneakers
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* About + Newsletter sections (unchanged) */}
      {/* ... */}
      {/* About Preview */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Born in the Northern Cape
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                From the dusty streets of Upington to sneakerheads across South Africa, 
                Letlapa represents authentic sneaker culture with deep local roots. 
                We understand what it means to rep your kicks with pride.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every pair we sell comes with our guarantee of authenticity. 
                We're not just selling sneakers – we're sharing a piece of South African sneaker culture, 
                built on trust, quality, and passion for the game.
              </p>
              <Button size="lg" asChild>
                <Link href="/about">
                  Read Our Story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-brand-dark-brown to-brand-warm-tan rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <span className="text-4xl font-bold">L</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Letlapa Sneakers</h3>
                  <p className="text-white/80">Est. in Upington, Northern Cape</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter & Social */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            Stay in the Loop
          </h2>
          <p className="text-muted-foreground mb-8">
            Get notified about new drops, exclusive deals, and sneaker culture stories from SA.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field flex-1"
            />
            <Button className="btn-primary">
              Subscribe
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            {/* TODO: Add proper email subscription with backend */}
            By subscribing, you agree to receive marketing emails from Letlapa Sneakers.
          </p>
        </div>
      </section>
    </div>
  );
}
