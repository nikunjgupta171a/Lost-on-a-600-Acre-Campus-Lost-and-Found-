import { useStore } from '../store';
import { Link, useRouter } from '../router';
import { ItemCard } from '../components/ItemCard';
import { Img } from '../components/Img';
import { PageHeader } from '../components/PageHeader';
import { IMAGES, STAT_CARDS } from '../data';
import {
  Package, CheckCircle, ClipboardList, Users, ArrowRight, Search,
  FileMinus, FilePlus, Map, QrCode, ShieldCheck, Bell, Clock, TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

const ICONS: Record<string, typeof Package> = {
  Package, CheckCircle, ClipboardList, Users,
};

export function DashboardPage() {
  const { items, lostReports, claims } = useStore();
  const { navigate } = useRouter();
  const [heroSearch, setHeroSearch] = useState('');

  const recentFound = items.filter((i) => i.status === 'available').slice(0, 6);
  const recentLost = lostReports.slice(0, 3);
  const returned = items.filter((i) => i.status === 'returned').slice(0, 3);

  const quickActions = [
    { to: '/report-lost', label: 'Report Lost', desc: 'File a lost item report', icon: FileMinus, tone: 'navy' },
    { to: '/post-found', label: 'Post Found', desc: 'Submit a found item', icon: FilePlus, tone: 'orange' },
    { to: '/map', label: 'Campus Map', desc: 'View drop points & finds', icon: Map, tone: 'navy' },
    { to: '/qr', label: 'QR Drop Point', desc: 'Scan & deposit item', icon: QrCode, tone: 'orange' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-navy-600">
        <Img
          src={IMAGES.campusHero}
          alt="LPU Campus"
          fallbackIndex={0}
          fallbackLabel="LPU Campus"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-700 via-navy-600/80 to-transparent" />
        <div className="relative px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <span className="chip bg-orange-500/20 text-orange-200 ring-1 ring-orange-400/30">
            <ShieldCheck className="h-3.5 w-3.5" /> LPU Lost &amp; Found Network
          </span>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Lost Something on Campus?
          </h1>
          <p className="mt-3 max-w-lg text-base text-white/80">
            Your campus community is here to help you find what matters.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/report-lost" className="btn-primary">
              <FileMinus className="h-4 w-4" /> REPORT LOST ITEM
            </Link>
            <Link to="/post-found" className="btn-navy bg-white text-navy-600 hover:bg-navy-50">
              <FilePlus className="h-4 w-4" /> POST FOUND ITEM
            </Link>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/find?q=${encodeURIComponent(heroSearch.trim())}`);
            }}
            className="mt-7 flex max-w-md items-center gap-2 rounded-xl bg-white p-1.5 shadow-lift"
          >
            <Search className="ml-2 h-5 w-5 text-muted" />
            <input
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="Search wallet, ID card, laptop, bottle..."
              className="flex-1 bg-transparent py-2 text-sm text-ink placeholder:text-muted focus:outline-none"
            />
            <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map((s) => {
          const Icon = ICONS[s.icon];
          return (
            <div key={s.label} className="card flex items-center gap-4 p-5">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  s.tone === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-navy-50 text-navy-600'
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-ink">{s.value}</p>
                <p className="text-xs text-muted">{s.label}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {quickActions.map(({ to, label, desc, icon: Icon, tone }) => (
            <Link
              key={to}
              to={to}
              className="card group flex flex-col gap-3 p-5 transition hover:-translate-y-1 hover:shadow-lift"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                  tone === 'orange'
                    ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white'
                    : 'bg-navy-50 text-navy-600 group-hover:bg-navy-600 group-hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-ink">{label}</p>
                <p className="text-xs text-muted">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently Found */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Recently Found Items</h2>
            <p className="text-sm text-muted">Latest items discovered across campus</p>
          </div>
          <Link to="/find" className="flex items-center gap-1 text-sm font-semibold text-orange-600 hover:gap-2">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recentFound.slice(0, 4).map((item, i) => (
            <ItemCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* Two-column: Recent Lost + How it works */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Recently Reported Lost</h2>
            <Link to="/report-lost" className="text-sm font-semibold text-orange-600">Report Yours</Link>
          </div>
          <div className="space-y-3">
            {recentLost.map((r) => (
              <Link key={r.id} to="/claims" className="card flex items-center gap-4 p-4 transition hover:shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <FileMinus className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{r.name}</p>
                  <p className="truncate text-xs text-muted">Last seen at {r.lastSeenLocation}</p>
                </div>
                {r.matches && r.matches.length > 0 && (
                  <span className="chip bg-green-50 text-green-700 ring-1 ring-green-600/20">
                    {r.matches.length} match{r.matches.length > 1 ? 'es' : ''}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="card overflow-hidden">
          <div className="relative h-32">
            <Img src={IMAGES.howItWorks} alt="How it works" fallbackIndex={1} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-700 to-transparent" />
            <h3 className="absolute bottom-3 left-4 font-display text-lg font-semibold text-white">How It Works</h3>
          </div>
          <div className="space-y-4 p-5">
            {[
              { n: 1, t: 'Report or Post', d: 'File a lost report or post a found item in seconds.' },
              { n: 2, t: 'Get Matched', d: 'We auto-match lost & found entries and notify you.' },
              { n: 3, t: 'Verify & Collect', d: 'Answer 3 verification questions and collect from Security.' },
            ].map((step) => (
              <div key={step.n} className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  {step.n}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{step.t}</p>
                  <p className="text-xs text-muted">{step.d}</p>
                </div>
              </div>
            ))}
            <Link to="/info" className="btn-ghost w-full">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Recently Returned + Map preview */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">Recently Returned</h2>
          <div className="space-y-3">
            {returned.map((item) => (
              <Link key={item.id} to={`/item/${item.id}`} className="card flex items-center gap-4 p-3 transition hover:shadow-soft">
                <Img src={item.image} alt={item.name} fallbackIndex={2} className="h-14 w-14 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{item.name}</p>
                  <p className="truncate text-xs text-muted">{item.location}</p>
                </div>
                <span className="chip bg-green-50 text-green-700 ring-1 ring-green-600/20">
                  <CheckCircle className="h-3.5 w-3.5" /> Returned
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">Campus Map Preview</h2>
          <Link to="/map" className="card group relative block overflow-hidden">
            <Img src={IMAGES.campusAerial} alt="Campus Map" fallbackIndex={3} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-700/90 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div>
                <p className="font-display text-lg font-semibold text-white">Explore Campus Map</p>
                <p className="text-sm text-white/70">Find drop points & locations</p>
              </div>
              <span className="rounded-xl bg-orange-500 p-2.5 text-white transition group-hover:bg-orange-600">
                <Map className="h-5 w-5" />
              </span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
