import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalSettings } from '../useLocalSettings';

interface SpeechSynthesisHook {
  isSupported: boolean;
  isSpeaking: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  setVoice: (voice: SpeechSynthesisVoice) => void;
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const { settings, updateSettings } = useLocalSettings();
  const [isSupported] = useState(() => 'speechSynthesis' in window);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoiceState] = useState<SpeechSynthesisVoice | null>(null);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Auto-select Hindi female voice if available
      if (availableVoices.length > 0 && !selectedVoice) {
        const hindiVoices = availableVoices.filter(v => v.lang.startsWith('hi'));
        const femaleHindiVoice = hindiVoices.find(v => 
          v.name.toLowerCase().includes('female') || 
          v.name.toLowerCase().includes('woman') ||
          v.name.toLowerCase().includes('lekha') ||
          v.name.toLowerCase().includes('nicky')
        );
        
        const voiceToUse = femaleHindiVoice || hindiVoices[0] || availableVoices[0];
        setSelectedVoiceState(voiceToUse);
        updateSettings({ selectedVoiceUri: voiceToUse.voiceURI });
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported, selectedVoice, updateSettings]);

  // Restore saved voice
  useEffect(() => {
    if (settings.selectedVoiceUri && voices.length > 0 && !selectedVoice) {
      const savedVoice = voices.find(v => v.voiceURI === settings.selectedVoiceUri);
      if (savedVoice) {
        setSelectedVoiceState(savedVoice);
      }
    }
  }, [settings.selectedVoiceUri, voices, selectedVoice]);

  const speak = useCallback((text: string) => {
    if (!isSupported || !settings.ttsEnabled) return;

    // Cancel any ongoing speech first (ensures latest message is always spoken)
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.lang = selectedVoice?.lang || 'hi-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, selectedVoice, settings.ttsEnabled]);

  const stopSpeaking = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoiceState(voice);
    updateSettings({ selectedVoiceUri: voice.voiceURI });
  }, [updateSettings]);

  return {
    isSupported,
    isSpeaking,
    voices,
    selectedVoice,
    speak,
    stopSpeaking,
    setVoice,
  };
}
