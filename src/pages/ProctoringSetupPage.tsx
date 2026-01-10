import { useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";

import {
  setCurrentStep,
  setPrivacyConsent,
  setCameraPermission,
  setCameraImage,          // ✅ ADD THIS
  setMicrophonePermission,
  setMicrophoneStream,
  completeSetup,
} from "@/store/proctoringSlice";

import { PrivacyNotice } from "@/components/proctoring/PrivacyNotice";
import { CameraSetup } from "@/components/proctoring/CameraSetup";
import { MicrophoneSetup } from "@/components/proctoring/MicrophoneSetup";
import { ScreenSetup } from "@/components/proctoring/ScreenSetup";

const STEPS = ["privacy", "camera", "microphone", "screen"] as const;

const ProctoringSetupPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, hasReadInstructions } = useAppSelector(
    (state) => state.auth
  );
  const { currentStep, setupCompleted } = useAppSelector(
    (state) => state.proctoring
  );

  const micStreamRef = useRef<MediaStream | null>(null);

  /* ---------------- Guards ---------------- */
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!hasReadInstructions) return <Navigate to="/instructions" replace />;
  if (setupCompleted) return <Navigate to="/exam" replace />;

  /* ---------------- Handlers ---------------- */

  const handlePrivacyAccept = () => {
    dispatch(setPrivacyConsent(true));
    dispatch(setCurrentStep("camera"));
  };

  // ✅ CAMERA RETURNS IMAGE (string)
  const handleCameraSuccess = (image: string) => {
    console.log("📸 Camera image received");

    dispatch(setCameraPermission("granted"));
    dispatch(setCameraImage(image));   // ✅ STORE IMAGE
    dispatch(setCurrentStep("microphone"));
  };

  // 🎤 MICROPHONE RETURNS STREAM
  const handleMicrophoneSuccess = (stream: MediaStream) => {
    micStreamRef.current = stream;

    dispatch(setMicrophonePermission("granted"));
    dispatch(setMicrophoneStream(true));
    dispatch(setCurrentStep("screen"));
  };

  const handleStartExam = () => {
    dispatch(completeSetup());
    navigate("/exam");
  };

  const handleBackToCamera = () => {
    dispatch(setCurrentStep("camera"));
  };

  const handleBackToMicrophone = () => {
    dispatch(setCurrentStep("microphone"));
  };

  const currentIndex = STEPS.indexOf(currentStep as any);

  return (
    <div className="min-h-screen bg-panel-bg flex flex-col">
      {/* Header */}
      <header className="bg-exam-header text-exam-header-foreground py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Proctoring Setup</h1>
            <p className="text-white/80 text-sm">
              Complete all steps to start your examination
            </p>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-card border-b border-border py-4">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isActive = index === currentIndex;
              const isCompleted = index < currentIndex;

              return (
                <div key={step} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 ${
                      isActive
                        ? "text-primary"
                        : isCompleted
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>
                    <span className="text-sm font-medium capitalize hidden sm:block">
                      {step === "privacy"
                        ? "Privacy"
                        : step === "screen"
                        ? "Start Exam"
                        : step}
                    </span>
                  </div>

                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-12 sm:w-20 h-0.5 mx-2 ${
                        isCompleted ? "bg-green-500" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-8 px-6">
        {currentStep === "privacy" && (
          <PrivacyNotice onAccept={handlePrivacyAccept} />
        )}

        {currentStep === "camera" && (
          <CameraSetup onSuccess={handleCameraSuccess} />
        )}

        {currentStep === "microphone" && (
          <MicrophoneSetup
            onSuccess={handleMicrophoneSuccess}
            onBack={handleBackToCamera}
          />
        )}

        {currentStep === "screen" && (
          <ScreenSetup
            onSuccess={handleStartExam}
            onBack={handleBackToMicrophone}
          />
        )}
      </main>
    </div>
  );
};

export default ProctoringSetupPage;
