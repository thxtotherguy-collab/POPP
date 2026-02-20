import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, ArrowRight, Upload, Send,
  Gauge, Settings, Droplets, Sprout, RefreshCcw,
  Wrench, HardHat, Waves, Tractor, Building2, Factory, User, Landmark,
  CheckCircle2, FileText, Phone, MessageSquare, ClipboardList
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AUDIENCE = [
  { icon: Wrench, label: 'Plumbing Contractors' },
  { icon: Waves, label: 'Borehole Installers' },
  { icon: Sprout, label: 'Irrigation Specialists' },
  { icon: Tractor, label: 'Agricultural Operations' },
  { icon: Building2, label: 'Construction Companies' },
  { icon: Landmark, label: 'Facility Managers' },
  { icon: Factory, label: 'Industrial Maintenance Teams' },
  { icon: User, label: 'Property Owners' },
];

const CATEGORIES = [
  {
    icon: Gauge,
    title: 'Pump Selection & Sizing',
    desc: 'Help determining the correct pump based on flow rate, head, and system requirements. We assess your application parameters and recommend pumps that deliver the required performance without over-specification or under-sizing — ensuring efficiency and longevity.',
  },
  {
    icon: Settings,
    title: 'System Design Support',
    desc: 'Guidance on pipe sizing, fittings, valves, and pressure regulation. We help you specify the correct pipe diameters, materials, and connection types for your operating pressures, flow velocities, and environmental conditions.',
  },
  {
    icon: Droplets,
    title: 'Borehole & Water Supply Systems',
    desc: 'Complete advice on pump integration, tanks, filtration, and pressure control. From borehole pump selection and cable sizing to tank placement and distribution system design — we cover the full scope of groundwater extraction and supply.',
  },
  {
    icon: Sprout,
    title: 'Irrigation System Consultation',
    desc: 'Water-efficient irrigation planning and component selection. We assist with sprinkler and drip system design, pump-to-zone matching, scheduling recommendations, and component specification for agricultural and landscaping applications.',
  },
  {
    icon: RefreshCcw,
    title: 'Replacement & System Upgrades',
    desc: 'Assessment of existing systems and performance improvements. If your current equipment is underperforming, cycling excessively, or has reached end-of-life, we evaluate the installation and recommend targeted upgrades or replacements.',
  },
];

const STEPS = [
  { num: '01', label: 'Submit your consultation request', icon: ClipboardList },
  { num: '02', label: 'Our team reviews your technical requirements', icon: FileText },
  { num: '03', label: 'We contact you to clarify details if needed', icon: Phone },
  { num: '04', label: 'We recommend suitable products or schedule a site visit', icon: MessageSquare },
  { num: '05', label: 'You receive a formal quotation and system recommendation', icon: CheckCircle2 },
];

const FAQ_DATA = [
  {
    q: 'What information do I need before requesting a consultation?',
    a: 'Provide as much technical detail as possible: the application type, required flow rate and pressure if known, water source, power supply available, pipe sizes, and any drawings or specifications you have. If you are unsure of these details, our team will help you determine them during the consultation process.',
  },
  {
    q: 'Can you help if I don\'t know my required flow rate?',
    a: 'Yes. Many clients are unsure of their exact flow and pressure requirements. Based on the type of application, number of outlets, distances involved, and elevation changes, we can calculate the required performance parameters and recommend equipment accordingly.',
  },
  {
    q: 'Do you provide on-site inspections?',
    a: 'For complex installations or large-scale projects, we can arrange on-site inspections and assessments. This is typically recommended for commercial, industrial, or agricultural systems where site-specific factors significantly influence equipment selection.',
  },
  {
    q: 'Do you supply installation services?',
    a: 'We primarily supply equipment and technical consultation. For installation, we work with a network of qualified plumbing and electrical contractors across South Africa. We can recommend trusted installers in your area and provide them with full technical specifications for your system.',
  },
  {
    q: 'How long does the quoting process take?',
    a: 'Standard consultation requests are reviewed and responded to within 24-48 business hours. Complex or multi-component system designs may require additional time for proper engineering assessment. We will communicate expected timelines at the outset of your enquiry.',
  },
];

const EMPTY_FORM = {
  full_name: '', company: '', phone: '', email: '', location: '',
  application_type: '', installation_type: '', flow_rate: '', pressure_head: '',
  power_supply: '', water_source: '', pipe_size: '', budget: '', timeline: '',
  description: '',
};

export default function ConsultationPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/consultations`, form);
      toast.success('Consultation request submitted. Our team will respond within 24-48 hours.');
      setForm(EMPTY_FORM);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      toast.error('Submission failed. Please try again or contact us directly.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white" data-testid="consultation-page">

      {/* ── 1. HERO ── */}
      <section className="relative bg-[hsl(222,47%,11%)] overflow-hidden" data-testid="consultation-hero">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0z\' fill=\'none\'/%3E%3Cpath d=\'M0 40L40 0M-10 10L30-30M10 50L50 10\' stroke=\'%23fff\' stroke-width=\'0.5\'/%3E%3C/svg%3E")'}} />
        <div className="relative max-w-[1400px] mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-[hsl(195,100%,50%)] font-semibold text-xs uppercase tracking-[0.2em] mb-5">Technical Consultation</p>
            <h1 className="font-manrope font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] mb-6" data-testid="consultation-h1">
              Professional Pump &amp; System Consultation
            </h1>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-10 max-w-2xl">
              Get expert guidance on pump selection, fittings, pressure systems, irrigation layouts, borehole setups, and complete water management solutions.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={scrollToForm}
                className="bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white h-12 px-8 text-sm font-semibold rounded-sm"
                data-testid="hero-request-btn"
              >
                Request a Consultation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={scrollToForm}
                variant="outline"
                className="border-white/25 text-white hover:bg-white/10 h-12 px-8 text-sm font-semibold rounded-sm"
                data-testid="hero-upload-btn"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Project Specifications
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. AUTHORITY ── */}
      <section className="py-20 bg-[hsl(210,40%,98%)]" data-testid="authority-section">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-manrope font-bold text-2xl sm:text-3xl text-[hsl(222,47%,11%)] mb-6" data-testid="authority-h2">
                Technical Support You Can Rely On
              </h2>
              <p className="text-sm text-[hsl(222,47%,11%)]/80 leading-relaxed mb-6">
                Our team provides expert consultation for residential, commercial, agricultural, and industrial pump systems. Whether you are designing a new installation, replacing equipment, or troubleshooting an existing setup, we help you select the correct pumps, fittings, valves, tanks, and control systems to ensure performance, efficiency, and durability.
              </p>
            </div>
            <div className="bg-white border border-[hsl(214,32%,91%)] rounded-sm p-8">
              <p className="font-manrope font-semibold text-sm uppercase tracking-wider text-[hsl(215,16%,47%)] mb-5">We assist with</p>
              <div className="space-y-3.5">
                {[
                  'Pump sizing and selection',
                  'Pressure and flow calculations',
                  'Pipe and fitting compatibility',
                  'Tank system integration',
                  'Irrigation and borehole planning',
                  'Replacement and upgrade assessments',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4.5 w-4.5 text-[hsl(214,100%,40%)] mt-0.5 shrink-0" />
                    <span className="text-sm text-[hsl(222,47%,11%)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. WHO THIS IS FOR ── */}
      <section className="py-20 bg-white" data-testid="audience-section">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="font-manrope font-bold text-2xl sm:text-3xl text-[hsl(222,47%,11%)] mb-3 text-center">
            Designed For
          </h2>
          <p className="text-base text-[hsl(215,16%,47%)] text-center mb-12 max-w-xl mx-auto">
            Our consultation services are structured for professionals and property owners who require technically accurate recommendations.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {AUDIENCE.map((a, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 p-6 bg-[hsl(210,40%,98%)] border border-[hsl(214,32%,91%)] rounded-sm hover:border-[hsl(214,100%,40%)/0.3] transition-colors"
                data-testid={`audience-${i}`}
              >
                <div className="w-11 h-11 bg-white border border-[hsl(214,32%,91%)] rounded-sm flex items-center justify-center">
                  <a.icon className="h-5 w-5 text-[hsl(214,100%,40%)]" />
                </div>
                <span className="text-sm font-medium text-[hsl(222,47%,11%)] text-center leading-tight">{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. CONSULTATION CATEGORIES ── */}
      <section className="py-20 bg-[hsl(210,40%,98%)]" data-testid="categories-section">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="font-manrope font-bold text-2xl sm:text-3xl text-[hsl(222,47%,11%)] mb-3">
            Consultation Categories
          </h2>
          <p className="text-base text-[hsl(215,16%,47%)] mb-12 max-w-2xl">
            Select the area most relevant to your project. Each consultation is tailored to your specific technical requirements.
          </p>
          <div className="space-y-5">
            {CATEGORIES.map((cat, i) => (
              <div
                key={i}
                className="bg-white border border-[hsl(214,32%,91%)] rounded-sm p-6 sm:p-8 flex flex-col sm:flex-row gap-5 hover:border-[hsl(214,100%,40%)/0.3] transition-colors"
                data-testid={`consult-category-${i}`}
              >
                <div className="w-12 h-12 bg-[hsl(214,100%,96%)] rounded-sm flex items-center justify-center shrink-0">
                  <cat.icon className="h-6 w-6 text-[hsl(214,100%,40%)]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-manrope font-bold text-lg text-[hsl(222,47%,11%)] mb-2">{cat.title}</h3>
                  <p className="text-sm text-[hsl(215,16%,47%)] leading-relaxed mb-4">{cat.desc}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={scrollToForm}
                    className="rounded-sm text-xs font-semibold gap-1.5 hover:bg-[hsl(214,100%,40%)] hover:text-white hover:border-[hsl(214,100%,40%)]"
                    data-testid={`request-advice-${i}`}
                  >
                    Request Technical Advice <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. TECHNICAL CONSULTATION FORM ── */}
      <section className="py-20 bg-white" ref={formRef} data-testid="consultation-form-section">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-manrope font-bold text-2xl sm:text-3xl text-[hsl(222,47%,11%)] mb-3">
              Technical Consultation Request
            </h2>
            <p className="text-base text-[hsl(215,16%,47%)] max-w-xl mx-auto">
              Provide your project details below. The more information you share, the more accurate our recommendation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="border border-[hsl(214,32%,91%)] rounded-sm" data-testid="consultation-form">
            {/* Contact Information */}
            <div className="p-6 sm:p-8 border-b border-[hsl(214,32%,91%)]">
              <h3 className="font-manrope font-semibold text-base text-[hsl(222,47%,11%)] mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-[hsl(214,100%,40%)] text-white text-[10px] font-bold rounded-sm flex items-center justify-center">1</span>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[hsl(222,47%,11%)] mb-1.5">Full Name *</label>
                  <input type="text" required value={form.full_name} onChange={e => update('full_name', e.target.value)} className="w-full h-10 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)] focus:border-[hsl(214,100%,40%)]" data-testid="form-full-name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(222,47%,11%)] mb-1.5">Company Name</label>
                  <input type="text" value={form.company} onChange={e => update('company', e.target.value)} className="w-full h-10 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)] focus:border-[hsl(214,100%,40%)]" data-testid="form-company" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(222,47%,11%)] mb-1.5">Phone Number *</label>
                  <input type="tel" required value={form.phone} onChange={e => update('phone', e.target.value)} className="w-full h-10 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)] focus:border-[hsl(214,100%,40%)]" data-testid="form-phone" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(222,47%,11%)] mb-1.5">Email Address *</label>
                  <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} className="w-full h-10 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)] focus:border-[hsl(214,100%,40%)]" data-testid="form-email" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[hsl(222,47%,11%)] mb-1.5">Location</label>
                  <input type="text" placeholder="City / Province" value={form.location} onChange={e => update('location', e.target.value)} className="w-full h-10 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)] focus:border-[hsl(214,100%,40%)]" data-testid="form-location" />
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div className="p-6 sm:p-8 border-b border-[hsl(214,32%,91%)]">
              <h3 className="font-manrope font-semibold text-base text-[hsl(222,47%,11%)] mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-[hsl(214,100%,40%)] text-white text-[10px] font-bold rounded-sm flex items-center justify-center">2</span>
                Project Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[hsl(222,47%,11%)] mb-1.5">Application Type *</label>
                  <Select value={form.application_type} onValueChange={v => update('application_type', v)}>
                    <SelectTrigger className="w-full h-10 rounded-sm text-sm" data-testid="form-application-type">
                      <SelectValue placeholder="Select application" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="agricultural">Agricultural</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(222,47%,11%)] mb-1.5">Installation Type</label>
                  <Select value={form.installation_type} onValueChange={v => update('installation_type', v)}>
                    <SelectTrigger className="w-full h-10 rounded-sm text-sm" data-testid="form-installation-type">
                      <SelectValue placeholder="New or Replacement?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Installation</SelectItem>
                      <SelectItem value="replacement">Replacement</SelectItem>
                      <SelectItem value="upgrade">System Upgrade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(222,47%,11%)] mb-1.5">Required Flow Rate (if known)</label>
                  <input type="text" placeholder="e.g. 40 L/min" value={form.flow_rate} onChange={e => update('flow_rate', e.target.value)} className="w-full h-10 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)] focus:border-[hsl(214,100%,40%)]" data-testid="form-flow-rate" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(222,47%,11%)] mb-1.5">Required Pressure / Head (if known)</label>
                  <input type="text" placeholder="e.g. 35m or 3.5 bar" value={form.pressure_head} onChange={e => update('pressure_head', e.target.value)} className="w-full h-10 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)] focus:border-[hsl(214,100%,40%)]" data-testid="form-pressure-head" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(222,47%,11%)] mb-1.5">Power Supply Available</label>
                  <Select value={form.power_supply} onValueChange={v => update('power_supply', v)}>
                    <SelectTrigger className="w-full h-10 rounded-sm text-sm" data-testid="form-power-supply">
                      <SelectValue placeholder="Select power supply" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single_phase">Single Phase (220V)</SelectItem>
                      <SelectItem value="three_phase">Three Phase (380V)</SelectItem>
                      <SelectItem value="solar">Solar / Off-Grid</SelectItem>
                      <SelectItem value="unknown">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(222,47%,11%)] mb-1.5">Water Source</label>
                  <Select value={form.water_source} onValueChange={v => update('water_source', v)}>
                    <SelectTrigger className="w-full h-10 rounded-sm text-sm" data-testid="form-water-source">
                      <SelectValue placeholder="Select water source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="municipal">Municipal Supply</SelectItem>
                      <SelectItem value="borehole">Borehole</SelectItem>
                      <SelectItem value="dam">Dam / River</SelectItem>
                      <SelectItem value="tank">Storage Tank</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(222,47%,11%)] mb-1.5">Pipe Size (if known)</label>
                  <input type="text" placeholder="e.g. 1 inch, 25mm" value={form.pipe_size} onChange={e => update('pipe_size', e.target.value)} className="w-full h-10 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)] focus:border-[hsl(214,100%,40%)]" data-testid="form-pipe-size" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[hsl(222,47%,11%)] mb-1.5">Estimated Budget (Optional)</label>
                  <input type="text" placeholder="e.g. R10,000 – R25,000" value={form.budget} onChange={e => update('budget', e.target.value)} className="w-full h-10 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)] focus:border-[hsl(214,100%,40%)]" data-testid="form-budget" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[hsl(222,47%,11%)] mb-1.5">Project Timeline</label>
                  <Select value={form.timeline} onValueChange={v => update('timeline', v)}>
                    <SelectTrigger className="w-full h-10 rounded-sm text-sm" data-testid="form-timeline">
                      <SelectValue placeholder="When do you need this?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent (within 1 week)</SelectItem>
                      <SelectItem value="short">Short term (1-4 weeks)</SelectItem>
                      <SelectItem value="medium">Medium term (1-3 months)</SelectItem>
                      <SelectItem value="planning">Planning phase (3+ months)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Description + Submit */}
            <div className="p-6 sm:p-8">
              <h3 className="font-manrope font-semibold text-base text-[hsl(222,47%,11%)] mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-[hsl(214,100%,40%)] text-white text-[10px] font-bold rounded-sm flex items-center justify-center">3</span>
                Project Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[hsl(222,47%,11%)] mb-1.5">Detailed Project Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => update('description', e.target.value)}
                    placeholder="Describe your project requirements, existing setup, problems experienced, distances, elevation changes, number of outlets, or any other technical details that will help us assist you."
                    className="w-full px-3 py-2.5 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)] focus:border-[hsl(214,100%,40%)] h-32 resize-none"
                    data-testid="form-description"
                  />
                </div>

                <Separator />

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white rounded-sm font-semibold text-sm"
                  data-testid="form-submit-btn"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {submitting ? 'Submitting...' : 'Submit Consultation Request'}
                </Button>
                <p className="text-center text-xs text-[hsl(215,16%,47%)]">
                  Our technical team will review your request and respond within 24-48 hours.
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* ── 6. PROCESS ── */}
      <section className="py-20 bg-[hsl(210,40%,98%)]" data-testid="process-section">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="font-manrope font-bold text-2xl sm:text-3xl text-[hsl(222,47%,11%)] mb-3 text-center">
            What Happens Next?
          </h2>
          <p className="text-base text-[hsl(215,16%,47%)] text-center mb-12 max-w-xl mx-auto">
            A structured process designed to get you the right recommendation as quickly and accurately as possible.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {STEPS.map((step, i) => (
              <div key={i} className="relative bg-white border border-[hsl(214,32%,91%)] rounded-sm p-5 text-center" data-testid={`process-step-${i}`}>
                <div className="w-10 h-10 bg-[hsl(214,100%,40%)] text-white rounded-sm flex items-center justify-center mx-auto mb-3">
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="block text-[10px] font-bold text-[hsl(214,100%,40%)] uppercase tracking-wider mb-1.5">Step {step.num}</span>
                <p className="text-sm text-[hsl(222,47%,11%)] leading-snug">{step.label}</p>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(214,32%,91%)] z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ── */}
      <section className="py-20 bg-white" data-testid="consultation-faq">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-manrope font-bold text-2xl sm:text-3xl text-[hsl(222,47%,11%)] mb-3 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-[hsl(215,16%,47%)] text-center mb-10">
            Common questions about our consultation service.
          </p>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ_DATA.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-[hsl(214,32%,91%)] rounded-sm px-5 data-[state=open]:border-[hsl(214,100%,40%)/0.3]"
              >
                <AccordionTrigger className="text-sm font-semibold text-[hsl(222,47%,11%)] text-left py-4 hover:no-underline" data-testid={`consultation-faq-${i}`}>
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[hsl(215,16%,47%)] leading-relaxed pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── 8. CLOSING CTA ── */}
      <section className="py-20 bg-[hsl(222,47%,11%)]" data-testid="consultation-cta">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <h2 className="font-manrope font-bold text-2xl sm:text-3xl text-white mb-4">
            Need Expert Advice on Your Pump System?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Submit your technical requirements today and let our team recommend the correct pumps, fittings, and system components for your project.
          </p>
          <Button
            onClick={scrollToForm}
            className="bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white h-12 px-10 text-sm font-semibold rounded-sm"
            data-testid="cta-request-btn"
          >
            Request Consultation Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
