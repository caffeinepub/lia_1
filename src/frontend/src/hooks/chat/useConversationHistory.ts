import { useState, useEffect, useCallback } from 'react';
import { useGetConversationHistory, useSaveMessage } from '../useQueries';
import { useCurrentUser } from '../auth/useCurrentUser';
import type { Message } from '../../backend';

export function useConversationHistory() {
  const { isAuthenticated } = useCurrentUser();
  const { data: backendMessages = [], isLoading } = useGetConversationHistory();
  const saveMessageMutation = useSaveMessage();
  
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  // Sync backend messages to local state
  useEffect(() => {
    if (isAuthenticated && backendMessages.length > 0) {
      setLocalMessages(backendMessages);
    }
  }, [backendMessages, isAuthenticated]);

  const addMessage = useCallback(async (text: string, sender: string) => {
    const message: Message = {
      text,
      sender,
      timestamp: BigInt(Date.now()),
    };

    // Add to local state immediately
    setLocalMessages(prev => [...prev, message]);

    // Save to backend if authenticated
    if (isAuthenticated) {
      try {
        await saveMessageMutation.mutateAsync(message);
      } catch (error) {
        console.error('Failed to save message:', error);
      }
    }
  }, [isAuthenticated, saveMessageMutation]);

  const clearHistory = useCallback(() => {
    setLocalMessages([]);
    // Note: Backend doesn't have a clear method, so we just clear locally
  }, []);

  return {
    messages: localMessages,
    addMessage,
    clearHistory,
    isLoading,
  };
}
