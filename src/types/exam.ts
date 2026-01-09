export type Subject = 'mathematics' | 'physics' | 'chemistry';

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

export interface SubjectState {
  questions: QuestionState[];
  currentQuestionIndex: number;
}

export interface ExamState {
  subjects: Record<Subject, SubjectState>;
  currentSubject: Subject;
  timeRemaining: number; // in seconds
  isSubmitted: boolean;
  startTime: number | null;
}

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
