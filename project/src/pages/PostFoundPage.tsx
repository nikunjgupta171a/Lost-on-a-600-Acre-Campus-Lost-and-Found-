import { useState } from 'react';
import { useStore } from '../store';
import { useToast } from '../components/Toast';
import { Link } from '../router';
import { PageHeader } from '../components/PageHeader';
import { Img } from '../components/Img';
import { CATEGORIES, IMAGES } from '../data';
import type { Category } from '../types';
import { FilePlus, Upload, CheckCircle, QrCode, ArrowRight, ShieldCheck, Package } from 'lucide-react';

export function PostFoundPage() {
  const { addItem, user } = useStore();
  const { notify } = useToast();
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    category: 'Wallet' as Category,
    foundLocation: '',
    dateFound: '',
    description: '',
    contact: user.email,
    holding: true,
    deposited: false,
  });
  const [preview, setPreview] = useState<string>('');

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.foundLocation || !form.dateFound) {
      notify('Please fill in all required fields.', 'error');
      return;
    }
    const item = addItem({
      name: form.name,
      category: form.category,
      location: form.foundLocation,
      dateFound: new Date(form.dateFound).toISOString(),
      description: form.description,
      image: preview || IMAGES.wallet,
      status: 'available',
      finderName: user.name,
      finderContact: form.contact,
      verified: false,
      deposited: form.deposited,
      hiddenDetails: 'Pending verification by Security Desk.',
    });
    setSubmitted(item.id);
    notify('Found item posted successfully!');
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="card flex flex-col items-center gap-3 py-12 text-center animate-scale-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h1 className="font-display text-xl font-bold text-ink">Found Item Posted!</h1>
          <p className="max-w-md text-sm text-muted">
            Your found item has been added to the search board. The unique Item ID is:
          </p>
          <p className="rounded-xl bg-navy-600 px-6 py-2 font-mono text-lg font-bold text-white">{submitted}</p>
          <div className="flex gap-2">
            <Link to="/find" className="btn-primary">View on Find Board</Link>
            <button onClick={() => { setSubmitted(null); setForm({ ...form, name: '', foundLocation: '', dateFound: '', description: '' }); }} className="btn-ghost">
              Post Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Found Something? Help Someone Find It!" subtitle="Post a found item so the owner can claim it." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form onSubmit={submit} className="card space-y-5 p-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Item Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Blue Water Bottle" className="input" />
            </div>
            <div>
              <label className="label">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className="input">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Found Location *</label>
              <input value={form.foundLocation} onChange={(e) => setForm({ ...form, foundLocation: e.target.value })} placeholder="e.g. Block 32, Corridor" className="input" />
            </div>
            <div>
              <label className="label">Date &amp; Time Found *</label>
              <input type="datetime-local" value={form.dateFound} onChange={(e) => setForm({ ...form, dateFound: e.target.value })} className="input" />
            </div>
          </div>

          <div>
            <label className="label">Item Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe the item — colour, brand, condition..." className="input resize-none" />
          </div>

          <div>
            <label className="label">Upload Item Photograph *</label>
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
            <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Email or phone" className="input" />
          </div>

          <div>
            <label className="label">Current Status</label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, holding: true, deposited: false })}
                className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition ${
                  form.holding ? 'border-orange-500 bg-orange-50' : 'border-line bg-white hover:border-navy-200'
                }`}
              >
                <Package className={`mt-0.5 h-5 w-5 ${form.holding ? 'text-orange-600' : 'text-muted'}`} />
                <div>
                  <p className="text-sm font-semibold text-ink">I am holding this item</p>
                  <p className="text-xs text-muted">Keep it safe until claimed.</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, holding: false, deposited: true })}
                className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition ${
                  form.deposited ? 'border-orange-500 bg-orange-50' : 'border-line bg-white hover:border-navy-200'
                }`}
              >
                <ShieldCheck className={`mt-0.5 h-5 w-5 ${form.deposited ? 'text-orange-600' : 'text-muted'}`} />
                <div>
                  <p className="text-sm font-semibold text-ink">Submitted to Security Desk</p>
                  <p className="text-xs text-muted">Deposited at the security office.</p>
                </div>
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            <FilePlus className="h-4 w-4" /> Post Found Item
          </button>
        </form>

        <div className="space-y-4">
          <div className="card overflow-hidden">
            <Img src={IMAGES.securityDesk} alt="Security Desk" fallbackIndex={2} className="h-40 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-ink">Deposit at Security Desk</h3>
              <p className="mt-1 text-xs text-muted">
                Main Administrative Block, Ground Floor. Open 8 AM – 10 PM.
              </p>
            </div>
          </div>
          <Link to="/qr" className="card flex items-center justify-between p-4 transition hover:shadow-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">QR Drop Point</p>
                <p className="text-xs text-muted">Scan to post quickly</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-orange-600" />
          </Link>
        </div>
      </div>
    </div>
  );
}
