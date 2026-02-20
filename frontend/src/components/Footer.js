import { Link } from 'react-router-dom';
import { Droplets, Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Subscribed to newsletter!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[hsl(222,47%,11%)] text-white" data-testid="main-footer">
      <div className="max-w-[1400px] mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="h-6 w-6 text-[hsl(195,100%,50%)]" />
              <span className="font-manrope font-bold text-xl">POPP</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Pump & Tank Co — your trusted source for water pumps, storage tanks, and accessories. Serving South Africa with expert advice and competitive pricing.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +27 (0) 21 555 1234</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@popp.co.za</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Cape Town, South Africa</div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-manrope font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">Quick Links</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Shop All', path: '/shop' },
                { label: 'Pump Finder Tool', path: '/pump-finder' },
                { label: 'System Consultation', path: '/consultation' },
                { label: 'Request a Quote', path: '/cart' },
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact' },
              ].map(link => (
                <Link key={link.path} to={link.path} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-manrope font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">Categories</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Booster Pumps', slug: 'booster-pumps' },
                { label: 'Submersible Pumps', slug: 'submersible-pumps' },
                { label: 'Borehole Pumps', slug: 'borehole-pumps' },
                { label: 'Self-Priming Pumps', slug: 'self-priming-pumps' },
                { label: 'Water Tanks', slug: 'water-tanks' },
                { label: 'Accessories', slug: 'accessories' },
              ].map(cat => (
                <Link key={cat.slug} to={`/shop?category=${cat.slug}`} className="block text-sm text-gray-400 hover:text-white transition-colors">
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-manrope font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">Get special offers and product updates delivered to your inbox.</p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-sm text-white placeholder:text-gray-500 outline-none focus:border-[hsl(195,100%,50%)]"
                data-testid="newsletter-input"
              />
              <Button type="submit" size="sm" className="bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white rounded-sm" data-testid="newsletter-submit">
                Join
              </Button>
            </form>
            <div className="mt-6">
              <h3 className="font-manrope font-semibold text-sm uppercase tracking-wider mb-3 text-gray-300">Info</h3>
              <div className="space-y-2.5 text-sm text-gray-400">
                <p className="hover:text-white transition-colors cursor-pointer">Shipping & Returns</p>
                <p className="hover:text-white transition-colors cursor-pointer">Terms & Conditions</p>
                <p className="hover:text-white transition-colors cursor-pointer">Privacy Policy</p>
                <p className="hover:text-white transition-colors cursor-pointer">FAQ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 py-4 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} POPP Pump & Tank Co. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
