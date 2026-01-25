import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { useExamTimer } from "@/hooks/useExamTimer";
import { useExamSafety } from "@/hooks/useExamSafety";
import { useTabDetection } from "@/hooks/useTabDetection";
import { useNoiseDetection } from "@/hooks/useNoiseDetection";
import { toast } from "sonner";
import {
  startExam,
  setCurrentSubject,
  setCurrentQuestion,
  selectOption,
  saveAndNext,
  clearResponse,
  markForReview,
  previousQuestion,
  submitExam,
} from "@/store/examSlice";
import { allQuestions, TOTAL_QUESTIONS } from "@/data/questions";

import { ExamHeader } from "@/components/exam/ExamHeader";
import { SubjectTabs } from "@/components/exam/SubjectTabs";
import { QuestionPanel } from "@/components/exam/QuestionPanel";
import { QuestionGrid } from "@/components/exam/QuestionGrid";
import { ActionButtons } from "@/components/exam/ActionButtons";
import { SubmitModal } from "@/components/exam/SubmitModal";
import { LiveIndicators } from "@/components/proctoring/LiveIndicators";
import { CameraPreview } from "@/components/proctoring/CameraPreview";
import { WarningModal } from "@/components/proctoring/WarningModal";
import { TerminationModal } from "@/components/proctoring/TerminationModal";

const ExamPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, hasReadInstructions, user } = useAppSelector(
    (state) => state.auth,
  );
  const proctoringState = useAppSelector((state) => state.proctoring);
  const { setupCompleted, isAutoSubmitted } = proctoringState;

  const examState = useAppSelector((state) => state.exam);
  const { formattedTime, timeRemaining, isSubmitted } = useExamTimer();

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);

  /* ================= AUTO SUBMIT ================= */
  useEffect(() => {
    if (isAutoSubmitted) {
      handleFinalSubmit(true);
    }
  }, [isAutoSubmitted]);

  /* ================= PROCTORING ================= */
  const isTrackingActive =
    !isSubmitted && hasReadInstructions && !isAutoSubmitted;

  useTabDetection(isTrackingActive);
  useNoiseDetection(micStream, isTrackingActive);
  useExamSafety(isTrackingActive);

  useEffect(() => {
    const initProctoring = async () => {
      try {
        const cStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const mStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setCameraStream(cStream);
        setMicStream(mStream);
      } catch {
        toast.error("Proctoring Hardware Error");
      }
    };
    if (setupCompleted) initProctoring();
    return () => {
      cameraStream?.getTracks().forEach((t) => t.stop());
      micStream?.getTracks().forEach((t) => t.stop());
    };
  }, [setupCompleted]);

  useEffect(() => {
    if (setupCompleted && !examState.startTime) dispatch(startExam());
  }, [setupCompleted, examState.startTime]);

  useEffect(() => {
    if (isSubmitted && !isAutoSubmitted)
      navigate("/summary", { replace: true });
  }, [isSubmitted]);

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!hasReadInstructions) return <Navigate to="/instructions" replace />;
  if (!setupCompleted) return <Navigate to="/proctoring-setup" replace />;

  /* ================= EVALUATION LOGIC ================= */

  const evaluateExam = () => {
    let total = TOTAL_QUESTIONS;
    let answered = 0;
    let correct = 0;
    let wrong = 0;
    let marked = 0;
    let notVisited = 0;

    Object.keys(allQuestions).forEach((subject) => {
      const subjectQuestions = allQuestions[subject];
      const subjectState = examState.subjects[subject];

      subjectQuestions.forEach((question, index) => {
        const qState = subjectState.questions[index];

        if (qState.status.includes("notVisited")) {
          notVisited++;
          return;
        }

        if (qState.status.includes("marked")) marked++;

        if (qState.selectedOption) {
          answered++;
          if (qState.selectedOption === question.correctAnswer) {
            correct++;
          } else {
            wrong++;
          }
        }
      });
    });

    const notAnswered = total - answered - notVisited;
    const finalMarks = correct * 4 - wrong * 1;

    return {
      stats: { total, answered, notAnswered, marked, notVisited },
      finalMarks,
    };
  };

  /* ================= FINAL SUBMIT ================= */

  const handleFinalSubmit = async (isTerminated = false) => {
    const { stats, finalMarks } = evaluateExam();

    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/exam-users/submit/${user?.applicationNumber}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stats,
            liveIndicator: {
              warningCount: proctoringState.warningCount,
              tabSwitchCount: proctoringState.tabSwitchCount,
              faceOffCount: proctoringState.faceOffCount,
              noiseDetectedCount: proctoringState.noiseDetectedCount,
            },
            finalMarks,
            terminated: isTerminated, // ✅ send termination flag
          }),
        },
      );

      dispatch(submitExam());
      navigate("/summary");
    } catch (error: any) {
      console.error("Submission Error:", error);
      toast.error(error.message || "Submission failed. Please try again.");
    }
  };

  /* ================= SUBJECT LOGIC ================= */

  const subjects = Object.keys(allQuestions);
  const currentSubject = examState.currentSubject;
  const currentSubjectState = examState.subjects[currentSubject];
  const currentQuestionIndex = currentSubjectState.currentQuestionIndex;

  const currentQuestion = allQuestions[currentSubject][currentQuestionIndex];
  const currentQuestionState =
    currentSubjectState.questions[currentQuestionIndex];

  const isFirstSubject = currentSubject === subjects[0];
  const isLastSubject = currentSubject === subjects[subjects.length - 1];

  const isFirstQuestionInSubject = currentQuestionIndex === 0;
  const isLastQuestionInSubject =
    currentQuestionIndex === allQuestions[currentSubject].length - 1;

  const isFirstQuestionGlobal = isFirstSubject && isFirstQuestionInSubject;
  const isLastQuestionGlobal = isLastSubject && isLastQuestionInSubject;

  /* ================= UI ================= */

  return (
    <div className="h-screen flex flex-col bg-panel-bg exam-mode overflow-hidden select-none">
      <ExamHeader
        examName="SW-CET 2026"
        formattedTime={formattedTime}
        isTimeLow={timeRemaining < 600}
      />

      <SubjectTabs
        currentSubject={currentSubject}
        onSubjectChange={(s) => dispatch(setCurrentSubject(s))}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto bg-white/50 backdrop-blur-sm">
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
            isFirstQuestion={isFirstQuestionGlobal}
            isLastQuestionOfLastSubject={isLastQuestionGlobal}
          />
        </div>

        <div className="w-80 border-l border-panel-border bg-card shadow-xl">
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
        onConfirm={() => {
          handleFinalSubmit();
        }}
        stats={evaluateExam().stats}
      />

      <LiveIndicators />
      <CameraPreview stream={cameraStream} />
      <WarningModal />
      <TerminationModal isOpen={isAutoSubmitted} />
    </div>
  );
};

export default ExamPage;
