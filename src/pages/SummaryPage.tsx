import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, Clock, BarChart3 } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { Subject } from '@/types/exam';

const SummaryPage = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const examState = useAppSelector((state) => state.exam);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!examState.isSubmitted) {
    return <Navigate to="/exam" replace />;
  }

  // Calculate detailed statistics
  const calculateSubjectStats = (subject: Subject) => {
    const questions = examState.subjects[subject].questions;
    let answered = 0;
    let marked = 0;
    let notAnswered = 0;

    questions.forEach((q) => {
      if (q.status === 'answered' || q.status === 'marked-answered') {
        answered++;
      }
      if (q.status === 'marked' || q.status === 'marked-answered') {
        marked++;
      }
      if (q.status !== 'answered' && q.status !== 'marked-answered') {
        notAnswered++;
      }
    });

    return { answered, marked, notAnswered, total: questions.length };
  };

  const mathStats = calculateSubjectStats('mathematics');
  const physicsStats = calculateSubjectStats('physics');
  const chemistryStats = calculateSubjectStats('chemistry');

  const totalAnswered = mathStats.answered + physicsStats.answered + chemistryStats.answered;
  const totalMarked = mathStats.marked + physicsStats.marked + chemistryStats.marked;
  const totalUnanswered = mathStats.notAnswered + physicsStats.notAnswered + chemistryStats.notAnswered;

  const subjects = [
    { name: 'Mathematics', stats: mathStats, color: 'bg-blue-500' },
    { name: 'Physics', stats: physicsStats, color: 'bg-green-500' },
    { name: 'Chemistry', stats: chemistryStats, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-panel-bg flex flex-col">
      {/* Header */}
      <header className="bg-exam-header text-exam-header-foreground py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md">
            <span className="text-primary font-bold text-xl">NTA</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">JEE Main 2024 - Model Test</h1>
            <p className="text-white/80 text-sm">Examination Summary</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Success Message */}
            <div className="bg-success/10 border border-success/30 rounded-xl p-6 mb-8 text-center">
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Exam Submitted Successfully!
              </h2>
              <p className="text-muted-foreground">
                Your responses have been recorded. Thank you for completing the examination.
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
                  <p className="font-semibold text-foreground">{user?.applicationNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submission Time</p>
                  <p className="font-semibold text-foreground">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Overall Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">30</p>
                    <p className="text-xs text-muted-foreground">Total Questions</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">{totalAnswered}</p>
                    <p className="text-xs text-muted-foreground">Answered</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-warning">{totalUnanswered}</p>
                    <p className="text-xs text-muted-foreground">Unanswered</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-500">{totalMarked}</p>
                    <p className="text-xs text-muted-foreground">Marked</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject-wise Breakdown */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="bg-secondary/50 px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Subject-wise Breakdown</h3>
              </div>
              <div className="divide-y divide-border">
                {subjects.map((subject) => (
                  <div key={subject.name} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${subject.color}`} />
                        <h4 className="font-medium text-foreground">{subject.name}</h4>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {subject.stats.total} Questions
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-3 bg-secondary rounded-full overflow-hidden mb-3">
                      <div 
                        className="h-full bg-success transition-all duration-500"
                        style={{ width: `${(subject.stats.answered / subject.stats.total) * 100}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-success">Answered: {subject.stats.answered}</span>
                      <span className="text-warning">Unanswered: {subject.stats.notAnswered}</span>
                      <span className="text-purple-500">Marked: {subject.stats.marked}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notice */}
            <div className="mt-8 p-4 bg-secondary rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                This is a model test. Results and scoring are not calculated in this demo version.
                <br />
                For official JEE Main examination, visit the NTA official website.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border py-4 px-6">
        <p className="text-center text-sm text-muted-foreground">
          © 2024 National Testing Agency. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default SummaryPage;
