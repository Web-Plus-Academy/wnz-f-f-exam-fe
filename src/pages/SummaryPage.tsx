import { useState, useEffect, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  FileText,
  Clock,
  BarChart3,
  Home,
  Loader2,
} from "lucide-react";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { Subject } from "@/types/exam";
import { Button } from "@/components/ui/button";
import logo from "/logo.png";
import { EXAM_START_TIME} from "@/data/questions";

const SummaryPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const examState = useAppSelector((state) => state.exam);

  // Countdown state for auto-redirect
  const [countdown, setCountdown] = useState(10);

  /* =====================================================
      🔒 FIXED SUBMITTED TIME
      useMemo captures the time exactly once when the component 
      mounts so it doesn't change during re-renders.
  ===================================================== */
  const fixedSubmittedTime = useMemo(() => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, []);

  /* =====================================================
      🚨 AUTO-REDIRECT LOGIC (10 Seconds)
  ===================================================== */
  useEffect(() => {
    if (!isAuthenticated || !examState.isSubmitted) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Resetting state via full reload to ensure a clean slate
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuthenticated, examState.isSubmitted]);

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!examState.isSubmitted) return <Navigate to="/exam" replace />;

  /* =====================================================
      Subject Stats Calculator
  ===================================================== */
  const calculateSubjectStats = (subject: Subject) => {
    const questions = examState.subjects[subject].questions;
    let answered = 0;
    let marked = 0;
    let notAnswered = 0;

    questions.forEach((q) => {
      if (q.status === "answered" || q.status === "marked-answered") answered++;
      if (q.status === "marked" || q.status === "marked-answered") marked++;
      if (q.status !== "answered" && q.status !== "marked-answered")
        notAnswered++;
    });
    return { answered, marked, notAnswered, total: questions.length };
  };

  const subjectConfigs = Object.keys(examState.subjects).map((key) => ({
    key: key as Subject,
    name: key === "aptitude" ? "General Aptitude" : "Web Fundamentals",
    color: key === "aptitude" ? "bg-blue-500" : "bg-purple-500",
  }));

  const subjectStats = subjectConfigs.map((s) => ({
    ...s,
    stats: calculateSubjectStats(s.key),
  }));

  const totalAnswered = subjectStats.reduce(
    (sum, s) => sum + s.stats.answered,
    0,
  );
  const totalMarked = subjectStats.reduce((sum, s) => sum + s.stats.marked, 0);
  const totalUnanswered = subjectStats.reduce(
    (sum, s) => sum + s.stats.notAnswered,
    0,
  );
  const totalQuestions = subjectStats.reduce(
    (sum, s) => sum + s.stats.total,
    0,
  );

  return (
    <div className="min-h-screen bg-panel-bg flex flex-col">
      <header className="bg-exam-header text-exam-header-foreground border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 flex items-center justify-center shadow-md">
              <img
                src={logo}
                alt="WebNexZ Foundation"
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

      <main className="flex-1 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Success Status Banner */}
            <div className="bg-success/5 border border-success/20 rounded-xl p-8 mb-8 text-center shadow-sm relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">
                Exam Submitted Successfully!
              </h2>
              <p className="text-slate-500 text-sm">
                Your responses have been securely encrypted and stored for
                review.
              </p>

              {/* Countdown Badge */}
              <div className="mt-4 inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-1.5 rounded-full shadow-sm">
                <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                  Redirecting in {countdown}s
                </span>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-panel-border p-5 mb-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoItem label="Candidate Name" value={user?.name} />

                <InfoItem
                  label="Application Number"
                  value={user?.applicationNumber || "N/A"}
                />

                <InfoItem label="Submitted Time" value={fixedSubmittedTime} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<FileText className="w-4 h-4" />}
                label="Total Items"
                value={totalQuestions}
              />
              <StatCard
                icon={<CheckCircle className="w-4 h-4" />}
                label="Answered"
                value={totalAnswered}
                color="text-success"
              />
              <StatCard
                icon={<Clock className="w-4 h-4" />}
                label="Unanswered"
                value={totalUnanswered}
                color="text-warning"
              />
              <StatCard
                icon={<BarChart3 className="w-4 h-4" />}
                label="To Review"
                value={totalMarked}
                color="text-purple-500"
              />
            </div>

            <div className="bg-card rounded-lg border border-panel-border overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-6 py-4 border-b border-panel-border">
                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">
                  Detailed Section Analysis
                </h3>
              </div>

              <div className="divide-y divide-panel-border">
                {subjectStats.map((subject) => (
                  <div key={subject.key} className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-6 rounded-sm ${subject.color}`}
                        />
                        <h4 className="font-bold text-slate-700">
                          {subject.name}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        {subject.stats.total} Qs
                      </span>
                    </div>

                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                      <div
                        className={`h-full ${subject.color} transition-all duration-1000`}
                        style={{
                          width: `${(subject.stats.answered / subject.stats.total) * 100}%`,
                        }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight">
                      <span className="text-success">
                        Solved: {subject.stats.answered}
                      </span>
                      <span className="text-warning">
                        Skipped: {subject.stats.notAnswered}
                      </span>
                      <span className="text-purple-500">
                        Review: {subject.stats.marked}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center gap-4 pb-12">
              <Button
                onClick={() => {
                  window.location.href = "/";
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 h-14 rounded-lg font-bold shadow-lg shadow-indigo-100 flex items-center gap-3 transition-all hover:-translate-y-1"
              >
                <Home className="w-5 h-5" />
                Return to Dashboard
              </Button>
              <p className="text-[10px] text-slate-400 font-medium">
                You will be automatically redirected to the home page shortly.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="bg-white border-t border-panel-border py-4 px-6 text-center">
        <p className="text-[11px] text-slate-400 font-medium">
          © 2026 WebNexZ Foundation Fellowship. Powered by{" "}
          <span className="text-slate-600 font-semibold">
            Saredufy Web Plus Academy
          </span>
        </p>
      </footer>
    </div>
  );
};

/* --- Helpers --- */
const InfoItem = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
      {label}
    </p>
    <p className="font-bold text-slate-700">{value || "---"}</p>
  </div>
);

const StatCard = ({ icon, label, value, color = "text-slate-700" }: any) => (
  <div className="bg-card rounded-lg border border-panel-border p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-50 rounded-lg text-slate-400">{icon}</div>
      <div>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
          {label}
        </p>
      </div>
    </div>
  </div>
);

export default SummaryPage;
