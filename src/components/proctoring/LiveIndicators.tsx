import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mic, Monitor, User, AlertTriangle, Volume2 } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppDispatch';

export const LiveIndicators = () => {
  const { 
    cameraStream, 
    microphoneStream, 
    screenStream,
    faceDetected,
    faceCount,
    noiseLevel,
    noiseThreshold,
    warningCount,
    tabSwitchCount,
  } = useAppSelector((state) => state.proctoring);

  const isNoisy = noiseLevel > noiseThreshold;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
      {/* Recording indicator */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        REC
      </motion.div>

      {/* Status badges */}
      <div className="flex flex-col gap-1.5">
        <AnimatePresence>
          {/* Camera Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-md ${
              cameraStream ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            {cameraStream ? 'Camera On' : 'Camera Off'}
          </motion.div>

          {/* Face Detection Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-md ${
              faceDetected 
                ? 'bg-green-500/90 text-white' 
                : faceCount > 1 
                  ? 'bg-orange-500/90 text-white' 
                  : 'bg-yellow-500/90 text-white'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            {faceDetected 
              ? 'Face OK' 
              : faceCount > 1 
                ? `${faceCount} Faces` 
                : 'No Face'}
          </motion.div>

          {/* Mic Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-md ${
              microphoneStream 
                ? isNoisy 
                  ? 'bg-orange-500/90 text-white' 
                  : 'bg-green-500/90 text-white'
                : 'bg-red-500/90 text-white'
            }`}
          >
            <Volume2 className="h-3.5 w-3.5" />
            {microphoneStream 
              ? isNoisy 
                ? 'Noisy' 
                : 'Quiet' 
              : 'Mic Off'}
          </motion.div>

          {/* Screen Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-md ${
              screenStream ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            {screenStream ? 'Screen On' : 'Screen Off'}
          </motion.div>

          {/* Warning Count */}
          {warningCount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-md bg-red-600 text-white"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {warningCount} Warning{warningCount > 1 ? 's' : ''}
            </motion.div>
          )}

          {/* Tab Switch Count */}
          {tabSwitchCount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-md bg-orange-600 text-white"
            >
              Tab Switches: {tabSwitchCount}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
