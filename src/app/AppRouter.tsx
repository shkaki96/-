import { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { ExperimentPage } from '../pages/ExperimentPage';

export const AppRouter = () => {
  const [activePage, setActivePage] = useState<'home' | 'experiment'>('home');
  const [selectedExperimentId, setSelectedExperimentId] = useState<string>('exp-001-work-heat-1st-law-thermodynamics');
  const [activeToolFromDrawer, setActiveToolFromDrawer] = useState<string | null>(null);

  const handleNavigateToExperiment = (id: string) => {
    setSelectedExperimentId(id);
    setActivePage('experiment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigatePage = (page: string) => {
    setActivePage(page as 'home' | 'experiment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenToolFromDrawer = (toolId: string) => {
    setActiveToolFromDrawer(toolId);
    if (activePage !== 'experiment') {
      setActivePage('experiment');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          onClearDrawerTool={() => setActiveToolFromDrawer(null)}
        />
      )}
    </MainLayout>
  );
};
