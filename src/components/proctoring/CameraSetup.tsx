import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, AlertTriangle, CheckCircle2, Scan, UserCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CameraSetup = ({ onSuccess }: { onSuccess?: (image: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motionCanvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [faceDetected, setFaceDetected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const requestCamera = async () => {
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus("granted");
        startMotionDetection();
      }
    } catch (err) {
      setStatus("denied");
    }
  };

  // 🧠 MOTION DETECTION LOGIC: Prevents auto-taking photos without a person
  const startMotionDetection = () => {
    setIsScanning(true);
    let lastFrame: ImageData | null = null;
    const motionThreshold = 150000; // Sensitivity: Higher = needs more movement

    const checkMotion = () => {
      if (!videoRef.current || !motionCanvasRef.current || faceDetected || snapshot) return;

      const video = videoRef.current;
      const canvas = motionCanvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);

      if (lastFrame) {
        let diff = 0;
        for (let i = 0; i < currentFrame.data.length; i += 4) {
          // Compare brightness of current vs last frame
          diff += Math.abs(currentFrame.data[i] - lastFrame.data[i]);
        }

        // If movement is detected, "Lock" the face and start countdown
        if (diff > motionThreshold) {
          setFaceDetected(true);
          setIsScanning(false);
          beginCountdown();
          return; // Stop checking motion once locked
        }
      }
      lastFrame = currentFrame;
      requestAnimationFrame(checkMotion);
    };

    requestAnimationFrame(checkMotion);
  };

  const beginCountdown = () => {
    let timer = 3;
    const interval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      if (timer === 0) {
        clearInterval(interval);
        captureImage();
      }
    }, 1000);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    setSnapshot(canvas.toDataURL("image/jpeg", 0.8));
  };

  return (
    <div className="max-w-xl mx-auto relative p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-800">Identity Verification</h2>
        </div>

        <div className="aspect-video bg-slate-900 rounded-2xl relative mb-6 overflow-hidden border-4 border-white shadow-lg">
          <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover transition-all ${snapshot ? "blur-md opacity-50" : ""}`} />
          
          {/* Invisible canvas used for motion math */}
          <canvas ref={motionCanvasRef} width="64" height="48" className="hidden" />

          {/* 🔍 STATUS: SCANNING (No Movement) */}
          {isScanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-900/20">
              <motion.div animate={{ y: [0, 180, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute top-0 w-full h-1 bg-indigo-400 shadow-[0_0_15px_indigo]" />
              <Scan className="w-10 h-10 text-white animate-pulse mb-2" />
              <p className="text-white text-[10px] font-bold tracking-widest uppercase bg-black/40 px-3 py-1 rounded-full">Position your face to begin</p>
            </div>
          )}

          {/* 🎯 STATUS: LOCKED (Movement Found) */}
          {faceDetected && !snapshot && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
              <div className="bg-green-500/30 p-4 rounded-full mb-3 border border-green-400">
                <UserCheck className="w-10 h-10 text-green-400" />
              </div>
              <motion.span key={countdown} initial={{ scale: 2 }} animate={{ scale: 1 }} className="text-white text-7xl font-black">{countdown}</motion.span>
              <p className="text-white text-xs font-bold mt-2 uppercase">Face Locked - Hold Still</p>
            </div>
          )}

          {snapshot && <img src={snapshot} className="absolute inset-0 w-full h-full object-cover z-20" />}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="space-y-3">
          {status === "idle" && <Button onClick={requestCamera} className="w-full h-14 rounded-2xl bg-indigo-600 text-lg font-bold">Start Verification</Button>}
          {snapshot && (
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => { setSnapshot(null); setFaceDetected(false); startMotionDetection(); }} className="h-12 rounded-xl">Retake</Button>
              <Button onClick={() => onSuccess?.(snapshot)} className="h-12 rounded-xl bg-indigo-600 font-bold">Proceed</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};