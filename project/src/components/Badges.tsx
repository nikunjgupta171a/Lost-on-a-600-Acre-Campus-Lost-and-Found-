import type { ItemStatus, ClaimStatus, Category } from '../types';
import {
  Wallet, IdCard, ShoppingBag, Laptop, Droplet, Laptop2, Watch, Package,
} from 'lucide-react';
import type { ComponentType } from 'react';

export function StatusBadge({ status }: { status: ItemStatus }) {
  const map: Record<ItemStatus, { label: string; cls: string }> = {
    available: { label: 'Available', cls: 'bg-green-50 text-green-700 ring-green-600/20' },
    claimed: { label: 'Claimed', cls: 'bg-orange-50 text-orange-700 ring-orange-600/20' },
    returned: { label: 'Returned', cls: 'bg-navy-50 text-navy-600 ring-navy-500/20' },
    pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
  };
  const s = map[status];
  return <span className={`chip ring-1 ${s.cls}`}>{s.label}</span>;
}

export function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  const map: Record<ClaimStatus, { cls: string; dot: string }> = {
    Pending: { cls: 'bg-amber-50 text-amber-700 ring-amber-600/20', dot: 'bg-amber-500' },
    'Under Review': { cls: 'bg-navy-50 text-navy-600 ring-navy-500/20', dot: 'bg-navy-500' },
    Approved: { cls: 'bg-green-50 text-green-700 ring-green-600/20', dot: 'bg-green-500' },
    Rejected: { cls: 'bg-red-50 text-red-700 ring-red-600/20', dot: 'bg-red-500' },
  };
  const s = map[status];
  return (
    <span className={`chip ring-1 ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

export function CategoryIcon({ category, className = 'h-5 w-5' }: { category: Category; className?: string }) {
  const map: Record<Category, ComponentType<{ className?: string }>> = {
    Wallet: Wallet,
    'ID Card': IdCard,
    Bag: ShoppingBag,
    Laptop: Laptop,
    Bottle: Droplet,
    Electronics: Laptop2,
    Accessories: Watch,
    Other: Package,
  };
  const Icon = map[category] || Package;
  return <Icon className={className} />;
}

export function CategoryPill({ category, active, onClick }: { category: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`chip transition ${
        active
          ? 'bg-navy-600 text-white ring-1 ring-navy-600'
          : 'bg-white text-muted ring-1 ring-line hover:border-navy-300 hover:text-ink'
      }`}
    >
      {category}
    </button>
  );
}
