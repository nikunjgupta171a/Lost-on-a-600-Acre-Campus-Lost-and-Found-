import { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Img } from '../components/Img';
import { Link } from '../router';
import { IMAGES } from '../data';
import { QrCode, Smartphone, FilePlus, ShieldCheck, Package, ArrowRight, MapPin, Clock } from 'lucide-react';

// Lightweight QR code rendered as a CSS grid pattern (no external dependency)
function QRPlaceholder({ size = 200 }: { size?: number }) {
  const cells = 21;
  const grid: boolean[][] = [];
  // deterministic pseudo-random pattern
  for (let r = 0; r < cells; r++) {
    grid[r] = [];
    for (let c = 0; c < cells; c++) {
      const finder =
        (r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7);
      if (finder) {
        const inBorder = (r % 6 === 0 || c % 6 === 0) && ((r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7));
        const inCore = (r >= 2 && r <= 4 && c >= 2 && c <= 4) || (r >= 2 && r <= 4 && c >= cells - 5 && c <= cells - 3) || (r >= cells - 5 && r <= cells - 3 && c >= 2 && c <= 4);
        grid[r][c] = inBorder || inCore || ((r === 0 || r === 6 || c === 0 || c === 6) && (r < 7 && c < 7));
      } else {
        grid[r][c] = (r * 7 + c * 13 + r * c) % 3 === 0;
      }
    }
  }
  const cellSize = size / cells;
  return (
    <div className="relative rounded-2xl bg-white p-4 shadow-lift" style={{ width: size + 32, height: size + 32 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="white" />
        {grid.map((row, r) =>
          row.map((on, c) =>
            on ? <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize} fill="#101D3A" /> : null,
          ),
        )}
      </svg>
      <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-soft">
        <ShieldCheck className="h-3.5 w-3.5" /> LPU Lost &amp; Found
      </div>
    </div>
  );
}

export function QRDropPointPage() {
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (scanned) {
      const t = setTimeout(() => setScanned(false), 3000);
      return () => clearTimeout(t);
    }
  }, [scanned]);

  return (
    <div className="space-y-6">
      <PageHeader title="QR Drop Point" subtitle="Scan to quickly post a found item and deposit it at the Security Desk." />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-navy-600">
        <Img src={IMAGES.dropBox} alt="Drop box" fallbackIndex={1} className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-700 to-navy-600/60" />
        <div className="relative px-6 py-8 sm:px-10">
          <span className="chip bg-orange-500/20 text-orange-200 ring-1 ring-orange-400/30">
            <QrCode className="h-3.5 w-3.5" /> Quick Drop
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">FOUND SOMETHING? DROP IT HERE!</h2>
          <p className="mt-2 max-w-lg text-sm text-white/80">
            Scan the QR code with your phone camera to open the found-item form, fill in the details, and deposit the item at the Security Desk.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* QR */}
        <div className="card flex flex-col items-center gap-5 p-8">
          <QRPlaceholder size={220} />
          <div className="text-center">
            <p className="font-display text-lg font-semibold text-ink">Scan to Post Found Item</p>
            <p className="text-sm text-muted">Point your phone camera at the code</p>
          </div>
          <div className="flex w-full gap-2">
            <button onClick={() => setScanned(true)} className="btn-primary flex-1">
              <Smartphone className="h-4 w-4" /> Simulate Scan
            </button>
            <Link to="/post-found" className="btn-navy flex-1">
              <FilePlus className="h-4 w-4" /> Open Form
            </Link>
          </div>
          {scanned && (
            <div className="flex w-full items-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-700 animate-slide-up">
              <ShieldCheck className="h-4 w-4" /> Scanned! Redirecting to found-item form...
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="font-display text-lg font-semibold text-ink">How It Works</h3>
            <div className="mt-4 space-y-4">
              {[
                { icon: QrCode, t: 'Scan the QR code', d: 'Use your phone camera or any QR scanner app.' },
                { icon: FilePlus, t: 'Fill in found-item details', d: 'Add name, category, location, and a photo.' },
                { icon: ShieldCheck, t: 'Submit the information', d: 'A unique Item ID is generated for tracking.' },
                { icon: Package, t: 'Deposit at Security Desk', d: 'Hand over the item at the nearest drop point.' },
              ].map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <s.icon className="h-5 w-5" />
                    </div>
                    {i < 3 && <div className="mt-1 h-full w-px flex-1 bg-line" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-semibold text-ink">{i + 1}. {s.t}</p>
                    <p className="text-xs text-muted">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card overflow-hidden">
            <Img src={IMAGES.securityDesk} alt="Security Desk" fallbackIndex={2} className="h-32 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-ink">Security Desk</h3>
              <div className="mt-2 space-y-1.5 text-xs text-muted">
                <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Main Administrative Block, Ground Floor</p>
                <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Open 8:00 AM – 10:00 PM, all days</p>
                <p className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" /> Contact: ext. 2104</p>
              </div>
              <Link to="/map" className="mt-3 flex items-center justify-between rounded-xl bg-canvas p-3 transition hover:bg-navy-50">
                <span className="text-sm font-medium text-ink">View all drop points on map</span>
                <ArrowRight className="h-4 w-4 text-orange-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
