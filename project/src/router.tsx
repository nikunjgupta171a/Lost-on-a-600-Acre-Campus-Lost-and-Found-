import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

type Params = Record<string, string>;

interface RouterCtx {
  path: string;
  params: Params;
  navigate: (to: string) => void;
}

const Ctx = createContext<RouterCtx | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.hash.slice(1) || '/');

  useEffect(() => {
    const onHash = () => {
      setPath(window.location.hash.slice(1) || '/');
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHash);
    if (!window.location.hash) window.location.hash = '/';
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
  }, []);

  const parts = path.split('/').filter(Boolean);
  const params: Params = {};
  // routes like /item/:id, /claim/:id
  if (parts[0] === 'item' && parts[1]) params.id = parts[1];
  if (parts[0] === 'claim' && parts[1]) params.id = parts[1];
  if (parts[0] === 'find' && parts[1]) params.category = decodeURIComponent(parts[1]);

  return <Ctx.Provider value={{ path, params, navigate }}>{children}</Ctx.Provider>;
}

export function useRouter() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}

export function Link({ to, children, className, onClick }: { to: string; children: ReactNode; className?: string; onClick?: () => void }) {
  const { navigate } = useRouter();
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}
