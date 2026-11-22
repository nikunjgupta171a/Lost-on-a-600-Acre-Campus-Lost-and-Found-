import { useState } from 'react';
import { useStore } from '../store';
import { Link } from '../router';
import { PageHeader } from '../components/PageHeader';
import { ClaimStatusBadge } from '../components/Badges';
import type { ClaimStatus } from '../types';
import { Search, ClipboardList, ArrowRight, Calendar, Inbox } from 'lucide-react';

const FILTERS: ('All' | ClaimStatus)[] = ['All', 'Pending', 'Under Review', 'Approved', 'Rejected'];

export function MyClaimsPage() {
  const { claims, items } = useStore();
  const [filter, setFilter] = useState<'All' | ClaimStatus>('All');
  const [search, setSearch] = useState('');

  const filtered = claims.filter((c) => {
    if (filter !== 'All' && c.status !== filter) return false;
    if (search) {
      const item = items.find((i) => i.id === c.itemId);
      const q = search.toLowerCase();
      return c.claimId.toLowerCase().includes(q) || (item?.name.toLowerCase().includes(q) ?? false);
    }
    return true;
  });

  const counts = FILTERS.reduce<Record<string, number>>((acc, f) => {
    acc[f] = f === 'All' ? claims.length : claims.filter((c) => c.status === f).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader title="My Claims" subtitle="Track the status of your ownership claims." />

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {FILTERS.slice(1).map((f) => (
          <div key={f} className="card p-4">
            <p className="font-display text-2xl font-bold text-ink">{counts[f]}</p>
            <p className="text-xs text-muted">{f}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by claim ID or item name..." className="input pl-10" />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`chip ring-1 transition ${
                filter === f ? 'bg-navy-600 text-white ring-navy-600' : 'bg-white text-muted ring-line hover:text-ink'
              }`}
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-50 text-navy-300">
            <Inbox className="h-8 w-8" />
          </div>
          <p className="font-semibold text-ink">No claims yet</p>
          <p className="text-sm text-muted">When you claim an item, it will appear here.</p>
          <Link to="/find" className="btn-primary mt-1">Find Items to Claim</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((claim) => {
            const item = items.find((i) => i.id === claim.itemId);
            const progress = claim.status === 'Pending' ? 25 : claim.status === 'Under Review' ? 50 : claim.status === 'Approved' ? 100 : 100;
            return (
              <Link key={claim.id} to={item ? `/item/${item.id}` : '/find'} className="card group flex flex-col gap-4 p-4 transition hover:shadow-soft sm:flex-row sm:items-center">
                {item && <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-semibold text-ink">{item?.name || 'Unknown item'}</p>
                    <ClaimStatusBadge status={claim.status} />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span className="font-mono font-medium text-navy-600">{claim.claimId}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(claim.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    {item && <span>{item.location}</span>}
                  </div>
                  {/* progress */}
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
                    <div
                      className={`h-full rounded-full transition-all ${claim.status === 'Rejected' ? 'bg-red-500' : 'bg-orange-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted transition group-hover:text-orange-600 sm:block" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
