import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ChevronRight, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success('Message sent! We will get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setSending(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[hsl(210,40%,98%)]" data-testid="contact-page">
      <div className="bg-white border-b border-[hsl(214,32%,91%)]">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-2 text-sm text-[hsl(215,16%,47%)]">
          <Link to="/" className="hover:text-[hsl(214,100%,40%)]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[hsl(222,47%,11%)] font-medium">Contact</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-manrope font-bold text-3xl sm:text-4xl text-[hsl(222,47%,11%)] mb-3">Get in Touch</h1>
          <p className="text-base text-[hsl(215,16%,47%)] max-w-lg mx-auto">
            Need advice on which pump or tank is right for you? Send us your requirements and we'll help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Contact info */}
          <div className="space-y-6">
            {[
              { icon: Phone, label: 'Phone', value: '+27 68 377 3507', sub: 'Mon-Fri, 8am-5pm SAST' },
              { icon: Mail, label: 'Email', value: 'info@popp.co.za', sub: 'Response within 24 hours' },
              { icon: MapPin, label: 'Location', value: 'Johannesburg, South Africa', sub: 'International delivery' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-[hsl(214,32%,91%)] rounded-sm p-5 flex gap-4">
                <div className="w-10 h-10 bg-[hsl(214,100%,95%)] rounded-sm flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-[hsl(214,100%,40%)]" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[hsl(222,47%,11%)]">{item.label}</p>
                  <p className="text-sm text-[hsl(222,47%,11%)]">{item.value}</p>
                  <p className="text-xs text-[hsl(215,16%,47%)]">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2 bg-white border border-[hsl(214,32%,91%)] rounded-sm p-8">
            <h2 className="font-manrope font-bold text-xl text-[hsl(222,47%,11%)] mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text" placeholder="Full Name *" required
                  value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))}
                  className="w-full h-11 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)]"
                  data-testid="contact-name"
                />
                <input
                  type="email" placeholder="Email *" required
                  value={form.email} onChange={(e) => setForm(f => ({...f, email: e.target.value}))}
                  className="w-full h-11 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)]"
                  data-testid="contact-email"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel" placeholder="Phone"
                  value={form.phone} onChange={(e) => setForm(f => ({...f, phone: e.target.value}))}
                  className="w-full h-11 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)]"
                  data-testid="contact-phone"
                />
                <input
                  type="text" placeholder="Subject"
                  value={form.subject} onChange={(e) => setForm(f => ({...f, subject: e.target.value}))}
                  className="w-full h-11 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)]"
                  data-testid="contact-subject"
                />
              </div>
              <textarea
                placeholder="Your message — include details like distances, pipe sizes, photos etc. *" required
                value={form.message} onChange={(e) => setForm(f => ({...f, message: e.target.value}))}
                className="w-full px-3 py-2 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)] h-32 resize-none"
                data-testid="contact-message"
              />
              <Button type="submit" disabled={sending} className="h-11 px-8 bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white rounded-sm font-semibold" data-testid="contact-submit">
                <Send className="h-4 w-4 mr-2" /> {sending ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
