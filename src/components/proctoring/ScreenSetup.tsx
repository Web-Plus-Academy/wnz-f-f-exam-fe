import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScreenSetupProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const ScreenSetup = ({ onSuccess, onBack }: ScreenSetupProps) => {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartExam = async () => {
    if (!agreed) {
      setError("Please agree to the exam rules to continue.");
      return;
    }

    try {
      // 🔒 Fullscreen must be user-triggered
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }

      onSuccess();
    } catch {
      setError("Fullscreen permission is required to start the exam.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-card rounded-lg border border-border p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Exam Instructions
            </h2>
            <p className="text-sm text-muted-foreground">Final Step</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-muted rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
            <p className="text-sm text-foreground font-medium">
              AI-based proctoring is active during this examination
            </p>
          </div>

          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Camera must remain <strong>ON</strong> throughout the exam</li>
            <li>• Only <strong>one face</strong> should be visible</li>
            <li>• Do <strong>not talk</strong> or read questions aloud</li>
            <li>• Do <strong>not move away</strong> from the screen</li>
            <li>• Do <strong>not switch tabs</strong> or minimize the window</li>
            <li>• Leaving fullscreen may lead to <strong>auto submission</strong></li>
          </ul>
        </div>

        {/* Consent */}
        <div className="flex items-start gap-3 mb-6">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              setError(null);
            }}
            className="mt-1"
          />
          <span className="text-sm text-foreground">
            I have read and agree to follow all exam rules and understand that
            AI-based monitoring is enabled.
          </span>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-sm text-red-600">
            {error}
          </div>
        )}

        

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleStartExam}
            disabled={!agreed}
            className="w-full"
            size="lg"
          >
            Start Examination
          </Button>

          <Button onClick={onBack} variant="ghost" className="w-full">
            Back to Microphone
          </Button>
        </div>

        {/* Footer note */}
        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-green-500" />
          Proctoring systems are now ready
        </div>
      </div>
    </motion.div>
  );
};
