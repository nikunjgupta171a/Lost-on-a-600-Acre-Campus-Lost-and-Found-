import { Link, useRouter } from '../router';
import { Search, FilePlus, ClipboardList, User } from 'lucide-react';

const ITEMS = [
  { to: '/find', label: 'Find', icon: Search },
  { to: '/post-found', label: 'Post', icon: FilePlus },
  { to: '/claims', label: 'Claims', icon: ClipboardList },
  { to: '/settings', label: 'Profile', icon: User },
];

export function BottomNav() {
  const { path } = useRouter();
  const isActive = (to: string) => path.startsWith(to);
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-line bg-white/95 px-2 py-1.5 backdrop-blur lg:hidden">
      {ITEMS.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium transition ${
            isActive(to) ? 'text-orange-600' : 'text-muted'
          }`}
        >
          <Icon className="h-5 w-5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
