import { cn } from '@/lib/utils';

interface LiaAvatarProps {
  isListening: boolean;
  isSpeaking: boolean;
}

export default function LiaAvatar({ isListening, isSpeaking }: LiaAvatarProps) {
  const getAvatarSrc = () => {
    if (isSpeaking) return '/assets/generated/lia-avatar-speaking.dim_768x768.png';
    if (isListening) return '/assets/generated/lia-avatar-listening.dim_768x768.png';
    return '/assets/generated/lia-avatar-idle.dim_768x768.png';
  };

  const getStateLabel = () => {
    if (isSpeaking) return 'बोल रही हूँ...';
    if (isListening) return 'सुन रही हूँ...';
    return 'तैयार';
  };

  return (
    <div className="relative">
      <div
        className={cn(
          'relative rounded-2xl overflow-hidden bg-card border-2 transition-all duration-300',
          isSpeaking && 'border-primary shadow-lg shadow-primary/20',
          isListening && 'border-accent shadow-lg shadow-accent/20',
          !isSpeaking && !isListening && 'border-border'
        )}
      >
        <div className="aspect-square relative">
          <img
            src={getAvatarSrc()}
            alt="LIA Avatar"
            className="w-full h-full object-cover"
          />
          
          {/* Pulse effect */}
          {(isListening || isSpeaking) && (
            <div className="absolute inset-0 animate-pulse">
              <div
                className={cn(
                  'absolute inset-0 rounded-2xl',
                  isSpeaking && 'bg-primary/10',
                  isListening && 'bg-accent/10'
                )}
              />
            </div>
          )}
        </div>
      </div>

      {/* Status indicator */}
      <div className="mt-3 text-center">
        <div
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
            isSpeaking && 'bg-primary/20 text-primary',
            isListening && 'bg-accent/20 text-accent',
            !isSpeaking && !isListening && 'bg-muted text-muted-foreground'
          )}
        >
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              isSpeaking && 'bg-primary animate-pulse',
              isListening && 'bg-accent animate-pulse',
              !isSpeaking && !isListening && 'bg-muted-foreground'
            )}
          />
          {getStateLabel()}
        </div>
      </div>
    </div>
  );
}
