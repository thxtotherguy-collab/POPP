import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, Droplets, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
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

export default function Header() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Pump Finder', path: '/pump-finder' },
    { label: 'Tank Sizing', path: '/tank-sizing' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const categories = [
    { label: 'Booster Pumps', slug: 'booster-pumps' },
    { label: 'Submersible Pumps', slug: 'submersible-pumps' },
    { label: 'Borehole Pumps', slug: 'borehole-pumps' },
    { label: 'Self-Priming Pumps', slug: 'self-priming-pumps' },
    { label: 'Water Tanks', slug: 'water-tanks' },
    { label: 'Accessories', slug: 'accessories' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border" data-testid="main-header">
      {/* Top bar */}
      <div className="bg-[hsl(214,100%,40%)] text-white text-xs py-1.5">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between">
          <span>Supply &bull; Advice &bull; Quotes</span>
          <span className="hidden sm:inline">Free quote requests &bull; SA wide delivery</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" data-testid="logo-link">
            <Droplets className="h-7 w-7 text-[hsl(214,100%,40%)]" />
            <div className="leading-tight">
              <span className="font-manrope font-bold text-lg tracking-tight text-[hsl(222,47%,11%)]">POPP</span>
              <span className="hidden sm:block text-[10px] text-[hsl(215,16%,47%)] font-medium -mt-0.5">Pump & Tank Co</span>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="flex w-full border border-border rounded-sm overflow-hidden focus-within:ring-2 focus-within:ring-[hsl(214,100%,40%)] focus-within:border-[hsl(214,100%,40%)]">
              <input
                data-testid="search-input"
                type="text"
                placeholder="Search pumps, tanks, accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 text-sm outline-none bg-white"
              />
              <button
                type="submit"
                data-testid="search-submit"
                className="px-3 bg-[hsl(214,100%,40%)] text-white hover:bg-[hsl(214,100%,35%)] transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1" data-testid="desktop-nav">
            {navLinks.slice(0, 2).map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 text-sm font-medium text-[hsl(222,47%,11%)] hover:text-[hsl(214,100%,40%)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-3 py-2 text-sm font-medium text-[hsl(222,47%,11%)] hover:text-[hsl(214,100%,40%)] transition-colors inline-flex items-center gap-1" data-testid="categories-dropdown">
                  Categories <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                {categories.map(cat => (
                  <DropdownMenuItem key={cat.slug} asChild>
                    <Link to={`/shop?category=${cat.slug}`} className="cursor-pointer">{cat.label}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/shop" className="cursor-pointer font-medium">All Products</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {navLinks.slice(2).map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 text-sm font-medium text-[hsl(222,47%,11%)] hover:text-[hsl(214,100%,40%)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-1.5" data-testid="user-menu-btn">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{user.name?.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-xs text-muted-foreground">{user.email}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} data-testid="logout-btn" className="cursor-pointer">Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" data-testid="login-link">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-1.5">
                  <User className="h-4 w-4" /> Sign In
                </Button>
              </Link>
            )}

            <Link to="/cart" className="relative" data-testid="cart-link">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Quote</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[hsl(214,100%,40%)] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center" data-testid="cart-badge">
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
                    <Droplets className="h-5 w-5 text-[hsl(214,100%,40%)]" /> POPP
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
                      <button type="submit" className="px-3 bg-[hsl(214,100%,40%)] text-white">
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
                    <p className="px-3 text-xs font-semibold text-[hsl(215,16%,47%)] uppercase tracking-wider mb-2">Categories</p>
                    {categories.map(cat => (
                      <Link
                        key={cat.slug}
                        to={`/shop?category=${cat.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2 text-sm hover:bg-[hsl(210,40%,96%)] rounded-sm"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3 mt-3">
                    {user ? (
                      <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2.5 text-sm font-medium text-red-600" data-testid="mobile-logout-btn">Sign Out</button>
                    ) : (
                      <Link to="/auth" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-[hsl(214,100%,40%)]" data-testid="mobile-login-link">Sign In / Register</Link>
                    )}
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
