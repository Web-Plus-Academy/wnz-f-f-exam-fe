import { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { useExamTimer } from "@/hooks/useExamTimer";
import { useExamSafety } from "@/hooks/useExamSafety";
import { useTabDetection } from "@/hooks/useTabDetection";
import { useNoiseDetection } from "@/hooks/useNoiseDetection";
import { 
  startExam, 
  setCurrentSubject, 
  setCurrentQuestion, 
  selectOption, 
  saveAndNext, 
  clearResponse, 
  markForReview, 
  previousQuestion, 
  submitExam 
} from "@/store/examSlice";
import { allQuestions } from "@/data/questions";
import { Subject } from "@/types/exam";

// Components
import { ExamHeader } from "@/components/exam/ExamHeader";
import { SubjectTabs } from "@/components/exam/SubjectTabs";
import { QuestionPanel } from "@/components/exam/QuestionPanel";
import { QuestionGrid } from "@/components/exam/QuestionGrid";
import { ActionButtons } from "@/components/exam/ActionButtons";
import { SubmitModal } from "@/components/exam/SubmitModal";
import { LiveIndicators } from "@/components/proctoring/LiveIndicators";
import { CameraPreview } from "@/components/proctoring/CameraPreview";
import { WarningModal } from "@/components/proctoring/WarningModal";

const ExamPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, hasReadInstructions, user } = useAppSelector((state) => state.auth);
  const examState = useAppSelector((state) => state.exam);
  const { setupCompleted } = useAppSelector((state) => state.proctoring);
  const { formattedTime, timeRemaining, isSubmitted } = useExamTimer();

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);

  // 1. Tab Detection
  useTabDetection(!isSubmitted && hasReadInstructions);
  
  // 2. Noise Detection (Using internal state or Redux stream)
  useNoiseDetection(micStream, !isSubmitted && hasReadInstructions);

  // 3. Exam Safety (Right click, Copy-Paste, etc)
  useExamSafety(!isSubmitted && hasReadInstructions);

  // Initialize Streams
  useEffect(() => {
    const initProctoring = async () => {
      try {
        const cStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const mStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setCameraStream(cStream);
        setMicStream(mStream);
      } catch (e) {
        console.error("Proctoring streams failed", e);
      }
    };
    if (setupCompleted) initProctoring();
  }, [setupCompleted]);

  useEffect(() => {
    if (setupCompleted && !examState.startTime) {
      dispatch(startExam());
    }
  }, [setupCompleted, examState.startTime, dispatch]);

  useEffect(() => {
    if (isSubmitted) navigate("/summary", { replace: true });
  }, [isSubmitted, navigate]);

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!hasReadInstructions) return <Navigate to="/instructions" replace />;
  if (!setupCompleted) return <Navigate to="/proctoring-setup" replace />;

  const currentSubject = examState.currentSubject;
  const currentSubjectState = examState.subjects[currentSubject];
  const currentQuestionIndex = currentSubjectState.currentQuestionIndex;
  const currentQuestion = allQuestions[currentSubject][currentQuestionIndex];
  const currentQuestionState = currentSubjectState.questions[currentQuestionIndex];

  const calculateStats = () => {
    let answered = 0;
    Object.values(examState.subjects).forEach(s => 
      s.questions.forEach(q => { if(q.status.includes('answered')) answered++; })
    );
    return { total: 30, answered, notAnswered: 30 - answered, marked: 0, notVisited: 0 };
  };

  return (
    <div className="h-screen flex flex-col bg-panel-bg exam-mode overflow-hidden">
      <ExamHeader examName="JEE Main 2024" formattedTime={formattedTime} isTimeLow={timeRemaining < 600} />
      <SubjectTabs currentSubject={currentSubject} onSubjectChange={(s) => dispatch(setCurrentSubject(s))} />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            <QuestionPanel 
              question={currentQuestion} 
              selectedOption={currentQuestionState.selectedOption} 
              onSelectOption={(option) => dispatch(selectOption({ option }))} 
            />
          </div>
          <ActionButtons 
            onSaveAndNext={() => dispatch(saveAndNext())}
            onClearResponse={() => dispatch(clearResponse())}
            onMarkForReview={() => dispatch(markForReview())}
            onPrevious={() => dispatch(previousQuestion())}
            onSubmit={() => setShowSubmitModal(true)}
            isFirstQuestion={currentQuestionIndex === 0}
            isLastQuestion={currentQuestionIndex === currentSubjectState.questions.length - 1}
          />
        </div>

        <div className="w-72 border-l border-panel-border">
          <QuestionGrid 
            questions={currentSubjectState.questions} 
            currentQuestionIndex={currentQuestionIndex} 
            onQuestionSelect={(i) => dispatch(setCurrentQuestion(i))}
            candidateName={user?.name || "Candidate"}
            subject={currentSubject}
          />
        </div>
      </div>

      <SubmitModal 
        isOpen={showSubmitModal} 
        onClose={() => setShowSubmitModal(false)} 
        onConfirm={() => dispatch(submitExam())} 
        stats={calculateStats()} 
      />

      {/* Proctoring UI Layers */}
      <LiveIndicators />
      <CameraPreview stream={cameraStream} />
      <WarningModal /> {/* 🚨 This will now pop up for noise, tab switch, etc. */}
    </div>
  );
};

export default ExamPage;