/* =====================================================
   SUBJECT TYPES (UPDATED FOR 2 SECTIONS)
===================================================== */

export type Subject =
  | 'aptitude'
  | 'web';

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
   LIVE INDICATOR (Strongly Typed Now)
===================================================== */

export interface LiveIndicatorState {
  warningCount: number;
  tabSwitchCount: number;
  faceOffCount: number;
  noiseDetectedCount: number;
}

/* =====================================================
   EXAM STATE
===================================================== */

export interface ExamState {
  subjects: Record<Subject, SubjectState>;
  currentSubject: Subject;
  timeRemaining: number;
  isSubmitted: boolean;
  startTime: number | null;
  liveIndicator: LiveIndicatorState;
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
