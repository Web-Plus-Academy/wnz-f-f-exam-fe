import { QuestionState, Subject } from '@/types/exam';
import { User } from 'lucide-react';

interface QuestionGridProps {
  questions: QuestionState[];
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  candidateName: string;
  subject: Subject;
}

const statusToClass: Record<string, string> = {
  'not-visited': 'question-btn-not-visited',
  'visited': 'question-btn-visited',
  'answered': 'question-btn-answered',
  'marked': 'question-btn-marked',
  'marked-answered': 'question-btn-marked-answered',
};

export const QuestionGrid = ({ 
  questions, 
  currentQuestionIndex, 
  onQuestionSelect,
  candidateName,
  subject,
}: QuestionGridProps) => {
  const subjectLabel = subject.charAt(0).toUpperCase() + subject.slice(1);

  return (
    <div className="exam-panel h-full flex flex-col">
      {/* Candidate Info */}
      <div className="p-4 border-b border-panel-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{candidateName}</p>
            <p className="text-sm text-muted-foreground">{subjectLabel}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-b border-panel-border">
        <p className="text-sm font-medium text-muted-foreground mb-3">Question Palette</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded question-btn-not-visited" />
            <span>Not Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded question-btn-visited" />
            <span>Not Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded question-btn-answered" />
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded question-btn-marked" />
            <span>Marked</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <div className="w-6 h-6 rounded question-btn-marked-answered" />
            <span>Marked & Answered</span>
          </div>
        </div>
      </div>

      {/* Question Numbers Grid */}
      <div className="p-4 flex-1 overflow-y-auto">
        <p className="text-sm font-medium text-muted-foreground mb-3">
          Choose a Question
        </p>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, index) => (
            <button
              key={q.questionId}
              onClick={() => onQuestionSelect(index)}
              className={`question-btn ${statusToClass[q.status]} ${
                currentQuestionIndex === index ? 'question-btn-current' : ''
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
