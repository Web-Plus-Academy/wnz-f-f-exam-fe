import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Square,
  AlertTriangle,
  Clock,
  BookOpen,
  FileText,
  Shield,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setHasReadInstructions } from "@/store/authSlice";
import { EXAM_DURATION, TOTAL_QUESTIONS } from "@/data/questions";

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
    navigate("/proctoring-setup");
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hour${hours > 1 ? "s" : ""}${
      minutes > 0 ? ` ${minutes} minutes` : ""
    }`;
  };

  /* =====================================================
     Instructions (Startup / Fellowship Oriented)
  ===================================================== */

  const instructions = [
  "This is an AI-proctored Computer Based Test (CBT) for the WebNexZ Foundation Fellowship.",
  "The examination evaluates logical thinking, programming fundamentals, web technology awareness, and learning mindset.",
  "All questions are compulsory and are of multiple-choice (MCQ) type.",
  "There is no negative marking. Candidates are advised to answer based on their own understanding.",
  "The webcam and microphone must remain enabled for the entire duration of the examination.",
  "Candidates must not speak, frequently look away from the screen, or allow any other individual to appear in the camera view.",
  "Switching browser tabs, minimizing the window, or exiting fullscreen mode will be detected and recorded.",
  "AI-based systems continuously monitor face presence, audio levels, and suspicious activity.",
  "The examination timer is controlled by the server and will auto-submit responses upon completion of the allotted time.",
  "Any attempt to manipulate, bypass, or interfere with the proctoring system may result in immediate disqualification.",
];


  const legendItems = [
    { color: "bg-question-not-visited", label: "Not Visited" },
    { color: "bg-question-visited", label: "Visited (Not Answered)" },
    { color: "bg-question-answered", label: "Answered" },
    { color: "bg-question-marked", label: "Marked for Review" },
    {
      color: "bg-question-marked-answered",
      label: "Answered & Marked",
    },
  ];

  return (
    <div className="min-h-screen bg-panel-bg flex flex-col">
      {/* Header */}
      <header className="bg-exam-header text-exam-header-foreground border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md">
              <img
                src="https://webnexzfoundation.saredufywpa.in/public/logo.png"
                alt="WebNexZ Foundation"
                className="w-16 h-16 object-contain"
              />
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                WebNexZ Foundation
              </h1>
              <p className="text-sm md:text-base text-white/80">
                Fellowship Entrance & Scholarship Examination
              </p>
              <p className="text-xs text-white/60 mt-0.5">
                Powered by{" "}
                <span className="font-semibold text-white">
                  Saredufy Web Plus Academy Pvt. Ltd.
                </span>
              </p>
            </div>
          </div>

          {/* Right: CBT + Date */}
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-sm font-semibold text-white">
              Computer Based Test (CBT)
            </span>
            <span className="text-sm text-white/80">March 26, 2026</span>
            <span className="text-xs text-green-400 font-medium mt-0.5">
              AI-Proctored • Secure Examination
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-6 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Candidate Info */}
            <div className="bg-card rounded-lg border border-border p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Candidate Name
                  </p>
                  <p className="font-semibold text-foreground">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Application Number
                  </p>
                  <p className="font-semibold text-foreground">
                    {user?.applicationNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Exam</p>
                  <p className="font-semibold text-foreground">
                    Launchpad Entrance Test
                  </p>
                </div>
              </div>
            </div>

            {/* Exam Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <OverviewCard
                icon={<FileText className="h-6 w-6 text-primary" />}
                title={TOTAL_QUESTIONS.toString()}
                subtitle="Total Questions"
              />
              <OverviewCard
                icon={<BookOpen className="h-6 w-6 text-primary" />}
                title="4"
                subtitle="Assessment Sections"
              />
              <OverviewCard
                icon={<Clock className="h-6 w-6 text-primary" />}
                title={formatDuration(EXAM_DURATION)}
                subtitle="Total Duration"
              />
            </div>

            {/* Instructions */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Important Instructions
              </h2>
              <ol className="space-y-3">
                {instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Legend */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Question Status Legend
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {legendItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded ${item.color}`} />
                    <span className="text-sm text-foreground">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Agreement */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-start gap-3 mb-6">
                <button onClick={() => setAgreed(!agreed)}>
                  {agreed ? (
                    <CheckSquare className="h-6 w-6 text-primary" />
                  ) : (
                    <Square className="h-6 w-6 text-muted-foreground" />
                  )}
                </button>
                <p className="text-sm text-foreground">
                  I have read and understood the instructions. I agree to comply
                  with AI proctoring, behavioral rules, and ethical conduct
                  required for the WebNexZ Foundation Fellowship.
                </p>
              </div>

              <button
                onClick={handleStartExam}
                disabled={!agreed}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  agreed
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {agreed
                  ? "Proceed to Proctoring Setup"
                  : "Please accept the instructions to continue"}
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

/* =====================================================
   Reusable Card
===================================================== */

const OverviewCard = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => (
  <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-4">
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  </div>
);

export default InstructionsPage;
