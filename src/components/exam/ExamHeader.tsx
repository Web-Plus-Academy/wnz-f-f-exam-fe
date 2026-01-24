import { ExamTimer } from './ExamTimer';

interface ExamHeaderProps {
  examName: string;
  formattedTime: string;
  isTimeLow: boolean;
}

export const ExamHeader = ({ examName, formattedTime, isTimeLow }: ExamHeaderProps) => {
  return (
    <header className="bg-exam-header text-exam-header-foreground px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20  flex items-center justify-center">
            <span className="text-primary font-bold text-xl">
              <img
                src="./public/favicon.ico"
                alt="SWCET"
                className="w-20 h-20 object-contain"
              />
            </span>
          </div>
          <div>
            <h1 className="text-xl font-semibold">Saredufy-WebNexZ Common Entrace Exam</h1>
            <p className="text-sm text-white/80">(CBT) Computer Based Test</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-white/80">Time Remaining</p>
          </div>
          <ExamTimer formattedTime={formattedTime} isLow={isTimeLow} />
        </div>
      </div>
    </header>
  );
};
