import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, FileText, Clock, BarChart3 } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { Subject } from "@/types/exam";

const SummaryPage = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const examState = useAppSelector((state) => state.exam);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!examState.isSubmitted) {
    return <Navigate to="/exam" replace />;
  }

  /* =====================================================
     Subject Stats Calculator
  ===================================================== */

  const calculateSubjectStats = (subject: Subject) => {
    const questions = examState.subjects[subject].questions;

    let answered = 0;
    let marked = 0;
    let notAnswered = 0;

    questions.forEach((q) => {
      if (q.status === "answered" || q.status === "marked-answered") {
        answered++;
      }
      if (q.status === "marked" || q.status === "marked-answered") {
        marked++;
      }
      if (q.status !== "answered" && q.status !== "marked-answered") {
        notAnswered++;
      }
    });

    return { answered, marked, notAnswered, total: questions.length };
  };

  /* =====================================================
     Subject Definitions
  ===================================================== */

  const subjectConfigs: {
    key: Subject;
    name: string;
    color: string;
  }[] = [
    { key: "aptitude", name: "Logical Thinking & Aptitude", color: "bg-blue-500" },
    { key: "programming", name: "Programming Fundamentals", color: "bg-green-500" },
    { key: "web", name: "Web Basics", color: "bg-purple-500" },
    { key: "mindset", name: "Learning Mindset", color: "bg-orange-500" },
  ];

  const subjectStats = subjectConfigs.map((s) => ({
    ...s,
    stats: calculateSubjectStats(s.key),
  }));

  const totalAnswered = subjectStats.reduce((sum, s) => sum + s.stats.answered, 0);
  const totalMarked = subjectStats.reduce((sum, s) => sum + s.stats.marked, 0);
  const totalUnanswered = subjectStats.reduce(
    (sum, s) => sum + s.stats.notAnswered,
    0
  );

  const totalQuestions = subjectStats.reduce(
    (sum, s) => sum + s.stats.total,
    0
  );

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-panel-bg flex flex-col">
      {/* Header */}
      <header className="bg-exam-header text-exam-header-foreground py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md">
            <span className="text-primary font-bold text-xl"></span>
            <img
                src="https://webnexzfoundation.saredufywpa.in/public/logo.png"
                alt="WebNexZ Foundation"
                className="w-16 h-16 object-contain"
              />
          </div>
          <div>
            <h1 className="text-xl font-bold">WebNexZ Foundation – Entrance Exam</h1>
            <p className="text-white/80 text-sm">Examination Summary</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Success */}
            <div className="bg-success/10 border border-success/30 rounded-xl p-6 mb-8 text-center">
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Exam Submitted Successfully!
              </h2>
              <p className="text-muted-foreground">
                Your responses have been recorded for evaluation.
              </p>
            </div>

            {/* Candidate Info */}
            <div className="bg-card rounded-lg border border-border p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Candidate Name</p>
                  <p className="font-semibold text-foreground">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Application Number</p>
                  <p className="font-semibold text-foreground">
                    {user?.applicationNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submission Time</p>
                  <p className="font-semibold text-foreground">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<FileText />}
                label="Total Questions"
                value={totalQuestions}
              />
              <StatCard
                icon={<CheckCircle />}
                label="Answered"
                value={totalAnswered}
                color="text-success"
              />
              <StatCard
                icon={<Clock />}
                label="Unanswered"
                value={totalUnanswered}
                color="text-warning"
              />
              <StatCard
                icon={<BarChart3 />}
                label="Marked"
                value={totalMarked}
                color="text-purple-500"
              />
            </div>

            {/* Subject Breakdown */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="bg-secondary/50 px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground">
                  Section-wise Breakdown
                </h3>
              </div>

              <div className="divide-y divide-border">
                {subjectStats.map((subject) => (
                  <div key={subject.key} className="p-6">
                    <div className="flex justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${subject.color}`} />
                        <h4 className="font-medium text-foreground">
                          {subject.name}
                        </h4>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {subject.stats.total} Questions
                      </span>
                    </div>

                    <div className="h-3 bg-secondary rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-success transition-all"
                        style={{
                          width: `${
                            (subject.stats.answered / subject.stats.total) * 100
                          }%`,
                        }}
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-success">
                        Answered: {subject.stats.answered}
                      </span>
                      <span className="text-warning">
                        Unanswered: {subject.stats.notAnswered}
                      </span>
                      <span className="text-purple-500">
                        Marked: {subject.stats.marked}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notice */}
            <div className="mt-8 p-4 bg-secondary rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                This entrance test is used for shortlisting candidates into Fellowship in 
                WebNexZ Foundation.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border py-3 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 WebNexZ Foundation Fellowship Examination.
            <span className="mx-1">|</span>
            Powered by{" "}
            <span className="font-medium text-foreground">
              Saredufy Web Plus Academy Pvt. Ltd.
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

/* =====================================================
   Reusable Stat Card
===================================================== */

const StatCard = ({
  icon,
  label,
  value,
  color = "text-foreground",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color?: string;
}) => (
  <div className="bg-card rounded-lg border border-border p-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  </div>
);

export default SummaryPage;
