import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, AlertTriangle, CheckCircle2, Scan, Loader2, UserCheck } from "lucide-react";
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
  const [faceDetected, setFaceDetected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Request Camera Access
  const requestCamera = async () => {
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("granted");
      startFaceDetectionSim();
    } catch (err) {
      setStatus("denied");
    }
  };

  // 2. Simulated Face Detection Logic
  // This "locks" onto a face after a brief scan, then starts the photo process
  const startFaceDetectionSim = () => {
    setFaceDetected(false);
    setIsProcessing(true);
    setSnapshot(null);

    // Simulate the time taken to detect a face
    setTimeout(() => {
      setFaceDetected(true);
      setIsProcessing(false);
      startCountdown();
    }, 2500); // 2.5s "Scanning" phase
  };

  // 3. Countdown only starts AFTER faceDetected is true
  const startCountdown = () => {
    let timer = 3;
    setCountdown(3);

    const interval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      
      if (timer === 0) {
        clearInterval(interval);
        executeCapture();
      }
    }, 1000);
  };

  const executeCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);
    
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setSnapshot(dataUrl);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto relative px-4">
      {/* Verification Badge */}
      <AnimatePresence>
        {snapshot && (
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-4 -right-2 z-30 flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-full border-4 border-green-500 overflow-hidden shadow-2xl bg-white">
              <img src={snapshot} className="w-full h-full object-cover" />
            </div>
            <div className="bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-full mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> VERIFIED
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 rounded-xl">
            <Camera className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Identity Verification</h2>
        </div>

        <div className="aspect-video bg-slate-900 rounded-2xl relative mb-6 overflow-hidden border-4 border-slate-50 shadow-inner">
          <video
            ref={videoRef} autoPlay playsInline muted
            className={`w-full h-full object-cover transition-all duration-700 ${snapshot ? "blur-md opacity-50" : "opacity-100"}`}
          />
          
          {/* PHASE 1: SEARCHING */}
          {status === "granted" && isProcessing && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-indigo-900/20 backdrop-blur-[2px]">
              <motion.div 
                animate={{ y: [0, 200, 0] }} transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-0 left-0 w-full h-1 bg-indigo-400 shadow-[0_0_15px_indigo]" 
              />
              <Scan className="w-12 h-12 text-white animate-pulse mb-3" />
              <p className="text-white font-bold text-xs uppercase tracking-widest">Scanning for face...</p>
            </div>
          )}

          {/* PHASE 2: FACE FOUND & COUNTDOWN */}
          {faceDetected && !snapshot && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/20">
              <div className="bg-green-500/20 border border-green-500/50 p-4 rounded-full mb-4">
                <UserCheck className="w-8 h-8 text-green-400" />
              </div>
              <motion.div 
                key={countdown} initial={{ scale: 1.5 }} animate={{ scale: 1 }}
                className="text-white text-7xl font-black drop-shadow-2xl"
              >
                {countdown}
              </motion.div>
              <p className="text-white text-xs font-bold mt-2 uppercase tracking-tighter">Face Locked - Capturing</p>
            </div>
          )}

          {snapshot && (
            <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={snapshot} className="absolute inset-0 w-full h-full object-cover z-20" />
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="space-y-3">
          {status === "idle" && (
            <Button onClick={requestCamera} className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-lg">
              Start Verification
            </Button>
          )}

          {snapshot && (
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={startFaceDetectionSim} className="h-12 rounded-xl border-slate-200 font-semibold">
                Retake
              </Button>
              <Button onClick={() => onSuccess?.(snapshot!)} className="h-12 rounded-xl bg-indigo-600 font-bold">
                Confirm & Proceed
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};