import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function ProductCard({ product, onQuickView, compareIds, onToggleCompare }) {
  const { addItem } = useCart();

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.original_price) * 100) : 0;
  const isCompared = compareIds?.includes(product.id);

  const formatPrice = (p) => `R${p.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Extract key specs for pills
  const specPills = [];
  const s = product.specs || {};
  if (s.power) specPills.push(s.power);
  if (s.max_flow) specPills.push(s.max_flow);
  if (s.max_head) specPills.push(s.max_head);
  if (s.capacity) specPills.push(s.capacity);

  return (
    <div className="group relative flex flex-col bg-white border border-[hsl(214,32%,91%)] hover:border-[hsl(214,100%,40%)/0.4] hover:shadow-md transition-all duration-300 rounded-sm overflow-hidden" data-testid={`product-card-${product.id}`}>
      {/* Badges row */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {hasDiscount && (
          <Badge className="bg-red-500 text-white text-[10px] font-bold rounded-sm w-fit">
            -{discountPct}%
          </Badge>
        )}
        {product.in_stock ? (
          <Badge className="bg-emerald-500/90 text-white text-[9px] font-semibold rounded-sm w-fit" data-testid={`stock-${product.id}`}>
            In Stock
          </Badge>
        ) : (
          <Badge className="bg-gray-400 text-white text-[9px] font-semibold rounded-sm w-fit" data-testid={`stock-${product.id}`}>
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Quick actions overlay */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {onQuickView && (
          <button
            onClick={(e) => { e.preventDefault(); onQuickView(product); }}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm border border-[hsl(214,32%,91%)] rounded-sm flex items-center justify-center hover:bg-[hsl(214,100%,40%)] hover:text-white hover:border-[hsl(214,100%,40%)] transition-colors"
            title="Quick View"
            data-testid={`quick-view-${product.id}`}
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        )}
        {onToggleCompare && (
          <button
            onClick={(e) => { e.preventDefault(); onToggleCompare(product.id); }}
            className={`w-8 h-8 border rounded-sm flex items-center justify-center transition-colors ${
              isCompared
                ? 'bg-[hsl(214,100%,40%)] text-white border-[hsl(214,100%,40%)]'
                : 'bg-white/90 backdrop-blur-sm border-[hsl(214,32%,91%)] hover:bg-[hsl(214,100%,95%)] hover:border-[hsl(214,100%,40%)]'
            }`}
            title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
            data-testid={`compare-${product.id}`}
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="relative aspect-square bg-[hsl(210,40%,96%)] overflow-hidden">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      <div className="flex flex-col flex-1 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(215,16%,47%)] mb-1">{product.brand}</p>
        <Link to={`/product/${product.id}`} className="font-manrope font-semibold text-sm text-[hsl(222,47%,11%)] hover:text-[hsl(214,100%,40%)] transition-colors line-clamp-2 mb-1.5" data-testid={`product-link-${product.id}`}>
          {product.name}
        </Link>
        <p className="text-xs text-[hsl(215,16%,47%)] line-clamp-2 mb-2 flex-1">{product.short_description}</p>

        {/* Key spec pills */}
        {specPills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {specPills.slice(0, 3).map((spec, i) => (
              <span key={i} className="inline-flex px-1.5 py-0.5 bg-[hsl(210,40%,96%)] text-[9px] font-medium text-[hsl(222,47%,11%)] rounded-sm">
                {spec}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-2 mt-auto pt-2 border-t border-[hsl(214,32%,91%)]">
          <div>
            <span className="font-manrope font-bold text-lg text-[hsl(222,47%,11%)]">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="block text-xs text-[hsl(215,16%,47%)] line-through">{formatPrice(product.original_price)}</span>
            )}
            <span className="block text-[9px] text-[hsl(215,16%,47%)]">Incl. VAT</span>
          </div>
          <Button
            size="sm"
            onClick={(e) => { e.preventDefault(); addItem(product); }}
            className="bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white text-xs rounded-sm h-8 px-3"
            disabled={!product.in_stock}
            data-testid={`add-to-cart-${product.id}`}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}
