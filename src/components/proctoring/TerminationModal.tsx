import { motion } from 'framer-motion';
import { ShieldAlert, LogOut, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const TerminationModal = ({ isOpen }: { isOpen: boolean }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-white border-t-8 border-red-600 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
            <ShieldAlert className="h-8 w-8 text-red-600" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            EXAM TERMINATED
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-1 mb-6">
            Security Protocol Engaged
          </p>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-8 text-left">
            <div className="flex items-center gap-3 mb-2">
              <FileCheck className="h-4 w-4 text-green-600" />
              <p className="text-sm font-bold text-slate-700">Answers Auto-Submitted</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your exam session has been terminated due to exceeding the allowed violation limit. Your responses have been saved and synced. This incident has been logged for review by the foundation board.
            </p>
          </div>

          <Button
            onClick={() => navigate("/summary", { replace: true })}
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Proceed to Summary
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};