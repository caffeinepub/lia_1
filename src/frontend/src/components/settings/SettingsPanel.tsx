import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalSettings } from '../../hooks/useLocalSettings';
import { useSpeechSynthesis } from '../../hooks/speech/useSpeechSynthesis';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface SettingsPanelProps {
  onClose: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { settings, updateSettings } = useLocalSettings();
  const { voices, selectedVoice, setVoice, isSupported } = useSpeechSynthesis();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>सेटिंग्स</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* TTS Not Supported Warning */}
          {!isSupported && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                आवाज़ आउटपुट इस ब्राउज़र में समर्थित नहीं है। आप टाइप किए गए इनपुट का उपयोग कर सकते हैं।
              </AlertDescription>
            </Alert>
          )}

          {/* TTS Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="tts-enabled" className="flex-1">
              <div>आवाज़ सक्षम करें</div>
              <div className="text-xs text-muted-foreground">
                LIA की प्रतिक्रियाएँ सुनें
              </div>
            </Label>
            <Switch
              id="tts-enabled"
              checked={settings.ttsEnabled}
              onCheckedChange={(checked) => updateSettings({ ttsEnabled: checked })}
              disabled={!isSupported}
            />
          </div>

          {/* Voice Selection */}
          {isSupported && voices.length > 0 && (
            <div className="space-y-2">
              <Label>आवाज़ चुनें</Label>
              <Select
                value={selectedVoice?.voiceURI || ''}
                onValueChange={(uri) => {
                  const voice = voices.find(v => v.voiceURI === uri);
                  if (voice) setVoice(voice);
                }}
                disabled={!settings.ttsEnabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Recognition Language */}
          <div className="space-y-2">
            <Label>पहचान भाषा</Label>
            <Select
              value={settings.recognitionLanguage}
              onValueChange={(lang) => updateSettings({ recognitionLanguage: lang })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hi-IN">हिन्दी (Hindi)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="en-GB">English (UK)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
