import { MapPin, Users, Award, Truck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1600')`
            }}
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-2xl p-8 md:p-12 text-white">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Born in the{' '}
              <span className="bg-gradient-to-r from-brand-warm-tan to-brand-cream bg-clip-text text-transparent">
                Northern Cape
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              From the dusty streets of Upington to sneakerheads across South Africa, 
              our story is one of passion, authenticity, and deep roots in local culture.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Letlapa Sneakers was born from a simple belief: everyone deserves access to 
                  authentic, high-quality sneakers, no matter where they are in South Africa. 
                  Founded in the heart of the Northern Cape, we understand the struggle of 
                  finding genuine kicks outside the major cities.
                </p>
                <p>
                  Starting from Upington and with deep connections to Pofadder, we've built 
                  relationships with trusted suppliers and developed a network that spans 
                  from Cape Town to Johannesburg. But we never forgot our roots.
                </p>
                <p>
                  Every pair we sell comes with our personal guarantee of authenticity. 
                  We're not just selling sneakers – we're building a community of South African 
                  sneakerheads who value quality, trust, and the culture that comes with it.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-brand-dark-brown to-brand-warm-tan rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">2019</div>
                    <div className="text-sm text-white/80">Founded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">5000+</div>
                    <div className="text-sm text-white/80">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">100%</div>
                    <div className="text-sm text-white/80">Authentic</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">9</div>
                    <div className="text-sm text-white/80">Provinces Served</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              What We Stand For
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our values are rooted in South African principles of Ubuntu, trust, and community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg">Authenticity</h3>
              <p className="text-muted-foreground text-sm">
                Every single pair is guaranteed authentic. No fakes, no compromises.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg">Community</h3>
              <p className="text-muted-foreground text-sm">
                Building a community of SA sneakerheads, from the Northern Cape to everywhere.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg">Local Roots</h3>
              <p className="text-muted-foreground text-sm">
                Proudly South African, with deep connections to our Northern Cape heritage.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg">Accessibility</h3>
              <p className="text-muted-foreground text-sm">
                Fast, reliable delivery to every corner of South Africa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
            The People Behind Letlapa
          </h2>
          
          <div className="bg-card rounded-2xl p-8 md:p-12 border border-border">
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                We're a small but passionate team of sneaker enthusiasts who understand 
                what it means to hunt for that perfect pair. From authentication experts 
                to customer service champions, everyone at Letlapa shares the same commitment 
                to bringing you the best sneaker experience in South Africa.
              </p>
              
              <p className="text-muted-foreground leading-relaxed">
                Whether you're in Cape Town, Durban, Johannesburg, or right here in the 
                Northern Cape with us, we're here to serve the South African sneaker community 
                with pride and authenticity.
              </p>

              <div className="pt-6">
                <p className="font-medium text-foreground">
                  Have questions? Want to share your sneaker story?
                </p>
                <p className="text-muted-foreground mt-2">
                  We'd love to hear from you. This is more than business – it's community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-brand-dark-brown to-brand-warm-tan">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Find Your Perfect Kicks?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers across South Africa who trust Letlapa 
            for authentic, quality sneakers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/shop"
              className="bg-white text-brand-dark-brown px-8 py-3 rounded-xl font-medium hover:bg-white/90 transition-colors"
            >
              Browse Collection
            </a>
            <a
              href="/contact"
              className="border border-white/30 text-white px-8 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}