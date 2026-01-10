import { Question } from "@/types/exam";

/* =====================================================
  1. Logical Thinking & Aptitude
===================================================== */

export const aptitudeQuestions: Question[] = [
  {
    id: "apt-1",
    subject: "aptitude",
    questionNumber: 1,
    questionText:
      "If all developers are learners and some learners are designers, which statement is definitely true?",
    options: {
      A: "All designers are developers",
      B: "Some developers may be designers",
      C: "No developer is a designer",
      D: "All learners are developers",
    },
    correctAnswer: "B",
  },
  {
    id: "apt-2",
    subject: "aptitude",
    questionNumber: 2,
    questionText:
      "Find the next number in the series: 2, 4, 8, 16, ?",
    options: {
      A: "18",
      B: "24",
      C: "32",
      D: "30",
    },
    correctAnswer: "C",
  },
  {
    id: "apt-3",
    subject: "aptitude",
    questionNumber: 3,
    questionText:
      "Which approach is best to solve a complex problem?",
    options: {
      A: "Guessing the solution",
      B: "Breaking it into smaller steps",
      C: "Ignoring edge cases",
      D: "Copying someone else's solution",
    },
    correctAnswer: "B",
  },
  {
    id: "apt-4",
    subject: "aptitude",
    questionNumber: 4,
    questionText:
      "If a task takes 5 minutes to complete and is repeated 6 times, what is the total time?",
    options: {
      A: "25 minutes",
      B: "30 minutes",
      C: "35 minutes",
      D: "40 minutes",
    },
    correctAnswer: "B",
  },
];

/* =====================================================
  2. Programming Fundamentals (Conceptual)
===================================================== */

export const programmingQuestions: Question[] = [
  {
    id: "prog-1",
    subject: "programming",
    questionNumber: 1,
    questionText:
      "What is the purpose of a variable in programming?",
    options: {
      A: "To repeat code",
      B: "To store and reuse data",
      C: "To design UI",
      D: "To compile code",
    },
    correctAnswer: "B",
  },
  {
    id: "prog-2",
    subject: "programming",
    questionNumber: 2,
    questionText:
      "Which statement best describes a loop?",
    options: {
      A: "Runs code once",
      B: "Stops program execution",
      C: "Repeats a block of code",
      D: "Stores data permanently",
    },
    correctAnswer: "C",
  },
  {
    id: "prog-3",
    subject: "programming",
    questionNumber: 3,
    questionText:
      "What does an IF condition do?",
    options: {
      A: "Repeats code",
      B: "Checks a condition and makes a decision",
      C: "Defines a variable",
      D: "Ends the program",
    },
    correctAnswer: "B",
  },
  {
    id: "prog-4",
    subject: "programming",
    questionNumber: 4,
    questionText:
      "What is pseudocode mainly used for?",
    options: {
      A: "Writing final code",
      B: "Designing logic in simple language",
      C: "Running programs",
      D: "Styling websites",
    },
    correctAnswer: "B",
  },
];

/* =====================================================
  3. Web Basics (Awareness Level)
===================================================== */

export const webBasicsQuestions: Question[] = [
  {
    id: "web-1",
    subject: "web",
    questionNumber: 1,
    questionText:
      "What is the World Wide Web?",
    options: {
      A: "A programming language",
      B: "A system of interlinked web pages",
      C: "A database",
      D: "An operating system",
    },
    correctAnswer: "B",
  },
  {
    id: "web-2",
    subject: "web",
    questionNumber: 2,
    questionText:
      "Which technology is mainly responsible for structuring web content?",
    options: {
      A: "CSS",
      B: "JavaScript",
      C: "HTML",
      D: "React",
    },
    correctAnswer: "C",
  },
  {
    id: "web-3",
    subject: "web",
    questionNumber: 3,
    questionText:
      "What is Frontend development?",
    options: {
      A: "Server-side logic",
      B: "Database management",
      C: "User interface development",
      D: "Cloud deployment",
    },
    correctAnswer: "C",
  },
  {
    id: "web-4",
    subject: "web",
    questionNumber: 4,
    questionText:
      "Which of the following runs in the browser?",
    options: {
      A: "Java",
      B: "Python",
      C: "JavaScript",
      D: "C++",
    },
    correctAnswer: "C",
  },
];

/* =====================================================
  4. Learning Mindset & Ethics
===================================================== */

export const mindsetQuestions: Question[] = [
  {
    id: "mind-1",
    subject: "mindset",
    questionNumber: 1,
    questionText:
      "If you do not understand a topic, what should you do first?",
    options: {
      A: "Quit learning",
      B: "Ignore it",
      C: "Ask questions and practice",
      D: "Copy answers",
    },
    correctAnswer: "C",
  },
  {
    id: "mind-2",
    subject: "mindset",
    questionNumber: 2,
    questionText:
      "Consistency in learning means:",
    options: {
      A: "Studying only when motivated",
      B: "Learning daily with discipline",
      C: "Studying once a week",
      D: "Learning only before exams",
    },
    correctAnswer: "B",
  },
  {
    id: "mind-3",
    subject: "mindset",
    questionNumber: 3,
    questionText:
      "What is ethical behavior in a learning community?",
    options: {
      A: "Sharing answers in exams",
      B: "Respecting peers and rules",
      C: "Ignoring guidelines",
      D: "Taking shortcuts",
    },
    correctAnswer: "B",
  },
  {
    id: "mind-4",
    subject: "mindset",
    questionNumber: 4,
    questionText:
      "If you fail a test, what is the best response?",
    options: {
      A: "Blame others",
      B: "Give up",
      C: "Analyze mistakes and improve",
      D: "Avoid learning",
    },
    correctAnswer: "C",
  },
];

/* =====================================================
  Combined Exam Configuration
===================================================== */

export const allQuestions: Record<string, Question[]> = {
  aptitude: aptitudeQuestions,
  programming: programmingQuestions,
  web: webBasicsQuestions,
  mindset: mindsetQuestions,
};

export const QUESTIONS_PER_SECTION = 4;
export const TOTAL_QUESTIONS = 16;
export const EXAM_DURATION = 30 * 60; // 30 minutes

export const EXAM_START_TIME = new Date('2026-01-10T00:00:00+05:30').getTime();
export const EXAM_END_TIME   = new Date('2026-01-10T24:00:00+05:30').getTime();


