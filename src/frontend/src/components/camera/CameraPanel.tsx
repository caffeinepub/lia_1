import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCamera } from '../../camera/useCamera';
import { Camera, CameraOff, RefreshCw, SwitchCamera } from 'lucide-react';

export default function CameraPanel() {
  const {
    isActive,
    isSupported,
    error,
    isLoading,
    currentFacingMode,
    startCamera,
    stopCamera,
    switchCamera,
    retry,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'user',
    width: 640,
    height: 480,
  });

  if (isSupported === false) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Camera is not supported in this browser.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative rounded-lg overflow-hidden bg-card border border-border aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <Camera className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error.message}
            {error.type === 'permission' && (
              <Button
                variant="outline"
                size="sm"
                onClick={retry}
                className="mt-2 w-full"
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                Retry
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        {!isActive ? (
          <Button
            onClick={startCamera}
            disabled={isLoading}
            className="flex-1"
            variant="outline"
          >
            <Camera className="h-4 w-4 mr-2" />
            कैमरा शुरू करें
          </Button>
        ) : (
          <>
            <Button
              onClick={stopCamera}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              <CameraOff className="h-4 w-4 mr-2" />
              बंद करें
            </Button>
            <Button
              onClick={() => switchCamera()}
              disabled={isLoading}
              variant="outline"
              size="icon"
            >
              <SwitchCamera className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
