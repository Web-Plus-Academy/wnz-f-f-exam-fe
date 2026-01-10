import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as faceDetection from "@mediapipe/face_detection";
import * as camUtils from "@mediapipe/camera_utils";

interface CameraSetupProps {
  onSuccess?: (image: string) => void;
}

export const CameraSetup = ({ onSuccess }: CameraSetupProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState<
    "idle" | "requesting" | "granted" | "denied"
  >("idle");

  const [videoReady, setVideoReady] = useState(false);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [restartKey, setRestartKey] = useState(0);
  const [faceValid, setFaceValid] = useState(false);
  const [faceError, setFaceError] = useState<string | null>(null);

  /* 📸 SNAPSHOT */
  const captureSnapshot = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    if (!faceValid) return null; // 🔒 FACE CHECK

    const video = videoRef.current;
    if (video.videoWidth === 0) return null;

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);

    return canvas.toDataURL("image/jpeg", 0.9);
  };

  /* 🎥 CAMERA */
  const requestCamera = async () => {
    setStatus("requesting");
    setSnapshot(null);
    setCountdown(3);
    setFaceValid(false);
    setFaceError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setStatus("granted");
    } catch {
      setStatus("denied");
    }
  };

/* 🧠 PRODUCTION SAFE FACE DETECTION */
useEffect(() => {
  if (status !== "granted" || !videoRef.current) return;

  let camera: any = null;
  let detector: any = null;

  const startAI = async () => {
    try {
      /**
       * 🛠️ THE FIX: Safe Constructor Access
       * In production builds, the class might be under .FaceDetection 
       * or the object itself. This prevents the "not a constructor" error.
       */
      const FD_Class = (faceDetection as any).FaceDetection || 
                       (faceDetection as any).default?.FaceDetection || 
                       faceDetection;

      detector = new FD_Class({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
        },
      });

      detector.setOptions({
        model: "short",
        minDetectionConfidence: 0.6,
      });

      detector.onResults((results: any) => {
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

      // Safe access for the Camera class
      const Cam_Class = (camUtils as any).Camera || 
                        (camUtils as any).default?.Camera || 
                        camUtils;

      camera = new Cam_Class(videoRef.current!, {
        onFrame: async () => {
          if (videoRef.current) {
            await detector.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });

      await camera.start();
    } catch (err) {
      console.error("Netlify AI Error:", err);
      setFaceError("Security AI failed to initialize");
    }
  };

  startAI();

  return () => {
    if (camera) camera.stop();
    if (detector) detector.close();
  };
}, [status, restartKey]);

  /* ⏱ AUTO CAPTURE (ONLY IF FACE VALID) */
  useEffect(() => {
    if (status !== "granted") return;
    if (!videoReady) return;
    if (snapshot) return;
    if (!faceValid) return;

    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          const img = captureSnapshot();
          if (img) setSnapshot(img);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, videoReady, faceValid, restartKey]);

  /* 🔁 RETAKE */
  const handleRetake = async () => {
    setSnapshot(null);
    setCountdown(3);
    setRestartKey((k) => k + 1);
    setFaceValid(false);
    setFaceError(null);

    if (videoRef.current) {
      await videoRef.current.play();
    }
  };

  /* ✅ PROCEED */
  const handleProceed = () => {
    if (snapshot) onSuccess?.(snapshot);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto relative"
    >
      {/* Face thumbnail */}
      {snapshot && (
        <div className="absolute top-0 right-0 z-20">
          <div className="w-20 h-20 rounded-full border-4 border-green-500 overflow-hidden shadow">
            <img src={snapshot} className="w-full h-full object-cover" />
          </div>
          <p className="text-[10px] text-center text-green-600 mt-1 font-medium">
            Verified
          </p>
        </div>
      )}

      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Camera className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold">Camera Verification</h2>
        </div>

        {/* 🔔 Instructions */}
        <div className="mb-4 rounded-lg border border-warning/30 bg-warning/10 p-3">
          <div className="flex items-center gap-2 text-warning font-semibold mb-1">
            <AlertTriangle className="h-4 w-4" />
            Important Instructions
          </div>
          <ul className="text-sm list-disc list-inside space-y-1">
            <li>Sit in a clean background</li>
            <li>Lighting must be in front of your face</li>
            <li>Only one face should be visible</li>
            <li>Do not move during capture</li>
          </ul>
        </div>

        {/* Preview */}
        <div className="aspect-video bg-muted rounded-md relative mb-4 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={() => setVideoReady(true)}
            className={`w-full h-full object-cover ${
              snapshot ? "opacity-0 absolute" : "opacity-100"
            }`}
          />

          {snapshot && (
            <img
              src={snapshot}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {status === "granted" && !snapshot && faceValid && countdown > 0 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-1 rounded">
              ⏳ Capturing in <b>{countdown}</b>
            </div>
          )}

          {faceError && status === "granted" && !snapshot && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded text-xs">
              {faceError}
            </div>
          )}

          {status === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p>Camera preview</p>
            </div>
          )}

          {status === "requesting" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin" />
              <p>Requesting camera…</p>
            </div>
          )}

          {status === "denied" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500">
              <XCircle />
              <p>Camera denied</p>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {status === "idle" && (
          <Button onClick={requestCamera} className="w-full">
            Enable Camera
          </Button>
        )}

        {snapshot && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRetake} className="w-full">
              Retake
            </Button>
            <Button onClick={handleProceed} className="w-full">
              Proceed
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CameraSetup;
