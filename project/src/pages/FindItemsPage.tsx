import { useMemo, useState, useEffect } from 'react';
import { useStore } from '../store';
import { useRouter } from '../router';
import { ItemCard } from '../components/ItemCard';
import { PageHeader } from '../components/PageHeader';
import { CategoryPill } from '../components/Badges';
import { CATEGORIES_WITH_ALL, LOCATIONS } from '../data';
import type { Category } from '../types';
import { Search, LayoutGrid, List, Map as MapIcon, SlidersHorizontal, X } from 'lucide-react';
import { Link } from '../router';

export function FindItemsPage() {
  const { items } = useStore();
  const { path, navigate } = useRouter();

  // parse query params from hash like /find?q=wallet&cat=Wallet
  const initial = useMemo(() => {
    const qs = path.split('?')[1] || '';
    const p = new URLSearchParams(qs);
    return { q: p.get('q') || '', cat: p.get('cat') || 'All Items' };
  }, [path]);

  const [query, setQuery] = useState(initial.q);
  const [category, setCategory] = useState<string>(initial.cat);
  const [location, setLocation] = useState('All Locations');
  const [sort, setSort] = useState('recent');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setQuery(initial.q);
    setCategory(initial.cat);
  }, [initial]);

  const filtered = useMemo(() => {
    let list = items.filter((i) => i.status !== 'returned');
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q),
      );
    }
    if (category !== 'All Items') list = list.filter((i) => i.category === category);
    if (location !== 'All Locations') list = list.filter((i) => i.location === location);
    if (sort === 'recent') list = [...list].sort((a, b) => +new Date(b.dateFound) - +new Date(a.dateFound));
    if (sort === 'oldest') list = [...list].sort((a, b) => +new Date(a.dateFound) - +new Date(b.dateFound));
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [items, query, category, location, sort]);

  const resetFilters = () => {
    setQuery('');
    setCategory('All Items');
    setLocation('All Locations');
    setSort('recent');
    navigate('/find');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Find Your Lost Belongings" subtitle="Browse recently discovered items across the university campus.">
        <Link to="/map" className="btn-ghost">
          <MapIcon className="h-4 w-4" /> Map View
        </Link>
      </PageHeader>

      {/* Search + filter toggle */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items, locations, categories..."
            className="input pl-10"
          />
        </div>
        <button onClick={() => setShowFilters((s) => !s)} className="btn-ghost lg:hidden">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
        <div className="hidden items-center gap-2 lg:flex">
          <select value={location} onChange={(e) => setLocation(e.target.value)} className="input w-auto">
            <option>All Locations</option>
            {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input w-auto">
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A-Z)</option>
          </select>
          <div className="flex overflow-hidden rounded-xl border border-line">
            <button onClick={() => setView('grid')} className={`p-2.5 ${view === 'grid' ? 'bg-navy-600 text-white' : 'bg-white text-muted'}`}>
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button onClick={() => setView('list')} className={`p-2.5 ${view === 'list' ? 'bg-navy-600 text-white' : 'bg-white text-muted'}`}>
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile filters */}
      {showFilters && (
        <div className="card grid grid-cols-2 gap-3 p-4 lg:hidden">
          <select value={location} onChange={(e) => setLocation(e.target.value)} className="input">
            <option>All Locations</option>
            {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input">
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      )}

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES_WITH_ALL.map((c) => (
          <CategoryPill key={c} category={c} active={category === c} onClick={() => setCategory(c)} />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          {filtered.length} item{filtered.length !== 1 ? 's' : ''} found
        </p>
        {(query || category !== 'All Items' || location !== 'All Locations') && (
          <button onClick={resetFilters} className="flex items-center gap-1 text-sm font-medium text-orange-600">
            <X className="h-4 w-4" /> Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-50 text-navy-300">
            <Search className="h-8 w-8" />
          </div>
          <p className="font-semibold text-ink">No items match your search</p>
          <p className="text-sm text-muted">Try different keywords or clear your filters.</p>
          <Link to="/report-lost" className="btn-primary mt-2">Report a Lost Item</Link>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item, i) => (
            <ItemCard key={item.id} item={item} index={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Link key={item.id} to={`/item/${item.id}`} className="card flex items-center gap-4 p-3 transition hover:shadow-soft">
              <img src={item.image} alt={item.name} className="h-20 w-28 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{item.name}</p>
                <p className="text-xs text-muted">{item.location} · {item.category}</p>
                <p className="mt-1 text-xs text-muted">{item.id}</p>
              </div>
              <span className="hidden chip bg-navy-50 text-navy-600 ring-1 ring-navy-500/20 sm:inline-flex">View</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
