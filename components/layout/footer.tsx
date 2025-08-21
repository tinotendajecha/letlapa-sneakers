import Link from 'next/link';
import { Instagram, Facebook, MapPin, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-dark-brown to-brand-warm-tan rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-display font-bold text-xl">Letlapa</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Authentic sneakers from the heart of South Africa. 
              Rooted in Upington and Pofadder, serving sneakerheads nationwide.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary rounded-xl flex items-center justify-center transition-all duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary rounded-xl flex items-center justify-center transition-all duration-300"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-3">
              {[
                { name: 'Shop All', href: '/shop' },
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'Size Guide', href: '/size-guide' },
                { name: 'Shipping Info', href: '/shipping' },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Customer Care</h3>
            <div className="space-y-3">
              {[
                { name: 'Returns & Exchanges', href: '/returns' },
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Authentication', href: '/authentication' },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p>Upington, Northern Cape</p>
                  <p>South Africa</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a 
                  href="mailto:hello@letlapa.co.za" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  hello@letlapa.co.za
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a 
                  href="tel:+27123456789" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  +27 12 345 6789
                </a>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Fast SA delivery 🚚</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Authenticity guaranteed ✓</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Secure payments 🔒</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Letlapa Sneakers. All rights reserved.
          </div>
          <div className="text-sm text-muted-foreground">
            Made with ❤️ by{' '}
            <a 
              href="https://genztechlabs.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GenZTechLabs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}