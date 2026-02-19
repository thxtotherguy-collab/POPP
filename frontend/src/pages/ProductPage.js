import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ChevronRight, ZoomIn, X } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import ProductCard from '../components/ProductCard';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [prodRes, relRes] = await Promise.all([
          axios.get(`${API}/products/${id}`),
          axios.get(`${API}/products/${id}/related`)
        ]);
        setProduct(prodRes.data);
        setRelated(relRes.data);
      } catch (err) {
        console.error('Failed to load product', err);
      }
      setLoading(false);
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1400px] mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-[hsl(210,40%,96%)] animate-pulse rounded-sm" />
            <div className="space-y-4">
              <div className="h-6 bg-[hsl(210,40%,96%)] animate-pulse rounded w-1/3" />
              <div className="h-10 bg-[hsl(210,40%,96%)] animate-pulse rounded w-2/3" />
              <div className="h-4 bg-[hsl(210,40%,96%)] animate-pulse rounded w-full" />
              <div className="h-4 bg-[hsl(210,40%,96%)] animate-pulse rounded w-4/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[hsl(215,16%,47%)]">Product not found</p>
      </div>
    );
  }

  const hasDiscount = product.original_price && product.original_price > product.price;
  const formatPrice = (p) => `R${p.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen bg-white" data-testid="product-page">
      {/* Breadcrumb */}
      <div className="bg-[hsl(210,40%,98%)] border-b border-[hsl(214,32%,91%)]">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-2 text-sm text-[hsl(215,16%,47%)]">
          <Link to="/" className="hover:text-[hsl(214,100%,40%)]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-[hsl(214,100%,40%)]">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/shop?category=${product.category_slug}`} className="hover:text-[hsl(214,100%,40%)]">{product.category}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[hsl(222,47%,11%)] font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div
              className="aspect-square bg-[hsl(210,40%,96%)] rounded-sm overflow-hidden cursor-zoom-in group"
              onClick={() => setLightbox(true)}
              data-testid="product-image"
            >
              <img
                src={product.images?.[0] || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                <ZoomIn className="h-8 w-8 text-white" />
              </div>
            </div>
            {hasDiscount && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold rounded-sm px-3 py-1">
                SALE
              </Badge>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(215,16%,47%)] mb-2">{product.brand}</p>
            <h1 className="font-manrope font-bold text-2xl sm:text-3xl text-[hsl(222,47%,11%)] mb-4" data-testid="product-name">{product.name}</h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-manrope font-bold text-3xl text-[hsl(222,47%,11%)]" data-testid="product-price">{formatPrice(product.price)}</span>
              {hasDiscount && (
                <span className="text-lg text-[hsl(215,16%,47%)] line-through">{formatPrice(product.original_price)}</span>
              )}
              <span className="text-xs text-[hsl(215,16%,47%)]">Incl. VAT</span>
            </div>

            <p className="text-[hsl(215,16%,47%)] leading-relaxed mb-8" data-testid="product-description">{product.description}</p>

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-[hsl(214,32%,91%)] rounded-sm">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 text-[hsl(222,47%,11%)] hover:bg-[hsl(210,40%,96%)]"
                  data-testid="qty-decrease"
                >-</button>
                <span className="px-4 py-2 text-sm font-medium min-w-[40px] text-center" data-testid="qty-value">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-2 text-[hsl(222,47%,11%)] hover:bg-[hsl(210,40%,96%)]"
                  data-testid="qty-increase"
                >+</button>
              </div>
              <Button
                onClick={() => addItem(product, qty)}
                className="bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white h-11 px-8 rounded-sm font-semibold"
                data-testid="add-to-cart-btn"
              >
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Quote
              </Button>
            </div>

            <Separator className="mb-6" />

            {/* Specs */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div data-testid="product-specs">
                <h3 className="font-manrope font-semibold text-lg text-[hsl(222,47%,11%)] mb-4">Technical Specifications</h3>
                <div className="border border-[hsl(214,32%,91%)] rounded-sm overflow-hidden">
                  {Object.entries(product.specs).map(([key, val], i) => (
                    <div key={key} className={`flex ${i % 2 === 0 ? 'bg-[hsl(210,40%,98%)]' : 'bg-white'}`}>
                      <span className="w-40 px-4 py-2.5 text-sm font-medium text-[hsl(215,16%,47%)] capitalize border-r border-[hsl(214,32%,91%)]">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="flex-1 px-4 py-2.5 text-sm text-[hsl(222,47%,11%)]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs capitalize rounded-sm">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20" data-testid="related-products">
            <h2 className="font-manrope font-bold text-2xl text-[hsl(222,47%,11%)] mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(false)} data-testid="lightbox">
          <button className="absolute top-4 right-4 text-white" onClick={() => setLightbox(false)} data-testid="lightbox-close">
            <X className="h-8 w-8" />
          </button>
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200'}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  );
}
