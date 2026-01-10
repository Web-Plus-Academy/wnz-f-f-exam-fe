import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Minimize2, User, UserX, Users } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { useFaceDetection } from "@/hooks/useFaceDetection";

interface CameraPreviewProps {
  stream: MediaStream | null;
}

export const CameraPreview = ({ stream }: CameraPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const dragOffset = useRef({ x: 0, y: 0 });

  // Get faceCount from Redux
  const { faceCount } = useAppSelector((state) => state.proctoring);

  /**
   * 🧠 FIX: Pass '!!stream' to satisfy the 'isActive: boolean' requirement
   * This tells the hook to start detecting only when the camera is on.
   */
  useFaceDetection(videoRef, !!stream);

  // 🎥 Attach stream to video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    video.srcObject = stream;
    
    const handlePlay = () => setIsVideoReady(true);
    video.addEventListener("playing", handlePlay);
    
    video.play().catch((err) => console.error("Video play failed:", err));

    return () => {
      video.removeEventListener("playing", handlePlay);
      video.srcObject = null;
    };
  }, [stream]);

  // 📍 Initial Position Logic
  useEffect(() => {
    const margin = 16;
    const width = isMinimized ? 56 : 192; 
    const height = isMinimized ? 56 : 144;
    setPosition({
      x: window.innerWidth - width - margin,
      y: window.innerHeight - height - margin,
    });
  }, [isMinimized]);

  // 🖱 Drag Logic
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };
    const onMouseUp = () => setDragging(false);
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  if (!stream) return null;

  const faceStatus = faceCount === 0 
    ? { text: "No Face", color: "bg-red-500", icon: <UserX className="h-3.5 w-3.5" /> } 
    : faceCount === 1 
    ? { text: "Face OK", color: "bg-green-500", icon: <User className="h-3.5 w-3.5" /> } 
    : { text: `${faceCount} Faces`, color: "bg-orange-500", icon: <Users className="h-3.5 w-3.5" /> };

  return (
    <motion.div
      ref={containerRef}
      style={{ left: position.x, top: position.y }}
      className="fixed z-50 cursor-move select-none"
      onMouseDown={(e) => {
        if (!containerRef.current) return;
        setDragging(true);
        const rect = containerRef.current.getBoundingClientRect();
        dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }}
    >
      <div className={`bg-card rounded-lg border border-border shadow-xl overflow-hidden transition-all duration-300 ${isMinimized ? "w-14 h-14" : "w-48 h-36"}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isMinimized ? "opacity-0" : "opacity-100"}`}
        />
        {isMinimized ? (
          <button onClick={() => setIsMinimized(false)} className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Camera className="h-6 w-6 text-primary" />
          </button>
        ) : (
          isVideoReady && (
            <>
              <div className={`absolute bottom-2 left-2 ${faceStatus.color} text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                {faceStatus.icon}
                {faceStatus.text}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                className="absolute top-2 right-2 w-6 h-6 rounded bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </>
          )
        )}
      </div>
    </motion.div>
  );
};