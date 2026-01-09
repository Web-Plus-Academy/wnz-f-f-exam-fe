import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Minimize2, Maximize2, User, UserX, Users } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { useFaceDetection } from '@/hooks/useFaceDetection';

interface CameraPreviewProps {
  stream: MediaStream | null;
}

export const CameraPreview = ({ stream }: CameraPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const { faceDetected, faceCount, cameraStream } = useAppSelector((state) => state.proctoring);
  
  // Enable face detection
  useFaceDetection(videoRef, cameraStream);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const getFaceIcon = () => {
    if (faceCount === 0) return <UserX className="h-3.5 w-3.5" />;
    if (faceCount === 1) return <User className="h-3.5 w-3.5" />;
    return <Users className="h-3.5 w-3.5" />;
  };

  const getFaceStatus = () => {
    if (faceCount === 0) return { text: 'No Face', color: 'bg-yellow-500' };
    if (faceCount === 1) return { text: 'Face OK', color: 'bg-green-500' };
    return { text: `${faceCount} Faces`, color: 'bg-orange-500' };
  };

  const faceStatus = getFaceStatus();

  if (!stream) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 left-4 z-50"
    >
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.button
            key="minimized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsMinimized(false)}
            className="w-14 h-14 rounded-full bg-card border-2 border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Camera className="h-6 w-6 text-primary" />
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-card rounded-lg border border-border shadow-xl overflow-hidden"
          >
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-48 h-36 object-cover"
              />
              
              {/* Face status badge */}
              <div className={`absolute bottom-2 left-2 ${faceStatus.color} text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                {getFaceIcon()}
                {faceStatus.text}
              </div>

              {/* Minimize button */}
              <button
                onClick={() => setIsMinimized(true)}
                className="absolute top-2 right-2 w-6 h-6 rounded bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
