import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from './MessageBubble';
import ClearHistoryButton from './ClearHistoryButton';
import { Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react';
import type { Message } from '../../backend';
import { parseCommand } from '../../tools/commandParser';
import { executeBuiltInTool } from '../../tools/builtInTools';
import { executeCustomTool } from '../../tools/customToolRunner';
import { useGetTools } from '../../hooks/useQueries';

interface ChatViewProps {
  messages: Message[];
  onSendMessage: (text: string, sender: string) => Promise<void>;
  onClearHistory: () => void;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  transcript: string;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
}

export default function ChatView({
  messages,
  onSendMessage,
  onClearHistory,
  isListening,
  onStartListening,
  onStopListening,
  transcript,
  isSpeaking,
  onStopSpeaking,
}: ChatViewProps) {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: customTools = [] } = useGetTools();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Update input with transcript
  useEffect(() => {
    if (transcript && !isListening) {
      setInput(transcript);
    }
  }, [transcript, isListening]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    setIsSending(true);
    setInput('');

    try {
      // Save user message
      await onSendMessage(text, 'Mj');

      // Parse and execute command
      const command = parseCommand(text, customTools);

      if (command) {
        let response = '';
        
        if (command.type === 'custom') {
          response = await executeCustomTool(command);
        } else {
          response = await executeBuiltInTool(command);
        }

        // Save assistant response
        await onSendMessage(response, 'LIA');
      } else {
        // No command detected, provide a helpful response
        await onSendMessage(
          'मुझे समझ नहीं आया। कृपया "help" टाइप करें उपलब्ध कमांड देखने के लिए।',
          'LIA'
        );
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      await onSendMessage(
        'क्षमा करें, कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
        'LIA'
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
        <h2 className="font-semibold">बातचीत</h2>
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onStopSpeaking}
              title="Stop Speaking"
            >
              <VolumeX className="h-4 w-4" />
            </Button>
          )}
          <ClearHistoryButton onClear={onClearHistory} />
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p>नमस्ते! मैं LIA हूँ। मैं आपकी कैसे मदद कर सकती हूँ?</p>
              <p className="text-sm mt-2">Type "help" to see available commands</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card/50">
        <div className="flex gap-2">
          <Button
            variant={isListening ? 'destructive' : 'outline'}
            size="icon"
            onClick={isListening ? onStopListening : onStartListening}
            disabled={isSending}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? 'सुन रहा हूँ...' : 'अपना संदेश टाइप करें...'}
            disabled={isSending || isListening}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
