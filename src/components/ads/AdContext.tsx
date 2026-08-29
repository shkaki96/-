import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdContextType {
  isAdVisible: boolean;
  dismissAd: () => void;
  resetAdState: () => void;
  activePage: string;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export const AdProvider: React.FC<{ activePage: string; children: React.ReactNode }> = ({
  activePage,
  children,
}) => {
  const [isAdVisible, setIsAdVisible] = useState(true);

  // Requirement: When the user opens an experiment, automatically close/suppress any open ad.
  useEffect(() => {
    if (activePage === 'experiment') {
      setIsAdVisible(false);
    }
  }, [activePage]);

  const dismissAd = () => {
    setIsAdVisible(false);
  };

  const resetAdState = () => {
    if (activePage !== 'experiment') {
      setIsAdVisible(true);
    }
  };

  return (
    <AdContext.Provider value={{ isAdVisible, dismissAd, resetAdState, activePage }}>
      {children}
    </AdContext.Provider>
  );
};

export const useAds = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAds must be used within an AdProvider');
  }
  return context;
};
