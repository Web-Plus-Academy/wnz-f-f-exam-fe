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
import logo from "/logo.png";
import { EXAM_START_TIME} from "@/data/questions";

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
      Instructions (Including Auto-Submit Thresholds)
  ===================================================== */

  const instructions = [
    "This is an AI-proctored Computer Based Test (CBT) for the Launchpad & Fellowship.",
    "The examination evaluates logical thinking, programming fundamentals, web technology awareness, and learning mindset.",
    "All questions are compulsory and are of multiple-choice (MCQ) type. There is no negative marking.",
    "The webcam and microphone must remain enabled for the entire duration of the examination.",
    "AI-based systems continuously monitor face presence, audio levels, and suspicious activity.",
    "The examination will AUTO-SUBMIT immediately if the following violation limits are reached:",
    "• 5 Tab Switches / Window Minimized actions.",
    "• 5 Instances of 'Face Not Detected' or 'Multiple Faces Detected'.",
    "• 10 High Noise detections (Microphone monitoring).",
    "• 20 Total cumulative warnings of any nature.",
    "Any attempt to manipulate or interfere with the proctoring system results in immediate disqualification.",
    "The exam timer is server-controlled and will auto-submit responses when the time reaches zero.",
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
            <div className="w-20 h-20 flex items-center justify-center shadow-md">
              <img
                src={logo}
                alt="SW-CET"
                className="w-20 h-20 object-contain"
              />
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                SW-CET 2026
              </h1>
              <p className="text-sm md:text-base text-white/80">
                Saredufy - WebNexZ Common Entrance Test
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
            <span className="text-sm text-white/80">
                            {new Date(EXAM_START_TIME).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
            
            <span className="text-xs text-green-400 font-medium mt-0.5">
              AI-Proctored • Secure Examination
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
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
                  <p className="text-sm text-muted-foreground">Candidate Name</p>
                  <p className="font-semibold text-foreground">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Application Number</p>
                  <p className="font-semibold text-foreground">{user?.applicationNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Exam</p>
                  <p className="font-semibold text-foreground">Common Entrance Test</p>
                </div>
              </div>
            </div>

            {/* Exam Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <OverviewCard
                icon={<FileText className="h-6 w-6 text-primary" />}
                title={TOTAL_QUESTIONS.toString()}
                subtitle="Total Questions"
              />
              <OverviewCard
                icon={<BookOpen className="h-6 w-6 text-primary" />}
                title="2"
                subtitle="Assessment Sections"
              />
              <OverviewCard
                icon={<Clock className="h-6 w-6 text-primary" />}
                title="30 Minutes"
                subtitle="Total Duration"
              />
            </div>

            {/* Detailed Instructions Section */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security & Conduct Rules
              </h2>
              <ol className="space-y-3">
                {instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3 text-sm">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="pt-0.5 text-muted-foreground leading-relaxed">
                      {instruction.startsWith("•") ? (
                        <span className="text-red-500 font-medium">{instruction}</span>
                      ) : (
                        instruction
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Question Status Legend */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Question Status Legend
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {legendItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded shadow-sm border ${item.color}`} />
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-tight">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Agreement & Action */}
            <div className="bg-card rounded-lg border-2 border-primary/20 p-8 shadow-inner">
              <div className="flex items-start gap-4 mb-8">
                <button 
                  onClick={() => setAgreed(!agreed)}
                  className="mt-1 transition-transform active:scale-90"
                >
                  {agreed ? (
                    <CheckSquare className="h-7 w-7 text-primary" />
                  ) : (
                    <Square className="h-7 w-7 text-muted-foreground" />
                  )}
                </button>
                <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                  I solemnly declare that I have read and understood all the instructions, 
                  specifically the automated submission thresholds. I consent to AI 
                  monitoring and acknowledge that any breach of conduct will result in 
                  immediate termination of the WebNexZ Fellowship Examination.
                </p>
              </div>

              <button
                onClick={handleStartExam}
                disabled={!agreed}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                  agreed
                    ? "bg-primary text-primary-foreground hover:scale-[1.01] hover:bg-primary/90 active:scale-[0.99]"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                }`}
              >
                {agreed
                  ? "Agree & Proceed to Setup"
                  : "Please Accept Agreement to Continue"}
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

/* --- Reusable Overview Component --- */
const OverviewCard = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => (
  <div className="bg-card rounded-lg border border-border p-5 flex items-center gap-4 hover:border-primary/50 transition-colors">
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground leading-none">{title}</p>
      <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wide">
        {subtitle}
      </p>
    </div>
  </div>
);

export default InstructionsPage;