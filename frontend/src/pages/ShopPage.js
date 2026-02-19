import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CATEGORY_OPTIONS = [
  { label: 'All Categories', value: 'all' },
  { label: 'Booster Pumps', value: 'booster-pumps' },
  { label: 'Submersible Pumps', value: 'submersible-pumps' },
  { label: 'Borehole Pumps', value: 'borehole-pumps' },
  { label: 'Self-Priming Pumps', value: 'self-priming-pumps' },
  { label: 'Water Tanks', value: 'water-tanks' },
  { label: 'Accessories', value: 'accessories' },
];

const SORT_OPTIONS = [
  { label: 'Name (A-Z)', value: 'name_asc' },
  { label: 'Name (Z-A)', value: 'name_desc' },
  { label: 'Price (Low-High)', value: 'price_asc' },
  { label: 'Price (High-Low)', value: 'price_desc' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get('category') || 'all';
  const brand = searchParams.get('brand') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'name_asc';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.set('category', category);
      if (brand) params.set('brand', brand);
      if (search) params.set('search', search);
      params.set('sort', sort);
      params.set('limit', '50');

      const res = await axios.get(`${API}/products?${params.toString()}`);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products', err);
    }
    setLoading(false);
  }, [category, brand, search, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    axios.get(`${API}/brands`).then(res => setBrands(res.data)).catch(() => {});
  }, []);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const activeFilterCount = [category !== 'all' && category, brand, search].filter(Boolean).length;
  const catLabel = CATEGORY_OPTIONS.find(c => c.value === category)?.label || 'All Products';

  return (
    <div className="min-h-screen bg-[hsl(210,40%,98%)]" data-testid="shop-page">
      {/* Page header */}
      <div className="bg-white border-b border-[hsl(214,32%,91%)]">
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <h1 className="font-manrope font-bold text-2xl sm:text-3xl text-[hsl(222,47%,11%)]" data-testid="shop-title">
            {search ? `Results for "${search}"` : catLabel}
          </h1>
          <p className="text-sm text-[hsl(215,16%,47%)] mt-1">{products.length} products found</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-sm gap-2"
            data-testid="toggle-filters-btn"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="bg-[hsl(214,100%,40%)] text-white text-[10px] h-5 px-1.5">{activeFilterCount}</Badge>
            )}
          </Button>

          <Select value={sort} onValueChange={(v) => updateFilter('sort', v)}>
            <SelectTrigger className="w-44 h-9 text-sm rounded-sm" data-testid="sort-select">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-[hsl(215,16%,47%)]" data-testid="clear-filters-btn">
              <X className="h-3 w-3 mr-1" /> Clear all
            </Button>
          )}
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 shrink-0`} data-testid="filters-sidebar">
            <div className="bg-white border border-[hsl(214,32%,91%)] rounded-sm p-5 space-y-6 sticky top-28">
              {/* Search within */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[hsl(215,16%,47%)] mb-2 block">Search</label>
                <div className="flex border border-[hsl(214,32%,91%)] rounded-sm overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search products..."
                    defaultValue={search}
                    onKeyDown={(e) => { if (e.key === 'Enter') updateFilter('search', e.target.value); }}
                    className="flex-1 px-3 py-2 text-sm outline-none"
                    data-testid="filter-search-input"
                  />
                  <span className="px-2 flex items-center text-[hsl(215,16%,47%)]"><Search className="h-4 w-4" /></span>
                </div>
              </div>

              {/* Category filter */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[hsl(215,16%,47%)] mb-2 block">Category</label>
                <div className="space-y-1">
                  {CATEGORY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => updateFilter('category', opt.value)}
                      className={`block w-full text-left px-3 py-1.5 text-sm rounded-sm transition-colors ${
                        category === opt.value
                          ? 'bg-[hsl(214,100%,95%)] text-[hsl(214,100%,40%)] font-medium'
                          : 'hover:bg-[hsl(210,40%,96%)] text-[hsl(222,47%,11%)]'
                      }`}
                      data-testid={`filter-category-${opt.value}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand filter */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[hsl(215,16%,47%)] mb-2 block">Brand</label>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilter('brand', '')}
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded-sm transition-colors ${
                      !brand ? 'bg-[hsl(214,100%,95%)] text-[hsl(214,100%,40%)] font-medium' : 'hover:bg-[hsl(210,40%,96%)]'
                    }`}
                    data-testid="filter-brand-all"
                  >
                    All Brands
                  </button>
                  {brands.map(b => (
                    <button
                      key={b}
                      onClick={() => updateFilter('brand', b)}
                      className={`block w-full text-left px-3 py-1.5 text-sm rounded-sm transition-colors ${
                        brand === b ? 'bg-[hsl(214,100%,95%)] text-[hsl(214,100%,40%)] font-medium' : 'hover:bg-[hsl(210,40%,96%)]'
                      }`}
                      data-testid={`filter-brand-${b}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-white animate-pulse rounded-sm h-80 border border-[hsl(214,32%,91%)]" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20" data-testid="no-products">
                <p className="text-lg text-[hsl(215,16%,47%)] mb-4">No products found</p>
                <Button onClick={clearFilters} variant="outline" className="rounded-sm">Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="product-grid">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
