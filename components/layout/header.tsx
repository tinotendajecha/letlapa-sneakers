'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, Heart, Menu, X, User, Sun, Moon, Instagram, Facebook } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useTheme } from '@/components/ui/theme-provider';
import { Button } from '@/components/ui/button';

export function Header() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    cartCount, 
    wishlistItems, 
    isMobileMenuOpen, 
    setMobileMenuOpen, 
    setCartOpen, 
    setWishlistOpen 
  } = useStore();
  const { theme, setTheme } = useTheme();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-dark-brown to-brand-warm-tan rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Letlapa
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for sneakers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background/50 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Social Icons - Desktop only */}
              <div className="hidden md:flex items-center space-x-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </div>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>

              {/* User Account */}
              <Link href="/login" className="p-2 text-muted-foreground hover:text-primary transition-colors">
                <User className="h-5 w-5" />
              </Link>

              {/* Wishlist */}
              <button
                onClick={() => setWishlistOpen(true)}
                className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for sneakers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background/50 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 w-full h-screen glass border-r border-white/20 p-6">
            <nav className="mt-16 space-y-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block text-lg font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Social Links */}
              <div className="pt-6 border-t border-border">
                <div className="flex space-x-4">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
                  >
                    <Instagram className="h-5 w-5" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
                  >
                    <Facebook className="h-5 w-5" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}