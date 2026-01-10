import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Loader2, ShieldCheck, Scan, UserCheck, RefreshCw, CheckCircle } from "lucide-react";
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
      console.error("Camera Access Error:", err);
      setStatus("denied");
    }
  };

  useEffect(() => {
    if (status !== "granted" || !videoRef.current) return;
    let activeCamera: any = null;
    let activeDetector: any = null;

    const initAI = async () => {
      try {
        const FaceDetection = (faceDetection as any).FaceDetection || 
                             (window as any).FaceDetection || 
                             (faceDetection as any).default;

        activeDetector = new FaceDetection({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
        });

        activeDetector.setOptions({
          model: "short",
          minDetectionConfidence: 0.7,
        });

        activeDetector.onResults((results: any) => {
          if (results.detections && results.detections.length === 1) {
            setFaceValid(true);
            setFaceError(null);
          } else if (results.detections && results.detections.length > 1) {
            setFaceValid(false);
            setFaceError("Multiple faces detected");
          } else {
            setFaceValid(false);
            setFaceError("Position your face in the frame");
          }
        });

        const CameraClass = (camUtils as any).Camera || 
                           (window as any).Camera || 
                           (camUtils as any).default;

        activeCamera = new CameraClass(videoRef.current!, {
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
        console.error("AI Initialization Error:", err);
        setFaceError("Failed to initialize Security AI");
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
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto relative p-4">
      <div className="bg-white rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100">
        
        {/* Modern Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">SWPA-Intelligence Identity Check</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Secure Session</p>
            </div>
          </div>
          {status === "granted" && !snapshot && (
             <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${faceValid ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                {faceValid ? 'Face Detected' : 'Scanning...'}
             </div>
          )}
        </div>

        {/* Enhanced Camera Viewport */}
        <div className="aspect-[4/3] bg-slate-900 rounded-[24px] relative mb-8 overflow-hidden group shadow-2xl border-4 border-white">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={() => setVideoReady(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${snapshot ? "opacity-0" : "opacity-100"}`}
          />

          {snapshot && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-10">
              <img src={snapshot} className="w-full h-full object-cover" alt="Captured" />
              <div className="absolute inset-0 bg-green-500/10 border-4 border-green-500 rounded-[24px]" />
            </motion.div>
          )}

          {!snapshot && status === "granted" && (
            <>
              {/* Dynamic Scanning Laser */}
              <motion.div 
                animate={{ top: ["0%", "100%", "0%"] }} 
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className={`absolute left-0 right-0 h-1 z-20 pointer-events-none ${faceValid ? "bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)]" : "bg-indigo-400/30 shadow-[0_0_10px_rgba(129,140,248,0.4)]"}`} 
              />
              
              {/* Target Brackets */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-64 h-64 border-2 rounded-[40px] transition-all duration-500 ${faceValid ? "border-green-500 scale-105" : "border-white/20 scale-100"}`}>
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-current rounded-tl-xl text-inherit" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-current rounded-tr-xl text-inherit" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-current rounded-bl-xl text-inherit" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-current rounded-br-xl text-inherit" />
                </div>
              </div>

              {/* Dynamic Status Display */}
              <div className="absolute inset-x-0 bottom-8 flex justify-center z-30">
                {faceValid ? (
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black text-3xl shadow-2xl flex items-center gap-3">
                    <UserCheck className="w-8 h-8 text-green-500" /> {countdown}
                  </motion.div>
                ) : (
                  <div className="bg-black/40 backdrop-blur-md text-white px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] border border-white/20">
                    {faceError || "Position face inside frame"}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Loader Overlay */}
          {status === "requesting" && (
            <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center text-slate-400 z-40">
              <Loader2 className="animate-spin w-10 h-10 mb-4 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-widest">Waking Sensors...</span>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* Dynamic Controls */}
        <div className="space-y-4">
          {status === "idle" && (
            <Button onClick={requestCamera} className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]">
              <Camera className="mr-2 w-5 h-5" /> Start Verification
            </Button>
          )}
          
          {snapshot && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => { setSnapshot(null); setRestartKey(k => k + 1); }} className="h-14 rounded-2xl border-2 font-bold text-slate-600 hover:bg-slate-50">
                <RefreshCw className="w-4 h-4 mr-2" /> Retake
              </Button>
              <Button onClick={() => onSuccess?.(snapshot)} className="h-14 rounded-2xl bg-green-600 hover:bg-green-700 font-bold shadow-xl shadow-green-100 text-white">
                Proceed <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </div>

        <p className="mt-6 text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Encrypted Biometric Verification</p>
      </div>
    </motion.div>
  );
};

export default CameraSetup;