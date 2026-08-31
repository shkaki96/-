import { useState, useCallback } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { ExperimentPage } from '../pages/ExperimentPage';

export const AppRouter = () => {
  const [activePage, setActivePage] = useState<'home' | 'experiment'>('home');
  const [selectedExperimentId, setSelectedExperimentId] = useState<string>('exp-001-work-heat-1st-law-thermodynamics');
  const [activeToolFromDrawer, setActiveToolFromDrawer] = useState<string | null>(null);

  const handleNavigateToExperiment = useCallback((id: string) => {
    setSelectedExperimentId(id);
    setActivePage('experiment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigatePage = useCallback((page: string) => {
    setActivePage(page as 'home' | 'experiment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenToolFromDrawer = useCallback((toolId: string) => {
    setActiveToolFromDrawer(toolId);
    setActivePage((prev) => {
      if (prev !== 'experiment') return 'experiment';
      return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleClearDrawerTool = useCallback(() => {
    setActiveToolFromDrawer(null);
  }, []);

  return (
    <MainLayout
      activePage={activePage}
      onNavigate={handleNavigatePage}
      onOpenTool={handleOpenToolFromDrawer}
    >
      {activePage === 'home' && (
        <HomePage onNavigateToExperiment={handleNavigateToExperiment} />
      )}
      {activePage === 'experiment' && (
        <ExperimentPage
          experimentId={selectedExperimentId}
          onNavigate={handleNavigateToExperiment}
          onBack={() => handleNavigatePage('home')}
          openToolFromDrawer={activeToolFromDrawer}
          onClearDrawerTool={handleClearDrawerTool}
        />
      )}
    </MainLayout>
  );
};
