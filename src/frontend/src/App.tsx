import { useEffect, useState, useRef } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AuthGate from './components/auth/AuthGate';
import ChatView from './components/chat/ChatView';
import LiaAvatar from './components/avatar/LiaAvatar';
import CameraPanel from './components/camera/CameraPanel';
import SettingsPanel from './components/settings/SettingsPanel';
import ToolManagerPanel from './components/tools/ToolManagerPanel';
import PermissionCta from './components/onboarding/PermissionCta';
import { useFirstRunPermissions } from './hooks/useFirstRunPermissions';
import { useSpeechRecognition } from './hooks/speech/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/speech/useSpeechSynthesis';
import { useConversationHistory } from './hooks/chat/useConversationHistory';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { Settings, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const { needsPermission, requestPermissions, permissionDenied, retry } = useFirstRunPermissions();
  const { isListening, transcript, startRecognition, stopRecognition, clearTranscript } = useSpeechRecognition();
  const { speak, isSpeaking, stopSpeaking, isSupported } = useSpeechSynthesis();
  const { messages, addMessage, clearHistory } = useConversationHistory();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // Track initialization and previous message count to prevent TTS on history restore
  const isInitializedRef = useRef(false);
  const prevMessageCountRef = useRef(0);

  // Auto-speak assistant responses (only for newly added messages, not history restore)
  useEffect(() => {
    // Skip if TTS is not supported
    if (!isSupported) return;

    const currentMessageCount = messages.length;
    
    // Mark as initialized after first render with messages
    if (!isInitializedRef.current && currentMessageCount > 0) {
      isInitializedRef.current = true;
      prevMessageCountRef.current = currentMessageCount;
      return; // Don't speak on initial history load
    }

    // Only speak if messages were added (not on initial load)
    if (isInitializedRef.current && currentMessageCount > prevMessageCountRef.current) {
      const lastMessage = messages[messages.length - 1];
      
      // Speak only new assistant messages
      if (lastMessage.sender === 'LIA') {
        // speak() already cancels any ongoing speech, so we can call it directly
        speak(lastMessage.text);
      }
    }

    // Update previous count
    prevMessageCountRef.current = currentMessageCount;
  }, [messages, speak, isSupported]);

  // Handle transcript from speech recognition
  useEffect(() => {
    if (transcript && !isListening) {
      // Transcript is ready to be sent
      clearTranscript();
    }
  }, [transcript, isListening, clearTranscript]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/lia-logo.dim_512x512.png" 
                alt="LIA Logo" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold tracking-tight">LIA</h1>
                <p className="text-xs text-muted-foreground">आपकी आभासी सहायक</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTools(!showTools)}
                title="Manage Tools"
              >
                <Wrench className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Permission CTA */}
        {needsPermission && (
          <PermissionCta
            onRequest={requestPermissions}
            denied={permissionDenied}
            onRetry={retry}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 overflow-hidden">
          {/* Left Column: Avatar & Camera */}
          <div className="lg:w-80 flex flex-col gap-4">
            <LiaAvatar isListening={isListening} isSpeaking={isSpeaking} />
            {showCamera && <CameraPanel />}
            {!showCamera && (
              <Button
                variant="outline"
                onClick={() => setShowCamera(true)}
                className="w-full"
              >
                कैमरा चालू करें
              </Button>
            )}
          </div>

          {/* Right Column: Chat */}
          <div className="flex-1 flex flex-col min-h-0">
            <AuthGate>
              <ChatView
                messages={messages}
                onSendMessage={addMessage}
                onClearHistory={clearHistory}
                isListening={isListening}
                onStartListening={startRecognition}
                onStopListening={stopRecognition}
                transcript={transcript}
                isSpeaking={isSpeaking}
                onStopSpeaking={stopSpeaking}
              />
            </AuthGate>
          </div>
        </main>

        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}

        {/* Tool Manager Panel */}
        {showTools && isAuthenticated && (
          <ToolManagerPanel onClose={() => setShowTools(false)} />
        )}

        {/* Footer */}
        <footer className="border-t border-border bg-card/30 backdrop-blur-sm py-4 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} • Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>

        <Toaster />
      </div>
    </ThemeProvider>
  );
}
