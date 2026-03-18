import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Settings, Droplets, ShieldCheck, Truck, Zap, Container } from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import ProductCard from '../components/ProductCard';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const HERO_IMG = 'https://images.unsplash.com/photo-1575507770554-1d097efa18d7?w=1600&q=80';

const categoryData = [
  { name: 'Booster Pumps', slug: 'Vertical Multistage Pump', icon: Zap, desc: 'Home & commercial pressure systems' },
  { name: 'Submersible Pumps', slug: 'Submersible Pump', icon: Droplets, desc: 'Wells, boreholes & drainage' },
  { name: 'Borehole Pumps', slug: 'Borehole Pump', icon: Activity, desc: 'Deep well pump solutions' },
  { name: 'Water Tanks', slug: 'Stainless Steel Pump', icon: Container, desc: 'Stainless steel pump solutions' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/products?featured=true&limit=8`);
        setFeatured(res.data);
      } catch (err) {
        console.error('Failed to load featured products', err);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div data-testid="home-page">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center" data-testid="hero-section">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Water" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[hsl(214,100%,15%)]/80" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <p className="text-[hsl(195,100%,50%)] font-semibold text-sm uppercase tracking-widest mb-4">Pump & Tank Co</p>
            <h1 className="font-manrope font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Industrial Grade<br />Water Solutions
            </h1>
            <p className="text-base md:text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">
              Simple browsing, expert advice, and fast quoting. Find the right pump or tank for your home, farm, or business.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/shop">
                <Button className="bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white h-12 px-8 text-sm font-semibold rounded-sm" data-testid="hero-shop-btn">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-8 text-sm font-semibold rounded-sm" data-testid="hero-quote-btn">
                  Get a Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="border-b border-[hsl(214,32%,91%)] bg-white">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: ShieldCheck, label: 'Quality Guaranteed', sub: 'Trusted brands only' },
              { icon: Truck, label: 'International and SA', sub: 'Fast & reliable shipping' },
              { icon: Activity, label: 'Expert Advice', sub: 'Free sizing & selection help' },
              { icon: Zap, label: 'Quick Quoting', sub: 'Response within 24 hours' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <item.icon className="h-6 w-6 text-[hsl(214,100%,40%)]" />
                <p className="font-manrope font-semibold text-sm text-[hsl(222,47%,11%)]">{item.label}</p>
                <p className="text-xs text-[hsl(215,16%,47%)]">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-[hsl(210,40%,98%)]" data-testid="categories-section">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="mb-12">
            <h2 className="font-manrope font-bold text-2xl sm:text-3xl text-[hsl(222,47%,11%)] mb-2">Shop by Category</h2>
            <p className="text-base text-[hsl(215,16%,47%)]">Browse our range of pumps, tanks, and accessories</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryData.map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="group bg-white border border-[hsl(214,32%,91%)] hover:border-[hsl(214,100%,40%)] p-8 rounded-sm transition-all duration-300 hover:shadow-lg"
                data-testid={`category-tile-${cat.slug}`}
              >
                <cat.icon className="h-10 w-10 text-[hsl(214,100%,40%)] mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-manrope font-bold text-lg text-[hsl(222,47%,11%)] mb-1">{cat.name}</h3>
                <p className="text-sm text-[hsl(215,16%,47%)] mb-4">{cat.desc}</p>
                <span className="inline-flex items-center text-sm font-medium text-[hsl(214,100%,40%)] group-hover:gap-2 transition-all">
                  Browse <ArrowRight className="h-4 w-4 ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white" data-testid="featured-section">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-manrope font-bold text-2xl sm:text-3xl text-[hsl(222,47%,11%)] mb-2">Featured Products</h2>
              <p className="text-base text-[hsl(215,16%,47%)]">Our top picks and special offers</p>
            </div>
            <Link to="/shop" className="hidden sm:inline-flex items-center text-sm font-medium text-[hsl(214,100%,40%)] hover:underline">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-[hsl(210,40%,96%)] animate-pulse rounded-sm h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="mt-8 text-center sm:hidden">
            <Link to="/shop">
              <Button variant="outline" className="rounded-sm" data-testid="view-all-products-btn">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-[hsl(210,40%,98%)]" data-testid="tools-section">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-manrope font-bold text-2xl sm:text-3xl text-[hsl(222,47%,11%)] mb-2">Interactive Tools</h2>
            <p className="text-base text-[hsl(215,16%,47%)]">Not sure what you need? Let our tools help you find the right solution.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/pump-finder" className="group relative overflow-hidden bg-[hsl(214,100%,40%)] text-white p-10 rounded-sm hover:shadow-xl transition-shadow" data-testid="pump-finder-card">
              <Activity className="h-12 w-12 mb-4 opacity-80" />
              <h3 className="font-manrope font-bold text-2xl mb-2">Pump Finder</h3>
              <p className="text-white/80 mb-6 max-w-sm">Enter your flow rate and head requirements. Get matched with the right pump and a quote link.</p>
              <span className="inline-flex items-center font-semibold text-sm">
                Open Tool <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link to="/consultation" className="group relative overflow-hidden bg-[hsl(222,47%,11%)] text-white p-10 rounded-sm hover:shadow-xl transition-shadow" data-testid="consultation-card">
              <Settings className="h-12 w-12 mb-4 opacity-80" />
              <h3 className="font-manrope font-bold text-2xl mb-2">System Consultation</h3>
              <p className="text-white/80 mb-6 max-w-sm">Get expert guidance on pump selection, system design, borehole setups, and complete water solutions.</p>
              <span className="inline-flex items-center font-semibold text-sm">
                Request Consultation <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <h2 className="font-manrope font-bold text-2xl sm:text-3xl text-[hsl(222,47%,11%)] mb-4">Need Help Choosing?</h2>
          <p className="text-base text-[hsl(215,16%,47%)] mb-8 max-w-xl mx-auto">
            Send us your requirements — photos, distances, pipe sizes — and we'll recommend the best options with pricing.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact">
              <Button className="bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white h-12 px-8 rounded-sm" data-testid="cta-contact-btn">
                Get Expert Advice
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="outline" className="h-12 px-8 rounded-sm" data-testid="cta-quote-btn">
                Request a Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
