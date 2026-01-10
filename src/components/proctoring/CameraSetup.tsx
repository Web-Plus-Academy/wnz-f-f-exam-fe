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
    
    // Draw mirrored if necessary, or standard
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
        // Handle production bundling variations for MediaPipe
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

  // Handle countdown logic separately to prevent unnecessary AI re-renders
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto relative p-4">
      {snapshot && (
        <div className="absolute -top-4 -right-4 z-20">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 rounded-full border-4 border-green-500 overflow-hidden shadow-2xl">
            <img src={snapshot} className="w-full h-full object-cover" alt="Verification" />
          </motion.div>
        </div>
      )}

      <div className="bg-white border rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Camera className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-800">Identity Verification</h2>
        </div>

        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 text-sm">
          <div className="flex items-center gap-2 font-bold mb-1">
            <AlertTriangle className="h-4 w-4" /> Instructions
          </div>
          <ul className="list-disc list-inside opacity-90">
            <li>Ensure you are alone in the frame</li>
            <li>Maintain clear lighting on your face</li>
            <li>Hold still once the face is detected</li>
          </ul>
        </div>

        <div className="aspect-video bg-slate-100 rounded-xl relative mb-6 overflow-hidden border-2 border-slate-200">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={() => setVideoReady(true)}
            className={`w-full h-full object-cover ${snapshot ? "hidden" : "block"}`}
          />

          {snapshot && <img src={snapshot} className="absolute inset-0 w-full h-full object-cover" alt="Snapshot" />}

          {!snapshot && status === "granted" && (
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              {faceValid ? (
                <div className="bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg animate-pulse">
                   Capturing in {countdown}...
                </div>
              ) : (
                <div className="bg-black/60 text-white px-6 py-2 rounded-full text-sm backdrop-blur-sm">
                  {faceError || "Waiting for alignment..."}
                </div>
              )}
            </div>
          )}

          {status === "requesting" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50">
              <Loader2 className="animate-spin text-indigo-600 h-10 w-10 mb-2" />
              <p className="text-slate-500 font-medium">Starting AI Engine...</p>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex flex-col gap-3">
          {status === "idle" && (
            <Button onClick={requestCamera} size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 text-lg">
              Start Verification
            </Button>
          )}

          {snapshot && (
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => { setSnapshot(null); setRestartKey(k => k + 1); }} className="flex-1 h-12">
                Retake
              </Button>
              <Button onClick={() => onSuccess?.(snapshot)} className="flex-1 bg-green-600 hover:bg-green-700 h-12">
                Proceed
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CameraSetup;