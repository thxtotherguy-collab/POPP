import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Minus, Plus, ChevronRight, Send } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: '',
    message: '',
  });

  const formatPrice = (p) => `R${p.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Your quote is empty'); return; }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        items: items.map(i => ({ id: i.id, name: i.name, brand: i.brand, price: i.price, qty: i.qty })),
      };
      await axios.post(`${API}/quotes`, payload);
      toast.success('Quote request submitted! We will contact you shortly.');
      clearCart();
      navigate('/');
    } catch (err) {
      toast.error('Failed to submit quote. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[hsl(210,40%,98%)]" data-testid="cart-page">
      <div className="bg-white border-b border-[hsl(214,32%,91%)]">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-2 text-sm text-[hsl(215,16%,47%)]">
          <Link to="/" className="hover:text-[hsl(214,100%,40%)]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[hsl(222,47%,11%)] font-medium">Quote Request</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <h1 className="font-manrope font-bold text-2xl sm:text-3xl text-[hsl(222,47%,11%)] mb-8">
          <ShoppingCart className="inline h-7 w-7 mr-2 -mt-1" />
          Your Quote Request
        </h1>

        {items.length === 0 ? (
          <div className="bg-white border border-[hsl(214,32%,91%)] rounded-sm p-12 text-center" data-testid="empty-cart">
            <ShoppingCart className="h-16 w-16 text-[hsl(214,32%,91%)] mx-auto mb-4" />
            <p className="text-lg text-[hsl(215,16%,47%)] mb-6">Your quote is empty</p>
            <Link to="/shop">
              <Button className="bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white rounded-sm" data-testid="continue-shopping-btn">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white border border-[hsl(214,32%,91%)] rounded-sm p-4 flex gap-4" data-testid={`cart-item-${item.id}`}>
                  <div className="w-20 h-20 bg-[hsl(210,40%,96%)] rounded-sm overflow-hidden shrink-0">
                    <img src={item.image || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[hsl(215,16%,47%)] uppercase">{item.brand}</p>
                    <p className="font-semibold text-sm text-[hsl(222,47%,11%)] truncate">{item.name}</p>
                    <p className="font-manrope font-bold text-[hsl(222,47%,11%)] mt-1">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeItem(item.id)} className="text-[hsl(215,16%,47%)] hover:text-red-500 transition-colors" data-testid={`remove-item-${item.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-1 border border-[hsl(214,32%,91%)] rounded-sm">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-1 hover:bg-[hsl(210,40%,96%)]" data-testid={`decrease-${item.id}`}>
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-sm font-medium">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="p-1 hover:bg-[hsl(210,40%,96%)]" data-testid={`increase-${item.id}`}>
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4">
                <p className="font-manrope font-bold text-xl text-[hsl(222,47%,11%)]" data-testid="cart-total">
                  Est. Total: {formatPrice(totalPrice)}
                </p>
                <p className="text-xs text-[hsl(215,16%,47%)]">Final pricing confirmed in quote</p>
              </div>
            </div>

            {/* Quote form */}
            <div className="bg-white border border-[hsl(214,32%,91%)] rounded-sm p-6 h-fit sticky top-28">
              <h2 className="font-manrope font-bold text-lg text-[hsl(222,47%,11%)] mb-4">Request Quote</h2>
              <p className="text-sm text-[hsl(215,16%,47%)] mb-6">Submit your details and we'll send you a formal quote with final pricing.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text" placeholder="Full Name *" required
                  value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))}
                  className="w-full h-10 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)]"
                  data-testid="quote-name-input"
                />
                <input
                  type="email" placeholder="Email Address *" required
                  value={form.email} onChange={(e) => setForm(f => ({...f, email: e.target.value}))}
                  className="w-full h-10 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)]"
                  data-testid="quote-email-input"
                />
                <input
                  type="tel" placeholder="Phone Number *" required
                  value={form.phone} onChange={(e) => setForm(f => ({...f, phone: e.target.value}))}
                  className="w-full h-10 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)]"
                  data-testid="quote-phone-input"
                />
                <input
                  type="text" placeholder="Company (optional)"
                  value={form.company} onChange={(e) => setForm(f => ({...f, company: e.target.value}))}
                  className="w-full h-10 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)]"
                  data-testid="quote-company-input"
                />
                <textarea
                  placeholder="Additional notes (optional)"
                  value={form.message} onChange={(e) => setForm(f => ({...f, message: e.target.value}))}
                  className="w-full px-3 py-2 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)] h-20 resize-none"
                  data-testid="quote-message-input"
                />
                <Separator />
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white rounded-sm font-semibold"
                  data-testid="submit-quote-btn"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {submitting ? 'Submitting...' : 'Submit Quote Request'}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
