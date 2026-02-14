import { useState, useEffect, useCallback } from 'react';

const FIRST_RUN_KEY = 'lia-first-run-complete';

export function useFirstRunPermissions() {
  const [needsPermission, setNeedsPermission] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkFirstRun = async () => {
      try {
        const firstRunComplete = localStorage.getItem(FIRST_RUN_KEY);
        
        if (!firstRunComplete) {
          setNeedsPermission(true);
        } else {
          setNeedsPermission(false);
        }
      } catch (error) {
        console.error('Failed to check first run:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkFirstRun();
  }, []);

  const requestPermissions = useCallback(async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      // Mark first run as complete
      localStorage.setItem(FIRST_RUN_KEY, 'true');
      setNeedsPermission(false);
      setPermissionDenied(false);
    } catch (error) {
      console.error('Permission denied:', error);
      setPermissionDenied(true);
    }
  }, []);

  const retry = useCallback(() => {
    setPermissionDenied(false);
    requestPermissions();
  }, [requestPermissions]);

  return {
    needsPermission,
    permissionDenied,
    isChecking,
    requestPermissions,
    retry,
  };
}
