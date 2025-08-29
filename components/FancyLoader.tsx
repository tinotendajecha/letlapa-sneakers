'use client';

import React from 'react';
import { Shovel as Shoe, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type FancyLoaderProps = {
    variant?: 'fullscreen' | 'inline';
    message?: string;
    showSkeletonGrid?: boolean;
    items?: number;
    className?: string;
};

const ProgressBar = () => (
    <div className="absolute top-0 left-0 w-full h-1 bg-muted overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer" />
    </div>
);

const FlagBadge = () => (
    <div className="relative">
        <div className="w-12 h-12 rounded-full bg-card border-2 border-border flex items-center justify-center shadow-lg ring-2 ring-primary/20">
            <span className="text-xl">🇿🇦</span>
        </div>
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
    </div>
);

const OrbitingShoe = () => (
    <div className="relative w-24 h-24 animate-orbit">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
            <Shoe className="w-6 h-6 text-primary animate-bounce-subtle" />
        </div>
    </div>
);

const SparkleParticles = () => (
    <>
        <Sparkles className="absolute top-1/4 left-1/4 w-4 h-4 text-primary/60 animate-sparkle-1" />
        <Sparkles className="absolute top-1/3 right-1/4 w-3 h-3 text-primary/40 animate-sparkle-2" />
        <Sparkles className="absolute bottom-1/4 left-1/3 w-3 h-3 text-primary/50 animate-sparkle-3" />
    </>
);

const SkeletonProductCard = ({ index }: { index: number }) => (
    <Card
        className="p-4 animate-fade-in"
        style={{ animationDelay: `${index * 100}ms` }}
    >
        <div className="space-y-4">
            {/* Product Image Skeleton */}
            <Skeleton className="h-48 w-full rounded-md" />

            {/* Product Title */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>

            {/* Price */}
            <Skeleton className="h-6 w-20" />

            {/* Tags */}
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full" />
            </div>
        </div>
    </Card>
);

const SkeletonGrid = ({ items }: { items: number }) => (
    <div className="w-full max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: items }).map((_, index) => (
                <SkeletonProductCard key={index} index={index} />
            ))}
        </div>
    </div>
);

export default function FancyLoader({
    variant = 'inline',
    message = 'Loading products…',
    showSkeletonGrid = true,
    items = 6,
    className,
}: FancyLoaderProps) {
    const isFullscreen = variant === 'fullscreen';

    return (
        <>
            <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes sparkle-1 {
          0%, 100% { opacity: 0; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes sparkle-2 {
          0%, 100% { opacity: 0; transform: scale(0.9) rotate(0deg); }
          60% { opacity: 0.8; transform: scale(1.1) rotate(240deg); }
        }
        @keyframes sparkle-3 {
          0%, 100% { opacity: 0; transform: scale(0.7) rotate(0deg); }
          40% { opacity: 0.9; transform: scale(1) rotate(120deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0px); }
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        .animate-orbit {
          animation: orbit 2s linear infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 1.5s ease-in-out infinite;
        }
        .animate-sparkle-1 {
          animation: sparkle-1 3s ease-in-out infinite;
        }
        .animate-sparkle-2 {
          animation: sparkle-2 2.5s ease-in-out infinite 0.5s;
        }
        .animate-sparkle-3 {
          animation: sparkle-3 2.8s ease-in-out infinite 1s;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-shimmer,
          .animate-orbit,
          .animate-bounce-subtle,
          .animate-sparkle-1,
          .animate-sparkle-2,
          .animate-sparkle-3 {
            animation: none;
          }
          .animate-fade-in {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

            <div
                role="status"
                aria-live="polite"
                className={cn(
                    isFullscreen
                        ? 'fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center'
                        : 'w-full',
                    className
                )}
            >
                <span className="sr-only">Loading content, please wait</span>

                {/* Progress Bar */}
                <ProgressBar />

                {/* Main Loader Section */}
                <div className={cn(
                    'flex flex-col items-center justify-center relative',
                    isFullscreen ? 'pt-24 mt-10 mb-12' : 'py-12'
                )}>
                    {/* Sparkle Particles */}
                    <div className="absolute inset-0 pointer-events-none">
                        <SparkleParticles />
                    </div>

                    {/* Central Loader - Flag with Orbiting Shoe */}
                    <div className="relative mb-6">
                        <FlagBadge />
                        <OrbitingShoe />
                    </div>

                    {/* Loading Message */}
                    <p className="text-lg font-medium text-foreground mb-2">
                        {message}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Just a moment while we prep your experience
                    </p>
                </div>

                {/* Skeleton Grid */}
                {showSkeletonGrid && (
                    <div className={cn(
                        'w-full',
                        isFullscreen ? 'max-w-6xl' : ''
                    )}>
                        <SkeletonGrid items={items} />
                    </div>
                )}
            </div>
        </>
    );
}

/*
Usage Examples:

// Fullscreen overlay loading
<FancyLoader variant="fullscreen" message="Lacing up fresh drops…" />

// Inline loading within a page section
<FancyLoader items={9} />

// Minimal inline loader without skeleton grid
<FancyLoader showSkeletonGrid={false} message="Updating your cart…" />

// Custom styling
<FancyLoader 
  variant="fullscreen"
  message="Finding the perfect fit…"
  items={12}
  className="bg-gradient-to-br from-background to-muted"
/>
*/