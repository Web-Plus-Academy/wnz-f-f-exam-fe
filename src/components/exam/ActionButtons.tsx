interface ActionButtonsProps {
  onSaveAndNext: () => void;
  onClearResponse: () => void;
  onMarkForReview: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

export const ActionButtons = ({
  onSaveAndNext,
  onClearResponse,
  onMarkForReview,
  onPrevious,
  onSubmit,
  isFirstQuestion,
}: ActionButtonsProps) => {
  return (
    <div className="bg-card border-t border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left side buttons */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={onMarkForReview}
            className="exam-action-btn exam-action-warning"
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

        {/* Right side buttons */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={onPrevious}
            disabled={isFirstQuestion}
            className="exam-action-btn exam-action-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button 
            onClick={onSaveAndNext}
            className="exam-action-btn exam-action-success"
          >
            Save & Next
          </button>
          <button 
            onClick={onSubmit}
            className="exam-action-btn exam-action-primary"
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
};
