import React, { useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { TopBar } from '../components/navigation/TopBar';
import { BottomBar } from '../components/navigation/BottomBar';
import { NavigationDrawer } from '../components/navigation/NavigationDrawer';
import { AdProvider } from '../components/ads/AdContext';
import { ReservedAdBanner } from '../components/ads/ReservedAdBanner';

interface MainLayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenTool?: (toolId: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activePage,
  onNavigate,
  onOpenTool = () => {},
}) => {
  const { isRTL } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <AdProvider activePage={activePage}>
      <div
        className={`min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col transition-colors duration-200 pb-20 md:pb-0 ${
          isRTL ? 'rtl' : 'ltr'
        }`}
      >
        {/* Navigation Drawer */}
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          activePage={activePage}
          onNavigate={onNavigate}
          onOpenTool={onOpenTool}
        />

        {/* Minimal Top Header Navigation */}
        <TopBar
          activePage={activePage}
          onNavigate={onNavigate}
          onOpenDrawer={() => setIsDrawerOpen(true)}
        />

        {/* Main Content Viewport with Reserved Layout Spacing */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Non-intrusive Reserved Ad Space (Auto-closed on experiment pages) */}
          <ReservedAdBanner />
          {children}
        </main>

        {/* Bottom Status & Navigation Bar */}
        <BottomBar activePage={activePage} onNavigate={onNavigate} />
      </div>
    </AdProvider>
  );
};
