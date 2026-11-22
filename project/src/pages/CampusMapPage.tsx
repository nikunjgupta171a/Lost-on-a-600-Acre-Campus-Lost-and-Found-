import { useState } from 'react';
import { useStore } from '../store';
import { Link } from '../router';
import { PageHeader } from '../components/PageHeader';
import { Img } from '../components/Img';
import { CAMPUS_LOCATIONS, IMAGES, CATEGORIES_WITH_ALL } from '../data';
import { Modal } from '../components/Modal';
import { ItemCard } from '../components/ItemCard';
import { Search, MapPin, ZoomIn, ZoomOut, Layers, Navigation, X } from 'lucide-react';

export function CampusMapPage() {
  const { items } = useStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState('All Items');
  const [zoom, setZoom] = useState(1);
  const [search, setSearch] = useState('');

  const selectedLoc = CAMPUS_LOCATIONS.find((l) => l.id === selected);
  const locItems = selectedLoc
    ? items.filter((i) => i.location.toLowerCase().includes(selectedLoc.name.toLowerCase().split(',')[0].toLowerCase()) || i.location === selectedLoc.name)
    : [];

  const filteredLocs = CAMPUS_LOCATIONS.filter((l) =>
    search ? l.name.toLowerCase().includes(search.toLowerCase()) : true,
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Campus Map" subtitle="Explore drop points, security desks, and found items across LPU campus.">
        <Link to="/qr" className="btn-ghost"><Navigation className="h-4 w-4" /> QR Drop Points</Link>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Map */}
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 border-b border-line p-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search location..." className="input pl-9" />
              </div>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input w-auto">
                {CATEGORIES_WITH_ALL.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Map canvas */}
            <div className="relative h-[480px] overflow-hidden bg-navy-600">
              <Img src={IMAGES.campusAerial} alt="Campus aerial map" fallbackIndex={3} className="absolute inset-0 h-full w-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-navy-700/30" />

              {/* Grid overlay for illustrative feel */}
              <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Markers */}
              <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
                {filteredLocs.map((loc) => {
                  const isSecurity = loc.id === 'security';
                  return (
                    <button
                      key={loc.id}
                      onClick={() => setSelected(loc.id)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition hover:z-10"
                      style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                    >
                      <div className={`flex flex-col items-center ${selected === loc.id ? 'scale-125' : ''} transition`}>
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full shadow-lift ring-2 ring-white ${
                          isSecurity ? 'bg-orange-500' : loc.count > 0 ? 'bg-navy-600' : 'bg-white'
                        }`}>
                          <MapPin className={`h-5 w-5 ${isSecurity ? 'text-white' : loc.count > 0 ? 'text-white' : 'text-navy-600'}`} />
                        </div>
                        {loc.count > 0 && (
                          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                            {loc.count}
                          </span>
                        )}
                        <span className="mt-1 hidden whitespace-nowrap rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-navy-600 shadow-sm sm:block">
                          {loc.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Zoom controls */}
              <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-xl border border-white/30 bg-white/90 backdrop-blur">
                <button onClick={() => setZoom((z) => Math.min(2, z + 0.25))} className="p-2 text-navy-600 hover:bg-navy-50">
                  <ZoomIn className="h-4 w-4" />
                </button>
                <div className="h-px bg-line" />
                <button onClick={() => setZoom((z) => Math.max(0.75, z - 0.25))} className="p-2 text-navy-600 hover:bg-navy-50">
                  <ZoomOut className="h-4 w-4" />
                </button>
              </div>

              {/* Legend */}
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 rounded-xl bg-white/90 p-3 backdrop-blur">
                <span className="flex items-center gap-1.5 text-xs font-medium text-ink">
                  <span className="h-3 w-3 rounded-full bg-orange-500" /> Security Desk
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-ink">
                  <span className="h-3 w-3 rounded-full bg-navy-600" /> Found Items
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-ink">
                  <span className="h-3 w-3 rounded-full bg-white ring-1 ring-navy-300" /> Location
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Locations list */}
        <div className="card h-fit p-4">
          <h3 className="mb-3 font-display text-sm font-semibold text-ink">Campus Locations</h3>
          <div className="space-y-2">
            {CAMPUS_LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelected(loc.id)}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                  selected === loc.id ? 'border-orange-500 bg-orange-50' : 'border-line hover:bg-canvas'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    loc.id === 'security' ? 'bg-orange-100 text-orange-600' : 'bg-navy-50 text-navy-600'
                  }`}>
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{loc.name}</p>
                    {loc.count > 0 && <p className="text-xs text-muted">{loc.count} item{loc.count > 1 ? 's' : ''}</p>}
                  </div>
                </div>
                {loc.count > 0 && <span className="chip bg-orange-50 text-orange-700">{loc.count}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Modal open={!!selectedLoc} onClose={() => setSelected(null)} title={selectedLoc?.name}>
        {selectedLoc && (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              {selectedLoc.id === 'security'
                ? 'The central Security Desk where all found items are deposited and verified.'
                : `${locItems.length} found item${locItems.length !== 1 ? 's' : ''} registered at this location.`}
            </p>
            {locItems.length > 0 ? (
              <div className="space-y-2">
                {locItems.slice(0, 5).map((it) => (
                  <Link key={it.id} to={`/item/${it.id}`} onClick={() => setSelected(null)} className="flex items-center gap-3 rounded-xl border border-line p-2.5 transition hover:bg-canvas">
                    <img src={it.image} alt={it.name} className="h-10 w-10 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{it.name}</p>
                      <p className="text-xs text-muted">{it.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-canvas p-3 text-center text-sm text-muted">No items at this location currently.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
