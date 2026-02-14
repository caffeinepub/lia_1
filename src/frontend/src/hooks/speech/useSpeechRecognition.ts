import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalSettings } from '../useLocalSettings';

interface SpeechRecognitionHook {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  error: string | null;
  startRecognition: () => void;
  stopRecognition: () => void;
  clearTranscript: () => void;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const { settings } = useLocalSettings();
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = settings.recognitionLanguage || 'hi-IN';

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };

      recognition.onerror = (event: any) => {
        setError(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please use typed input.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [settings.recognitionLanguage]);

  const startRecognition = useCallback(() => {
    if (!recognitionRef.current) return;
    
    try {
      setError(null);
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      setError('Failed to start recognition');
      console.error(err);
    }
  }, []);

  const stopRecognition = useCallback(() => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    error,
    startRecognition,
    stopRecognition,
    clearTranscript,
  };
}
