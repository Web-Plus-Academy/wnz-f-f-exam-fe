import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2, XCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
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
  const [isVerifying, setIsVerifying] = useState(false);

  // 1. Simply Request Camera Access
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
      startMockVerification(); // Trigger the "showoff" logic
    } catch {
      setStatus("denied");
    }
  };

  // 2. Mock the "AI Detection" and Countdown
  const startMockVerification = () => {
    setIsVerifying(true);
    let timer = 3;
    
    const interval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      
      if (timer === 0) {
        clearInterval(interval);
        const img = captureSnapshot();
        setSnapshot(img);
        setIsVerifying(false);
      }
    }, 1000);
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

  const handleRetake = () => {
    setSnapshot(null);
    setCountdown(3);
    startMockVerification();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto relative">
      {snapshot && (
        <div className="absolute top-0 right-0 z-20 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full border-4 border-green-500 overflow-hidden shadow-lg">
            <img src={snapshot} className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-1 text-green-600 mt-1 font-bold text-[10px] bg-white px-2 rounded-full border shadow-sm">
            <CheckCircle2 className="w-3 h-3" /> VERIFIED
          </div>
        </div>
      )}

      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Camera className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold">Identity Verification</h2>
        </div>

        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm mb-1">
            <AlertTriangle className="h-4 w-4" /> Important Instructions
          </div>
          <ul className="text-xs list-disc list-inside text-amber-800 space-y-0.5">
            <li>Ensure you are in a well-lit room</li>
            <li>Keep your face centered in the frame</li>
            <li>The AI system will automatically capture your photo</li>
          </ul>
        </div>

        <div className="aspect-video bg-slate-900 rounded-lg relative mb-4 overflow-hidden border">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${snapshot ? "opacity-0" : "opacity-100"}`}
          />
          {snapshot && <img src={snapshot} className="absolute inset-0 w-full h-full object-cover" />}
          
          {isVerifying && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
              <div className="bg-white/90 text-primary px-6 py-2 rounded-full font-bold text-xl animate-pulse">
                Capturing in {countdown}...
              </div>
              <p className="text-white text-xs mt-2 font-medium">AI Analyzing Face Geometry...</p>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {status === "idle" && (
          <Button onClick={requestCamera} className="w-full py-6 text-md font-bold">
            Start Camera Verification
          </Button>
        )}

        {snapshot && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRetake} className="w-full">Retake</Button>
            <Button onClick={() => onSuccess?.(snapshot)} className="w-full font-bold">Proceed to Exam</Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};