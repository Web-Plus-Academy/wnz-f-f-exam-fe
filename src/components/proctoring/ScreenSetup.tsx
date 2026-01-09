import { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScreenSetupProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const ScreenSetup = ({ onSuccess, onBack }: ScreenSetupProps) => {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');

  const requestScreen = async () => {
    setStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser',
        },
        audio: false,
        // @ts-ignore - preferCurrentTab is a newer API
        preferCurrentTab: true,
      });
      
      setStatus('granted');
      
      // Listen for screen share stop
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        console.log('Screen share stopped by user');
      });
      
    } catch (error) {
      console.error('Screen share denied:', error);
      setStatus('denied');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-card rounded-lg border border-border p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Monitor className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Screen Recording Setup</h2>
            <p className="text-sm text-muted-foreground">Step 3 of 3</p>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-8 mb-6">
          <div className="flex flex-col items-center">
            {status === 'idle' && (
              <>
                <Monitor className="h-20 w-20 text-muted-foreground mb-4" />
                <p className="text-foreground font-medium mb-2">Tab Recording Required</p>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  Select "This Tab" when prompted to share only the exam tab.
                  This ensures your other activities remain private.
                </p>
              </>
            )}
            {status === 'requesting' && (
              <>
                <Loader2 className="h-20 w-20 text-primary mb-4 animate-spin" />
                <p className="text-muted-foreground">Waiting for screen share selection...</p>
              </>
            )}
            {status === 'denied' && (
              <>
                <XCircle className="h-20 w-20 text-destructive mb-4" />
                <p className="text-destructive font-medium">Screen sharing was cancelled</p>
                <p className="text-sm text-muted-foreground mt-2">Please try again and select "This Tab"</p>
              </>
            )}
            {status === 'granted' && (
              <>
                <div className="relative mb-4">
                  <Monitor className="h-20 w-20 text-primary" />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <CheckCircle className="h-8 w-8 text-green-500 bg-white rounded-full" />
                  </div>
                </div>
                <p className="text-foreground font-medium">Screen Recording Active</p>
                <p className="text-sm text-muted-foreground mt-2">Your exam tab is being recorded</p>
              </>
            )}
          </div>
        </div>

        {status === 'granted' && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">All permissions granted!</p>
              <p className="text-sm text-muted-foreground">You're ready to start the examination.</p>
            </div>
          </div>
        )}

        {status !== 'granted' && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Important Instructions</p>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• When the dialog appears, select "Chrome Tab" or "This Tab"</li>
                <li>• Choose the current exam tab from the list</li>
                <li>• Click "Share" to continue</li>
              </ul>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {status === 'idle' && (
            <Button onClick={requestScreen} className="w-full" size="lg">
              Share This Tab
            </Button>
          )}
          {status === 'requesting' && (
            <Button disabled className="w-full" size="lg">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Waiting for Selection...
            </Button>
          )}
          {status === 'granted' && (
            <Button onClick={onSuccess} className="w-full" size="lg">
              Start Examination
            </Button>
          )}
          {status === 'denied' && (
            <Button onClick={requestScreen} variant="outline" className="w-full" size="lg">
              Try Again
            </Button>
          )}
          <Button onClick={onBack} variant="ghost" className="w-full">
            Back to Microphone
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
