import { Clock } from 'lucide-react';

interface ExamTimerProps {
  formattedTime: string;
  isLow?: boolean;
}

export const ExamTimer = ({ formattedTime, isLow }: ExamTimerProps) => {
  return (
    <div 
      className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-lg font-semibold ${
        isLow 
          ? 'bg-timer text-timer-foreground animate-pulse-slow' 
          : 'bg-secondary text-secondary-foreground'
      }`}
    >
      <Clock className="h-5 w-5" />
      <span>{formattedTime}</span>
    </div>
  );
};
