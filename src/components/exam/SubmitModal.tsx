import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  stats: {
    total: number;
    answered: number;
    notAnswered: number;
    marked: number;
    notVisited: number;
  };
}

export const SubmitModal = ({ isOpen, onClose, onConfirm, stats }: SubmitModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-warning/10 p-4 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-warning" />
              <h2 className="text-lg font-semibold text-foreground">Submit Exam?</h2>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-muted-foreground mb-4">
                Are you sure you want to submit your exam? This action cannot be undone.
              </p>

              {/* Stats */}
              <div className="bg-secondary rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Questions:</span>
                  <span className="font-medium">{stats.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Answered:</span>
                  <span className="font-medium text-success">{stats.answered}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Not Answered:</span>
                  <span className="font-medium text-warning">{stats.notAnswered}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Marked for Review:</span>
                  <span className="font-medium">{stats.marked}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Not Visited:</span>
                  <span className="font-medium text-muted-foreground">{stats.notVisited}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-secondary/50 flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="exam-action-btn exam-action-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                className="exam-action-btn exam-action-primary"
              >
                Yes, Submit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
