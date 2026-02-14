import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetTools, useAddTool } from '../../hooks/useQueries';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ToolManagerPanelProps {
  onClose: () => void;
}

export default function ToolManagerPanel({ onClose }: ToolManagerPanelProps) {
  const { data: tools = [], isLoading } = useGetTools();
  const addToolMutation = useAddTool();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [urlTemplate, setUrlTemplate] = useState('');

  const handleAddTool = async () => {
    if (!name.trim() || !urlTemplate.trim()) {
      toast.error('कृपया नाम और URL टेम्पलेट भरें');
      return;
    }

    try {
      await addToolMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        urlTemplate: urlTemplate.trim(),
      });

      setName('');
      setDescription('');
      setUrlTemplate('');
      toast.success('टूल जोड़ा गया!');
    } catch (error) {
      toast.error('टूल जोड़ने में विफल');
      console.error(error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>कस्टम टूल्स प्रबंधित करें</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add Tool Form */}
          <div className="space-y-4 p-4 border border-border rounded-lg bg-card/50">
            <h3 className="font-semibold">नया टूल जोड़ें</h3>
            
            <div className="space-y-2">
              <Label htmlFor="tool-name">टूल का नाम *</Label>
              <Input
                id="tool-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Wikipedia Search"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tool-desc">विवरण</Label>
              <Textarea
                id="tool-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this tool do?"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tool-url">URL टेम्पलेट *</Label>
              <Input
                id="tool-url"
                value={urlTemplate}
                onChange={(e) => setUrlTemplate(e.target.value)}
                placeholder="https://example.com/search?q={query}"
              />
              <p className="text-xs text-muted-foreground">
                Use {'{query}'} as a placeholder for the search term
              </p>
            </div>

            <Button
              onClick={handleAddTool}
              disabled={addToolMutation.isPending}
              className="w-full"
            >
              {addToolMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  जोड़ा जा रहा है...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  टूल जोड़ें
                </>
              )}
            </Button>
          </div>

          {/* Tools List */}
          <div className="space-y-2">
            <h3 className="font-semibold">आपके टूल्स</h3>
            <ScrollArea className="h-[200px] border border-border rounded-lg p-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : tools.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  कोई कस्टम टूल नहीं। ऊपर एक जोड़ें!
                </div>
              ) : (
                <div className="space-y-3">
                  {tools.map((tool, idx) => (
                    <div
                      key={idx}
                      className="p-3 border border-border rounded-lg bg-card"
                    >
                      <div className="font-medium">{tool.name}</div>
                      {tool.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {tool.description}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-2 font-mono">
                        {tool.urlTemplate}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
