import { Question } from '@/types/exam';
import { motion } from 'framer-motion';

interface QuestionPanelProps {
  question: Question;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  onSelectOption: (option: 'A' | 'B' | 'C' | 'D') => void;
}

export const QuestionPanel = ({ question, selectedOption, onSelectOption }: QuestionPanelProps) => {
  const optionKeys = ['A', 'B', 'C', 'D'] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-lg border border-border p-6"
    >
      {/* Question Header */}
      <div className="flex items-start gap-4 mb-6">
        <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
          {question.questionNumber}
        </span>
        <p className="text-lg leading-relaxed text-foreground flex-1">
          {question.questionText}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3 ml-14">
        {optionKeys.map((key) => (
          <button
            key={key}
            onClick={() => onSelectOption(key)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-start gap-3 ${
              selectedOption === key
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-secondary/50'
            }`}
          >
            <div 
              className={`option-radio flex-shrink-0 mt-0.5 ${
                selectedOption === key ? 'option-radio-selected' : ''
              }`}
            />
            <span className="font-medium text-muted-foreground mr-2">({key})</span>
            <span className="text-foreground">{question.options[key]}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
