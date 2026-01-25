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
   Initial State (UPDATED FOR 2 SECTIONS)
===================================================== */

const initialState: ExamState = {
  subjects: {
    aptitude: initializeSubjectState("aptitude"),
    web: initializeSubjectState("web"),
  },
  currentSubject: "aptitude",
  timeRemaining: EXAM_DURATION,
  isSubmitted: false,
  startTime: null,
  liveIndicator: {
    warningCount: 0,
    tabSwitchCount: 0,
    faceOffCount: 0,
    noiseDetectedCount: 0,
  },
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
      const subjectState = state.subjects[subject];

      subjectState.currentQuestionIndex = action.payload;

      const question = subjectState.questions[action.payload];
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
      const currentSub = state.currentSubject;
      const subState = state.subjects[currentSub];
      const index = subState.currentQuestionIndex;
      const question = subState.questions[index];

      // Update status
      if (question.selectedOption) {
        question.status =
          question.status === "marked"
            ? "marked-answered"
            : "answered";
      }

      if (index < subState.questions.length - 1) {
        subState.currentQuestionIndex += 1;

        const nextQuestion =
          subState.questions[subState.currentQuestionIndex];

        if (nextQuestion.status === "not-visited") {
          nextQuestion.status = "visited";
        }

      } else {
        // Move to next subject
        const subjects = Object.keys(state.subjects) as Subject[];
        const currentIdx = subjects.indexOf(currentSub);

        if (currentIdx < subjects.length - 1) {
          const nextSubject = subjects[currentIdx + 1];

          state.currentSubject = nextSubject;
          state.subjects[nextSubject].currentQuestionIndex = 0;

          const firstQuestion =
            state.subjects[nextSubject].questions[0];

          if (firstQuestion.status === "not-visited") {
            firstQuestion.status = "visited";
          }
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
      const currentSub = state.currentSubject;
      const subState = state.subjects[currentSub];
      const index = subState.currentQuestionIndex;
      const question = subState.questions[index];

      question.status = question.selectedOption
        ? "marked-answered"
        : "marked";

      if (index < subState.questions.length - 1) {
        subState.currentQuestionIndex += 1;

        const nextQuestion =
          subState.questions[subState.currentQuestionIndex];

        if (nextQuestion.status === "not-visited") {
          nextQuestion.status = "visited";
        }

      } else {
        const subjects = Object.keys(state.subjects) as Subject[];
        const currentIdx = subjects.indexOf(currentSub);

        if (currentIdx < subjects.length - 1) {
          const nextSubject = subjects[currentIdx + 1];

          state.currentSubject = nextSubject;
          state.subjects[nextSubject].currentQuestionIndex = 0;

          const firstQuestion =
            state.subjects[nextSubject].questions[0];

          if (firstQuestion.status === "not-visited") {
            firstQuestion.status = "visited";
          }
        }
      }
    },

    previousQuestion: (state) => {
      const currentSub = state.currentSubject;
      const subState = state.subjects[currentSub];

      if (subState.currentQuestionIndex > 0) {
        subState.currentQuestionIndex -= 1;
      } else {
        const subjects = Object.keys(state.subjects) as Subject[];
        const currentIdx = subjects.indexOf(currentSub);

        if (currentIdx > 0) {
          const prevSubject = subjects[currentIdx - 1];
          state.currentSubject = prevSubject;

          state.subjects[prevSubject].currentQuestionIndex =
            state.subjects[prevSubject].questions.length - 1;
        }
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
        web: initializeSubjectState("web"),
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
