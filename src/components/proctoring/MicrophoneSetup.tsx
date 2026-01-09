import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, CheckCircle, XCircle, Loader2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MicrophoneSetupProps {
  onSuccess: (stream: MediaStream) => void;
  onBack: () => void;
}

export const MicrophoneSetup = ({ onSuccess, onBack }: MicrophoneSetupProps) => {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const requestMicrophone = async () => {
    setStatus('requesting');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      setStream(mediaStream);
      setStatus('granted');
      
      // Start audio visualization
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      const source = audioContextRef.current.createMediaStreamSource(mediaStream);
      source.connect(analyserRef.current);
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
        setAudioLevel(Math.min(100, (average / 255) * 100 * 2));
        animationRef.current = requestAnimationFrame(updateLevel);
      };
      
      updateLevel();
    } catch (error) {
      console.error('Microphone access denied:', error);
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
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
            <Mic className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Microphone Setup</h2>
            <p className="text-sm text-muted-foreground">Step 2 of 3</p>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-8 mb-6">
          <div className="flex flex-col items-center">
            {status === 'idle' && (
              <>
                <Mic className="h-20 w-20 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Click to enable microphone</p>
              </>
            )}
            {status === 'requesting' && (
              <>
                <Loader2 className="h-20 w-20 text-primary mb-4 animate-spin" />
                <p className="text-muted-foreground">Requesting microphone access...</p>
              </>
            )}
            {status === 'denied' && (
              <>
                <XCircle className="h-20 w-20 text-destructive mb-4" />
                <p className="text-destructive font-medium">Microphone access denied</p>
                <p className="text-sm text-muted-foreground mt-2">Please enable microphone in browser settings</p>
              </>
            )}
            {status === 'granted' && (
              <>
                <div className="relative mb-4">
                  <Volume2 className="h-20 w-20 text-primary" />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <CheckCircle className="h-8 w-8 text-green-500 bg-white rounded-full" />
                  </div>
                </div>
                <p className="text-foreground font-medium mb-4">Microphone Active</p>
                
                {/* Audio level indicator */}
                <div className="w-full max-w-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">Audio Level:</span>
                    <span className="text-sm font-medium">{Math.round(audioLevel)}%</span>
                  </div>
                  <div className="h-4 bg-muted-foreground/20 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full transition-colors ${
                        audioLevel > 60 ? 'bg-green-500' : audioLevel > 30 ? 'bg-yellow-500' : 'bg-primary'
                      }`}
                      animate={{ width: `${audioLevel}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Speak to test your microphone
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {status === 'idle' && (
            <Button onClick={requestMicrophone} className="w-full" size="lg">
              Enable Microphone
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
              Continue to Screen Recording
            </Button>
          )}
          {status === 'denied' && (
            <Button onClick={requestMicrophone} variant="outline" className="w-full" size="lg">
              Try Again
            </Button>
          )}
          <Button onClick={onBack} variant="ghost" className="w-full">
            Back to Camera
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
