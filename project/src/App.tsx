import { useState } from 'react';
import { RouterProvider, useRouter } from './router';
import { StoreProvider } from './store';
import { ToastProvider } from './components/Toast';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardPage } from './pages/DashboardPage';
import { FindItemsPage } from './pages/FindItemsPage';
import { ItemDetailsPage } from './pages/ItemDetailsPage';
import { ReportLostPage } from './pages/ReportLostPage';
import { PostFoundPage } from './pages/PostFoundPage';
import { CampusMapPage } from './pages/CampusMapPage';
import { QRDropPointPage } from './pages/QRDropPointPage';
import { MyClaimsPage } from './pages/MyClaimsPage';
import { UsefulInfoPage } from './pages/UsefulInfoPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';

function CurrentPage() {
  const { path } = useRouter();
  const route = path.split('?')[0];
  const parts = route.split('/').filter(Boolean);

  if (route === '/' || parts.length === 0) return <DashboardPage />;
  if (parts[0] === 'find') return <FindItemsPage />;
  if (parts[0] === 'item') return <ItemDetailsPage />;
  if (parts[0] === 'report-lost') return <ReportLostPage />;
  if (parts[0] === 'post-found') return <PostFoundPage />;
  if (parts[0] === 'map') return <CampusMapPage />;
  if (parts[0] === 'qr') return <QRDropPointPage />;
  if (parts[0] === 'claims') return <MyClaimsPage />;
  if (parts[0] === 'info') return <UsefulInfoPage />;
  if (parts[0] === 'settings') return <SettingsPage />;
  if (parts[0] === 'admin') return <AdminPage />;
  return <DashboardPage />;
}

function Shell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <Header onMenu={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6 pb-24 lg:px-8 lg:pb-8">
          <CurrentPage />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <RouterProvider>
          <Shell />
        </RouterProvider>
      </ToastProvider>
    </StoreProvider>
  );
}
