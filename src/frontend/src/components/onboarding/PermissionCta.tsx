import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, AlertCircle } from 'lucide-react';

interface PermissionCtaProps {
  onRequest: () => void;
  denied: boolean;
  onRetry: () => void;
}

export default function PermissionCta({ onRequest, denied, onRetry }: PermissionCtaProps) {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/10">
              <Mic className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">माइक्रोफ़ोन की अनुमति चाहिए</h2>
          <p className="text-muted-foreground">
            LIA के साथ बात करने के लिए, कृपया माइक्रोफ़ोन की अनुमति दें।
          </p>
        </div>

        {denied && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Permission was denied. Please check your browser settings and try again.
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={denied ? onRetry : onRequest}
          size="lg"
          className="w-full"
        >
          {denied ? 'पुनः प्रयास करें' : 'अनुमति दें'}
        </Button>

        <p className="text-xs text-muted-foreground">
          आप बाद में भी टाइप करके बात कर सकते हैं
        </p>
      </div>
    </div>
  );
}
