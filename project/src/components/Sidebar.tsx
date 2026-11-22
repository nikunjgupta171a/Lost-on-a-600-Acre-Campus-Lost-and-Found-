import { useState } from 'react';
import { Link, useRouter } from '../router';
import { useStore } from '../store';
import {
  LayoutDashboard, Search, FileMinus, FilePlus, Map, QrCode, ClipboardList,
  Info, Settings, LifeBuoy, LogOut, ShieldCheck, X, Menu,
} from 'lucide-react';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/find', label: 'Find Items', icon: Search },
  { to: '/report-lost', label: 'Report Lost', icon: FileMinus },
  { to: '/post-found', label: 'Post Found', icon: FilePlus },
  { to: '/map', label: 'Campus Map', icon: Map },
  { to: '/qr', label: 'QR Drop Point', icon: QrCode },
  { to: '/claims', label: 'My Claims', icon: ClipboardList },
  { to: '/info', label: 'Useful Information', icon: Info },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { path } = useRouter();
  const { user } = useStore();

  const isActive = (to: string) => (to === '/' ? path === '/' : path.startsWith(to));

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-navy-900/50 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-navy-600 text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 shadow-soft">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-base font-bold leading-tight">Campus Lost &amp; Found</h1>
              <p className="text-xs text-white/60">LPU Campus</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">Menu</p>
          <ul className="space-y-1">
            {NAV.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={onClose}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive(to) ? 'bg-orange-500 text-white shadow-soft' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {isActive(to) && <span className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-orange-300" />}
                  <Icon className="h-5 w-5 shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {user.role === 'admin' && (
            <>
              <p className="px-3 pb-2 pt-5 text-[10px] font-semibold uppercase tracking-wider text-white/40">Administration</p>
              <Link
                to="/admin"
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive('/admin') ? 'bg-orange-500 text-white shadow-soft' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ShieldCheck className="h-5 w-5 shrink-0" />
                Security Dashboard
              </Link>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-3 py-4">
          <Link
            to="/info"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <LifeBuoy className="h-5 w-5" /> Help &amp; Support
          </Link>
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
            <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-orange-500/40" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-white/50">{user.studentId}</p>
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="rounded-lg p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export function MobileNavToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-line bg-white p-2 text-ink transition hover:bg-canvas lg:hidden"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
