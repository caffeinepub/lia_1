import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../useQueries';

export function useCallerUserProfile() {
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const saveProfileMutation = useSaveCallerUserProfile();

  const saveProfile = async (name: string) => {
    await saveProfileMutation.mutateAsync({ name });
  };

  return {
    userProfile,
    isLoading,
    isFetched,
    saveProfile,
    isSaving: saveProfileMutation.isPending,
  };
}
