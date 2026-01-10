import { motion } from "framer-motion";
import { Shield, Camera, Mic, AlertTriangle, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface PrivacyNoticeProps {
  onAccept: () => void;
}

export const PrivacyNotice = ({ onAccept }: PrivacyNoticeProps) => {
  const [accepted, setAccepted] = useState(false);

  const features = [
    {
      icon: Camera,
      title: "Camera Monitoring",
      description:
        "Your webcam will remain active throughout the exam for identity verification and AI-based face monitoring.",
    },
    {
      icon: Mic,
      title: "Audio Monitoring",
      description:
        "Microphone input will be analyzed to detect unusual noise or speaking during the exam.",
    },
    {
      icon: Monitor,
      title: "Fullscreen & Tab Monitoring",
      description:
        "The exam must remain in fullscreen mode. Tab switching or minimizing the window will be detected.",
    },
    {
      icon: Shield,
      title: "AI Proctoring",
      description:
        "AI systems will analyze behavior patterns such as face presence, movement, and focus to ensure exam integrity.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-card rounded-lg border border-border p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Proctoring & Privacy Notice
            </h2>
            <p className="text-sm text-muted-foreground">
              Please review carefully before continuing
            </p>
          </div>
        </div>

        {/* Warning Box */}
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-foreground">
            <strong>Important:</strong> This examination uses AI-assisted
            proctoring to maintain fairness and integrity. The monitoring
            measures listed below will be active during your exam session.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex gap-4 p-3 rounded-lg bg-muted/50"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Consent */}
        <div className="border-t border-border pt-6">
          <div className="flex items-start gap-3 mb-6">
            <Checkbox
              id="privacy-consent"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
            />
            <label
              htmlFor="privacy-consent"
              className="text-sm text-foreground cursor-pointer"
            >
              I have read and understood the proctoring rules. I consent to the
              use of my camera, microphone, fullscreen enforcement, and
              AI-based monitoring during the examination. I understand that
              violations may result in warnings or automatic submission.
            </label>
          </div>

          <Button
            onClick={onAccept}
            disabled={!accepted}
            className="w-full"
            size="lg"
          >
            Continue to Setup
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
