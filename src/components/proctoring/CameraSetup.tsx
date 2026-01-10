import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2, XCircle, AlertTriangle, CheckCircle2, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraSetupProps {
  onSuccess?: (image: string) => void;
}

export const CameraSetup = ({ onSuccess }: CameraSetupProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [isSearching, setIsSearching] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // 1. Request Camera
  const requestCamera = async () => {
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("granted");
      triggerShowoffLogic();
    } catch {
      setStatus("denied");
    }
  };

  // 2. The "Showoff" Sequence
  const triggerShowoffLogic = () => {
    setSnapshot(null);
    setCountdown(3);
    setIsSearching(true); // Show "Scanning for face..."
    setIsCapturing(false);

    // Wait 1.5 seconds to "find" the face, then start countdown
    setTimeout(() => {
      setIsSearching(false);
      setIsCapturing(true);
      
      let timer = 3;
      const interval = setInterval(() => {
        timer -= 1;
        setCountdown(timer);
        
        if (timer === 0) {
          clearInterval(interval);
          const img = captureSnapshot();
          setSnapshot(img);
          setIsCapturing(false);
        }
      }, 1000);
    }, 1500);
  };

  const captureSnapshot = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.9);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto relative">
      {snapshot && (
        <div className="absolute top-0 right-0 z-20 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-full border-4 border-green-500 overflow-hidden shadow-lg"
          >
            <img src={snapshot} className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex items-center gap-1 text-green-600 mt-1 font-bold text-[10px] bg-white px-2 py-0.5 rounded-full border shadow-sm">
            <CheckCircle2 className="w-3 h-3" /> FACE VERIFIED
          </div>
        </div>
      )}

      <div className="bg-card border rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Camera className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Identity Verification</h2>
        </div>

        <div className="aspect-video bg-slate-900 rounded-xl relative mb-4 overflow-hidden border-2 border-slate-100 shadow-inner">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transition-opacity duration-500 ${snapshot ? "opacity-30" : "opacity-100"}`}
          />
          
          {snapshot && (
            <div className="absolute inset-0 flex items-center justify-center">
               <img src={snapshot} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-green-500/10" />
            </div>
          )}
          
          {/* Mock Scanning UI */}
          {isSearching && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
              <Scan className="w-12 h-12 text-white animate-pulse mb-2" />
              <p className="text-white text-sm font-semibold tracking-wide uppercase">Searching for face...</p>
              <div className="w-48 h-1 bg-white/20 mt-4 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary" 
                  initial={{ width: 0 }} 
                  animate={{ width: "100%" }} 
                  transition={{ duration: 1.5 }} 
                />
              </div>
            </div>
          )}

          {/* Mock Countdown UI */}
          {isCapturing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
              <div className="text-white text-6xl font-black mb-2 drop-shadow-lg">
                {countdown}
              </div>
              <p className="text-white text-xs font-bold uppercase tracking-widest">Hold Still</p>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="space-y-3">
          {status === "idle" && (
            <Button onClick={requestCamera} className="w-full py-6 text-md font-bold shadow-lg shadow-primary/20">
              Start Verification
            </Button>
          )}

          {snapshot && (
            <div className="flex gap-3">
              <Button variant="outline" onClick={triggerShowoffLogic} className="w-full h-12 font-semibold">
                Retake Photo
              </Button>
              <Button onClick={() => onSuccess?.(snapshot)} className="w-full h-12 font-bold shadow-lg shadow-primary/20">
                Proceed to Exam
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200">
           <div className="flex gap-2 items-start text-[11px] text-slate-500">
             <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
             <p>Our AI system cross-references your live features with your registered profile to ensure exam integrity.</p>
           </div>
        </div>
      </div>
    </motion.div>
  );
};