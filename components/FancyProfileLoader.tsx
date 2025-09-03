'use client';

import React from 'react';
import { User, Phone, MapPin, Truck, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type FancyProfileLoaderProps = {
  variant?: 'fullscreen' | 'inline';
  message?: string;
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

const SparkleParticles = () => (
  <>
    <Sparkles className="absolute top-1/4 left-1/4 w-4 h-4 text-primary/60 animate-sparkle-1" />
    <Sparkles className="absolute top-1/3 right-1/4 w-3 h-3 text-primary/40 animate-sparkle-2" />
    <Sparkles className="absolute bottom-1/4 left-1/3 w-3 h-3 text-primary/50 animate-sparkle-3" />
  </>
);

/** Left column (profile summary) skeleton */
const SummarySkeleton = () => (
  <Card className="p-6 border border-border">
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-dark-brown to-brand-warm-tan flex items-center justify-center">
        <User className="text-white w-7 h-7" />
      </div>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>

    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Email Address</label>
      <Skeleton className="h-10 w-full rounded-md" />
    </div>

    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-primary" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  </Card>
);

/** Contact form skeleton */
const ContactSkeleton = () => (
  <Card className="p-6 border border-border">
    <div className="flex items-center mb-4">
      <Phone className="h-5 w-5 mr-2" />
      <span className="font-semibold text-lg">Contact Information</span>
    </div>
    <div className="space-y-4">
      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-3 w-48 mt-2" />
      </div>
      <div>
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-10 w-full" />
        <div className="flex items-center space-x-2 mt-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  </Card>
);

/** Address form + list skeleton */
const AddressSkeleton = () => (
  <Card className="p-6 border border-border">
    <div className="flex items-center mb-4">
      <MapPin className="h-5 w-5 mr-2" />
      <span className="font-semibold text-lg">Delivery Address</span>
    </div>

    <div className="mb-6">
      <Skeleton className="h-10 w-full" />
    </div>

    <div className="space-y-3">
      <Skeleton className="h-4 w-36" />
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="p-4 border border-border rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-64" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

/** Shipping prefs skeleton */
const ShippingSkeleton = () => (
  <Card className="p-6 border border-border">
    <div className="flex items-center mb-4">
      <Truck className="h-5 w-5 mr-2" />
      <span className="font-semibold text-lg">Shipping Preferences</span>
    </div>
    <div className="space-y-4">
      <div>
        <Skeleton className="h-4 w-40 mb-2" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div>
        <Skeleton className="h-4 w-56 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  </Card>
);

export default function FancyProfileLoader({
  variant = 'inline',
  message = 'Loading your profile…',
  className,
}: FancyProfileLoaderProps) {
  const isFullscreen = variant === 'fullscreen';

  return (
    <>
      <style jsx>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        @keyframes sparkle-1 { 0%,100%{opacity:0;transform:scale(0.8) rotate(0)} 50%{opacity:1;transform:scale(1) rotate(180deg)} }
        @keyframes sparkle-2 { 0%,100%{opacity:0;transform:scale(0.9) rotate(0)} 60%{opacity:.8;transform:scale(1.1) rotate(240deg)} }
        @keyframes sparkle-3 { 0%,100%{opacity:0;transform:scale(0.7) rotate(0)} 40%{opacity:.9;transform:scale(1) rotate(120deg)} }
        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
        .animate-sparkle-1 { animation: sparkle-1 3s ease-in-out infinite; }
        .animate-sparkle-2 { animation: sparkle-2 2.5s ease-in-out infinite .5s; }
        .animate-sparkle-3 { animation: sparkle-3 2.8s ease-in-out infinite 1s; }
        @media (prefers-reduced-motion: reduce) {
          .animate-shimmer, .animate-sparkle-1, .animate-sparkle-2, .animate-sparkle-3 { animation: none; }
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

        <ProgressBar />

        {/* Header flair */}
        <div className={cn('flex flex-col items-center relative', isFullscreen ? 'pt-24 mt-10 mb-8' : 'py-8')}>
          <div className="absolute inset-0 pointer-events-none">
            <SparkleParticles />
          </div>
          <FlagBadge />
          <p className="text-lg font-medium text-foreground mt-4">{message}</p>
          <p className="text-sm text-muted-foreground">Just a moment while we prep your experience</p>
        </div>

        {/* Layout that mirrors /profile */}
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <SummarySkeleton />
            </div>

            <div className="lg:col-span-8 space-y-8">
              <ContactSkeleton />
              <AddressSkeleton />
              <ShippingSkeleton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
