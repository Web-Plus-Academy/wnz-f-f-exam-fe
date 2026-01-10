import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProctoringState, ProctoringWarning } from '@/types/proctoring';


// Define a local interface extension if your types file isn't updated yet
interface ExtendedProctoringState extends ProctoringState {
  faceOffCount: number;
  noiseDetectedCount: number;
}

const initialState: ExtendedProctoringState = {
  setupCompleted: false,
  currentStep: 'privacy',
  cameraPermission: 'pending',
  microphonePermission: 'pending',
  screenPermission: 'pending',
  cameraStream: false,
  microphoneStream: false,
  screenStream: false,
  cameraImage: null,
  faceDetected: false,
  faceCount: 0,
  lastFaceCheck: null,
  noiseLevel: 0,
  noiseThreshold: 60,
  isNoisy: false,
  warnings: [],
  warningCount: 0,
  tabSwitchCount: 0,
  // 🚀 New counters for LiveIndicators
  faceOffCount: 0,
  noiseDetectedCount: 0,
  activeWarningModal: null,
  privacyConsent: false,
};

const proctoringSlice = createSlice({
  name: 'proctoring',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<ProctoringState['currentStep']>) => {
      state.currentStep = action.payload;
    },
    setPrivacyConsent: (state, action: PayloadAction<boolean>) => {
      state.privacyConsent = action.payload;
    },
    setCameraPermission: (state, action: PayloadAction<ProctoringState['cameraPermission']>) => {
      state.cameraPermission = action.payload;
    },
    setMicrophonePermission: (state, action: PayloadAction<ProctoringState['microphonePermission']>) => {
      state.microphonePermission = action.payload;
    },
    setScreenPermission: (state, action: PayloadAction<ProctoringState['screenPermission']>) => {
      state.screenPermission = action.payload;
    },
    setCameraImage: (state, action: PayloadAction<string | null>) => {
      state.cameraImage = action.payload;
    },
    setCameraStream: (state, action: PayloadAction<boolean>) => {
      state.cameraStream = action.payload;
    },
    setMicrophoneStream: (state, action: PayloadAction<boolean>) => {
      state.microphoneStream = action.payload;
    },
    setScreenStream: (state, action: PayloadAction<boolean>) => {
      state.screenStream = action.payload;
    },
    setFaceDetection: (state, action: PayloadAction<{ detected: boolean; count: number }>) => {
      state.faceDetected = action.payload.detected;
      state.faceCount = action.payload.count;
      state.lastFaceCheck = Date.now();
    },
    setNoiseLevel: (state, action: PayloadAction<number>) => {
      state.noiseLevel = action.payload;
      state.isNoisy = action.payload > state.noiseThreshold;
    },
    
    // 🚨 Centralized Warning Logic
    addWarning: (state, action: PayloadAction<Omit<ProctoringWarning, 'id' | 'timestamp'>>) => {
      const newWarning = {
        ...action.payload,
        id: `warning_${Date.now()}`,
        timestamp: Date.now(),
      };

      state.warnings.push(newWarning);
      state.warningCount++;
      state.activeWarningModal = newWarning;

      // 📊 Increment specific counters based on type for LiveIndicators
      switch (action.payload.type) {
        case 'noise_violation' as any:
          state.noiseDetectedCount++;
          break;
        case 'face_not_detected' as any:
        case 'multiple_faces' as any:
          state.faceOffCount++;
          break;
        case 'tab_switch' as any:
          state.tabSwitchCount++;
          break;
      }
    },

    dismissWarningModal: (state) => {
      state.activeWarningModal = null;
    },
    completeSetup: (state) => {
      state.setupCompleted = true;
    },
    resetProctoring: () => initialState,
  },
});

export const {
  setCurrentStep,
  setPrivacyConsent,
  setCameraPermission,
  setMicrophonePermission,
  setScreenPermission,
  setCameraStream,
  setMicrophoneStream,
  setScreenStream,
  setCameraImage,
  setFaceDetection,
  setNoiseLevel,
  addWarning,
  dismissWarningModal,
  completeSetup,
  resetProctoring,
} = proctoringSlice.actions;

// Alias for simpler component usage
export const showWarningModal = addWarning;

export default proctoringSlice.reducer;