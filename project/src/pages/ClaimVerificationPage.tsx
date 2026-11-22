import { useState } from 'react';
import type { Item } from '../types';
import { ShieldCheck, Lock, CheckCircle } from 'lucide-react';

interface FormData { color: string; contents: string; uniqueMarks: string; }

export function ClaimVerificationForm({
  item,
  userName,
  userContact,
  onSubmit,
}: {
  item: Item;
  userName: string;
  userContact: string;
  onSubmit: (data: FormData) => void;
}) {
  const [color, setColor] = useState('');
  const [contents, setContents] = useState('');
  const [uniqueMarks, setUniqueMarks] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!color.trim()) e.color = 'Please describe the colour of the item.';
    if (!contents.trim()) e.contents = 'Please describe what is inside the item.';
    if (!uniqueMarks.trim()) e.uniqueMarks = 'Please mention any unique marks or identification.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) onSubmit({ color, contents, uniqueMarks });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex items-start gap-3 rounded-xl bg-navy-50 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-navy-600" />
        <div>
          <p className="text-sm font-semibold text-ink">Verify ownership of: {item.name}</p>
          <p className="text-xs text-muted">Answer these three questions to help us verify your claim.</p>
        </div>
      </div>

      <div>
        <label className="label">1. What is the colour of the item?</label>
        <input value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Black with brown stitching" className="input" />
        {errors.color && <p className="mt-1 text-xs text-red-500">{errors.color}</p>}
      </div>

      <div>
        <label className="label">2. What is inside the item?</label>
        <input value={contents} onChange={(e) => setContents(e.target.value)} placeholder="e.g. Two cards, ₹200, and a photo" className="input" />
        {errors.contents && <p className="mt-1 text-xs text-red-500">{errors.contents}</p>}
      </div>

      <div>
        <label className="label">3. Does it have any unique marks, stickers, or identification?</label>
        <textarea value={uniqueMarks} onChange={(e) => setUniqueMarks(e.target.value)} rows={3} placeholder="e.g. A small sticker on the back with initials" className="input resize-none" />
        {errors.uniqueMarks && <p className="mt-1 text-xs text-red-500">{errors.uniqueMarks}</p>}
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-canvas p-3 text-xs text-muted">
        <Lock className="mt-0.5 h-4 w-4 shrink-0" />
        Your answers are kept private and only visible to authorised security staff for verification.
      </div>

      <div className="flex items-center justify-between border-t border-line pt-4">
        <div className="text-xs text-muted">
          <p>Claimant: <span className="font-medium text-ink">{userName}</span></p>
          <p>Contact: <span className="font-medium text-ink">{userContact}</span></p>
        </div>
        <button type="submit" className="btn-primary">
          <CheckCircle className="h-4 w-4" /> Submit Claim
        </button>
      </div>
    </form>
  );
}
