import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, RotateCcw, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import CATEGORY_SEO from '../data/CategorySEOData';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export function TrustElements() {
  return (
    <div className="bg-white border border-[hsl(214,32%,91%)] rounded-sm" data-testid="trust-elements">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[hsl(214,32%,91%)]">
        {[
          { icon: Truck, title: 'SA Wide Delivery', desc: 'Reliable shipping to all major centres and rural areas across South Africa' },
          { icon: ShieldCheck, title: 'Warranty Included', desc: 'All products carry full manufacturer warranty — 2 to 8 years depending on brand' },
          { icon: RotateCcw, title: 'Easy Returns', desc: 'Hassle-free returns within 14 days on unused, undamaged products' },
          { icon: MessageCircle, title: 'Need Help Choosing?', desc: 'Our team provides free sizing advice — send your requirements via email or WhatsApp', isAction: true },
        ].map((item, i) => (
          <div key={i} className="p-5 flex gap-3.5">
            <div className="w-9 h-9 bg-[hsl(214,100%,96%)] rounded-sm flex items-center justify-center shrink-0">
              <item.icon className="h-4.5 w-4.5 text-[hsl(214,100%,40%)]" />
            </div>
            <div>
              <p className="font-manrope font-semibold text-sm text-[hsl(222,47%,11%)]">{item.title}</p>
              <p className="text-xs text-[hsl(215,16%,47%)] leading-relaxed mt-0.5">{item.desc}</p>
              {item.isAction && (
                <Link to="/contact" className="inline-block mt-2">
                  <Button size="sm" variant="outline" className="text-xs h-7 rounded-sm" data-testid="trust-contact-btn">
                    Contact Us
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryFAQ({ categorySlug }) {
  const seo = CATEGORY_SEO[categorySlug];
  if (!seo?.faq?.length) return null;

  return (
    <div data-testid="category-faq">
      <h2 className="font-manrope font-bold text-xl text-[hsl(222,47%,11%)] mb-6">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {seo.faq.map((item, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="bg-white border border-[hsl(214,32%,91%)] rounded-sm px-5 data-[state=open]:border-[hsl(214,100%,40%)/0.3]"
          >
            <AccordionTrigger className="text-sm font-semibold text-[hsl(222,47%,11%)] text-left py-4 hover:no-underline" data-testid={`faq-trigger-${i}`}>
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-[hsl(215,16%,47%)] leading-relaxed pb-4" data-testid={`faq-content-${i}`}>
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
