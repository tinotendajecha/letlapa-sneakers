'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search, ShoppingCart, Heart, Menu, X, User, Sun, Moon,
  Instagram, Facebook, LogOut
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { useTheme } from '@/components/ui/theme-provider';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

type SessionUser = { id: string; email: string; name?: string | null; isAdmin?: boolean };
type MeResponse = { authenticated: boolean; user?: SessionUser };

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [session, setSession] = useState<MeResponse | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const {
    cartCount,
    wishlistItems,
    isMobileMenuOpen,
    setMobileMenuOpen,
    setCartOpen,
    setWishlistOpen,
  } = useStore();

  const { theme, setTheme } = useTheme();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const data: MeResponse = await res.json();
        if (!cancelled) setSession(data);
      } catch {
        if (!cancelled) setSession({ authenticated: false });
      } finally {
        if (!cancelled) setLoadingSession(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (!res.ok) throw new Error('Logout failed');
      toast.success('Signed out');
      setSession({ authenticated: false });
      // If you guard some routes via middleware, redirect to home:
      router.push('/');
      router.refresh();
    } catch (e) {
      toast.error('Could not sign out');
    }
  };

  const isAuthed = !!session?.authenticated;
  const firstName = session?.user?.name?.split(' ')?.[0];

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 mr-7">
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
                  className={`text-sm font-medium transition-colors hover:text-primary ${pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Compact Search (desktop) */}
            <div className="hidden lg:flex flex-1 justify-center mx-4">
              <div className="relative w-full max-w-[18rem] xl:max-w-[22rem] transition-all duration-200 focus-within:max-w-[24rem]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background/60 backdrop-blur-sm text-sm
                 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Desktop: show socials if LOGGED OUT; else show Profile + Logout */}
              <div className="hidden md:flex items-center space-x-2">
                {isAuthed ? (
                  <>
                    {/* Profile */}
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-2 py-1 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                      title="Profile"
                    >
                      <User className="h-5 w-5" />
                      <span className="hidden xl:inline text-sm">
                        {firstName ? `Hi, ${firstName}` : 'Profile'}
                      </span>
                    </Link>
                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      title="Sign out"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      title="Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  </>
                )}
              </div>

              {/* Theme Toggle */}
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2">
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>

              {/* Account (fallback icon for small screens & logged out) */}
              {!isAuthed && (
                <Link href="/login" className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Sign in">
                  <User className="h-5 w-5" />
                </Link>
              )}

              {/* Wishlist */}
              <button
                onClick={() => setWishlistOpen(true)}
                className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
                title="Wishlist"
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
                title="Cart"
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
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 w-full h-screen glass border-r border-white/20 p-6">
            <nav className="mt-16 space-y-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block text-lg font-medium transition-colors hover:text-primary ${pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-6 border-t border-border space-y-4">
                {isAuthed ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 text-foreground hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                      className="flex items-center space-x-2 text-foreground hover:text-primary"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center space-x-2 text-foreground hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Sign in</span>
                    </Link>
                    {/* Socials for logged-out */}
                    <div className="flex space-x-4 text-muted-foreground">
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-primary">
                        <Instagram className="h-5 w-5" />
                        <span>Instagram</span>
                      </a>
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-primary">
                        <Facebook className="h-5 w-5" />
                        <span>Facebook</span>
                      </a>
                    </div>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
