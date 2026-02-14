import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

interface ClearHistoryButtonProps {
  onClear: () => void;
}

export default function ClearHistoryButton({ onClear }: ClearHistoryButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Clear History">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>इतिहास साफ़ करें?</AlertDialogTitle>
          <AlertDialogDescription>
            यह क्रिया आपकी सभी बातचीत को हटा देगी। इसे पूर्ववत नहीं किया जा सकता।
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>रद्द करें</AlertDialogCancel>
          <AlertDialogAction onClick={onClear}>साफ़ करें</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
