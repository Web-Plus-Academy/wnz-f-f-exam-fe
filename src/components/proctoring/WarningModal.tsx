import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XCircle, Info, X, Mic, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { dismissWarningModal } from '@/store/proctoringSlice';

export const WarningModal = () => {
  const dispatch = useAppDispatch();
  const { activeWarningModal, warningCount } = useAppSelector(
    (state) => state.proctoring
  );

  if (!activeWarningModal) return null;

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          icon: XCircle,
          bgColor: 'bg-white',
          borderColor: 'border-red-600',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          accentBar: 'bg-red-600',
          title: 'Critical Violation',
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-white',
          borderColor: 'border-amber-500',
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          accentBar: 'bg-amber-500',
          title: 'Behavioral Warning',
        };
      case 'noise':
        return {
          icon: Mic,
          bgColor: 'bg-white',
          borderColor: 'border-indigo-500',
          iconBg: 'bg-indigo-100',
          iconColor: 'text-indigo-600',
          accentBar: 'bg-indigo-500',
          title: 'Audio Disturbance',
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-white',
          borderColor: 'border-blue-500',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          accentBar: 'bg-blue-500',
          title: 'System Notice',
        };
    }
  };

  const config = getSeverityConfig(activeWarningModal.severity);
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      >
        <motion.div
          key={activeWarningModal.id}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative w-full max-w-md ${config.bgColor} border-t-4 ${config.borderColor} rounded-2xl shadow-2xl overflow-hidden`}
        >
          {/* Header Section */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${config.iconBg} ${config.iconColor}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
                  Strike Status
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-200`}>
                  {warningCount} / 20
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {config.title}
              </h3>
              <p className="text-slate-600 mt-2 leading-relaxed font-medium">
                {activeWarningModal.message}
              </p>
            </div>
          </div>

          {/* Warning Content Area */}
          <div className="px-6 py-4 bg-slate-50 border-y border-slate-100">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wide">
                Consequence
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Continued violations will result in automated exam termination and submission.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="p-6 flex flex-col gap-3">
            <Button
              onClick={() => dispatch(dismissWarningModal())}
              className={`w-full h-12 text-sm font-bold uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] ${config.accentBar} text-white hover:opacity-90`}
            >
              Acknowledge & Continue
            </Button>
            
            <p className="text-[10px] text-center text-slate-400 font-medium italic">
              Logged at {new Date(activeWarningModal.timestamp).toLocaleTimeString()}
            </p>
          </div>

          {/* Animated Progress Bar Decoration */}
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8 }}
            className={`h-1 ${config.accentBar} opacity-50`}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};