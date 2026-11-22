import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

type ToastKind = 'success' | 'info' | 'error';
interface Toast { id: string; text: string; kind: ToastKind; }

const ToastCtx = createContext<{ notify: (text: string, kind?: ToastKind) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((text: string, kind: ToastKind = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const remove = (id: string) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastCtx.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-start gap-3 rounded-xl border border-line bg-white p-4 shadow-lift animate-slide-up"
          >
            {t.kind === 'success' && <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />}
            {t.kind === 'info' && <Info className="mt-0.5 h-5 w-5 shrink-0 text-navy-500" />}
            {t.kind === 'error' && <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />}
            <p className="flex-1 text-sm font-medium text-ink">{t.text}</p>
            <button onClick={() => remove(t.id)} className="text-muted hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
