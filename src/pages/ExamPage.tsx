import { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { useExamTimer } from '@/hooks/useExamTimer';
import { useExamSafety } from '@/hooks/useExamSafety';
import { useTabDetection } from '@/hooks/useTabDetection';
import { useNoiseDetection } from '@/hooks/useNoiseDetection';
import { startExam } from '@/store/examSlice';
import {
  setCurrentSubject,
  setCurrentQuestion,
  selectOption,
  saveAndNext,
  clearResponse,
  markForReview,
  previousQuestion,
  submitExam,
} from '@/store/examSlice';
import { allQuestions } from '@/data/questions';
import { Subject } from '@/types/exam';

import { ExamHeader } from '@/components/exam/ExamHeader';
import { SubjectTabs } from '@/components/exam/SubjectTabs';
import { QuestionPanel } from '@/components/exam/QuestionPanel';
import { QuestionGrid } from '@/components/exam/QuestionGrid';
import { ActionButtons } from '@/components/exam/ActionButtons';
import { SubmitModal } from '@/components/exam/SubmitModal';
import { LiveIndicators } from '@/components/proctoring/LiveIndicators';
import { CameraPreview } from '@/components/proctoring/CameraPreview';
import { WarningModal } from '@/components/proctoring/WarningModal';

const ExamPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, hasReadInstructions, user } = useAppSelector((state) => state.auth);
  const examState = useAppSelector((state) => state.exam);
  const { setupCompleted, microphoneStream } = useAppSelector((state) => state.proctoring);
  const { formattedTime, timeRemaining, isSubmitted } = useExamTimer();
  
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Enable proctoring features
  useTabDetection(!isSubmitted && hasReadInstructions);
  useNoiseDetection(null, !isSubmitted && hasReadInstructions);

  // Start exam when entering page
  useEffect(() => {
    if (setupCompleted && !examState.startTime) {
      dispatch(startExam());
    }
  }, [setupCompleted, examState.startTime, dispatch]);

  // Get camera stream
  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(stream);
      } catch (e) {
        console.log('Camera not available');
      }
    };
    if (setupCompleted) getCamera();
  }, [setupCompleted]);

  // Enable exam safety features
  useExamSafety(!isSubmitted && hasReadInstructions);

  // Redirect if exam is submitted
  useEffect(() => {
    if (isSubmitted) {
      navigate('/summary', { replace: true });
    }
  }, [isSubmitted, navigate]);

  // Redirect if not authenticated or hasn't read instructions
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!hasReadInstructions) {
    return <Navigate to="/instructions" replace />;
  }

  if (!setupCompleted) {
    return <Navigate to="/proctoring-setup" replace />;
  }

  const currentSubject = examState.currentSubject;
  const currentSubjectState = examState.subjects[currentSubject];
  const currentQuestionIndex = currentSubjectState.currentQuestionIndex;
  const currentQuestion = allQuestions[currentSubject][currentQuestionIndex];
  const currentQuestionState = currentSubjectState.questions[currentQuestionIndex];

  const handleSubjectChange = (subject: Subject) => {
    dispatch(setCurrentSubject(subject));
  };

  const handleQuestionSelect = (index: number) => {
    dispatch(setCurrentQuestion(index));
  };

  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D') => {
    dispatch(selectOption({ option }));
  };

  const handleSaveAndNext = () => {
    dispatch(saveAndNext());
  };

  const handleClearResponse = () => {
    dispatch(clearResponse());
  };

  const handleMarkForReview = () => {
    dispatch(markForReview());
  };

  const handlePrevious = () => {
    dispatch(previousQuestion());
  };

  const handleSubmit = () => {
    setShowSubmitModal(true);
  };

  const confirmSubmit = () => {
    dispatch(submitExam());
    setShowSubmitModal(false);
  };

  // Calculate stats for submit modal
  const calculateStats = () => {
    let answered = 0;
    let notAnswered = 0;
    let marked = 0;
    let notVisited = 0;

    Object.values(examState.subjects).forEach((subject) => {
      subject.questions.forEach((q) => {
        switch (q.status) {
          case 'answered':
          case 'marked-answered':
            answered++;
            break;
          case 'marked':
            marked++;
            notAnswered++;
            break;
          case 'visited':
            notAnswered++;
            break;
          case 'not-visited':
            notVisited++;
            break;
        }
        if (q.status === 'marked' || q.status === 'marked-answered') {
          marked++;
        }
      });
    });

    // Fix marked count (was double counting)
    marked = 0;
    Object.values(examState.subjects).forEach((subject) => {
      subject.questions.forEach((q) => {
        if (q.status === 'marked' || q.status === 'marked-answered') {
          marked++;
        }
      });
    });

    return {
      total: 30,
      answered,
      notAnswered: 30 - answered,
      marked,
      notVisited,
    };
  };

  const isTimeLow = timeRemaining < 600; // Less than 10 minutes

  return (
    <div className="h-screen flex flex-col bg-panel-bg exam-mode overflow-hidden">
      {/* Header */}
      <ExamHeader 
        examName="JEE Main 2024 - Model Test"
        formattedTime={formattedTime}
        isTimeLow={isTimeLow}
      />

      {/* Subject Tabs */}
      <SubjectTabs 
        currentSubject={currentSubject}
        onSubjectChange={handleSubjectChange}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            <QuestionPanel
              question={currentQuestion}
              selectedOption={currentQuestionState.selectedOption}
              onSelectOption={handleSelectOption}
            />
          </div>

          {/* Action Buttons */}
          <ActionButtons
            onSaveAndNext={handleSaveAndNext}
            onClearResponse={handleClearResponse}
            onMarkForReview={handleMarkForReview}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            isFirstQuestion={currentQuestionIndex === 0}
            isLastQuestion={currentQuestionIndex === currentSubjectState.questions.length - 1}
          />
        </div>

        {/* Question Grid Sidebar */}
        <div className="w-72 border-l border-panel-border">
          <QuestionGrid
            questions={currentSubjectState.questions}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionSelect={handleQuestionSelect}
            candidateName={user?.name || 'Candidate'}
            subject={currentSubject}
          />
        </div>
      </div>

      {/* Submit Modal */}
      <SubmitModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={confirmSubmit}
        stats={calculateStats()}
      />

      {/* Proctoring Components */}
      <LiveIndicators />
      <CameraPreview stream={cameraStream} />
      <WarningModal />
    </div>
  );
};

export default ExamPage;
