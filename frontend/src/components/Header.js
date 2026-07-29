import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, ChevronDown } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const LOGO_SRC = '/images/brand/swsg-logo.png';

export default function Header() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Pumps', path: '/pumps' },
    { label: 'Irrigation', path: '/irrigation' },
    { label: 'Agriculture', path: '/agriculture' },
    { label: 'Store', path: '/store' },
    { label: 'Consultation', path: '/consultation' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const categories = [
    { label: 'Borehole Pump', slug: 'Borehole Pump' },
    { label: 'Centrifugal Pump', slug: 'Centrifugal Pump' },
    { label: 'Submersible Pump', slug: 'Submersible Pump' },
    { label: 'Vertical Multistage Pump', slug: 'Vertical Multistage Pump' },
    { label: 'End Suction Pump', slug: 'End Suction Pump' },
    { label: 'Stainless Steel Pump', slug: 'Stainless Steel Pump' },
    { label: 'Self-Priming Pump', slug: 'Self-Priming Pump' },
    { label: 'Twin Impeller Pump', slug: 'Twin Impeller Pump' },
    { label: 'Fountain Pump', slug: 'Fountain Pump' },
    { label: 'Drainage Pump', slug: 'Drainage Pump' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border" data-testid="main-header">
      {/* Top bar */}
      <div className="bg-[hsl(211,68%,16%)] text-white text-xs py-1.5">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between">
          <span>Pumps &bull; Irrigation &bull; Agriculture</span>
          <span className="hidden sm:inline">+27 81 417 7689 &bull; info@swsg.co.za</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between h-16 sm:h-24 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" data-testid="logo-link" aria-label="SWSG Home">
            <img src={LOGO_SRC} alt="Southern Water Solutions Group" className="h-14 sm:h-20 lg:h-24 w-auto object-contain" />
            <span className="sr-only">SWSG — Southern Water Solutions Group</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="flex w-full border border-border rounded-sm overflow-hidden focus-within:ring-2 focus-within:ring-[hsl(211,70%,39%)] focus-within:border-[hsl(211,70%,39%)]">
              <input
                data-testid="search-input"
                type="text"
                placeholder="Search pumps, parts, accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 text-sm outline-none bg-white"
              />
              <button
                type="submit"
                data-testid="search-submit"
                className="px-3 bg-[hsl(211,70%,39%)] text-white hover:bg-[hsl(211,70%,32%)] transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-0.5" data-testid="desktop-nav">
            {navLinks.slice(0, 4).map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="px-2.5 py-2 text-sm font-medium text-[hsl(211,68%,16%)] hover:text-[hsl(211,70%,39%)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-2.5 py-2 text-sm font-medium text-[hsl(211,68%,16%)] hover:text-[hsl(211,70%,39%)] transition-colors inline-flex items-center gap-1" data-testid="categories-dropdown">
                  Store <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuItem asChild>
                  <Link to="/store" className="cursor-pointer font-medium">All Products</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {categories.map(cat => (
                  <DropdownMenuItem key={cat.slug} asChild>
                    <Link to={`/store?category=${cat.slug}`} className="cursor-pointer">{cat.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {navLinks.slice(5).map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="px-2.5 py-2 text-sm font-medium text-[hsl(211,68%,16%)] hover:text-[hsl(211,70%,39%)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative" data-testid="cart-link">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[hsl(211,70%,39%)] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center" data-testid="cart-badge">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden" data-testid="mobile-menu-btn">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <img src={LOGO_SRC} alt="SWSG" className="h-16 w-auto object-contain" />
                    <span className="sr-only">SWSG</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-1">
                  {/* Mobile search */}
                  <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false); }} className="mb-4">
                    <div className="flex border border-border rounded-sm overflow-hidden">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm outline-none"
                        data-testid="mobile-search-input"
                      />
                      <button type="submit" className="px-3 bg-[hsl(211,70%,39%)] text-white">
                        <Search className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                  {navLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 text-sm font-medium hover:bg-[hsl(210,40%,96%)] rounded-sm"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t border-border pt-3 mt-3">
                    <p className="px-3 text-xs font-semibold text-[hsl(215,16%,47%)] uppercase tracking-wider mb-2">Pump Categories</p>
                    {categories.map(cat => (
                      <Link
                        key={cat.slug}
                        to={`/store?category=${cat.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2 text-sm hover:bg-[hsl(210,40%,96%)] rounded-sm"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
