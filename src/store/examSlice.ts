import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExamState, Subject, QuestionStatus } from "@/types/exam";
import { allQuestions, EXAM_DURATION } from "@/data/questions";

/* =====================================================
   Helpers
===================================================== */

const initializeSubjectState = (subject: Subject) => ({
  questions: allQuestions[subject].map((q) => ({
    questionId: q.id,
    status: "not-visited" as QuestionStatus,
    selectedOption: null,
  })),
  currentQuestionIndex: 0,
});

/* =====================================================
   Initial State (UPDATED)
===================================================== */

const initialState: ExamState = {
  subjects: {
    aptitude: initializeSubjectState("aptitude"),
    programming: initializeSubjectState("programming"),
    web: initializeSubjectState("web"),
    mindset: initializeSubjectState("mindset"),
  },
  currentSubject: "aptitude",
  timeRemaining: EXAM_DURATION,
  isSubmitted: false,
  startTime: null,
};

/* =====================================================
   Slice
===================================================== */

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    startExam: (state) => {
      state.startTime = Date.now();
      // mark first question as visited
      state.subjects[state.currentSubject].questions[0].status = "visited";
    },

    setCurrentSubject: (state, action: PayloadAction<Subject>) => {
      state.currentSubject = action.payload;
      const subjectState = state.subjects[action.payload];
      const index = subjectState.currentQuestionIndex;
      const question = subjectState.questions[index];

      if (question.status === "not-visited") {
        question.status = "visited";
      }
    },

    setCurrentQuestion: (state, action: PayloadAction<number>) => {
      const subject = state.currentSubject;
      state.subjects[subject].currentQuestionIndex = action.payload;

      const question = state.subjects[subject].questions[action.payload];
      if (question.status === "not-visited") {
        question.status = "visited";
      }
    },

    selectOption: (
      state,
      action: PayloadAction<{ option: "A" | "B" | "C" | "D" }>
    ) => {
      const subject = state.currentSubject;
      const index = state.subjects[subject].currentQuestionIndex;
      state.subjects[subject].questions[index].selectedOption =
        action.payload.option;
    },

    saveAndNext: (state) => {
      const subject = state.currentSubject;
      const subjectState = state.subjects[subject];
      const index = subjectState.currentQuestionIndex;
      const question = subjectState.questions[index];

      if (question.selectedOption) {
        question.status =
          question.status === "marked" ? "marked-answered" : "answered";
      }

      if (index < subjectState.questions.length - 1) {
        subjectState.currentQuestionIndex += 1;
        const nextQuestion =
          subjectState.questions[subjectState.currentQuestionIndex];
        if (nextQuestion.status === "not-visited") {
          nextQuestion.status = "visited";
        }
      }
    },

    clearResponse: (state) => {
      const subject = state.currentSubject;
      const subjectState = state.subjects[subject];
      const index = subjectState.currentQuestionIndex;
      const question = subjectState.questions[index];

      question.selectedOption = null;

      if (question.status === "marked-answered") {
        question.status = "marked";
      } else if (question.status === "answered") {
        question.status = "visited";
      }
    },

    markForReview: (state) => {
      const subject = state.currentSubject;
      const subjectState = state.subjects[subject];
      const index = subjectState.currentQuestionIndex;
      const question = subjectState.questions[index];

      question.status = question.selectedOption
        ? "marked-answered"
        : "marked";

      if (index < subjectState.questions.length - 1) {
        subjectState.currentQuestionIndex += 1;
        const nextQuestion =
          subjectState.questions[subjectState.currentQuestionIndex];
        if (nextQuestion.status === "not-visited") {
          nextQuestion.status = "visited";
        }
      }
    },

    previousQuestion: (state) => {
      const subject = state.currentSubject;
      const subjectState = state.subjects[subject];
      if (subjectState.currentQuestionIndex > 0) {
        subjectState.currentQuestionIndex -= 1;
      }
    },

    updateTimer: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },

    submitExam: (state) => {
      state.isSubmitted = true;
    },

    resetExam: () => ({
      ...initialState,
      subjects: {
        aptitude: initializeSubjectState("aptitude"),
        programming: initializeSubjectState("programming"),
        web: initializeSubjectState("web"),
        mindset: initializeSubjectState("mindset"),
      },
    }),
  },
});

/* =====================================================
   Exports
===================================================== */

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
