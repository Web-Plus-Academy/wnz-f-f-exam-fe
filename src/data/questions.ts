import { Question } from "@/types/exam";

/* =====================================================
  SECTION A: General Aptitude (25 Questions)
===================================================== */

export const aptitudeQuestions: Question[] = [

  // Logical Reasoning
  {
    id: "apt-1",
    subject: "aptitude",
    questionNumber: 1,
    questionText:
      "If all programmers are logical and some logical people are gamers, what can be concluded?",
    options: {
      A: "All gamers are programmers",
      B: "Some programmers may be gamers",
      C: "No programmer is a gamer",
      D: "All logical people are programmers",
    },
    correctAnswer: "B",
  },
  {
    id: "apt-2",
    subject: "aptitude",
    questionNumber: 2,
    questionText: "Find the next number: 5, 10, 20, 40, ?",
    options: { A: "60", B: "70", C: "80", D: "100" },
    correctAnswer: "C",
  },
  {
    id: "apt-3",
    subject: "aptitude",
    questionNumber: 3,
    questionText: "What is 30% of 250?",
    options: { A: "65", B: "70", C: "75", D: "80" },
    correctAnswer: "C",
  },
  {
    id: "apt-4",
    subject: "aptitude",
    questionNumber: 4,
    questionText: "If a train travels 80 km in 2 hours, what is its speed?",
    options: { A: "30 km/h", B: "40 km/h", C: "50 km/h", D: "60 km/h" },
    correctAnswer: "B",
  },
  {
    id: "apt-5",
    subject: "aptitude",
    questionNumber: 5,
    questionText: "Complete the pattern: 2, 6, 12, 20, ?",
    options: { A: "28", B: "30", C: "32", D: "36" },
    correctAnswer: "B",
  },

  // Arithmetic
  {
    id: "apt-6",
    subject: "aptitude",
    questionNumber: 6,
    questionText: "If cost price is ₹400 and profit is 20%, selling price is:",
    options: { A: "₹460", B: "₹470", C: "₹480", D: "₹500" },
    correctAnswer: "C",
  },
  {
    id: "apt-7",
    subject: "aptitude",
    questionNumber: 7,
    questionText: "Average of 10, 20, 30 is:",
    options: { A: "15", B: "20", C: "25", D: "30" },
    correctAnswer: "B",
  },
  {
    id: "apt-8",
    subject: "aptitude",
    questionNumber: 8,
    questionText: "If 4 workers finish a job in 5 days, 1 worker will take:",
    options: { A: "10 days", B: "15 days", C: "20 days", D: "25 days" },
    correctAnswer: "C",
  },
  {
    id: "apt-9",
    subject: "aptitude",
    questionNumber: 9,
    questionText: "What is the simple interest on ₹1000 at 10% for 1 year?",
    options: { A: "₹50", B: "₹100", C: "₹150", D: "₹200" },
    correctAnswer: "B",
  },
  {
    id: "apt-10",
    subject: "aptitude",
    questionNumber: 10,
    questionText: "25, 24, 22, 19, ?",
    options: { A: "15", B: "16", C: "17", D: "18" },
    correctAnswer: "A",
  },

  // Logical & Critical Thinking
  {
    id: "apt-11",
    subject: "aptitude",
    questionNumber: 11,
    questionText:
      "If all roses are flowers and some flowers are red, what can be concluded?",
    options: {
      A: "All roses are red",
      B: "Some roses may be red",
      C: "No roses are red",
      D: "All red things are roses",
    },
    correctAnswer: "B",
  },
  {
    id: "apt-12",
    subject: "aptitude",
    questionNumber: 12,
    questionText: "A is taller than B. B is taller than C. Who is shortest?",
    options: { A: "A", B: "B", C: "C", D: "Cannot determine" },
    correctAnswer: "C",
  },
  {
    id: "apt-13",
    subject: "aptitude",
    questionNumber: 13,
    questionText: "If TODAY = UPEBZ, then DAY = ?",
    options: { A: "EBZ", B: "EBY", C: "EBX", D: "DBZ" },
    correctAnswer: "A",
  },
  {
    id: "apt-14",
    subject: "aptitude",
    questionNumber: 14,
    questionText: "Which number is odd one out? 2, 4, 8, 16, 18",
    options: { A: "2", B: "8", C: "16", D: "18" },
    correctAnswer: "D",
  },
  {
    id: "apt-15",
    subject: "aptitude",
    questionNumber: 15,
    questionText: "Best way to solve a complex problem is:",
    options: {
      A: "Ignore it",
      B: "Break into smaller steps",
      C: "Guess",
      D: "Copy others",
    },
    correctAnswer: "B",
  },

  // More Mixed Aptitude
  {
    id: "apt-16",
    subject: "aptitude",
    questionNumber: 16,
    questionText: "15% of 200 is:",
    options: { A: "20", B: "25", C: "30", D: "35" },
    correctAnswer: "C",
  },
  {
    id: "apt-17",
    subject: "aptitude",
    questionNumber: 17,
    questionText: "1, 4, 9, 16, ?",
    options: { A: "20", B: "24", C: "25", D: "36" },
    correctAnswer: "C",
  },
  {
    id: "apt-18",
    subject: "aptitude",
    questionNumber: 18,
    questionText: "If 3x = 15, x = ?",
    options: { A: "3", B: "4", C: "5", D: "6" },
    correctAnswer: "C",
  },
  {
    id: "apt-19",
    subject: "aptitude",
    questionNumber: 19,
    questionText: "Ratio of 20:40 is:",
    options: { A: "1:2", B: "2:1", C: "1:3", D: "2:3" },
    correctAnswer: "A",
  },
  {
    id: "apt-20",
    subject: "aptitude",
    questionNumber: 20,
    questionText: "Next alphabet: A, D, G, J, ?",
    options: { A: "L", B: "M", C: "N", D: "O" },
    correctAnswer: "B",
  },
  {
    id: "apt-21",
    subject: "aptitude",
    questionNumber: 21,
    questionText: "Speed = Distance / ?",
    options: { A: "Time", B: "Mass", C: "Area", D: "Volume" },
    correctAnswer: "A",
  },
  {
    id: "apt-22",
    subject: "aptitude",
    questionNumber: 22,
    questionText: "If 6 workers take 4 days, total work units = ?",
    options: { A: "10", B: "20", C: "24", D: "30" },
    correctAnswer: "C",
  },
  {
    id: "apt-23",
    subject: "aptitude",
    questionNumber: 23,
    questionText: "What is 100 ÷ 4?",
    options: { A: "20", B: "25", C: "30", D: "40" },
    correctAnswer: "B",
  },
  {
    id: "apt-24",
    subject: "aptitude",
    questionNumber: 24,
    questionText: "Which is a prime number?",
    options: { A: "9", B: "15", C: "17", D: "21" },
    correctAnswer: "C",
  },
  {
    id: "apt-25",
    subject: "aptitude",
    questionNumber: 25,
    questionText: "Logical sequence: 2, 3, 5, 8, 12, ?",
    options: { A: "15", B: "17", C: "18", D: "20" },
    correctAnswer: "B",
  },
];

/* =====================================================
  SECTION B: Web Fundamentals (25 Questions)
===================================================== */

export const webFundamentalQuestions: Question[] = [

  {
    id: "web-1",
    subject: "web",
    questionNumber: 1,
    questionText: "What does RAM stand for?",
    options: {
      A: "Random Access Memory",
      B: "Read Access Memory",
      C: "Run Access Memory",
      D: "Rapid Action Memory",
    },
    correctAnswer: "A",
  },
  {
    id: "web-2",
    subject: "web",
    questionNumber: 2,
    questionText: "Which is used for secure web browsing?",
    options: { A: "HTTP", B: "HTTPS", C: "FTP", D: "SMTP" },
    correctAnswer: "B",
  },
  {
    id: "web-3",
    subject: "web",
    questionNumber: 3,
    questionText: "HTML stands for:",
    options: {
      A: "Hyper Text Markup Language",
      B: "High Text Machine Language",
      C: "Hyperlink Text Mark",
      D: "Home Tool Markup Language",
    },
    correctAnswer: "A",
  },
  {
    id: "web-4",
    subject: "web",
    questionNumber: 4,
    questionText: "CSS is mainly used for:",
    options: {
      A: "Logic building",
      B: "Styling web pages",
      C: "Database storage",
      D: "Backend development",
    },
    correctAnswer: "B",
  },
  {
    id: "web-5",
    subject: "web",
    questionNumber: 5,
    questionText: "JavaScript runs in:",
    options: {
      A: "Browser",
      B: "Database",
      C: "Compiler only",
      D: "Printer",
    },
    correctAnswer: "A",
  },

  {
    id: "web-6",
    subject: "web",
    questionNumber: 6,
    questionText: "What is a variable?",
    options: {
      A: "A loop",
      B: "Storage for data",
      C: "An error",
      D: "Output",
    },
    correctAnswer: "B",
  },
  {
    id: "web-7",
    subject: "web",
    questionNumber: 7,
    questionText: "IF condition is used to:",
    options: {
      A: "Repeat code",
      B: "Check a condition",
      C: "End program",
      D: "Store data",
    },
    correctAnswer: "B",
  },
  {
    id: "web-8",
    subject: "web",
    questionNumber: 8,
    questionText: "A loop is used to:",
    options: {
      A: "Stop execution",
      B: "Repeat code",
      C: "Delete data",
      D: "Store file",
    },
    correctAnswer: "B",
  },
  {
    id: "web-9",
    subject: "web",
    questionNumber: 9,
    questionText: "An algorithm is:",
    options: {
      A: "A browser",
      B: "Step-by-step solution",
      C: "A database",
      D: "A compiler",
    },
    correctAnswer: "B",
  },
  {
    id: "web-10",
    subject: "web",
    questionNumber: 10,
    questionText: "DNS converts:",
    options: {
      A: "IP to Domain",
      B: "Domain to IP",
      C: "HTML to CSS",
      D: "CSS to JS",
    },
    correctAnswer: "B",
  },

  // 15 more beginner logic/web awareness
  {
    id: "web-11",
    subject: "web",
    questionNumber: 11,
    questionText: "Frontend means:",
    options: {
      A: "Server logic",
      B: "Database",
      C: "User Interface",
      D: "Hosting",
    },
    correctAnswer: "C",
  },
  {
    id: "web-12",
    subject: "web",
    questionNumber: 12,
    questionText: "Backend handles:",
    options: {
      A: "UI design",
      B: "Server logic",
      C: "Styling",
      D: "Fonts",
    },
    correctAnswer: "B",
  },
  {
    id: "web-13",
    subject: "web",
    questionNumber: 13,
    questionText: "Which is a database?",
    options: { A: "HTML", B: "MongoDB", C: "CSS", D: "Bootstrap" },
    correctAnswer: "B",
  },
  {
    id: "web-14",
    subject: "web",
    questionNumber: 14,
    questionText: "== is used for:",
    options: {
      A: "Assignment",
      B: "Comparison",
      C: "Loop",
      D: "Function",
    },
    correctAnswer: "B",
  },
  {
    id: "web-15",
    subject: "web",
    questionNumber: 15,
    questionText: "Which tag creates hyperlink?",
    options: { A: "<p>", B: "<a>", C: "<div>", D: "<h1>" },
    correctAnswer: "B",
  },
  {
    id: "web-16",
    subject: "web",
    questionNumber: 16,
    questionText: "IP address identifies:",
    options: {
      A: "User name",
      B: "Device on network",
      C: "Browser",
      D: "CSS file",
    },
    correctAnswer: "B",
  },
  {
    id: "web-17",
    subject: "web",
    questionNumber: 17,
    questionText: "Which is NOT a programming language?",
    options: { A: "Java", B: "Python", C: "HTML", D: "C++" },
    correctAnswer: "C",
  },
  {
    id: "web-18",
    subject: "web",
    questionNumber: 18,
    questionText: "Flowchart is used to:",
    options: {
      A: "Design UI",
      B: "Visualize algorithm",
      C: "Host website",
      D: "Store data",
    },
    correctAnswer: "B",
  },
  {
    id: "web-19",
    subject: "web",
    questionNumber: 19,
    questionText: "What does API stand for?",
    options: {
      A: "Application Programming Interface",
      B: "Advanced Program Internet",
      C: "Applied Process Integration",
      D: "Application Process Internet",
    },
    correctAnswer: "A",
  },
  {
    id: "web-20",
    subject: "web",
    questionNumber: 20,
    questionText: "Cloud computing means:",
    options: {
      A: "Using internet-based services",
      B: "Local storage only",
      C: "Offline apps",
      D: "Hardware repair",
    },
    correctAnswer: "A",
  },
  {
    id: "web-21",
    subject: "web",
    questionNumber: 21,
    questionText: "Compiler converts:",
    options: {
      A: "High-level to machine code",
      B: "HTML to CSS",
      C: "Browser to server",
      D: "IP to domain",
    },
    correctAnswer: "A",
  },
  {
    id: "web-22",
    subject: "web",
    questionNumber: 22,
    questionText: "Which is used to store data permanently?",
    options: {
      A: "RAM",
      B: "ROM",
      C: "CPU",
      D: "Cache",
    },
    correctAnswer: "B",
  },
  {
    id: "web-23",
    subject: "web",
    questionNumber: 23,
    questionText: "What is debugging?",
    options: {
      A: "Writing code",
      B: "Fixing errors",
      C: "Hosting site",
      D: "Designing UI",
    },
    correctAnswer: "B",
  },
  {
    id: "web-24",
    subject: "web",
    questionNumber: 24,
    questionText: "Which part handles data storage?",
    options: {
      A: "Frontend",
      B: "Database",
      C: "CSS",
      D: "HTML",
    },
    correctAnswer: "B",
  },
  {
    id: "web-25",
    subject: "web",
    questionNumber: 25,
    questionText: "Internet is:",
    options: {
      A: "Single computer",
      B: "Network of networks",
      C: "Browser",
      D: "Software",
    },
    correctAnswer: "B",
  },
];

/* =====================================================
  Combined Configuration
===================================================== */

export const allQuestions: Record<string, Question[]> = {
  aptitude: aptitudeQuestions,
  web: webFundamentalQuestions,
};

export const QUESTIONS_PER_SECTION = 25;
export const TOTAL_QUESTIONS = 50;
export const EXAM_DURATION = 30 * 60; // 30 minutes


/* =====================================================
  Combined Exam Configuration
===================================================== */

// export const allQuestions: Record<string, Question[]> = {
//   aptitude: aptitudeQuestions,
//   programming: programmingQuestions,
//   web: webBasicsQuestions,
//   mindset: mindsetQuestions,
// };

// export const QUESTIONS_PER_SECTION = 4;
// export const TOTAL_QUESTIONS = 16;
// export const EXAM_DURATION = 30 * 60; // 30 minutes

export const EXAM_START_TIME = new Date('2026-01-28T20:00:00+05:30').getTime();
export const EXAM_END_TIME   = new Date('2026-01-28T21:00:00+05:30').getTime();

// export const EXAM_END_TIME   = new Date('2026-01-25T23:00:00+05:30').getTime();
// export const EXAM_END_TIME   = new Date('2026-01-28T21:00:00+05:30').getTime();


