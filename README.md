# 🏃‍♂️ Letlapa Sneakers

A premium, high-end sneaker store built with Next.js 13+ App Router, showcasing authentic South African sneaker culture from the heart of the Northern Cape.

## 🌟 Features

### ✨ Frontend (Complete)
- **Premium UI/UX**: Glassmorphism effects, smooth animations, mobile-first design
- **Product Catalog**: Advanced filtering, sorting, wishlist functionality  
- **Shopping Cart**: Persistent cart with localStorage, quantity management
- **Authentication UI**: Login/register forms with Google OAuth placeholder
- **Theme System**: Custom light/dark mode with brown/beige brand colors
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Admin Dashboard**: Complete admin interface for managing store

### 📱 Mobile Experience
- Fully responsive design with mobile-specific optimizations
- Touch-friendly interactions and swipe gestures
- Mobile menu with smooth animations
- WhatsApp integration for instant customer support

### 🎨 Design System
- **Brand Colors**: Dark Brown (#714329), Warm Tan (#B08463), Soft Beige (#B9937B), Cream (#D0B9A7)
- **Typography**: Inter font family for premium feel
- **Components**: Built with shadcn/ui for consistency
- **Animations**: Smooth transitions and micro-interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd letlapa-sneakers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
├── app/                    # Next.js 13+ App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Homepage
│   ├── shop/              # Product catalog
│   ├── product/[id]/      # Product detail pages
│   ├── about/             # About page
│   ├── contact/           # Contact form
│   ├── login/             # Authentication UI
│   └── admin/             # Admin dashboard
├── components/            # Reusable components
│   ├── layout/            # Header, footer
│   ├── products/          # Product cards, filters
│   ├── cart/              # Shopping cart, wishlist
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities and store
│   ├── store.ts           # Zustand state management
│   ├── mock-data.ts       # Sample product data
│   └── utils.ts           # Helper functions
└── styles/               # Global styles and themes
```

## 🎯 Pages & Features

### 🏠 Homepage (`/`)
- Hero section with glassmorphism overlay
- Featured products carousel
- Brand story preview
- Trust badges (Fast SA delivery, Authenticity guaranteed)

### 🛍️ Shop (`/shop`) 
- Product grid with filtering and sorting
- Advanced filters: brand, size, color, price range
- Responsive layout with mobile-optimized filters

### 👟 Product Detail (`/product/[id]`)
- Image gallery with zoom functionality
- Size and color selection
- Add to cart/wishlist
- Customer reviews section
- Shipping and return information

### 📖 About (`/about`)
- Brand story rooted in Upington and Pofadder
- Company values and mission
- Team information
- Call-to-action sections

### 📞 Contact (`/contact`)
- Contact form with SA province selection
- Multiple contact methods
- Business hours
- WhatsApp integration

### 🔐 Authentication (`/login`, `/register`)
- Email/password login forms
- Google OAuth integration (UI only)
- Responsive forms with validation

### ⚙️ Admin Dashboard (`/admin`)
- Sales overview and analytics
- Product management interface
- Order tracking system
- Customer lead management

## 🛠️ State Management

### Zustand Store Features
- **Cart Management**: Add/remove items, quantity updates, persistent storage
- **Wishlist**: Save favorite products across sessions  
- **Filters**: Product filtering and sorting state
- **UI State**: Mobile menu, cart drawer, theme management

### Local Storage Integration
- Cart items persist between sessions
- Wishlist data saved locally
- Theme preference storage

## 🎨 Theme System

### Brand Colors
```css
--brand-dark-brown: #714329
--brand-warm-tan: #B08463  
--brand-soft-beige: #B9937B
--brand-cream: #D0B9A7
--brand-muted-taupe: #B5A192
```

### Design Tokens
- **Spacing**: 8px grid system
- **Typography**: Inter font with display/body variants
- **Border Radius**: 0.75rem for modern rounded corners
- **Shadows**: Subtle elevation with glassmorphism effects

## 📱 Mobile Responsiveness

### Breakpoints
- **Mobile**: < 768px - Single column, touch-optimized
- **Tablet**: 768px - 1024px - Two columns, adapted layouts  
- **Desktop**: > 1024px - Full multi-column experience

### Mobile Features
- Swipe gestures for product images
- Touch-friendly button sizes (min 44px)
- Collapsible mobile menu
- Bottom sheet cart drawer
- WhatsApp floating action button

## ⚠️ Backend Integration Required

This is a **frontend-only implementation**. To make it production-ready, you'll need to implement:

### 🔧 Required Integrations

1. **Authentication System**
   ```bash
   # Example with NextAuth.js
   npm install next-auth
   ```

2. **Payment Processing**
   ```bash 
   # Stripe integration
   npm install @stripe/stripe-js stripe
   ```

3. **Database & CMS**
   ```bash
   # Example with Supabase
   npm install @supabase/supabase-js
   ```

4. **Email Service** 
   ```bash
   # Example with Resend
   npm install resend
   ```

### 📝 TODO Items in Code
- Search for `// TODO:` comments throughout the codebase
- Authentication endpoints and logic
- Payment processing integration  
- Product data management (replace mock data)
- Email notifications and contact form
- Order management and tracking
- Admin dashboard functionality

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
1. Copy `.env.example` to `.env.local`
2. Fill in your actual environment variables
3. Configure authentication, payments, and external services

### Recommended Hosting
- **Vercel**: Optimal for Next.js applications
- **Netlify**: Good alternative with form handling
- **Railway**: Full-stack deployment option

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)  
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Credits

- **Design Inspiration**: Modern sneaker culture and South African heritage
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: [Inter](https://rsms.me/inter/) 
- **Images**: [Pexels](https://pexels.com/) for stock photography

---

**Made with ❤️ by [GenZTechLabs](https://genztechlabs.com)**

> Bringing authentic South African sneaker culture to life through premium web experiences.