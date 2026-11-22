import type { Item } from '../types';
import { Img } from './Img';
import { StatusBadge, CategoryIcon } from './Badges';
import { Link } from '../router';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

function timeAgo(iso: string) {
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff <= 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 30) return `${diff} days ago`;
  const m = Math.floor(diff / 30);
  return `${m} month${m > 1 ? 's' : ''} ago`;
}

export function ItemCard({ item, index = 0 }: { item: Item; index?: number }) {
  return (
    <Link
      to={`/item/${item.id}`}
      className="group card flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-100">
        <Img
          src={item.image}
          alt={item.name}
          fallbackIndex={index}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <span className="chip bg-white/95 text-navy-600 shadow-sm backdrop-blur">
            <CategoryIcon category={item.category} className="h-3.5 w-3.5" />
            {item.category}
          </span>
        </div>
        <div className="absolute right-3 top-3">
          <StatusBadge status={item.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-semibold text-ink transition group-hover:text-orange-600">
          {item.name}
        </h3>
        <div className="mt-2 flex flex-col gap-1.5 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {item.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Found {timeAgo(item.dateFound)}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <span className="text-xs font-medium text-muted">{item.id}</span>
          <span className="flex items-center gap-1 text-xs font-semibold text-orange-600 transition group-hover:gap-2">
            View Details <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
