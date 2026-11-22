import { useState, useRef, useEffect } from 'react';
import { useRouter, Link } from '../router';
import { useStore } from '../store';
import { Bell, Search, ChevronDown, User, Settings, LogOut, ShieldCheck } from 'lucide-react';

export function Header({ onMenu }: { onMenu: () => void }) {
  const { user, notifications, markAllRead, setRole } = useStore();
  const { navigate } = useRouter();
  const [showNotif, setShowNotif] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/95 px-4 backdrop-blur lg:px-6">
      <button
        onClick={onMenu}
        className="rounded-lg border border-line bg-white p-2 text-ink transition hover:bg-canvas lg:hidden"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) navigate(`/find?q=${encodeURIComponent(query.trim())}`);
        }}
        className="relative flex-1 max-w-xl"
      >
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for items, locations or categories..."
          className="input pl-10"
        />
      </form>

      <div className="flex-1 lg:hidden" />

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotif((s) => !s);
              if (!showNotif) markAllRead();
            }}
            className="relative rounded-xl border border-line bg-white p-2.5 text-ink transition hover:bg-canvas"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-line bg-white p-2 shadow-lift animate-scale-in">
              <p className="px-3 py-2 text-sm font-semibold text-ink">Notifications</p>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="px-3 py-6 text-center text-sm text-muted">No notifications yet.</p>
                )}
                {notifications.map((n) => (
                  <div key={n.id} className="rounded-xl px-3 py-2.5 transition hover:bg-canvas">
                    <p className="text-sm text-ink">{n.text}</p>
                    <p className="mt-0.5 text-xs text-muted">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu((s) => !s)}
            className="flex items-center gap-2.5 rounded-xl border border-line bg-white py-1.5 pl-1.5 pr-3 transition hover:bg-canvas"
          >
            <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-lg object-cover" />
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-tight text-ink">{user.name}</p>
              <p className="text-xs text-muted">{user.role === 'admin' ? 'Security Admin' : 'Student'}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-muted sm:block" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-line bg-white p-2 shadow-lift animate-scale-in">
              <div className="border-b border-line px-3 py-2.5">
                <p className="text-sm font-semibold text-ink">{user.name}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
              <Link to="/settings" onClick={() => setShowMenu(false)} className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink transition hover:bg-canvas">
                <User className="h-4 w-4 text-muted" /> My Profile
              </Link>
              <Link to="/settings" onClick={() => setShowMenu(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink transition hover:bg-canvas">
                <Settings className="h-4 w-4 text-muted" /> Preferences
              </Link>
              <button
                onClick={() => {
                  setRole(user.role === 'admin' ? 'student' : 'admin');
                  setShowMenu(false);
                  navigate(user.role === 'admin' ? '/' : '/admin');
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink transition hover:bg-canvas"
              >
                <ShieldCheck className="h-4 w-4 text-muted" />
                {user.role === 'admin' ? 'Switch to Student' : 'Switch to Admin'}
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
