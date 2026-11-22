import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { usePersistentState } from './hooks/usePersistentState';
import type { Item, LostReport, Claim, User } from './types';
import { SEED_ITEMS, SEED_LOST, SEED_CLAIMS, CURRENT_USER } from './data';

interface Store {
  items: Item[];
  lostReports: LostReport[];
  claims: Claim[];
  user: User;
  addItem: (i: Omit<Item, 'id'>) => Item;
  addLostReport: (l: Omit<LostReport, 'id' | 'submittedAt' | 'matches'>) => LostReport;
  addClaim: (c: Omit<Claim, 'id' | 'submittedAt' | 'status' | 'claimId'>) => Claim;
  updateClaimStatus: (id: string, status: Claim['status']) => void;
  updateItemStatus: (id: string, status: Item['status']) => void;
  resetData: () => void;
  setRole: (role: 'student' | 'admin') => void;
  notifications: { id: string; text: string; read: boolean; time: string }[];
  markAllRead: () => void;
}

const StoreCtx = createContext<Store | null>(null);

let counter = 100;
const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = usePersistentState<Item[]>('clf_items', SEED_ITEMS);
  const [lostReports, setLostReports] = usePersistentState<LostReport[]>('clf_lost', SEED_LOST);
  const [claims, setClaims] = usePersistentState<Claim[]>('clf_claims', SEED_CLAIMS);
  const [user, setUser] = usePersistentState<User>('clf_user', CURRENT_USER);
  const [notifications, setNotifications] = usePersistentState<
    { id: string; text: string; read: boolean; time: string }[]
  >('clf_notes', [
    { id: 'n1', text: 'Your claim CLM-2026-0148 is under review.', read: false, time: '1h ago' },
    { id: 'n2', text: 'New found item: Black Leather Wallet at Library.', read: false, time: '3h ago' },
    { id: 'n3', text: 'Claim CLM-2026-0132 approved. Collect from Security Desk.', read: true, time: '2d ago' },
  ]);

  const addItem = useCallback(
    (i: Omit<Item, 'id'>) => {
      const id = `LPU-FOUND-${(Math.floor(Math.random() * 900) + 100)}`;
      const item: Item = { ...i, id };
      setItems((prev) => [item, ...prev]);
      setNotifications((prev) => [
        { id: nextId('n'), text: `Found item posted: ${item.name} (${item.id}).`, read: false, time: 'just now' },
        ...prev,
      ]);
      return item;
    },
    [setItems, setNotifications],
  );

  const addLostReport = useCallback(
    (l: Omit<LostReport, 'id' | 'submittedAt' | 'matches'>) => {
      const id = `LPU-LOST-${(Math.floor(Math.random() * 900) + 100)}`;
      // crude matching by category + location overlap
      const matches = items
        .filter((it) => it.category === l.category && it.status === 'available')
        .slice(0, 3)
        .map((m) => m.id);
      const report: LostReport = { ...l, id, submittedAt: new Date().toISOString(), matches };
      setLostReports((prev) => [report, ...prev]);
      setNotifications((prev) => [
        { id: nextId('n'), text: `Lost report filed: ${report.name}. ${matches.length} possible match(es).`, read: false, time: 'just now' },
        ...prev,
      ]);
      return report;
    },
    [items, setLostReports, setNotifications],
  );

  const addClaim = useCallback(
    (c: Omit<Claim, 'id' | 'submittedAt' | 'status' | 'claimId'>) => {
      const claim: Claim = {
        ...c,
        id: nextId('c'),
        claimId: `CLM-2026-${(Math.floor(Math.random() * 9000) + 1000)}`,
        status: 'Pending',
        submittedAt: new Date().toISOString(),
      };
      setClaims((prev) => [claim, ...prev]);
      setNotifications((prev) => [
        { id: nextId('n'), text: `Claim ${claim.claimId} submitted for review.`, read: false, time: 'just now' },
        ...prev,
      ]);
      return claim;
    },
    [setClaims, setNotifications],
  );

  const updateClaimStatus = useCallback(
    (id: string, status: Claim['status']) => {
      setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
      const c = claims.find((x) => x.id === id);
      if (status === 'Approved' && c) {
        setItems((prev) => prev.map((it) => (it.id === c.itemId ? { ...it, status: 'claimed' } : it)));
      }
      if (status === 'Rejected' && c) {
        setItems((prev) =>
          prev.map((it) => (it.id === c.itemId && it.status === 'claimed' ? { ...it, status: 'available' } : it)),
        );
      }
    },
    [claims, setClaims, setItems],
  );

  const updateItemStatus = useCallback(
    (id: string, status: Item['status']) => {
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)));
    },
    [setItems],
  );

  const resetData = useCallback(() => {
    setItems(SEED_ITEMS);
    setLostReports(SEED_LOST);
    setClaims(SEED_CLAIMS);
    setUser(CURRENT_USER);
  }, [setItems, setLostReports, setClaims, setUser]);

  const setRole = useCallback(
    (role: 'student' | 'admin') => {
      setUser((u) => ({ ...u, role }));
    },
    [setUser],
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [setNotifications]);

  const store: Store = {
    items,
    lostReports,
    claims,
    user,
    addItem,
    addLostReport,
    addClaim,
    updateClaimStatus,
    updateItemStatus,
    resetData,
    setRole,
    notifications,
    markAllRead,
  };

  return <StoreCtx.Provider value={store}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
