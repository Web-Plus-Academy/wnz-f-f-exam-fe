import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

// 🛠️ FIX: Import as namespaces to avoid constructor errors
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
    if (video.videoWidth === 0) return null;

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);

    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const requestCamera = async () => {
    setStatus("requesting");
    setSnapshot(null);
    setFaceValid(false);
    setFaceError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("granted");
    } catch (err) {
      console.error("Camera access error:", err);
      setStatus("denied");
    }
  };

  /* 🧠 FIXED FACE DETECTION LOGIC */
  useEffect(() => {
    if (status !== "granted" || !videoRef.current) return;

    // Use the namespace constructor
    const detector = new faceDetection.FaceDetection({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    detector.setOptions({
      model: "short",
      minDetectionConfidence: 0.6,
    });

    detector.onResults((results) => {
      if (results.detections && results.detections.length === 1) {
        setFaceValid(true);
        setFaceError(null);
      } else if (results.detections && results.detections.length > 1) {
        setFaceValid(false);
        setFaceError("Multiple faces detected");
      } else {
        setFaceValid(false);
        setFaceError("No face detected");
      }
    });

    const camera = new camUtils.Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await detector.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();

    // 🧹 CLEANUP: Critical to prevent "UV" or "constructor" errors on re-renders
    return () => {
      camera.stop();
      detector.close();
    };
  }, [status, restartKey]);

  useEffect(() => {
    if (status !== "granted" || !videoReady || snapshot || !faceValid) return;

    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const img = captureSnapshot();
          if (img) setSnapshot(img);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, videoReady, faceValid, snapshot, restartKey]);

  const handleRetake = () => {
    setSnapshot(null);
    setCountdown(3);
    setRestartKey((k) => k + 1);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto relative">
      {snapshot && (
        <div className="absolute top-0 right-0 z-20">
          <div className="w-20 h-20 rounded-full border-4 border-green-500 overflow-hidden shadow-lg">
            <img src={snapshot} className="w-full h-full object-cover" alt="Snapshot" />
          </div>
          <p className="text-[10px] text-center text-green-600 mt-1 font-bold">VERIFIED</p>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Camera className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Identity Verification</h2>
        </div>

        <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-2">
            <AlertTriangle className="h-4 w-4" />
            Positioning Guide
          </div>
          <ul className="text-xs text-amber-800 space-y-1 opacity-80">
            <li>• Ensure your face is centered in the frame</li>
            <li>• Use a well-lit environment (no backlight)</li>
            <li>• Remove sunglasses or large hats</li>
          </ul>
        </div>

        <div className="aspect-video bg-slate-900 rounded-2xl relative mb-6 overflow-hidden shadow-inner">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={() => setVideoReady(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${snapshot ? "opacity-0" : "opacity-100"}`}
          />

          {snapshot && <img src={snapshot} className="absolute inset-0 w-full h-full object-cover" alt="Final" />}

          {!snapshot && status === "granted" && faceValid && countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl">
                <span className="text-2xl font-black text-primary">{countdown}</span>
              </div>
            </div>
          )}

          {faceError && status === "granted" && !snapshot && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg">
              {faceError}
            </div>
          )}

          {status === "requesting" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium opacity-70">Initializing Camera...</p>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {status === "idle" && (
          <Button onClick={requestCamera} className="w-full h-12 rounded-xl text-md font-bold transition-all hover:scale-[1.02]">
            Start Camera Verification
          </Button>
        )}

        {snapshot && (
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleRetake} className="w-full h-12 rounded-xl font-bold border-2">
              Retake
            </Button>
            <Button onClick={() => onSuccess?.(snapshot)} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
              Confirm & Proceed
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CameraSetup;