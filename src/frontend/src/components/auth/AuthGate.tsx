import { ReactNode } from 'react';
import { useCurrentUser } from '../../hooks/auth/useCurrentUser';
import { useCallerUserProfile } from '../../hooks/profile/useCallerUserProfile';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AuthGateProps {
  children: ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { login, loginStatus } = useInternetIdentity();
  const { isAuthenticated } = useCurrentUser();
  const { userProfile, isLoading: profileLoading, isFetched, saveProfile, isSaving } = useCallerUserProfile();
  
  const [name, setName] = useState('Mj');

  const handleSaveProfile = async () => {
    if (name.trim()) {
      await saveProfile(name.trim());
    }
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md px-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">नमस्ते! मैं LIA हूँ</h2>
            <p className="text-muted-foreground">
              आपकी व्यक्तिगत आभासी सहायक। शुरू करने के लिए कृपया लॉगिन करें।
            </p>
          </div>
          <Button
            onClick={login}
            disabled={loginStatus === 'logging-in'}
            size="lg"
            className="w-full max-w-xs"
          >
            {loginStatus === 'logging-in' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                लॉगिन हो रहा है...
              </>
            ) : (
              'लॉगिन करें'
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Show profile setup if needed
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return (
      <Dialog open={true}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>स्वागत है!</DialogTitle>
            <DialogDescription>
              कृपया अपना नाम बताएं ताकि मैं आपको बेहतर तरीके से जान सकूं।
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">आपका नाम</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="अपना नाम दर्ज करें"
                disabled={isSaving}
              />
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={!name.trim() || isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  सहेजा जा रहा है...
                </>
              ) : (
                'जारी रखें'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show loading state
  if (profileLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
