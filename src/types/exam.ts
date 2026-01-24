/* =====================================================
   SUBJECT TYPES (UPDATED)
===================================================== */

export type Subject =
  | 'aptitude'
  | 'programming'
  | 'web'
  | 'mindset';

/* =====================================================
   QUESTION MODEL
===================================================== */

export interface Question {
  id: string;
  subject: Subject;
  questionNumber: number;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

/* =====================================================
   QUESTION STATUS
===================================================== */

export type QuestionStatus =
  | 'not-visited'
  | 'visited'
  | 'answered'
  | 'marked'
  | 'marked-answered';

export interface QuestionState {
  questionId: string;
  status: QuestionStatus;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
}

/* =====================================================
   SUBJECT STATE
===================================================== */

export interface SubjectState {
  questions: QuestionState[];
  currentQuestionIndex: number;
}

/* =====================================================
   EXAM STATE (UPDATED)
===================================================== */

export interface ExamState {
  liveIndicator: any;
  subjects: Record<Subject, SubjectState>;
  currentSubject: Subject;
  timeRemaining: number; // in seconds
  isSubmitted: boolean;
  startTime: number | null;
}

/* =====================================================
   AUTH / USER INFO
===================================================== */

export interface UserInfo {
  applicationNumber: string;
  name: string;
  dateOfBirth: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  hasReadInstructions: boolean;
}
