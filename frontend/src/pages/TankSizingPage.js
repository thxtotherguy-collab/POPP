import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ruler, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';

const TANK_SUGGESTIONS = [
  { capacity: 1000, name: 'Slimline 1000L Tank', price: 3200 },
  { capacity: 2500, name: 'JoJo 2500L Vertical Tank', price: 4200 },
  { capacity: 5000, name: 'JoJo 5000L Vertical Tank', price: 6800 },
  { capacity: 10000, name: 'JoJo 10000L Vertical Tank', price: 12500 },
];

export default function TankSizingPage() {
  const [people, setPeople] = useState('');
  const [days, setDays] = useState('');
  const [usage, setUsage] = useState('');
  const [result, setResult] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    const numPeople = parseInt(people);
    const numDays = parseInt(days);
    if (isNaN(numPeople) || isNaN(numDays)) return;

    // Average daily water usage per person in litres
    const usageMap = { light: 100, normal: 200, heavy: 300 };
    const dailyPerPerson = usageMap[usage] || 200;

    const totalLitres = numPeople * numDays * dailyPerPerson;
    const essentialLitres = Math.ceil(totalLitres * 0.5); // 50% for essential use only
    const fullLitres = totalLitres;

    // Find matching tanks
    const essentialTank = TANK_SUGGESTIONS.find(t => t.capacity >= essentialLitres) || TANK_SUGGESTIONS[TANK_SUGGESTIONS.length - 1];
    const fullTank = TANK_SUGGESTIONS.find(t => t.capacity >= fullLitres) || TANK_SUGGESTIONS[TANK_SUGGESTIONS.length - 1];

    const multipleTanks = fullLitres > 10000 ? Math.ceil(fullLitres / 10000) : null;

    setResult({
      totalLitres: fullLitres,
      essentialLitres,
      essentialTank,
      fullTank,
      multipleTanks,
      dailyUsage: numPeople * dailyPerPerson,
    });
  };

  const formatPrice = (p) => `R${p.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen bg-[hsl(210,40%,98%)]" data-testid="tank-sizing-page">
      <div className="bg-white border-b border-[hsl(214,32%,91%)]">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-2 text-sm text-[hsl(215,16%,47%)]">
          <Link to="/" className="hover:text-[hsl(214,100%,40%)]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[hsl(222,47%,11%)] font-medium">Tank Sizing</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <Ruler className="h-12 w-12 text-[hsl(214,100%,40%)] mx-auto mb-4" />
          <h1 className="font-manrope font-bold text-3xl sm:text-4xl text-[hsl(222,47%,11%)] mb-3">Tank Sizing Calculator</h1>
          <p className="text-base text-[hsl(215,16%,47%)] max-w-lg mx-auto">
            Estimate how many litres of backup water storage you need based on your household size and usage.
          </p>
        </div>

        <div className="bg-white border border-[hsl(214,32%,91%)] rounded-sm p-8">
          <form onSubmit={calculate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[hsl(222,47%,11%)] mb-2">Number of People</label>
                <input
                  type="number"
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  placeholder="e.g. 4"
                  className="w-full h-11 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)] focus:border-[hsl(214,100%,40%)]"
                  data-testid="people-input"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(222,47%,11%)] mb-2">Days of Backup</label>
                <input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full h-11 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)] focus:border-[hsl(214,100%,40%)]"
                  data-testid="days-input"
                  required
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[hsl(222,47%,11%)] mb-2">Usage Level</label>
              <Select value={usage} onValueChange={setUsage}>
                <SelectTrigger className="w-full h-11 rounded-sm" data-testid="usage-select">
                  <SelectValue placeholder="Select usage level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light (100L/person/day) — essential use only</SelectItem>
                  <SelectItem value="normal">Normal (200L/person/day) — standard household</SelectItem>
                  <SelectItem value="heavy">Heavy (300L/person/day) — garden & pool included</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full h-12 bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white rounded-sm font-semibold" data-testid="calculate-tank-btn">
              Calculate Tank Size
            </Button>
          </form>
        </div>

        {result && (
          <div className="mt-8 space-y-6" data-testid="tank-results">
            {/* Summary */}
            <div className="bg-white border border-[hsl(214,32%,91%)] rounded-sm p-6">
              <h2 className="font-manrope font-bold text-xl text-[hsl(222,47%,11%)] mb-4">Your Water Storage Needs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-[hsl(210,40%,98%)] rounded-sm">
                  <p className="text-sm text-[hsl(215,16%,47%)]">Daily Usage</p>
                  <p className="font-manrope font-bold text-2xl text-[hsl(222,47%,11%)]">{result.dailyUsage}L</p>
                </div>
                <div className="text-center p-4 bg-[hsl(214,100%,95%)] rounded-sm">
                  <p className="text-sm text-[hsl(215,16%,47%)]">Essential Backup</p>
                  <p className="font-manrope font-bold text-2xl text-[hsl(214,100%,40%)]">{result.essentialLitres.toLocaleString()}L</p>
                </div>
                <div className="text-center p-4 bg-[hsl(214,100%,40%)] rounded-sm text-white">
                  <p className="text-sm opacity-80">Full Backup</p>
                  <p className="font-manrope font-bold text-2xl">{result.totalLitres.toLocaleString()}L</p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white border border-[hsl(214,32%,91%)] rounded-sm p-6">
              <h3 className="font-manrope font-semibold text-lg text-[hsl(222,47%,11%)] mb-4">Recommended Tanks</h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-[hsl(210,40%,98%)] rounded-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase text-[hsl(215,16%,47%)]">Essential Backup</p>
                    <p className="font-semibold text-[hsl(222,47%,11%)]">{result.essentialTank.name}</p>
                    <p className="text-sm text-[hsl(215,16%,47%)]">{result.essentialTank.capacity}L capacity</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-manrope font-bold text-lg">{formatPrice(result.essentialTank.price)}</span>
                    <Link to="/contact">
                      <Button size="sm" className="bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white rounded-sm" data-testid="quote-essential-tank">
                        Quote <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-[hsl(214,100%,40%)] bg-[hsl(214,100%,98%)] rounded-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase text-[hsl(214,100%,40%)]">Recommended — Full Backup</p>
                    <p className="font-semibold text-[hsl(222,47%,11%)]">
                      {result.multipleTanks ? `${result.multipleTanks}x ${result.fullTank.name}` : result.fullTank.name}
                    </p>
                    <p className="text-sm text-[hsl(215,16%,47%)]">
                      {result.multipleTanks ? `${result.multipleTanks} x ${result.fullTank.capacity}L` : `${result.fullTank.capacity}L capacity`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-manrope font-bold text-lg">
                      {formatPrice(result.fullTank.price * (result.multipleTanks || 1))}
                    </span>
                    <Link to="/contact">
                      <Button size="sm" className="bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white rounded-sm" data-testid="quote-full-tank">
                        Quote <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-[hsl(215,16%,47%)]">
              These are estimates. <Link to="/contact" className="text-[hsl(214,100%,40%)] font-medium hover:underline">Contact us</Link> for a precise recommendation based on your setup.
            </p>
          </div>
        )}

        <Separator className="my-12" />
        <div className="text-center">
          <Link to="/shop?category=water-tanks">
            <Button variant="outline" className="rounded-sm" data-testid="browse-tanks-btn">Browse All Tanks</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
