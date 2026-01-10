import React from "react";

interface ActionButtonsProps {
  onSaveAndNext: () => void;
  onClearResponse: () => void;
  onMarkForReview: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isFirstQuestion: boolean;
  isLastQuestionOfLastSubject: boolean; // Controls the final state
}

export const ActionButtons = ({
  onSaveAndNext,
  onClearResponse,
  onMarkForReview,
  onPrevious,
  onSubmit,
  isFirstQuestion,
  isLastQuestionOfLastSubject,
}: ActionButtonsProps) => {
  return (
    <div className="bg-card border-t border-border p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Side: Review & Clear */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={onMarkForReview}
            disabled={isLastQuestionOfLastSubject}
            className="exam-action-btn exam-action-warning disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale-[0.5]"
          >
            Mark for Review & Next
          </button>
          
          <button 
            onClick={onClearResponse}
            className="exam-action-btn exam-action-secondary"
          >
            Clear Response
          </button>
        </div>

        {/* Right Side: Navigation & Submission */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={onPrevious}
            disabled={isFirstQuestion}
            className="exam-action-btn exam-action-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {/* This button stays enabled until the very last question of the last subject */}
          <button 
            onClick={onSaveAndNext}
            disabled={isLastQuestionOfLastSubject}
            className={`exam-action-btn exam-action-success transition-all active:scale-95 
              ${isLastQuestionOfLastSubject ? 'opacity-50 cursor-not-allowed grayscale-[0.3]' : 'shadow-md shadow-emerald-100'}`}
          >
            Save & Next
          </button>

          <button 
            onClick={onSubmit}
            className="exam-action-btn exam-action-primary shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;