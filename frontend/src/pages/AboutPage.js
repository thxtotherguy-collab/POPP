import { Link } from 'react-router-dom';
import { ChevronRight, Droplets, ShieldCheck, Users, Truck, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white" data-testid="about-page">
      <div className="bg-white border-b border-[hsl(214,32%,91%)]">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-2 text-sm text-[hsl(215,16%,47%)]">
          <Link to="/" className="hover:text-[hsl(214,100%,40%)]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[hsl(222,47%,11%)] font-medium">About</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-[hsl(210,40%,98%)] py-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Droplets className="h-10 w-10 text-[hsl(214,100%,40%)]" />
              <span className="font-manrope font-bold text-3xl text-[hsl(222,47%,11%)]">POPP</span>
            </div>
            <h1 className="font-manrope font-bold text-3xl sm:text-4xl text-[hsl(222,47%,11%)] mb-6">
              Pump & Tank Co
            </h1>
            <p className="text-lg text-[hsl(215,16%,47%)] leading-relaxed mb-4">
              Supply &bull; Advice &bull; Quotes
            </p>
            <p className="text-base text-[hsl(215,16%,47%)] leading-relaxed">
              POPP is a South African water solutions company specialising in pumps, water storage tanks, and accessories. We help homeowners, farmers, and businesses find the right equipment for their water needs — from simple pressure boosting to complete borehole and backup water systems.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="font-manrope font-bold text-2xl sm:text-3xl text-[hsl(222,47%,11%)] mb-12 text-center">Why Choose POPP?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: ShieldCheck, title: 'Trusted Brands', desc: 'We stock only reputable brands like DAB, Grundfos, Zilmet, JoJo, and Pascali. Every product is backed by manufacturer warranties and our own quality guarantee.' },
              { icon: Users, title: 'Expert Advice', desc: 'Not sure what you need? Our team provides free sizing and selection advice. Use our Pump Finder tool or request a system consultation for personalised recommendations.' },
              { icon: Truck, title: 'International Delivery', desc: 'We deliver across South Africa and internationally. Whether you are in Johannesburg, Cape Town, Durban, or overseas — we will get your equipment to you quickly and safely.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-[hsl(214,100%,95%)] rounded-sm flex items-center justify-center mx-auto mb-5">
                  <item.icon className="h-8 w-8 text-[hsl(214,100%,40%)]" />
                </div>
                <h3 className="font-manrope font-bold text-lg text-[hsl(222,47%,11%)] mb-3">{item.title}</h3>
                <p className="text-sm text-[hsl(215,16%,47%)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[hsl(214,100%,40%)]">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <h2 className="font-manrope font-bold text-2xl sm:text-3xl text-white mb-4">Ready to Find Your Solution?</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">Browse our catalogue or use our interactive tools to find exactly what you need.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/shop">
              <Button className="bg-white text-[hsl(214,100%,40%)] hover:bg-gray-100 h-12 px-8 rounded-sm font-semibold" data-testid="about-shop-btn">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-8 rounded-sm font-semibold" data-testid="about-contact-btn">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
