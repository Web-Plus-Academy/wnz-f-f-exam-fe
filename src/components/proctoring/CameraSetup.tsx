import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraSetupProps {
  onSuccess: (stream: MediaStream) => void;
  onSkip?: () => void;
}

export const CameraSetup = ({ onSuccess, onSkip }: CameraSetupProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const requestCamera = async () => {
    setStatus('requesting');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      });
      setStream(mediaStream);
      setStatus('granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      setStatus('denied');
    }
  };

  const handleContinue = () => {
    if (stream) {
      onSuccess(stream);
    }
  };

  useEffect(() => {
    return () => {
      // Don't stop stream here, it will be managed by parent
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-card rounded-lg border border-border p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Camera className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Camera Setup</h2>
            <p className="text-sm text-muted-foreground">Step 1 of 3</p>
          </div>
        </div>

        <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-6 relative">
          {status === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Camera className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Camera preview will appear here</p>
            </div>
          )}
          {status === 'requesting' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Loader2 className="h-16 w-16 text-primary mb-4 animate-spin" />
              <p className="text-muted-foreground">Requesting camera access...</p>
            </div>
          )}
          {status === 'denied' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10">
              <XCircle className="h-16 w-16 text-destructive mb-4" />
              <p className="text-destructive font-medium">Camera access denied</p>
              <p className="text-sm text-muted-foreground mt-2">Please enable camera in browser settings</p>
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${status === 'granted' ? 'block' : 'hidden'}`}
          />
          {status === 'granted' && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-green-500/90 text-white px-3 py-1.5 rounded-full text-sm">
              <CheckCircle className="h-4 w-4" />
              Camera Active
            </div>
          )}
        </div>

        <div className="space-y-3">
          {status === 'idle' && (
            <Button onClick={requestCamera} className="w-full" size="lg">
              Enable Camera
            </Button>
          )}
          {status === 'requesting' && (
            <Button disabled className="w-full" size="lg">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Requesting Permission...
            </Button>
          )}
          {status === 'granted' && (
            <Button onClick={handleContinue} className="w-full" size="lg">
              Continue to Microphone Setup
            </Button>
          )}
          {status === 'denied' && (
            <div className="space-y-2">
              <Button onClick={requestCamera} variant="outline" className="w-full" size="lg">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
