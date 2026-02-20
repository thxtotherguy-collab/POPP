import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import CATEGORY_SEO from '../data/CategorySEOData';

const CATEGORY_NAMES = {
  'booster-pumps': 'Booster Pumps',
  'submersible-pumps': 'Submersible Pumps',
  'borehole-pumps': 'Borehole Pumps',
  'self-priming-pumps': 'Self-Priming Pumps',
  'water-tanks': 'Water Tanks',
  'accessories': 'Accessories',
};

export default function CategoryHeader({ categorySlug, productCount }) {
  const seo = CATEGORY_SEO[categorySlug] || CATEGORY_SEO['all'];
  const isAll = categorySlug === 'all';

  return (
    <div data-testid="category-header">
      {/* Breadcrumb */}
      <div className="bg-[hsl(210,40%,98%)] border-b border-[hsl(214,32%,91%)]">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-2 text-sm text-[hsl(215,16%,47%)]">
          <Link to="/" className="hover:text-[hsl(214,100%,40%)] transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-[hsl(214,100%,40%)] transition-colors">Shop</Link>
          {!isAll && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[hsl(222,47%,11%)] font-medium">{seo.h1}</span>
            </>
          )}
        </div>
      </div>

      {/* SEO Header */}
      <div className="bg-white border-b border-[hsl(214,32%,91%)]">
        <div className="max-w-[1400px] mx-auto px-4 py-10">
          <div className="max-w-3xl">
            <h1 className="font-manrope font-bold text-3xl sm:text-4xl text-[hsl(222,47%,11%)] mb-2" data-testid="category-h1">
              {seo.h1}
            </h1>
            <h2 className="text-base md:text-lg text-[hsl(215,16%,47%)] font-medium mb-1" data-testid="category-h2">
              {seo.h2}
            </h2>
            <p className="text-sm text-[hsl(215,16%,47%)] mb-6">{productCount} product{productCount !== 1 ? 's' : ''} available</p>

            {/* SEO intro paragraph */}
            <p className="text-sm text-[hsl(222,47%,11%)]/80 leading-relaxed mb-6" data-testid="category-intro">
              {seo.intro}
            </p>

            {/* Application tags */}
            {seo.applications?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {seo.applications.map((app, i) => (
                  <span key={i} className="inline-flex items-center px-3 py-1 bg-[hsl(214,100%,96%)] text-[hsl(214,100%,35%)] text-xs font-medium rounded-sm">
                    {app}
                  </span>
                ))}
              </div>
            )}

            {/* Related categories */}
            {seo.relatedCategories?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-[hsl(215,16%,47%)] font-medium">Related:</span>
                {seo.relatedCategories.map(slug => (
                  <Link
                    key={slug}
                    to={`/shop?category=${slug}`}
                    className="text-[hsl(214,100%,40%)] hover:underline font-medium"
                  >
                    {CATEGORY_NAMES[slug] || slug}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BuyingGuidePanel({ categorySlug }) {
  const seo = CATEGORY_SEO[categorySlug];
  if (!seo?.buyingGuide) return null;

  const guide = seo.buyingGuide;

  return (
    <div className="bg-white border border-[hsl(214,32%,91%)] rounded-sm p-6" data-testid="buying-guide-panel">
      <h3 className="font-manrope font-bold text-lg text-[hsl(222,47%,11%)] mb-4">{guide.title}</h3>
      <ul className="space-y-2.5 mb-5">
        {guide.points.map((point, i) => (
          <li key={i} className="flex gap-3 text-sm text-[hsl(222,47%,11%)]/80 leading-relaxed">
            <span className="shrink-0 w-5 h-5 bg-[hsl(214,100%,95%)] text-[hsl(214,100%,40%)] rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">
              {i + 1}
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <Link to={guide.link}>
        <Button variant="outline" size="sm" className="rounded-sm text-sm gap-2" data-testid="buying-guide-cta">
          {guide.linkText} <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </Link>
    </div>
  );
}
