import { useState, useEffect, useCallback } from 'react';

interface LocalSettings {
  recognitionLanguage: string;
  selectedVoiceUri: string | null;
  ttsEnabled: boolean;
}

const DEFAULT_SETTINGS: LocalSettings = {
  recognitionLanguage: 'hi-IN',
  selectedVoiceUri: null,
  ttsEnabled: true,
};

const STORAGE_KEY = 'lia-settings';

export function useLocalSettings() {
  const [settings, setSettings] = useState<LocalSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<LocalSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    settings,
    updateSettings,
  };
}
