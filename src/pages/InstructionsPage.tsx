import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckSquare, Square, AlertTriangle, Clock, BookOpen, FileText } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setHasReadInstructions } from '@/store/authSlice';
import { startExam } from '@/store/examSlice';
import { TOTAL_QUESTIONS, QUESTIONS_PER_SUBJECT, EXAM_DURATION } from '@/data/questions';

const InstructionsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  const [agreed, setAgreed] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleStartExam = () => {
    if (!agreed) return;
    dispatch(setHasReadInstructions(true));
    dispatch(startExam());
    navigate('/exam');
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} minutes` : ''}`;
  };

  const instructions = [
    'The examination will comprise of Objective Type Multiple Choice Questions (MCQs).',
    'All questions are compulsory and each carries equal marks.',
    'There is NO negative marking for incorrect answers.',
    'The clock will be set at the server. The countdown timer in the top right corner will display the remaining time available for you to complete the examination.',
    'When the timer reaches zero, the examination will end by itself. You will NOT be required to end or submit your examination.',
    'You can click on the question number in the Question Palette to go to that question directly.',
    'Do NOT refresh the page or use the browser back button during the examination.',
    'Switching tabs or windows during the exam is strictly prohibited and may be flagged.',
    'Right-click menu and keyboard shortcuts are disabled during the examination.',
    'You can mark questions for review and revisit them before final submission.',
  ];

  const legendItems = [
    { color: 'bg-question-not-visited', label: 'Not Visited - Question not yet accessed' },
    { color: 'bg-question-visited', label: 'Not Answered - Question visited but not answered' },
    { color: 'bg-question-answered', label: 'Answered - Question has been answered' },
    { color: 'bg-question-marked', label: 'Marked for Review - Question marked but not answered' },
    { color: 'bg-question-marked-answered', label: 'Answered & Marked - Question answered and marked for review' },
  ];

  return (
    <div className="min-h-screen bg-panel-bg flex flex-col">
      {/* Header */}
      <header className="bg-exam-header text-exam-header-foreground py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md">
            <span className="text-primary font-bold text-xl">NTA</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">JEE Main 2024 - Model Test</h1>
            <p className="text-white/80 text-sm">Instructions & Guidelines</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Candidate Info Card */}
            <div className="bg-card rounded-lg border border-border p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Candidate Name</p>
                  <p className="font-semibold text-foreground">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Application Number</p>
                  <p className="font-semibold text-foreground">{user?.applicationNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Exam Name</p>
                  <p className="font-semibold text-foreground">JEE Main Model Test</p>
                </div>
              </div>
            </div>

            {/* Exam Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{TOTAL_QUESTIONS}</p>
                  <p className="text-sm text-muted-foreground">Total Questions</p>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <p className="text-sm text-muted-foreground">Subjects ({QUESTIONS_PER_SUBJECT} each)</p>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{formatDuration(EXAM_DURATION)}</p>
                  <p className="text-sm text-muted-foreground">Duration</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Important Instructions
              </h2>
              <ol className="space-y-3">
                {instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3 text-sm text-foreground">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Question Status Legend */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Question Status Legend
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {legendItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded ${item.color}`} />
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Agreement & Start */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-start gap-3 mb-6">
                <button
                  onClick={() => setAgreed(!agreed)}
                  className="flex-shrink-0 mt-0.5"
                >
                  {agreed ? (
                    <CheckSquare className="h-6 w-6 text-primary" />
                  ) : (
                    <Square className="h-6 w-6 text-muted-foreground" />
                  )}
                </button>
                <p className="text-sm text-foreground">
                  I have read and understood the instructions. I agree to abide by the rules and regulations of the examination. I understand that any malpractice will lead to disqualification.
                </p>
              </div>

              <button
                onClick={handleStartExam}
                disabled={!agreed}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  agreed
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {agreed ? 'Start Examination' : 'Please read and accept the instructions to proceed'}
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default InstructionsPage;
