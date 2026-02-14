import { useInternetIdentity } from '../useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export function useCurrentUser() {
  const { identity, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;

  const logout = useCallback(async () => {
    await clear();
    queryClient.clear();
  }, [clear, queryClient]);

  return {
    identity,
    isAuthenticated,
    logout,
    loginStatus,
  };
}
