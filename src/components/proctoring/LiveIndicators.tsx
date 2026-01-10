import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, UserX, Mic, MousePointer2 } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppDispatch";

export const LiveIndicators = () => {
  const { 
    warningCount, 
    tabSwitchCount, 
    faceOffCount,    
    noiseDetectedCount 
  } = useAppSelector((state) => state.proctoring);

  // Updated variants for horizontal entry (sliding down from top)
  const itemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.1 } }
  };

  return (
    // Changed to flex-row and items-center for a single line
    <div className="fixed top-20 right-4 z-50 flex flex-row items-center gap-2">
      
      {/* 🔴 Status Pill (Kept separate or first in row) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md border border-red-500/50 text-white px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg mr-1"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        AI-Proctored LIVE
      </motion.div>

      {/* Wrapper for the dynamic warning pills */}
      <div className="flex flex-row items-center gap-2">
        <AnimatePresence mode="popLayout">
          
          {/* ⚠️ Warnings */}
          {warningCount > 0 && (
            <motion.div
              key="warnings"
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md border border-red-400 whitespace-nowrap"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Warnings: {warningCount}</span>
            </motion.div>
          )}

          {/* 👤 Face Offs */}
          {faceOffCount > 0 && (
            <motion.div
              key="face-offs"
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-md border border-slate-600 whitespace-nowrap"
            >
              <UserX className="h-3.5 w-3.5 text-blue-400" />
              <span>Face Offs: {faceOffCount}</span>
            </motion.div>
          )}

          {/* 🎤 Noise */}
          {noiseDetectedCount > 0 && (
            <motion.div
              key="noise-detections"
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-md border border-slate-600 whitespace-nowrap"
            >
              <Mic className="h-3.5 w-3.5 text-indigo-400" />
              <span>Noise: {noiseDetectedCount}</span>
            </motion.div>
          )}

          {/* 🔁 Tab Switches */}
          {tabSwitchCount > 0 && (
            <motion.div
              key="tab-switches"
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex items-center gap-2 bg-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-md border border-orange-400 whitespace-nowrap"
            >
              <MousePointer2 className="h-3.5 w-3.5" />
              <span>Tabs: {tabSwitchCount}</span>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};