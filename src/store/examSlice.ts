import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExamState, Subject, QuestionStatus } from '@/types/exam';
import { allQuestions, EXAM_DURATION } from '@/data/questions';

const initializeSubjectState = (subject: Subject) => ({
  questions: allQuestions[subject].map((q) => ({
    questionId: q.id,
    status: 'not-visited' as QuestionStatus,
    selectedOption: null,
  })),
  currentQuestionIndex: 0,
});

const initialState: ExamState = {
  subjects: {
    mathematics: initializeSubjectState('mathematics'),
    physics: initializeSubjectState('physics'),
    chemistry: initializeSubjectState('chemistry'),
  },
  currentSubject: 'mathematics',
  timeRemaining: EXAM_DURATION,
  isSubmitted: false,
  startTime: null,
};

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    startExam: (state) => {
      state.startTime = Date.now();
      // Mark first question as visited
      state.subjects[state.currentSubject].questions[0].status = 'visited';
    },
    
    setCurrentSubject: (state, action: PayloadAction<Subject>) => {
      state.currentSubject = action.payload;
      const currentIndex = state.subjects[action.payload].currentQuestionIndex;
      const question = state.subjects[action.payload].questions[currentIndex];
      if (question.status === 'not-visited') {
        question.status = 'visited';
      }
    },
    
    setCurrentQuestion: (state, action: PayloadAction<number>) => {
      const subject = state.currentSubject;
      state.subjects[subject].currentQuestionIndex = action.payload;
      const question = state.subjects[subject].questions[action.payload];
      if (question.status === 'not-visited') {
        question.status = 'visited';
      }
    },
    
    selectOption: (state, action: PayloadAction<{ option: 'A' | 'B' | 'C' | 'D' }>) => {
      const subject = state.currentSubject;
      const index = state.subjects[subject].currentQuestionIndex;
      state.subjects[subject].questions[index].selectedOption = action.payload.option;
    },
    
    saveAndNext: (state) => {
      const subject = state.currentSubject;
      const index = state.subjects[subject].currentQuestionIndex;
      const question = state.subjects[subject].questions[index];
      
      if (question.selectedOption) {
        if (question.status === 'marked') {
          question.status = 'marked-answered';
        } else {
          question.status = 'answered';
        }
      }
      
      // Move to next question if available
      if (index < state.subjects[subject].questions.length - 1) {
        state.subjects[subject].currentQuestionIndex = index + 1;
        const nextQuestion = state.subjects[subject].questions[index + 1];
        if (nextQuestion.status === 'not-visited') {
          nextQuestion.status = 'visited';
        }
      }
    },
    
    clearResponse: (state) => {
      const subject = state.currentSubject;
      const index = state.subjects[subject].currentQuestionIndex;
      const question = state.subjects[subject].questions[index];
      question.selectedOption = null;
      if (question.status === 'marked-answered') {
        question.status = 'marked';
      } else if (question.status === 'answered') {
        question.status = 'visited';
      }
    },
    
    markForReview: (state) => {
      const subject = state.currentSubject;
      const index = state.subjects[subject].currentQuestionIndex;
      const question = state.subjects[subject].questions[index];
      
      if (question.selectedOption) {
        question.status = 'marked-answered';
      } else {
        question.status = 'marked';
      }
      
      // Move to next question if available
      if (index < state.subjects[subject].questions.length - 1) {
        state.subjects[subject].currentQuestionIndex = index + 1;
        const nextQuestion = state.subjects[subject].questions[index + 1];
        if (nextQuestion.status === 'not-visited') {
          nextQuestion.status = 'visited';
        }
      }
    },
    
    previousQuestion: (state) => {
      const subject = state.currentSubject;
      const index = state.subjects[subject].currentQuestionIndex;
      
      if (index > 0) {
        state.subjects[subject].currentQuestionIndex = index - 1;
      }
    },
    
    updateTimer: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    
    submitExam: (state) => {
      state.isSubmitted = true;
    },
    
    resetExam: (state) => {
      return {
        ...initialState,
        subjects: {
          mathematics: initializeSubjectState('mathematics'),
          physics: initializeSubjectState('physics'),
          chemistry: initializeSubjectState('chemistry'),
        },
      };
    },
  },
});

export const {
  startExam,
  setCurrentSubject,
  setCurrentQuestion,
  selectOption,
  saveAndNext,
  clearResponse,
  markForReview,
  previousQuestion,
  updateTimer,
  submitExam,
  resetExam,
} = examSlice.actions;

export default examSlice.reducer;
