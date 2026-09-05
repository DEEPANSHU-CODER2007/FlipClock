import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type Theme = 'dark' | 'midnight' | 'amoled';

interface Settings {
  use24Hour: boolean;
  showSeconds: boolean;
  animationEnabled: boolean;
  soundEnabled: boolean;
  theme: Theme;
}

interface SettingsContextType extends Settings {
  setUse24Hour: (val: boolean) => void;
  setShowSeconds: (val: boolean) => void;
  setAnimationEnabled: (val: boolean) => void;
  setSoundEnabled: (val: boolean) => void;
  setTheme: (val: Theme) => void;
}

const defaultSettings: Settings = {
  use24Hour: false,
  showSeconds: true,
  animationEnabled: true,
  soundEnabled: false,
  theme: 'dark',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage<Settings>('flipclock-settings', defaultSettings);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setUse24Hour: (val) => updateSetting('use24Hour', val),
        setShowSeconds: (val) => updateSetting('showSeconds', val),
        setAnimationEnabled: (val) => updateSetting('animationEnabled', val),
        setSoundEnabled: (val) => updateSetting('soundEnabled', val),
        setTheme: (val) => updateSetting('theme', val),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
