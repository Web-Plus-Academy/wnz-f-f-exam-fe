import { motion } from 'framer-motion';
import { Shield, Camera, Mic, Monitor, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

interface PrivacyNoticeProps {
  onAccept: () => void;
}

export const PrivacyNotice = ({ onAccept }: PrivacyNoticeProps) => {
  const [accepted, setAccepted] = useState(false);

  const features = [
    {
      icon: Camera,
      title: 'Camera Recording',
      description: 'Your webcam will be active throughout the exam for identity verification and proctoring.',
    },
    {
      icon: Mic,
      title: 'Audio Monitoring',
      description: 'Ambient noise levels will be monitored to ensure exam integrity.',
    },
    {
      icon: Monitor,
      title: 'Screen Recording',
      description: 'Your browser tab will be recorded to prevent unauthorized access to other resources.',
    },
    {
      icon: Shield,
      title: 'AI Monitoring',
      description: 'Face detection AI will verify your presence and detect any anomalies.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-card rounded-lg border border-border p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Proctoring Privacy Notice</h2>
            <p className="text-sm text-muted-foreground">Please read carefully before proceeding</p>
          </div>
        </div>

        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-foreground">
            <strong>Important:</strong> This examination uses AI-powered proctoring to ensure fairness and integrity. 
            The following monitoring features will be active during your exam session.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6">
          <div className="flex items-start gap-3 mb-6">
            <Checkbox
              id="privacy-consent"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
            />
            <label htmlFor="privacy-consent" className="text-sm text-foreground cursor-pointer">
              I understand and consent to the proctoring measures described above. I acknowledge that my 
              camera, microphone, and screen activity will be monitored and recorded during the examination.
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
