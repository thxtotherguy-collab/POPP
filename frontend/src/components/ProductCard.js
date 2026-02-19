import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.original_price) * 100) : 0;

  const formatPrice = (p) => `R${p.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="group relative flex flex-col bg-white border border-[hsl(214,32%,91%)] hover:border-[hsl(214,100%,40%)/0.5] transition-all duration-300 rounded-sm overflow-hidden" data-testid={`product-card-${product.id}`}>
      {hasDiscount && (
        <Badge className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold rounded-sm">
          -{discountPct}%
        </Badge>
      )}

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
        <Link to={`/product/${product.id}`} className="font-manrope font-semibold text-sm text-[hsl(222,47%,11%)] hover:text-[hsl(214,100%,40%)] transition-colors line-clamp-2 mb-2" data-testid={`product-link-${product.id}`}>
          {product.name}
        </Link>
        <p className="text-xs text-[hsl(215,16%,47%)] line-clamp-2 mb-3 flex-1">{product.short_description}</p>

        <div className="flex items-end justify-between gap-2 mt-auto">
          <div>
            <span className="font-manrope font-bold text-lg text-[hsl(222,47%,11%)]">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="block text-xs text-[hsl(215,16%,47%)] line-through">{formatPrice(product.original_price)}</span>
            )}
          </div>
          <Button
            size="sm"
            onClick={(e) => { e.preventDefault(); addItem(product); }}
            className="bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white text-xs rounded-sm h-8 px-3"
            data-testid={`add-to-cart-${product.id}`}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}
