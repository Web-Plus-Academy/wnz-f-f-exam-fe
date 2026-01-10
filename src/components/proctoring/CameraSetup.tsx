import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Loader2, XCircle, AlertTriangle, Scan, UserCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as faceDetection from "@mediapipe/face_detection";
import * as camUtils from "@mediapipe/camera_utils";

interface CameraSetupProps {
  onSuccess?: (image: string) => void;
}

export const CameraSetup = ({ onSuccess }: CameraSetupProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [videoReady, setVideoReady] = useState(false);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [restartKey, setRestartKey] = useState(0);
  const [faceValid, setFaceValid] = useState(false);
  const [faceError, setFaceError] = useState<string | null>(null);

  const captureSnapshot = (): string | null => {
    if (!videoRef.current || !canvasRef.current || !faceValid) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const requestCamera = async () => {
    setStatus("requesting");
    setSnapshot(null);
    setCountdown(3);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("granted");
    } catch (err) {
      setStatus("denied");
    }
  };

  useEffect(() => {
    if (status !== "granted" || !videoRef.current) return;
    let activeCamera: any = null;
    let activeDetector: any = null;

    const initAI = async () => {
      try {
        const FD_Class = (faceDetection as any).FaceDetection || (faceDetection as any).default?.FaceDetection || faceDetection;
        activeDetector = new FD_Class({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
        });
        activeDetector.setOptions({ model: "short", minDetectionConfidence: 0.7 });
        activeDetector.onResults((results: any) => {
          if (results.detections && results.detections.length === 1) {
            setFaceValid(true);
            setFaceError(null);
          } else if (results.detections && results.detections.length > 1) {
            setFaceValid(false);
            setFaceError("Multiple faces detected");
          } else {
            setFaceValid(false);
            setFaceError("Position face in center");
          }
        });

        const Cam_Class = (camUtils as any).Camera || (camUtils as any).default?.Camera || camUtils;
        activeCamera = new Cam_Class(videoRef.current!, {
          onFrame: async () => {
            if (videoRef.current && activeDetector) {
              await activeDetector.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });
        await activeCamera.start();
      } catch (err) {
        setFaceError("AI Initialization failed");
      }
    };
    initAI();
    return () => {
      if (activeCamera) activeCamera.stop();
      if (activeDetector) activeDetector.close();
    };
  }, [status, restartKey]);

  useEffect(() => {
    if (status !== "granted" || !videoReady || snapshot || !faceValid) {
      setCountdown(3);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const img = captureSnapshot();
          if (img) setSnapshot(img);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [faceValid, snapshot, videoReady, status]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto relative p-4 font-sans">
      <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-2xl overflow-hidden">
        
        {/* Header with Status Badges */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <ShieldCheck className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Identity Check</h2>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">AI Automated Proctoring</p>
            </div>
          </div>
          
          <AnimatePresence>
            {status === "granted" && !snapshot && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${faceValid ? "bg-green-50 border-green-200 text-green-600" : "bg-amber-50 border-amber-200 text-amber-600"}`}>
                <div className={`w-2 h-2 rounded-full ${faceValid ? "bg-green-500 animate-pulse" : "bg-amber-500"}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{faceValid ? "Verified" : "Scanning"}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Camera Container */}
        <div className="aspect-video bg-slate-900 rounded-2xl relative mb-6 overflow-hidden group shadow-inner border-4 border-slate-50">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={() => setVideoReady(true)}
            className={`w-full h-full object-cover transition-transform duration-700 ${snapshot ? "scale-105 blur-sm opacity-40" : "scale-100"}`}
          />

          {/* AI UI OVERLAYS */}
          {!snapshot && status === "granted" && (
            <>
              {/* Animated Scan Line */}
              <motion.div 
                animate={{ top: ["0%", "100%", "0%"] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className={`absolute left-0 right-0 h-[2px] z-10 pointer-events-none ${faceValid ? "bg-green-400/50 shadow-[0_0_15px_rgba(74,222,128,0.5)]" : "bg-indigo-400/30 shadow-[0_0_10px_rgba(129,140,248,0.3)]"}`} 
              />
              
              {/* Corner Targets */}
              <div className="absolute inset-0 p-8 flex items-center justify-center pointer-events-none">
                <div className={`w-48 h-48 border-2 rounded-3xl transition-colors duration-500 ${faceValid ? "border-green-500/50" : "border-white/10"}`}>
                   <Scan className={`absolute top-4 left-4 w-6 h-6 ${faceValid ? "text-green-500" : "text-white/20"}`} />
                   <div className={`absolute bottom-4 right-4 rotate-180`}><Scan className={`w-6 h-6 ${faceValid ? "text-green-500" : "text-white/20"}`} /></div>
                </div>
              </div>

              {/* Status Message */}
              <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 pointer-events-none">
                {faceValid ? (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-green-600/90 backdrop-blur-md text-white px-8 py-2 rounded-full font-black text-2xl shadow-xl flex items-center gap-3">
                    <UserCheck className="w-6 h-6" /> {countdown}
                  </motion.div>
                ) : (
                  <div className="bg-black/60 backdrop-blur-sm text-white px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] border border-white/10">
                    {faceError || "Initializing Sensors..."}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Result View */}
          <AnimatePresence>
            {snapshot && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-20">
                <img src={snapshot} className="w-full h-full object-cover" alt="Snapshot" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-8">
                  <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-1.5 rounded-full font-bold shadow-lg text-sm">
                    <ShieldCheck className="w-4 h-4" /> BIOMETRIC DATA STORED
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Initial Loaders */}
          {status === "requesting" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white z-30">
              <Loader2 className="animate-spin text-indigo-400 h-12 w-12 mb-4" />
              <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest">Waking AI System...</p>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* Footer Actions */}
        <div className="flex flex-col gap-4">
          {status === "idle" && (
            <Button onClick={requestCamera} size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 h-16 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-200 transition-all active:scale-[0.98]">
              Begin AI Verification
            </Button>
          )}

          {snapshot && (
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => { setSnapshot(null); setRestartKey(k => k + 1); }} className="flex-1 h-14 rounded-2xl font-bold border-2 border-slate-100 hover:bg-slate-50 transition-colors">
                Try Again
              </Button>
              <Button onClick={() => onSuccess?.(snapshot)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-14 rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]">
                Finalize Identity
              </Button>
            </div>
          )}
        </div>

        {/* Subtle Footer Info */}
        <p className="mt-6 text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Secure Session Encrypted</p>
      </div>
    </motion.div>
  );
};

export default CameraSetup;