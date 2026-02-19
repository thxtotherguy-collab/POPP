import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';

const PUMP_DATA = [
  { name: 'Pascali PM45 Peripheral Pump', brand: 'Pascali', maxFlow: 35, maxHead: 35, power: 0.37, price: 2450, type: 'Peripheral' },
  { name: 'Zilmet Magic Box 0.65kW', brand: 'Zilmet', maxFlow: 60, maxHead: 42, power: 0.65, price: 7176, type: 'Booster' },
  { name: 'Zilmet ZIL 10H Self-Priming', brand: 'Zilmet', maxFlow: 50, maxHead: 35, power: 0.75, price: 3020, type: 'Self-Priming' },
  { name: 'DAB E.SYBOX Mini 3', brand: 'DAB', maxFlow: 80, maxHead: 55, power: 0.8, price: 12500, type: 'Booster' },
  { name: 'DAB JET 132M Self-Priming', brand: 'DAB', maxFlow: 80, maxHead: 48, power: 1.0, price: 4850, type: 'Self-Priming' },
  { name: 'DAB ESYBOX Diver 55/120', brand: 'DAB', maxFlow: 120, maxHead: 55, power: 1.2, price: 25553, type: 'Submersible' },
  { name: 'Grundfos SCALA2 3-45', brand: 'Grundfos', maxFlow: 45, maxHead: 45, power: 0.55, price: 15800, type: 'Booster' },
  { name: 'DAB S4E 8M Borehole Pump', brand: 'DAB', maxFlow: 120, maxHead: 62, power: 1.5, price: 9800, type: 'Borehole' },
  { name: 'Grundfos SQFlex 2.5-2', brand: 'Grundfos', maxFlow: 42, maxHead: 80, power: 1.4, price: 28500, type: 'Borehole' },
];

export default function PumpFinderPage() {
  const [flowRate, setFlowRate] = useState('');
  const [headRequired, setHeadRequired] = useState('');
  const [application, setApplication] = useState('');
  const [results, setResults] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    const flow = parseFloat(flowRate);
    const head = parseFloat(headRequired);
    if (isNaN(flow) || isNaN(head)) return;

    let matches = PUMP_DATA.filter(p => p.maxFlow >= flow && p.maxHead >= head);
    if (application) {
      const appMap = {
        'domestic': ['Booster', 'Peripheral'],
        'irrigation': ['Self-Priming', 'Submersible'],
        'borehole': ['Borehole', 'Submersible'],
        'drainage': ['Submersible'],
      };
      const types = appMap[application] || [];
      const filtered = matches.filter(p => types.includes(p.type));
      if (filtered.length > 0) matches = filtered;
    }
    matches.sort((a, b) => a.price - b.price);
    setResults(matches.slice(0, 3));
  };

  const formatPrice = (p) => `R${p.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen bg-[hsl(210,40%,98%)]" data-testid="pump-finder-page">
      <div className="bg-white border-b border-[hsl(214,32%,91%)]">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-2 text-sm text-[hsl(215,16%,47%)]">
          <Link to="/" className="hover:text-[hsl(214,100%,40%)]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[hsl(222,47%,11%)] font-medium">Pump Finder</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <Activity className="h-12 w-12 text-[hsl(214,100%,40%)] mx-auto mb-4" />
          <h1 className="font-manrope font-bold text-3xl sm:text-4xl text-[hsl(222,47%,11%)] mb-3">Pump Finder</h1>
          <p className="text-base text-[hsl(215,16%,47%)] max-w-lg mx-auto">
            Enter your flow rate and head requirements below. We'll match you with suitable pumps from our range.
          </p>
        </div>

        <div className="bg-white border border-[hsl(214,32%,91%)] rounded-sm p-8">
          <form onSubmit={calculate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[hsl(222,47%,11%)] mb-2">
                  Required Flow Rate (L/min)
                </label>
                <input
                  type="number"
                  value={flowRate}
                  onChange={(e) => setFlowRate(e.target.value)}
                  placeholder="e.g. 40"
                  className="w-full h-11 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)] focus:border-[hsl(214,100%,40%)]"
                  data-testid="flow-rate-input"
                  required
                  min="1"
                />
                <p className="text-xs text-[hsl(215,16%,47%)] mt-1">Litres per minute your system needs</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(222,47%,11%)] mb-2">
                  Required Head (m)
                </label>
                <input
                  type="number"
                  value={headRequired}
                  onChange={(e) => setHeadRequired(e.target.value)}
                  placeholder="e.g. 30"
                  className="w-full h-11 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)] focus:border-[hsl(214,100%,40%)]"
                  data-testid="head-input"
                  required
                  min="1"
                />
                <p className="text-xs text-[hsl(215,16%,47%)] mt-1">Vertical distance water needs to travel</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[hsl(222,47%,11%)] mb-2">Application (optional)</label>
              <Select value={application} onValueChange={setApplication}>
                <SelectTrigger className="w-full h-11 rounded-sm" data-testid="application-select">
                  <SelectValue placeholder="Select application type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="domestic">Domestic / Home Pressure</SelectItem>
                  <SelectItem value="irrigation">Irrigation / Transfer</SelectItem>
                  <SelectItem value="borehole">Borehole / Deep Well</SelectItem>
                  <SelectItem value="drainage">Drainage / Dewatering</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full h-12 bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white rounded-sm font-semibold" data-testid="find-pump-btn">
              Find My Pump
            </Button>
          </form>
        </div>

        {/* Results */}
        {results !== null && (
          <div className="mt-8" data-testid="pump-results">
            <h2 className="font-manrope font-bold text-xl text-[hsl(222,47%,11%)] mb-4">
              {results.length > 0 ? `${results.length} Pump${results.length > 1 ? 's' : ''} Found` : 'No Matches'}
            </h2>
            {results.length === 0 ? (
              <div className="bg-white border border-[hsl(214,32%,91%)] rounded-sm p-8 text-center">
                <p className="text-[hsl(215,16%,47%)] mb-4">No pumps match your requirements. Try adjusting your values or contact us for a custom recommendation.</p>
                <Link to="/contact">
                  <Button variant="outline" className="rounded-sm">Contact Us</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((pump, i) => (
                  <div key={i} className="bg-white border border-[hsl(214,32%,91%)] rounded-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" data-testid={`pump-result-${i}`}>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(215,16%,47%)]">{pump.brand} &bull; {pump.type}</p>
                      <h3 className="font-manrope font-semibold text-lg text-[hsl(222,47%,11%)]">{pump.name}</h3>
                      <p className="text-sm text-[hsl(215,16%,47%)]">
                        Max Flow: {pump.maxFlow} L/min &bull; Max Head: {pump.maxHead}m &bull; Power: {pump.power} kW
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-manrope font-bold text-xl text-[hsl(222,47%,11%)]">{formatPrice(pump.price)}</span>
                      <Link to="/contact">
                        <Button className="bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white rounded-sm" data-testid={`quote-pump-${i}`}>
                          Get Quote <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <Separator className="my-12" />
        <div className="text-center text-sm text-[hsl(215,16%,47%)]">
          <p>Not sure about your requirements? <Link to="/contact" className="text-[hsl(214,100%,40%)] font-medium hover:underline">Contact us</Link> and we'll help you size the right pump.</p>
        </div>
      </div>
    </div>
  );
}
