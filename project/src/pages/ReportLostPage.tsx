import { useState } from 'react';
import { useStore } from '../store';
import { useToast } from '../components/Toast';
import { Link } from '../router';
import { PageHeader } from '../components/PageHeader';
import { ItemCard } from '../components/ItemCard';
import { Img } from '../components/Img';
import { CATEGORIES, IMAGES } from '../data';
import type { Category } from '../types';
import { FileMinus, Upload, CheckCircle, ArrowRight, Image as ImageIcon } from 'lucide-react';

export function ReportLostPage() {
  const { addLostReport, items } = useStore();
  const { notify } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [matches, setMatches] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: '',
    category: 'Wallet' as Category,
    lastSeenLocation: '',
    dateLost: '',
    description: '',
    contact: '',
  });
  const [preview, setPreview] = useState<string>('');

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.lastSeenLocation || !form.dateLost) {
      notify('Please fill in all required fields.', 'error');
      return;
    }
    const report = addLostReport({
      name: form.name,
      category: form.category,
      lastSeenLocation: form.lastSeenLocation,
      dateLost: new Date(form.dateLost).toISOString(),
      description: form.description,
      image: preview || undefined,
      contact: form.contact,
    });
    setMatches(report.matches || []);
    setSubmitted(true);
    notify('Lost report filed successfully!');
  };

  if (submitted) {
    const matchedItems = items.filter((i) => matches.includes(i.id));
    return (
      <div className="space-y-6">
        <div className="card flex flex-col items-center gap-3 py-12 text-center animate-scale-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h1 className="font-display text-xl font-bold text-ink">Lost Report Submitted</h1>
          <p className="max-w-md text-sm text-muted">
            Your lost item report has been filed. We will notify you when a matching found item appears.
          </p>
          <div className="flex gap-2">
            <Link to="/find" className="btn-primary">Browse Found Items</Link>
            <button onClick={() => { setSubmitted(false); setForm({ name: '', category: 'Wallet', lastSeenLocation: '', dateLost: '', description: '', contact: '' }); }} className="btn-ghost">
              Report Another
            </button>
          </div>
        </div>

        {matchedItems.length > 0 && (
          <div>
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <span className="chip bg-green-50 text-green-700 ring-1 ring-green-600/20">{matchedItems.length} match</span>
              Possible matching found items
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {matchedItems.map((it, i) => <ItemCard key={it.id} item={it} index={i} />)}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Report a Lost Item" subtitle="File a report so the campus community can help you find it." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form onSubmit={submit} className="card space-y-5 p-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Item Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Black Leather Wallet" className="input" />
            </div>
            <div>
              <label className="label">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className="input">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Last Seen Location *</label>
              <input value={form.lastSeenLocation} onChange={(e) => setForm({ ...form, lastSeenLocation: e.target.value })} placeholder="e.g. Library, 2nd Floor" className="input" />
            </div>
            <div>
              <label className="label">Date &amp; Time Last Seen *</label>
              <input type="datetime-local" value={form.dateLost} onChange={(e) => setForm({ ...form, dateLost: e.target.value })} className="input" />
            </div>
          </div>

          <div>
            <label className="label">Item Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe the item — brand, colour, distinguishing features..." className="input resize-none" />
          </div>

          <div>
            <label className="label">Upload Photograph (optional)</label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-canvas p-6 transition hover:border-orange-400 hover:bg-orange-50/30">
              {preview ? (
                <img src={preview} alt="preview" className="max-h-40 rounded-lg object-contain" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted" />
                  <p className="text-sm text-muted">Click to upload a photo</p>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>

          <div>
            <label className="label">Contact Information</label>
            <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Email or phone number" className="input" />
          </div>

          <button type="submit" className="btn-primary w-full">
            <FileMinus className="h-4 w-4" /> Submit Lost Report
          </button>
        </form>

        {/* Side visual */}
        <div className="space-y-4">
          <div className="card overflow-hidden">
            <Img src={IMAGES.library} alt="Library" fallbackIndex={1} className="h-40 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-ink">Tips for a better report</h3>
              <ul className="mt-2 space-y-1.5 text-xs text-muted">
                <li className="flex gap-2"><CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-500" /> Include a clear photo if available.</li>
                <li className="flex gap-2"><CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-500" /> Mention unique identifying marks.</li>
                <li className="flex gap-2"><CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-500" /> Be specific about the location and time.</li>
                <li className="flex gap-2"><CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-500" /> Check the Find Items board for matches.</li>
              </ul>
            </div>
          </div>
          <Link to="/find" className="card flex items-center justify-between p-4 transition hover:shadow-soft">
            <div>
              <p className="text-sm font-semibold text-ink">Looking for a found item?</p>
              <p className="text-xs text-muted">Browse the found items board</p>
            </div>
            <ArrowRight className="h-5 w-5 text-orange-600" />
          </Link>
        </div>
      </div>
    </div>
  );
}
