import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Search, ChevronDown, ChevronUp, ArrowUpDown, Package, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Slider } from '../components/ui/slider';
import { Separator } from '../components/ui/separator';
import { Input } from '../components/ui/input';
import { useCart } from '../contexts/CartContext';

// Import the EBARA catalog data
import catalogData from '../data/ebaraCatalog.json';

const PLACEHOLDER_IMAGE = '/images/pumps/placeholder.svg';

// Sort options
const SORT_OPTIONS = [
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Power: Low to High', value: 'power_asc' },
  { label: 'Power: High to Low', value: 'power_desc' },
  { label: 'Series: A-Z', value: 'series_asc' },
  { label: 'Series: Z-A', value: 'series_desc' },
  { label: 'Name: A-Z', value: 'name_asc' },
];

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

// Voltage Toggle Component
function VoltageToggle({ selected, onChange }) {
  return (
    <div className="inline-flex items-center bg-[hsl(210,40%,96%)] rounded-sm p-0.5">
      <button
        onClick={() => onChange('220V')}
        className={`px-2 py-1 text-[10px] font-semibold rounded-sm transition-all ${
          selected === '220V'
            ? 'bg-[hsl(45,93%,47%)] text-[hsl(222,47%,11%)] shadow-sm'
            : 'text-[hsl(215,16%,47%)] hover:text-[hsl(222,47%,11%)]'
        }`}
        data-testid="voltage-toggle-220v"
      >
        220V
      </button>
      <button
        onClick={() => onChange('380V')}
        className={`px-2 py-1 text-[10px] font-semibold rounded-sm transition-all ${
          selected === '380V'
            ? 'bg-[hsl(214,100%,40%)] text-white shadow-sm'
            : 'text-[hsl(215,16%,47%)] hover:text-[hsl(222,47%,11%)]'
        }`}
        data-testid="voltage-toggle-380v"
      >
        380V
      </button>
    </div>
  );
}

// Product Card Component
function CatalogProductCard({ product }) {
  const { addItem } = useCart();
  const [selectedVoltage, setSelectedVoltage] = useState('220V');
  
  // Determine which price to show
  const displayPrice = useMemo(() => {
    if (product.has_dual_voltage) {
      return selectedVoltage === '220V' ? product.price_220v : product.price_380v;
    }
    return product.price;
  }, [product, selectedVoltage]);
  
  const formatPrice = (p) => `R${p.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  
  // Handle image loading with fallback
  const [imgSrc, setImgSrc] = useState(`/images/pumps/${product.image}`);
  const handleImageError = () => setImgSrc(PLACEHOLDER_IMAGE);

  // Convert catalog product to cart format
  const handleAddToCart = () => {
    const cartProduct = {
      id: product.has_dual_voltage ? `${product.id}-${selectedVoltage}` : product.id,
      name: product.has_dual_voltage ? `${product.name} (${selectedVoltage})` : product.name,
      brand: product.brand,
      price: displayPrice,
      category: product.category,
      category_slug: product.category.toLowerCase().replace(/\s+/g, '-'),
      short_description: product.description,
      images: [imgSrc],
      in_stock: true,
      specs: {
        power: `${product.power_kw} kW`,
        series: product.series,
        ...(product.has_dual_voltage && { voltage: selectedVoltage })
      }
    };
    addItem(cartProduct);
  };

  return (
    <div className="group relative flex flex-col bg-white border border-[hsl(214,32%,91%)] hover:border-[hsl(214,100%,40%)/0.4] hover:shadow-md transition-all duration-300 rounded-sm overflow-hidden" data-testid={`product-card-${product.id}`}>
      {/* Stock Badge */}
      <div className="absolute top-3 left-3 z-10">
        <Badge className="bg-emerald-500/90 text-white text-[9px] font-semibold rounded-sm">
          In Stock
        </Badge>
      </div>

      {/* Dual Voltage Badge */}
      {product.has_dual_voltage && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-[hsl(214,100%,40%)] text-white text-[9px] font-semibold rounded-sm flex items-center gap-1">
            <Zap className="h-2.5 w-2.5" /> Dual Voltage
          </Badge>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square bg-[hsl(210,40%,96%)] overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={handleImageError}
        />
      </div>

      <div className="flex flex-col flex-1 p-4">
        {/* Brand & SKU */}
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(215,16%,47%)]">{product.brand}</p>
          <p className="text-[9px] text-[hsl(215,16%,47%)]">{product.sku}</p>
        </div>
        
        {/* Product Name */}
        <h3 className="font-manrope font-semibold text-sm text-[hsl(222,47%,11%)] line-clamp-2 mb-1.5">
          {product.name}
        </h3>
        
        {/* Description */}
        <p className="text-xs text-[hsl(215,16%,47%)] line-clamp-2 mb-2 flex-1">{product.description}</p>

        {/* Spec Pills */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.power_kw > 0 && (
            <span className="inline-flex px-1.5 py-0.5 bg-[hsl(210,40%,96%)] text-[9px] font-medium text-[hsl(222,47%,11%)] rounded-sm">
              {product.power_kw} kW
            </span>
          )}
          <span className="inline-flex px-1.5 py-0.5 bg-[hsl(210,40%,96%)] text-[9px] font-medium text-[hsl(222,47%,11%)] rounded-sm">
            {product.series}
          </span>
          <span className="inline-flex px-1.5 py-0.5 bg-[hsl(214,100%,95%)] text-[9px] font-medium text-[hsl(214,100%,40%)] rounded-sm">
            {product.category}
          </span>
        </div>

        {/* Voltage Toggle (if dual voltage) */}
        {product.has_dual_voltage && (
          <div className="mb-3">
            <VoltageToggle selected={selectedVoltage} onChange={setSelectedVoltage} />
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-2 mt-auto pt-2 border-t border-[hsl(214,32%,91%)]">
          <div>
            <span className="font-manrope font-bold text-lg text-[hsl(222,47%,11%)]">{formatPrice(displayPrice)}</span>
            <span className="block text-[9px] text-[hsl(215,16%,47%)]">
              {product.has_dual_voltage ? `${selectedVoltage} • Incl. VAT` : 'Incl. VAT'}
            </span>
          </div>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white text-xs rounded-sm h-8 px-3"
            data-testid={`add-to-cart-${product.id}`}
          >
            <Package className="h-3.5 w-3.5 mr-1" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  
  // Get filter values from URL
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedSeries = searchParams.get('series') || 'all';
  const sort = searchParams.get('sort') || 'price_asc';
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const minPowerParam = searchParams.get('minPower');
  const maxPowerParam = searchParams.get('maxPower');

  // Extract unique categories and series from data
  const categories = useMemo(() => {
    const cats = [...new Set(catalogData.map(p => p.category))].sort();
    return ['all', ...cats];
  }, []);

  const series = useMemo(() => {
    const seriesList = [...new Set(catalogData.map(p => p.series))].sort();
    return ['all', ...seriesList];
  }, []);

  // Calculate price and power ranges from data
  const priceRange = useMemo(() => {
    const prices = catalogData.map(p => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, []);

  const powerRange = useMemo(() => {
    const powers = catalogData.filter(p => p.power_kw > 0).map(p => p.power_kw);
    return { min: Math.min(...powers), max: Math.max(...powers) };
  }, []);

  // State for sliders
  const [priceFilter, setPriceFilter] = useState([
    minPriceParam ? parseInt(minPriceParam) : priceRange.min,
    maxPriceParam ? parseInt(maxPriceParam) : priceRange.max
  ]);

  const [powerFilter, setPowerFilter] = useState([
    minPowerParam ? parseFloat(minPowerParam) : powerRange.min,
    maxPowerParam ? parseFloat(maxPowerParam) : powerRange.max
  ]);

  // Update URL when filters change
  const updateFilter = useCallback((key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  // Handle search
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  // Handle price range change
  const handlePriceChange = useCallback((value) => {
    setPriceFilter(value);
    const params = new URLSearchParams(searchParams);
    if (value[0] > priceRange.min) {
      params.set('minPrice', value[0].toString());
    } else {
      params.delete('minPrice');
    }
    if (value[1] < priceRange.max) {
      params.set('maxPrice', value[1].toString());
    } else {
      params.delete('maxPrice');
    }
    setSearchParams(params);
  }, [searchParams, setSearchParams, priceRange]);

  // Handle power range change
  const handlePowerChange = useCallback((value) => {
    setPowerFilter(value);
    const params = new URLSearchParams(searchParams);
    if (value[0] > powerRange.min) {
      params.set('minPower', value[0].toString());
    } else {
      params.delete('minPower');
    }
    if (value[1] < powerRange.max) {
      params.set('maxPower', value[1].toString());
    } else {
      params.delete('maxPower');
    }
    setSearchParams(params);
  }, [searchParams, setSearchParams, powerRange]);

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({});
    setSearchTerm('');
    setPriceFilter([priceRange.min, priceRange.max]);
    setPowerFilter([powerRange.min, powerRange.max]);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...catalogData];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Series filter
    if (selectedSeries !== 'all') {
      result = result.filter(p => p.series === selectedSeries);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.series.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    // Price filter
    result = result.filter(p => p.price >= priceFilter[0] && p.price <= priceFilter[1]);

    // Power filter (only for products with power > 0)
    result = result.filter(p => p.power_kw === 0 || (p.power_kw >= powerFilter[0] && p.power_kw <= powerFilter[1]));

    // Sort
    switch (sort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'power_asc':
        result.sort((a, b) => a.power_kw - b.power_kw);
        break;
      case 'power_desc':
        result.sort((a, b) => b.power_kw - a.power_kw);
        break;
      case 'series_asc':
        result.sort((a, b) => a.series.localeCompare(b.series));
        break;
      case 'series_desc':
        result.sort((a, b) => b.series.localeCompare(a.series));
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [selectedCategory, selectedSeries, searchTerm, priceFilter, powerFilter, sort]);

  // Count active filters
  const activeFilterCount = [
    selectedCategory !== 'all',
    selectedSeries !== 'all',
    searchTerm,
    priceFilter[0] > priceRange.min || priceFilter[1] < priceRange.max,
    powerFilter[0] > powerRange.min || powerFilter[1] < powerRange.max,
  ].filter(Boolean).length;

  const formatPrice = (p) => `R${p.toLocaleString('en-ZA')}`;

  // Count dual voltage products
  const dualVoltageCount = useMemo(() => catalogData.filter(p => p.has_dual_voltage).length, []);

  return (
    <div className="min-h-screen bg-[hsl(210,40%,98%)]" data-testid="shop-page">
      {/* Page Header */}
      <div className="bg-[hsl(214,100%,15%)] text-white py-12">
        <div className="max-w-[1400px] mx-auto px-4">
          <h1 className="font-manrope font-bold text-3xl sm:text-4xl mb-2">EBARA Pump Catalog</h1>
          <p className="text-gray-300 text-base max-w-2xl">
            Browse our complete range of EBARA industrial pumps. Filter by category, series, power output, and price to find the perfect pump for your application.
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
            <span>{catalogData.length} products</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-yellow-400" />
              {dualVoltageCount} with dual voltage (220V/380V)
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Mobile filter trigger */}
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
              <SelectTrigger className="w-48 h-9 text-sm rounded-sm" data-testid="sort-select">
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
            Showing <span className="font-semibold text-[hsl(222,47%,11%)]">{filteredProducts.length}</span> of {catalogData.length} products
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'fixed inset-0 z-[60] bg-black/50 lg:static lg:bg-transparent' : 'hidden'} lg:block w-full lg:w-72 shrink-0`} data-testid="filters-sidebar">
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

              {/* Search */}
              <FilterSection title="Search">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(215,16%,47%)]" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-9 h-9 text-sm rounded-sm"
                    data-testid="filter-search-input"
                  />
                </div>
              </FilterSection>

              <Separator />

              {/* Category filter */}
              <FilterSection title="Category">
                <div className="space-y-0.5 max-h-52 overflow-y-auto">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => updateFilter('category', cat)}
                      className={`block w-full text-left px-3 py-1.5 text-sm rounded-sm transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[hsl(214,100%,95%)] text-[hsl(214,100%,40%)] font-medium'
                          : 'hover:bg-[hsl(210,40%,96%)] text-[hsl(222,47%,11%)]'
                      }`}
                      data-testid={`filter-category-${cat}`}
                    >
                      {cat === 'all' ? 'All Categories' : cat}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <Separator />

              {/* Series filter */}
              <FilterSection title="Series">
                <div className="space-y-0.5 max-h-52 overflow-y-auto">
                  {series.map(s => (
                    <button
                      key={s}
                      onClick={() => updateFilter('series', s)}
                      className={`block w-full text-left px-3 py-1.5 text-sm rounded-sm transition-colors ${
                        selectedSeries === s
                          ? 'bg-[hsl(214,100%,95%)] text-[hsl(214,100%,40%)] font-medium'
                          : 'hover:bg-[hsl(210,40%,96%)] text-[hsl(222,47%,11%)]'
                      }`}
                      data-testid={`filter-series-${s}`}
                    >
                      {s === 'all' ? 'All Series' : s}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <Separator />

              {/* Power Range */}
              <FilterSection title="Power (kW)">
                <div className="px-1">
                  <Slider
                    value={powerFilter}
                    min={powerRange.min}
                    max={powerRange.max}
                    step={0.1}
                    onValueChange={handlePowerChange}
                    className="mb-3"
                    data-testid="power-range-slider"
                  />
                  <div className="flex items-center justify-between text-xs text-[hsl(215,16%,47%)]">
                    <span>{powerFilter[0]} kW</span>
                    <span>{powerFilter[1]} kW</span>
                  </div>
                </div>
              </FilterSection>

              <Separator />

              {/* Price Range */}
              <FilterSection title="Price Range">
                <div className="px-1">
                  <Slider
                    value={priceFilter}
                    min={priceRange.min}
                    max={priceRange.max}
                    step={500}
                    onValueChange={handlePriceChange}
                    className="mb-3"
                    data-testid="price-range-slider"
                  />
                  <div className="flex items-center justify-between text-xs text-[hsl(215,16%,47%)]">
                    <span>{formatPrice(priceFilter[0])}</span>
                    <span>{formatPrice(priceFilter[1])}</span>
                  </div>
                </div>
              </FilterSection>

              {/* Quick Stats */}
              <Separator />
              <div className="text-xs text-[hsl(215,16%,47%)] space-y-1">
                <p><strong>{catalogData.length}</strong> total products</p>
                <p><strong>{categories.length - 1}</strong> categories</p>
                <p><strong>{series.length - 1}</strong> series</p>
                <p className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <strong>{dualVoltageCount}</strong> dual voltage options
                </p>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[hsl(214,32%,91%)] rounded-sm" data-testid="no-products">
                <Search className="h-12 w-12 text-[hsl(214,32%,91%)] mx-auto mb-4" />
                <p className="text-lg font-manrope font-semibold text-[hsl(222,47%,11%)] mb-2">No products found</p>
                <p className="text-sm text-[hsl(215,16%,47%)] mb-6">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters} variant="outline" className="rounded-sm">Clear All Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="product-grid">
                {filteredProducts.map(product => (
                  <CatalogProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Trust Elements */}
        <div className="mt-12 bg-white border border-[hsl(214,32%,91%)] rounded-sm p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Quality Guaranteed', sub: 'Genuine EBARA products' },
              { label: 'SA Wide Delivery', sub: 'Fast & reliable shipping' },
              { label: 'Expert Support', sub: 'Technical assistance available' },
              { label: 'Quick Quoting', sub: 'Add to cart for instant quote' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <p className="font-manrope font-semibold text-sm text-[hsl(222,47%,11%)]">{item.label}</p>
                <p className="text-xs text-[hsl(215,16%,47%)]">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

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
