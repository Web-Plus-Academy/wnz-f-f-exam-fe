import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XCircle, Info, X, Mic } from 'lucide-react';
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
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/50',
          iconColor: 'text-red-500',
          title: 'Critical Warning',
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-orange-500/20',
          borderColor: 'border-orange-500/50',
          iconColor: 'text-orange-500',
          title: 'Warning',
        };
      case 'noise':
        return {
          icon: Mic,
          bgColor: 'bg-indigo-500/20',
          borderColor: 'border-indigo-500/50',
          iconColor: 'text-indigo-500',
          title: 'Noise Alert',
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/50',
          iconColor: 'text-yellow-500',
          title: 'Notice',
        };
    }
  };

  const config = getSeverityConfig(activeWarningModal.severity);
  const Icon = config.icon;

  const handleDismiss = () => {
    dispatch(dismissWarningModal());
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-md"
      >
        <motion.div
          // 🚀 CRITICAL FIX: The key ensures the modal re-appears every time a new warning arrives
          key={activeWarningModal.id || 'warning-modal'} 
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`w-full max-w-md ${config.bgColor} ${config.borderColor} border-2 rounded-xl shadow-2xl overflow-hidden`}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className={`h-5 w-5 ${config.iconColor}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`font-semibold ${config.iconColor}`}>
                    {config.title}
                  </h3>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground font-mono">
                    #{warningCount}
                  </span>
                </div>

                <p className="text-sm text-foreground mt-1 leading-relaxed">
                  {activeWarningModal.message}
                </p>

                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-3 font-semibold">
                  Detected at: {new Date(activeWarningModal.timestamp).toLocaleTimeString()}
                </p>
              </div>

              <button
                onClick={handleDismiss}
                className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Close warning"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="px-4 pb-4">
            <Button
              onClick={handleDismiss}
              variant="secondary"
              className="w-full font-bold shadow-sm"
              size="sm"
            >
              I Understand
            </Button>
          </div>
          
          {/* Visual Progress Bar (Optional decoration) */}
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            className={`h-1 ${config.iconColor} bg-current opacity-30`}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};