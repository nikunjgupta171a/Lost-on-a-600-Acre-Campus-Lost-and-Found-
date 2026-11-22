import { useState } from 'react';
import { useStore } from '../store';
import { Link } from '../router';
import { PageHeader } from '../components/PageHeader';
import { ClaimStatusBadge, StatusBadge, CategoryIcon } from '../components/Badges';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import type { Claim, ClaimStatus, Item } from '../types';
import {
  Package, CheckCircle, ClipboardList, Users, TrendingUp, Search,
  Check, X, Eye, Filter, ArrowRight, ShieldCheck, RotateCcw,
} from 'lucide-react';

export function AdminPage() {
  const { items, lostReports, claims, updateClaimStatus, updateItemStatus, user } = useStore();
  const { notify } = useToast();
  const [tab, setTab] = useState<'overview' | 'claims' | 'items' | 'lost'>('overview');
  const [search, setSearch] = useState('');
  const [reviewClaim, setReviewClaim] = useState<Claim | null>(null);
  const [viewItem, setViewItem] = useState<Item | null>(null);

  const stats = [
    { label: 'Total Found Items', value: items.length, icon: Package, tone: 'navy' },
    { label: 'Total Lost Reports', value: lostReports.length, icon: ClipboardList, tone: 'orange' },
    { label: 'Pending Claims', value: claims.filter((c) => c.status === 'Pending' || c.status === 'Under Review').length, icon: Eye, tone: 'navy' },
    { label: 'Returned Items', value: items.filter((i) => i.status === 'returned').length, icon: CheckCircle, tone: 'orange' },
  ];

  const filteredClaims = claims.filter((c) => {
    if (!search) return true;
    const item = items.find((i) => i.id === c.itemId);
    const q = search.toLowerCase();
    return c.claimId.toLowerCase().includes(q) || c.claimantName.toLowerCase().includes(q) || (item?.name.toLowerCase().includes(q) ?? false);
  });

  const filteredItems = items.filter((i) =>
    !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()),
  );

  const approve = (c: Claim) => {
    updateClaimStatus(c.id, 'Approved');
    updateItemStatus(c.itemId, 'returned');
    setReviewClaim(null);
    notify(`Claim ${c.claimId} approved. Item marked as returned.`);
  };

  const reject = (c: Claim) => {
    updateClaimStatus(c.id, 'Rejected');
    setReviewClaim(null);
    notify(`Claim ${c.claimId} rejected.`, 'error');
  };

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'claims', label: 'Review Claims' },
    { id: 'items', label: 'Manage Items' },
    { id: 'lost', label: 'Lost Reports' },
  ] as const;

  return (
    <div className="space-y-6">
      <PageHeader title="Security Dashboard" subtitle="Administrative control centre for campus Lost & Found operations.">
        <span className="chip bg-orange-50 text-orange-700 ring-1 ring-orange-600/20">
          <ShieldCheck className="h-3.5 w-3.5" /> {user.role === 'admin' ? 'Admin Mode' : 'Student View'}
        </span>
      </PageHeader>

      {user.role !== 'admin' && (
        <div className="card flex items-center gap-3 border-amber-200 bg-amber-50 p-4">
          <ShieldCheck className="h-5 w-5 text-amber-600" />
          <p className="text-sm text-amber-800">
            You are viewing the admin dashboard in student mode. Switch to admin from your profile menu to manage claims and items.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4 p-5">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.tone === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-navy-50 text-navy-600'}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-ink">{s.value}</p>
              <p className="text-xs text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.id ? 'text-orange-600' : 'text-muted hover:text-ink'
            }`}
          >
            {t.label}
            {tab === t.id && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-orange-500" />}
          </button>
        ))}
      </div>

      {/* Search */}
      {tab !== 'overview' && (
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="input pl-10" />
        </div>
      )}

      {/* Overview */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="mb-4 font-display text-base font-semibold text-ink">Pending Claim Reviews</h3>
            <div className="space-y-3">
              {claims.filter((c) => c.status === 'Pending' || c.status === 'Under Review').slice(0, 5).map((c) => {
                const item = items.find((i) => i.id === c.itemId);
                return (
                  <div key={c.id} className="flex items-center gap-3 rounded-xl border border-line p-3">
                    {item && <img src={item.image} alt="" className="h-10 w-10 rounded-lg object-cover" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{item?.name}</p>
                      <p className="text-xs text-muted">{c.claimId} · {c.claimantName}</p>
                    </div>
                    <ClaimStatusBadge status={c.status} />
                    <button onClick={() => setReviewClaim(c)} className="rounded-lg bg-navy-600 p-1.5 text-white transition hover:bg-navy-700">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
              {claims.filter((c) => c.status === 'Pending' || c.status === 'Under Review').length === 0 && (
                <p className="py-6 text-center text-sm text-muted">No pending claims.</p>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="mb-4 font-display text-base font-semibold text-ink">Recent Found Items</h3>
            <div className="space-y-2">
              {items.slice(0, 5).map((it) => (
                <div key={it.id} className="flex items-center gap-3 rounded-xl border border-line p-2.5">
                  <img src={it.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{it.name}</p>
                    <p className="text-xs text-muted">{it.id} · {it.location}</p>
                  </div>
                  <StatusBadge status={it.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Claims */}
      {tab === 'claims' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-canvas text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Claim ID</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Claimant</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredClaims.map((c) => {
                  const item = items.find((i) => i.id === c.itemId);
                  return (
                    <tr key={c.id} className="transition hover:bg-canvas">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-navy-600">{c.claimId}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {item && <img src={item.image} alt="" className="h-8 w-8 rounded-lg object-cover" />}
                          <span className="font-medium text-ink">{item?.name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted">{c.claimantName}</td>
                      <td className="px-4 py-3 text-xs text-muted">{new Date(c.submittedAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3"><ClaimStatusBadge status={c.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => setReviewClaim(c)} className="rounded-lg bg-navy-50 p-1.5 text-navy-600 transition hover:bg-navy-600 hover:text-white" title="Review">
                            <Eye className="h-4 w-4" />
                          </button>
                          {c.status !== 'Approved' && (
                            <button onClick={() => approve(c)} className="rounded-lg bg-green-50 p-1.5 text-green-600 transition hover:bg-green-600 hover:text-white" title="Approve">
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          {c.status !== 'Rejected' && (
                            <button onClick={() => reject(c)} className="rounded-lg bg-red-50 p-1.5 text-red-600 transition hover:bg-red-600 hover:text-white" title="Reject">
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Items */}
      {tab === 'items' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-canvas text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Item ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredItems.map((it) => (
                  <tr key={it.id} className="transition hover:bg-canvas">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-navy-600">{it.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src={it.image} alt="" className="h-8 w-8 rounded-lg object-cover" />
                        <span className="font-medium text-ink">{it.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-muted"><CategoryIcon category={it.category} className="h-4 w-4" /> {it.category}</span>
                    </td>
                    <td className="px-4 py-3 text-muted">{it.location}</td>
                    <td className="px-4 py-3"><StatusBadge status={it.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setViewItem(it)} className="rounded-lg bg-navy-50 p-1.5 text-navy-600 transition hover:bg-navy-600 hover:text-white" title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                        {it.status === 'available' && (
                          <button onClick={() => { updateItemStatus(it.id, 'returned'); notify(`${it.name} marked as returned.`); }} className="rounded-lg bg-green-50 p-1.5 text-green-600 transition hover:bg-green-600 hover:text-white" title="Mark returned">
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {it.status !== 'available' && (
                          <button onClick={() => { updateItemStatus(it.id, 'available'); notify(`${it.name} marked as available.`); }} className="rounded-lg bg-amber-50 p-1.5 text-amber-600 transition hover:bg-amber-600 hover:text-white" title="Mark available">
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lost reports */}
      {tab === 'lost' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-canvas text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Report ID</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Last Seen</th>
                  <th className="px-4 py-3">Date Lost</th>
                  <th className="px-4 py-3">Matches</th>
                  <th className="px-4 py-3 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {lostReports.map((r) => (
                  <tr key={r.id} className="transition hover:bg-canvas">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-navy-600">{r.id}</td>
                    <td className="px-4 py-3 font-medium text-ink">{r.name}</td>
                    <td className="px-4 py-3 text-muted">{r.lastSeenLocation}</td>
                    <td className="px-4 py-3 text-xs text-muted">{new Date(r.dateLost).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      {r.matches && r.matches.length > 0 ? (
                        <span className="chip bg-green-50 text-green-700 ring-1 ring-green-600/20">{r.matches.length} match{r.matches.length > 1 ? 'es' : ''}</span>
                      ) : (
                        <span className="text-xs text-muted">No matches</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={r.matches?.[0] ? `/item/${r.matches[0]}` : '/find'} className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                        View <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review claim modal */}
      <Modal open={!!reviewClaim} onClose={() => setReviewClaim(null)} title="Review Ownership Claim" maxWidth="max-w-xl">
        {reviewClaim && (() => {
          const item = items.find((i) => i.id === reviewClaim.itemId);
          return (
            <div className="space-y-4">
              {item && (
                <div className="flex items-center gap-4 rounded-xl bg-canvas p-3">
                  <img src={item.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <div>
                    <p className="font-semibold text-ink">{item.name}</p>
                    <p className="text-xs text-muted">{item.id} · {item.location}</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted">Claim ID</p><p className="font-mono font-medium text-navy-600">{reviewClaim.claimId}</p></div>
                <div><p className="text-xs text-muted">Claimant</p><p className="font-medium text-ink">{reviewClaim.claimantName}</p></div>
                <div><p className="text-xs text-muted">Contact</p><p className="font-medium text-ink">{reviewClaim.claimantContact}</p></div>
                <div><p className="text-xs text-muted">Submitted</p><p className="font-medium text-ink">{new Date(reviewClaim.submittedAt).toLocaleDateString('en-IN')}</p></div>
              </div>
              <div className="rounded-xl border border-line p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Verification Answers</p>
                <dl className="space-y-2 text-sm">
                  <div><dt className="text-muted">Colour:</dt><dd className="font-medium text-ink">{reviewClaim.color}</dd></div>
                  <div><dt className="text-muted">Contents:</dt><dd className="font-medium text-ink">{reviewClaim.contents}</dd></div>
                  <div><dt className="text-muted">Unique marks:</dt><dd className="font-medium text-ink">{reviewClaim.uniqueMarks}</dd></div>
                </dl>
              </div>
              {item && (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-700">Hidden Details (for verification)</p>
                  <p className="mt-1 text-sm text-orange-800">{item.hiddenDetails}</p>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-line pt-4">
                <ClaimStatusBadge status={reviewClaim.status} />
                <div className="flex gap-2">
                  <button onClick={() => reject(reviewClaim)} className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100">
                    <X className="mr-1 inline h-4 w-4" /> Reject
                  </button>
                  <button onClick={() => approve(reviewClaim)} className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
                    <Check className="mr-1 inline h-4 w-4" /> Approve &amp; Return
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* View item modal */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="Item Details">
        {viewItem && (
          <div className="space-y-3">
            <img src={viewItem.image} alt="" className="h-40 w-full rounded-xl object-cover" />
            <p className="font-semibold text-ink">{viewItem.name}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-muted">ID: <span className="font-mono font-medium text-navy-600">{viewItem.id}</span></p>
              <p className="text-muted">Category: <span className="font-medium text-ink">{viewItem.category}</span></p>
              <p className="text-muted">Location: <span className="font-medium text-ink">{viewItem.location}</span></p>
              <p className="text-muted">Status: <StatusBadge status={viewItem.status} /></p>
            </div>
            <p className="text-sm text-muted">{viewItem.description}</p>
            <div className="rounded-xl bg-canvas p-3 text-sm">
              <p className="text-xs font-semibold uppercase text-muted">Hidden details</p>
              <p className="text-ink">{viewItem.hiddenDetails}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
