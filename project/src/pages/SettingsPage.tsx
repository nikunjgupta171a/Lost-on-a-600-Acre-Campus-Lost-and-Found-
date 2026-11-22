import { useState } from 'react';
import { useStore } from '../store';
import { useToast } from '../components/Toast';
import { PageHeader } from '../components/PageHeader';
import { Img } from '../components/Img';
import {
  User, Mail, IdCard, Building, Camera, Sun, Moon, Globe, Bell,
  Eye, LifeBuoy, Bug, Save, ShieldCheck, LogOut, Palette,
} from 'lucide-react';

export function SettingsPage() {
  const { user, resetData } = useStore();
  const { notify } = useToast();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [notifClaims, setNotifClaims] = useState(true);
  const [notifMatches, setNotifMatches] = useState(true);
  const [notifSecurity, setNotifSecurity] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    notify('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account, preferences, and accessibility options." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="card p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="h-24 w-24 rounded-2xl object-cover ring-4 ring-orange-500/20" />
              <button className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white shadow-lift transition hover:bg-orange-600">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h2 className="mt-4 font-display text-lg font-bold text-ink">{user.name}</h2>
            <p className="text-sm text-muted">{user.department}</p>
            <span className="mt-2 chip bg-navy-50 text-navy-600 ring-1 ring-navy-500/20">
              <ShieldCheck className="h-3.5 w-3.5" /> {user.role === 'admin' ? 'Security Admin' : 'Verified Student'}
            </span>
          </div>

          <div className="mt-6 space-y-3 border-t border-line pt-4">
            <InfoRow icon={IdCard} label="Student ID" value={user.studentId} />
            <InfoRow icon={Building} label="Department" value={user.department} />
            <InfoRow icon={Mail} label="Email" value={user.email} />
          </div>

          <button
            onClick={() => { resetData(); notify('Demo data has been reset.'); }}
            className="btn-ghost mt-4 w-full"
          >
            Reset Demo Data
          </button>
        </div>

        {/* Settings sections */}
        <div className="space-y-6 lg:col-span-2">
          {/* Account details */}
          <form onSubmit={save} className="card p-6">
            <div className="mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-orange-600" />
              <h3 className="font-display text-base font-semibold text-ink">Account Details</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Student ID</label>
                <input value={user.studentId} disabled className="input cursor-not-allowed bg-canvas text-muted" />
              </div>
              <div>
                <label className="label">Department</label>
                <input value={user.department} disabled className="input cursor-not-allowed bg-canvas text-muted" />
              </div>
            </div>
            <button type="submit" className="btn-primary mt-4">
              <Save className="h-4 w-4" /> Save Changes
            </button>
          </form>

          {/* Appearance */}
          <div className="card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5 text-orange-600" />
              <h3 className="font-display text-base font-semibold text-ink">Appearance</h3>
            </div>
            <div className="space-y-4">
              <ToggleRow
                icon={darkMode ? Moon : Sun}
                label="Dark Mode"
                desc="Use a dark colour scheme across the app"
                value={darkMode}
                onChange={setDarkMode}
              />
              <div className="flex items-center justify-between border-t border-line pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-600">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">Language Preference</p>
                    <p className="text-xs text-muted">Choose your display language</p>
                  </div>
                </div>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input w-auto">
                  <option>English</option>
                  <option>हिन्दी</option>
                  <option>ਪੰਜਾਬੀ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              <h3 className="font-display text-base font-semibold text-ink">Notification Preferences</h3>
            </div>
            <div className="space-y-4">
              <ToggleRow icon={ShieldCheck} label="Claim Updates" desc="Notify me when my claim status changes" value={notifClaims} onChange={setNotifClaims} />
              <ToggleRow icon={Bug} label="Match Alerts" desc="Notify me when a found item matches my lost report" value={notifMatches} onChange={setNotifMatches} />
              <ToggleRow icon={Bell} label="Security Broadcasts" desc="Campus-wide security announcements" value={notifSecurity} onChange={setNotifSecurity} />
            </div>
          </div>

          {/* Accessibility */}
          <div className="card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-orange-600" />
              <h3 className="font-display text-base font-semibold text-ink">Accessibility</h3>
            </div>
            <div className="space-y-4">
              <ToggleRow icon={Eye} label="High Contrast" desc="Increase colour contrast for better readability" value={highContrast} onChange={setHighContrast} />
              <ToggleRow icon={Eye} label="Large Text" desc="Increase base text size" value={largeText} onChange={setLargeText} />
            </div>
          </div>

          {/* Help */}
          <div className="card p-6">
            <div className="mb-4 flex items-center gap-2">
              <LifeBuoy className="h-5 w-5 text-orange-600" />
              <h3 className="font-display text-base font-semibold text-ink">Help &amp; Support</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button className="btn-ghost"><LifeBuoy className="h-4 w-4" /> Contact Support</button>
              <button className="btn-ghost"><Bug className="h-4 w-4" /> Report an Issue</button>
            </div>
            <button
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-canvas text-muted">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="truncate text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}

function ToggleRow({
  icon: Icon, label, desc, value, onChange,
}: { icon: typeof User; label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-600">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{label}</p>
          <p className="text-xs text-muted">{desc}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${value ? 'bg-orange-500' : 'bg-line'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${value ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
