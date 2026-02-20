import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ZoomIn, ShoppingCart, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useCart } from '../contexts/CartContext';

export default function QuickViewModal({ product, open, onClose }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const hasDiscount = product.original_price && product.original_price > product.price;
  const formatPrice = (p) => `R${p.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const topSpecs = Object.entries(product.specs || {}).slice(0, 4);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden" data-testid="quick-view-modal">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square bg-[hsl(210,40%,96%)]">
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {hasDiscount && (
              <Badge className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold rounded-sm px-2">
                SALE
              </Badge>
            )}
            {product.in_stock ? (
              <Badge className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] rounded-sm">In Stock</Badge>
            ) : (
              <Badge className="absolute top-3 right-3 bg-gray-400 text-white text-[10px] rounded-sm">Out of Stock</Badge>
            )}
          </div>

          {/* Info */}
          <div className="p-6 flex flex-col">
            <DialogHeader className="text-left mb-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(215,16%,47%)]">{product.brand}</p>
              <DialogTitle className="font-manrope font-bold text-lg text-[hsl(222,47%,11%)] leading-snug mt-1">
                {product.name}
              </DialogTitle>
              <DialogDescription className="sr-only">Quick view of {product.name}</DialogDescription>
            </DialogHeader>

            <div className="flex items-baseline gap-2 mt-3">
              <span className="font-manrope font-bold text-2xl text-[hsl(222,47%,11%)]">{formatPrice(product.price)}</span>
              {hasDiscount && (
                <span className="text-sm text-[hsl(215,16%,47%)] line-through">{formatPrice(product.original_price)}</span>
              )}
            </div>
            <p className="text-[10px] text-[hsl(215,16%,47%)] mb-3">Incl. VAT</p>

            <p className="text-sm text-[hsl(215,16%,47%)] leading-relaxed line-clamp-3 mb-4">{product.short_description}</p>

            {/* Key specs */}
            {topSpecs.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {topSpecs.map(([key, val]) => (
                  <span key={key} className="inline-flex items-center px-2 py-0.5 bg-[hsl(210,40%,96%)] text-[10px] font-medium text-[hsl(222,47%,11%)] rounded-sm capitalize">
                    {key.replace(/_/g, ' ')}: {val}
                  </span>
                ))}
              </div>
            )}

            <Separator className="mb-4" />

            {/* Add to quote */}
            <div className="flex items-center gap-3 mt-auto">
              <div className="flex items-center border border-[hsl(214,32%,91%)] rounded-sm">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-2.5 py-1.5 text-sm hover:bg-[hsl(210,40%,96%)]" data-testid="qv-qty-decrease">-</button>
                <span className="px-3 text-sm font-medium" data-testid="qv-qty-value">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-2.5 py-1.5 text-sm hover:bg-[hsl(210,40%,96%)]" data-testid="qv-qty-increase">+</button>
              </div>
              <Button
                onClick={() => { addItem(product, qty); onClose(false); }}
                className="flex-1 bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white rounded-sm h-10 text-sm font-semibold"
                disabled={!product.in_stock}
                data-testid="qv-add-to-cart"
              >
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Quote
              </Button>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={() => onClose(false)}
              className="mt-3 text-center text-sm font-medium text-[hsl(214,100%,40%)] hover:underline inline-flex items-center justify-center gap-1"
              data-testid="qv-view-full"
            >
              View Full Details <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
