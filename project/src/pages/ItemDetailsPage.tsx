import { useState } from 'react';
import { useStore } from '../store';
import { Link, useRouter } from '../router';
import { Img } from '../components/Img';
import { ItemCard } from '../components/ItemCard';
import { StatusBadge, CategoryIcon, ClaimStatusBadge } from '../components/Badges';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { ClaimVerificationForm } from './ClaimVerificationPage';
import {
  MapPin, Calendar, User, Phone, ShieldCheck, Lock, ArrowLeft, ArrowRight,
  CheckCircle, Clock, Info, Tag, Hash,
} from 'lucide-react';

export function ItemDetailsPage() {
  const { items, claims, addClaim, user } = useStore();
  const { params, navigate } = useRouter();
  const { notify } = useToast();
  const [showClaim, setShowClaim] = useState(false);

  const item = items.find((i) => i.id === params.id);

  if (!item) {
    return (
      <div className="card flex flex-col items-center gap-4 py-20 text-center">
        <p className="font-display text-xl font-semibold text-ink">Item not found</p>
        <Link to="/find" className="btn-primary">Back to Find Items</Link>
      </div>
    );
  }

  const similar = items
    .filter((i) => i.id !== item.id && i.category === item.category && i.status === 'available')
    .slice(0, 4);

  const itemClaims = claims.filter((c) => c.itemId === item.id);

  return (
    <div className="space-y-6">
      <Link to="/find" className="flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to Find Items
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Image */}
        <div className="card overflow-hidden">
          <div className="relative aspect-[4/3] bg-navy-100">
            <Img src={item.image} alt={item.name} fallbackIndex={0} className="h-full w-full object-cover" />
            <div className="absolute left-3 top-3 flex gap-2">
              <span className="chip bg-white/95 text-navy-600 shadow-sm backdrop-blur">
                <CategoryIcon category={item.category} className="h-3.5 w-3.5" /> {item.category}
              </span>
            </div>
            <div className="absolute right-3 top-3">
              <StatusBadge status={item.status} />
            </div>
          </div>
          {item.verified && (
            <div className="flex items-center gap-2 border-t border-line px-4 py-3 text-xs font-medium text-green-700">
              <ShieldCheck className="h-4 w-4" /> Verified by Security Desk
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted">
              <Hash className="h-3.5 w-3.5" /> {item.id}
            </div>
            <h1 className="mt-1 font-display text-2xl font-bold text-ink">{item.name}</h1>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoTile icon={MapPin} label="Location" value={item.location} />
            <InfoTile icon={Calendar} label="Date Found" value={new Date(item.dateFound).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
            <InfoTile icon={Tag} label="Category" value={item.category} />
            <InfoTile icon={User} label="Finder" value={item.finderName} />
          </div>

          <div>
            <p className="label">Description</p>
            <p className="text-sm leading-relaxed text-muted">{item.description}</p>
          </div>

          {/* Security notice */}
          <div className="flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
            <Lock className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
            <div>
              <p className="text-sm font-semibold text-orange-800">Security Notice</p>
              <p className="text-xs text-orange-700">
                Certain item details are hidden to protect against fraudulent claims. These are only revealed during ownership verification.
              </p>
            </div>
          </div>

          {item.deposited && (
            <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-700">
              <CheckCircle className="h-4 w-4" /> Item deposited at Security Desk
            </div>
          )}

          {item.status === 'available' ? (
            <button onClick={() => setShowClaim(true)} className="btn-primary w-full text-base">
              <ShieldCheck className="h-5 w-5" /> CLAIM THIS ITEM
            </button>
          ) : item.status === 'claimed' ? (
            <div className="rounded-xl bg-orange-50 p-4 text-center text-sm font-medium text-orange-700">
              This item has been claimed and is under verification.
            </div>
          ) : (
            <div className="rounded-xl bg-navy-50 p-4 text-center text-sm font-medium text-navy-600">
              This item has been returned to its owner.
            </div>
          )}

          {itemClaims.length > 0 && (
            <div className="card p-4">
              <p className="mb-2 text-sm font-semibold text-ink">Claims on this item</p>
              <div className="space-y-2">
                {itemClaims.map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted">{c.claimId}</span>
                    <ClaimStatusBadge status={c.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Claim instructions */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Claim Instructions</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { n: 1, t: 'Click Claim', d: 'Start the ownership verification process.' },
            { n: 2, t: 'Answer 3 Questions', d: 'Describe the colour, contents, and unique marks.' },
            { n: 3, t: 'Collect from Security', d: 'Once approved, collect the item from the Security Desk.' },
          ].map((s) => (
            <div key={s.n} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">{s.n}</div>
              <div>
                <p className="text-sm font-semibold text-ink">{s.t}</p>
                <p className="text-xs text-muted">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location info */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Location Information</h2>
        <p className="mt-1 text-sm text-muted">{item.location}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/map" className="btn-ghost">View on Campus Map</Link>
          <Link to="/qr" className="btn-ghost">QR Drop Point</Link>
        </div>
      </div>

      {/* Similar items */}
      {similar.length > 0 && (
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">Similar Found Items</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((it, i) => <ItemCard key={it.id} item={it} index={i} />)}
          </div>
        </div>
      )}

      <Modal open={showClaim} onClose={() => setShowClaim(false)} title="Verify Item Ownership" maxWidth="max-w-xl">
        <ClaimVerificationForm
          item={item}
          userName={user.name}
          userContact={user.email}
          onSubmit={(data) => {
            const claim = addClaim({
              itemId: item.id,
              color: data.color,
              contents: data.contents,
              uniqueMarks: data.uniqueMarks,
              claimantName: user.name,
              claimantContact: user.email,
            });
            setShowClaim(false);
            notify(`Claim ${claim.claimId} submitted successfully!`);
            navigate('/claims');
          }}
        />
      </Modal>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="card flex items-start gap-3 p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-500">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="truncate text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}
