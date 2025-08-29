'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type ProductLoaderProps = {
  variant?: 'fullscreen' | 'inline';
  message?: string;
  showReviewsSkeleton?: boolean;
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
      {/* your icon in the main FancyLoader uses lucide Shovel-as-shoe; keeping it abstract here */}
      <div className="w-6 h-6 rounded-sm bg-primary animate-bounce-subtle" />
    </div>
  </div>
);

const SparkleParticles = () => (
  <>
    <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-primary/60 animate-sparkle-1" />
    <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-primary/40 animate-sparkle-2" />
    <div className="absolute bottom-1/4 left-1/3 w-3 h-3 rounded-full bg-primary/50 animate-sparkle-3" />
  </>
);

export default function FancyProductLoader({
  variant = 'fullscreen',
  message = 'Loading product…',
  showReviewsSkeleton = true,
  className,
}: ProductLoaderProps) {
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

        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
        .animate-orbit { animation: orbit 2s linear infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 1.5s ease-in-out infinite; }
        .animate-sparkle-1 { animation: sparkle-1 3s ease-in-out infinite; }
        .animate-sparkle-2 { animation: sparkle-2 2.5s ease-in-out infinite 0.5s; }
        .animate-sparkle-3 { animation: sparkle-3 2.8s ease-in-out infinite 1s; }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; opacity: 0; }

        @media (prefers-reduced-motion: reduce) {
          .animate-shimmer,
          .animate-orbit,
          .animate-bounce-subtle,
          .animate-sparkle-1,
          .animate-sparkle-2,
          .animate-sparkle-3 { animation: none; }
          .animate-fade-in { opacity: 1; transform: none; }
        }
      `}</style>

      <div
        role="status"
        aria-live="polite"
        className={cn(
          isFullscreen
            ? 'fixed inset-0 z-50 bg-background/70 backdrop-blur-sm overflow-y-auto'
            : 'w-full',
          className
        )}
      >
        {/* Progress Bar */}
        <ProgressBar />

        {/* Header / Orbit */}
        <div className={cn(
          'flex flex-col items-center justify-center relative',
          // push content down so it doesn’t collide with progress bar
          isFullscreen ? 'pt-16 mb-8' : 'py-8'
        )}>
          <div className="absolute inset-0 pointer-events-none">
            <SparkleParticles />
          </div>

          <div className="relative mb-4">
            <FlagBadge />
            <OrbitingShoe />
          </div>

          <p className="text-lg font-medium text-foreground mb-1">{message}</p>
          <p className="text-sm text-muted-foreground">Getting your product details ready…</p>
        </div>

        {/* Main Product Detail Skeleton */}
        <div className={cn(
          'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16',
          isFullscreen ? '' : 'pt-6'
        )}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT: Image gallery skeleton */}
            <div className="space-y-4">
              <Card className="p-0 overflow-hidden animate-fade-in">
                <Skeleton className="aspect-square w-full" />
              </Card>

              <div className="grid grid-cols-4 gap-4">
                {[0,1,2,3].map((i) => (
                  <Card key={i} className="p-0 overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                    <Skeleton className="aspect-square w-full" />
                  </Card>
                ))}
              </div>
            </div>

            {/* RIGHT: Details skeleton */}
            <div className="space-y-6">
              {/* brand + title */}
              <div className="space-y-2 animate-fade-in">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-2/3" />
              </div>

              {/* rating row */}
              <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '80ms' }}>
                <div className="flex items-center gap-1">
                  {[0,1,2,3,4].map((i) => <Skeleton key={i} className="h-4 w-4 rounded" />)}
                </div>
                <Skeleton className="h-4 w-24" />
              </div>

              {/* price */}
              <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '120ms' }}>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>

              {/* description */}
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: '160ms' }}>
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-10/12" />
                <Skeleton className="h-4 w-8/12" />
              </div>

              {/* size grid */}
              <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                <Skeleton className="h-4 w-16 mb-3" />
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
              </div>

              {/* color list */}
              <div className="animate-fade-in" style={{ animationDelay: '240ms' }}>
                <Skeleton className="h-4 w-16 mb-3" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
              </div>

              {/* quantity */}
              <div className="animate-fade-in" style={{ animationDelay: '280ms' }}>
                <Skeleton className="h-4 w-20 mb-3" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-10 w-10 rounded-lg" />
                </div>
              </div>

              {/* buttons */}
              <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '320ms' }}>
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>

              {/* features */}
              <div className="space-y-3 pt-6 border-t border-border animate-fade-in" style={{ animationDelay: '360ms' }}>
                {[0,1,2].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* reviews skeleton */}
          {showReviewsSkeleton && (
            <div className="mt-16 border-t border-border pt-16 animate-fade-in" style={{ animationDelay: '420ms' }}>
              <Skeleton className="h-8 w-56 mb-8" />
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="p-6 border border-border">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <div className="flex items-center gap-1">
                          {[0,1,2,3,4].map((j) => <Skeleton key={j} className="h-4 w-4 rounded" />)}
                        </div>
                      </div>
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-11/12" />
                      <Skeleton className="h-4 w-9/12" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
