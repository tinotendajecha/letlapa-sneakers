'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { provinces } from '@/lib/mock-data';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    province: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission with backend
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', province: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions about our sneakers? Need help with sizing? 
            Want to know about new drops? We're here to help!
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-display font-bold mb-6">Let's Connect</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Whether you're a longtime sneaker collector or just getting started, 
                we're here to help you find the perfect pair. Reach out through any 
                of these channels, and we'll get back to you quickly.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Visit Our Location</h3>
                  <p className="text-muted-foreground text-sm">
                    Upington, Northern Cape<br />
                    South Africa
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Call Us</h3>
                  <p className="text-muted-foreground text-sm">
                    <a href="tel:+27612135627" className="hover:text-primary transition-colors">
                      +27612135627
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mon-Fri 9AM-6PM, Sat 9AM-2PM
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Email Us</h3>
                  <p className="text-muted-foreground text-sm">
                    <a href="mailto:hello@letlapa.co.za" className="hover:text-primary transition-colors">
                      hello@letlapa.co.za
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">WhatsApp</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Quick questions? Chat with us directly
                  </p>
                  <button
                    onClick={() => {
                      const phoneNumber = "27612135627"; // TODO: Replace with actual Letlapa WhatsApp number
                      const message = "Hi! I have a question about your sneakers.";
                      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                      window.open(url, '_blank');
                    }}
                    className="text-xs bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Start Chat
                  </button>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-medium mb-4">Business Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span>9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="text-destructive">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-xl p-8 border border-border">
            <h2 className="text-2xl font-display font-bold mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="province" className="block text-sm font-medium mb-2">
                  Province
                </label>
                <select
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  <option value="">Select your province</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="input-field resize-none"
                  placeholder="Tell us about your sneaker needs, questions about sizing, or anything else we can help with..."
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Send Message
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                {/* TODO: Add privacy policy */}
                By submitting this form, you agree to our privacy policy. 
                We'll only use your information to respond to your inquiry.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                question: "How can I be sure the sneakers are authentic?",
                answer: "Every pair we sell comes with our 100% authenticity guarantee. We work directly with authorized retailers and have expert authentication processes in place."
              },
              {
                question: "What are your delivery options?",
                answer: "We offer fast delivery nationwide. Standard delivery takes 2-3 business days to major cities, and 3-5 days to remote areas. Express delivery available for urgent orders."
              },
              {
                question: "Do you offer exchanges or returns?",
                answer: "Yes! We offer 30-day returns and exchanges on unworn items in original packaging. Just contact us to initiate the process."
              },
              {
                question: "Can I get notifications about new sneaker releases?",
                answer: "Absolutely! Follow us on Instagram and Facebook, or subscribe to our newsletter to get notified about new drops and exclusive deals."
              },
            ].map((faq, index) => (
              <div key={index} className="bg-background rounded-xl p-6 border border-border">
                <h3 className="font-medium mb-3">{faq.question}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}