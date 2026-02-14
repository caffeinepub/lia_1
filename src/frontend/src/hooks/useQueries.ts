import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Tool, Message, UserProfile } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetTools() {
  const { actor, isFetching } = useActor();

  return useQuery<Tool[]>({
    queryKey: ['customTools'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTools();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTool() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tool: Tool) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTool(tool);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customTools'] });
    },
  });
}

export function useGetConciergeTools() {
  const { actor, isFetching } = useActor();

  return useQuery<Tool[]>({
    queryKey: ['conciergeTools'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getConciergeTools();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetConversationHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['conversationHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getConversationHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: Message) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveMessage(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversationHistory'] });
    },
  });
}
