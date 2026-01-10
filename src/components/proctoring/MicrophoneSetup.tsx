import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setNoiseLevel } from "@/store/proctoringSlice";

interface MicrophoneSetupProps {
  onSuccess: (stream: MediaStream) => void;
  onBack: () => void;
}

export const MicrophoneSetup = ({ onSuccess, onBack }: MicrophoneSetupProps) => {
  const dispatch = useAppDispatch();
  
  const [status, setStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [audioLevel, setAudioLevel] = useState(0);
  const [isTooLoud, setIsTooLoud] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const requestMicrophone = async () => {
    setStatus("requesting");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false, 
          autoGainControl: true,
        },
      });
      setStream(mediaStream);
      setStatus("granted");

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.2;

      const source = audioContext.createMediaStreamSource(mediaStream);
      source.connect(analyser);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const detectNoise = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / dataArray.length);

        // Normalize level for UI feedback
        const normalizedLevel = Math.min(100, (rms / 128) * 100);
        setAudioLevel(normalizedLevel);
        
        // Update global state for visual indicators elsewhere
        dispatch(setNoiseLevel(normalizedLevel));

        // UI Threshold check
        if (normalizedLevel > 40) {
          setIsTooLoud(true);
          // 🚀 Warning modal dispatch removed from here as requested
        } else {
          setIsTooLoud(false);
        }
        animationRef.current = requestAnimationFrame(detectNoise);
      };

      detectNoise();
    } catch (e) {
      setStatus("denied");
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-card rounded-2xl border p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className={`p-3 rounded-xl transition-colors ${isTooLoud ? "bg-red-500/10" : "bg-primary/10"}`}>
            <Mic className={`h-8 w-8 ${isTooLoud ? "text-red-500" : "text-primary"}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading tracking-tight">Acoustic Monitoring</h2>
            <p className="text-sm text-muted-foreground">Adjust your environment until the bar stays below the red line.</p>
          </div>
        </div>

        <div className={`rounded-2xl p-10 mb-8 border-2 flex flex-col items-center min-h-[300px] transition-all duration-200 ${
          isTooLoud ? "bg-red-500/5 border-red-500 shadow-inner" : "bg-muted/30 border-dashed border-border"
        }`}>
          {status === "granted" ? (
            <div className="w-full space-y-8">
              <div className="flex justify-center h-20">
                <AnimatePresence mode="wait">
                  {isTooLoud ? (
                    <motion.div key="loud" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                      <VolumeX className="h-20 w-20 text-red-500" />
                    </motion.div>
                  ) : (
                    <motion.div key="quiet" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                      <Volume2 className="h-20 w-20 text-primary" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Mic Input</span>
                  <span className={`text-2xl font-mono font-bold ${isTooLoud ? "text-red-500" : "text-primary"}`}>
                    {Math.round(audioLevel)}%
                  </span>
                </div>

                <div className="h-4 bg-background rounded-full border border-border overflow-hidden relative shadow-sm">
                  <div className="absolute left-[40%] top-0 bottom-0 w-0.5 bg-red-500/40 z-10" />
                  <motion.div
                    className={`h-full ${isTooLoud ? "bg-red-500" : "bg-primary"}`}
                    animate={{ width: `${audioLevel}%` }}
                    transition={{ type: "spring", bounce: 0, duration: 0.1 }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                 {status === "requesting" ? <Loader2 className="animate-spin text-primary" /> : <Mic className="text-muted-foreground" />}
              </div>
              <Button onClick={requestMicrophone} size="lg" className="rounded-full px-8 font-bold">
                {status === "requesting" ? "Requesting..." : "Enable Microphone"}
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => onSuccess(stream!)}
            className="w-full h-14 text-lg font-bold shadow-lg transition-transform active:scale-[0.98]"
            disabled={!stream || isTooLoud}
          >
            {isTooLoud ? "Too Noisy to Proceed" : "Proceed to Exam"}
          </Button>
          <Button onClick={onBack} variant="ghost" className="text-muted-foreground">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};