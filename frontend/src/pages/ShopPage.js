import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, Search, ChevronDown, ChevronUp, LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import CategoryHeader, { BuyingGuidePanel } from '../components/CategoryHeader';
import { TrustElements, CategoryFAQ } from '../components/TrustElements';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Slider } from '../components/ui/slider';
import { Separator } from '../components/ui/separator';

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

// Parse numeric value from spec string like "0.8 kW" or "80 L/min"
function parseSpecNum(val) {
  if (!val) return null;
  const match = String(val).match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

// Collapsible filter section component
function FilterSection({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-[hsl(215,16%,47%)] mb-2 hover:text-[hsl(222,47%,11%)] transition-colors"
        data-testid={`filter-section-${title.toLowerCase().replace(/\s/g, '-')}`}
      >
        {title}
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>
      {open && <div className="animate-in slide-in-from-top-1 duration-200">{children}</div>}
    </div>
  );
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [maxPrice, setMaxPrice] = useState(100000);

  // Client-side spec filters
  const [filterPower, setFilterPower] = useState('');
  const [filterFlow, setFilterFlow] = useState('');

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

      // Calculate max price from data
      if (res.data.length > 0) {
        const mp = Math.max(...res.data.map(p => p.price));
        setMaxPrice(Math.ceil(mp / 1000) * 1000);
        setPriceRange([0, Math.ceil(mp / 1000) * 1000]);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    }
    setLoading(false);
  }, [category, brand, search, sort]);

  useEffect(() => {
    fetchProducts();
    setFilterPower('');
    setFilterFlow('');
  }, [fetchProducts]);

  useEffect(() => {
    axios.get(`${API}/brands`).then(res => setBrands(res.data)).catch(() => {});
  }, []);

  // Client-side filtering for price range and spec filters
  const filteredProducts = useMemo(() => {
    let result = products;

    // Price range filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Power filter
    if (filterPower) {
      const [min, max] = filterPower.split('-').map(Number);
      result = result.filter(p => {
        const pw = parseSpecNum(p.specs?.power || p.specs?.pump_power);
        if (pw === null) return false;
        return pw >= min && pw <= max;
      });
    }

    // Flow rate filter
    if (filterFlow) {
      const [min, max] = filterFlow.split('-').map(Number);
      result = result.filter(p => {
        const fl = parseSpecNum(p.specs?.max_flow);
        if (fl === null) return false;
        return fl >= min && fl <= max;
      });
    }

    return result;
  }, [products, priceRange, filterPower, filterFlow]);

  // Extract available filter options from current products
  const availablePowers = useMemo(() => {
    const powers = products.map(p => parseSpecNum(p.specs?.power || p.specs?.pump_power)).filter(Boolean);
    if (powers.length === 0) return [];
    return [
      { label: 'All Power', value: '' },
      { label: '0 – 0.5 kW', value: '0-0.5' },
      { label: '0.5 – 1.0 kW', value: '0.5-1' },
      { label: '1.0 – 1.5 kW', value: '1-1.5' },
      { label: '1.5+ kW', value: '1.5-100' },
    ];
  }, [products]);

  const availableFlows = useMemo(() => {
    const flows = products.map(p => parseSpecNum(p.specs?.max_flow)).filter(Boolean);
    if (flows.length === 0) return [];
    return [
      { label: 'All Flow Rates', value: '' },
      { label: '0 – 50 L/min', value: '0-50' },
      { label: '50 – 100 L/min', value: '50-100' },
      { label: '100+ L/min', value: '100-9999' },
    ];
  }, [products]);

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
    setFilterPower('');
    setFilterFlow('');
    setPriceRange([0, maxPrice]);
  };

  const toggleCompare = (id) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const activeFilterCount = [
    category !== 'all' && category,
    brand,
    search,
    filterPower,
    filterFlow,
    priceRange[0] > 0 || priceRange[1] < maxPrice,
  ].filter(Boolean).length;

  const formatPrice = (p) => `R${p.toLocaleString('en-ZA')}`;

  return (
    <div className="min-h-screen bg-[hsl(210,40%,98%)]" data-testid="shop-page">
      {/* SEO Category Header */}
      <CategoryHeader categorySlug={category} productCount={filteredProducts.length} />

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Sticky mobile filter trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-sm gap-2 lg:hidden"
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
                <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-[hsl(215,16%,47%)]" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-[hsl(215,16%,47%)] hover:text-red-500" data-testid="clear-filters-btn">
                <X className="h-3 w-3 mr-1" /> Clear all filters
              </Button>
            )}
          </div>

          <p className="text-sm text-[hsl(215,16%,47%)]">
            Showing <span className="font-semibold text-[hsl(222,47%,11%)]">{filteredProducts.length}</span> of {products.length} products
          </p>
        </div>

        <div className="flex gap-8">
          {/* Advanced Sidebar Filters */}
          <aside className={`${showFilters ? 'fixed inset-0 z-40 bg-black/50 lg:static lg:bg-transparent' : 'hidden'} lg:block w-full lg:w-72 shrink-0`} data-testid="filters-sidebar">
            <div className={`${showFilters ? 'absolute right-0 top-0 h-full w-80 overflow-y-auto' : ''} bg-white border border-[hsl(214,32%,91%)] rounded-sm p-5 space-y-5 lg:sticky lg:top-28`}>
              {/* Mobile close */}
              {showFilters && (
                <div className="flex items-center justify-between lg:hidden mb-2">
                  <span className="font-manrope font-bold text-lg">Filters</span>
                  <button onClick={() => setShowFilters(false)} className="p-1" data-testid="close-filters-mobile">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* Search within */}
              <FilterSection title="Search">
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
              </FilterSection>

              <Separator />

              {/* Category filter */}
              <FilterSection title="Category">
                <div className="space-y-0.5 max-h-52 overflow-y-auto">
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
              </FilterSection>

              <Separator />

              {/* Brand filter */}
              <FilterSection title="Brand">
                <div className="space-y-0.5 max-h-44 overflow-y-auto">
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
              </FilterSection>

              <Separator />

              {/* Price Range */}
              <FilterSection title="Price Range">
                <div className="px-1">
                  <Slider
                    value={priceRange}
                    min={0}
                    max={maxPrice}
                    step={500}
                    onValueChange={setPriceRange}
                    className="mb-3"
                    data-testid="price-range-slider"
                  />
                  <div className="flex items-center justify-between text-xs text-[hsl(215,16%,47%)]">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </FilterSection>

              {/* Power filter (only show if products have power specs) */}
              {availablePowers.length > 0 && (
                <>
                  <Separator />
                  <FilterSection title="Power (kW)" defaultOpen={false}>
                    <div className="space-y-0.5">
                      {availablePowers.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setFilterPower(opt.value)}
                          className={`block w-full text-left px-3 py-1.5 text-sm rounded-sm transition-colors ${
                            filterPower === opt.value
                              ? 'bg-[hsl(214,100%,95%)] text-[hsl(214,100%,40%)] font-medium'
                              : 'hover:bg-[hsl(210,40%,96%)] text-[hsl(222,47%,11%)]'
                          }`}
                          data-testid={`filter-power-${opt.value || 'all'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </FilterSection>
                </>
              )}

              {/* Flow Rate filter */}
              {availableFlows.length > 0 && (
                <>
                  <Separator />
                  <FilterSection title="Flow Rate" defaultOpen={false}>
                    <div className="space-y-0.5">
                      {availableFlows.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setFilterFlow(opt.value)}
                          className={`block w-full text-left px-3 py-1.5 text-sm rounded-sm transition-colors ${
                            filterFlow === opt.value
                              ? 'bg-[hsl(214,100%,95%)] text-[hsl(214,100%,40%)] font-medium'
                              : 'hover:bg-[hsl(210,40%,96%)] text-[hsl(222,47%,11%)]'
                          }`}
                          data-testid={`filter-flow-${opt.value || 'all'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </FilterSection>
                </>
              )}

              {/* Buying guide panel (in sidebar) */}
              {category !== 'all' && (
                <>
                  <Separator />
                  <BuyingGuidePanel categorySlug={category} />
                </>
              )}
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-white animate-pulse rounded-sm h-96 border border-[hsl(214,32%,91%)]" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[hsl(214,32%,91%)] rounded-sm" data-testid="no-products">
                <Search className="h-12 w-12 text-[hsl(214,32%,91%)] mx-auto mb-4" />
                <p className="text-lg font-manrope font-semibold text-[hsl(222,47%,11%)] mb-2">No products found</p>
                <p className="text-sm text-[hsl(215,16%,47%)] mb-6">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters} variant="outline" className="rounded-sm">Clear All Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="product-grid">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                    compareIds={compareIds}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compare Bar (sticky bottom) */}
        {compareIds.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-[hsl(214,100%,40%)] shadow-lg" data-testid="compare-bar">
            <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className="bg-[hsl(214,100%,40%)] text-white">{compareIds.length}</Badge>
                <span className="text-sm font-medium text-[hsl(222,47%,11%)]">product{compareIds.length > 1 ? 's' : ''} selected for comparison</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setCompareIds([])} className="text-xs" data-testid="clear-compare">
                  Clear
                </Button>
                <Button
                  size="sm"
                  className="bg-[hsl(214,100%,40%)] text-white rounded-sm"
                  onClick={() => {
                    // Scroll to compare section or open modal
                    const compareProducts = products.filter(p => compareIds.includes(p.id));
                    setQuickViewProduct(compareProducts[0]);
                  }}
                  data-testid="compare-btn"
                >
                  Compare ({compareIds.length})
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Trust Elements */}
        <div className="mt-12">
          <TrustElements />
        </div>

        {/* Category FAQ */}
        {category !== 'all' && (
          <div className="mt-12 mb-4">
            <CategoryFAQ categorySlug={category} />
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Mobile sticky filter button */}
      <div className="fixed bottom-4 left-4 right-4 z-30 lg:hidden pointer-events-none">
        <Button
          onClick={() => setShowFilters(true)}
          className="pointer-events-auto w-full bg-[hsl(222,47%,11%)] hover:bg-[hsl(222,47%,15%)] text-white rounded-sm h-12 shadow-lg font-semibold gap-2"
          data-testid="sticky-filter-btn"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter & Sort
          {activeFilterCount > 0 && (
            <Badge className="bg-[hsl(214,100%,40%)] text-white text-[10px] h-5 px-1.5 ml-1">{activeFilterCount}</Badge>
          )}
        </Button>
      </div>
    </div>
  );
}
