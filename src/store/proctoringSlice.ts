import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProctoringState, ProctoringWarning } from '@/types/proctoring';

const initialState: ProctoringState = {
  setupCompleted: false,
  currentStep: 'privacy',
  
  cameraPermission: 'pending',
  microphonePermission: 'pending',
  screenPermission: 'pending',
  
  cameraStream: false,
  microphoneStream: false,
  screenStream: false,
  
  faceDetected: false,
  faceCount: 0,
  lastFaceCheck: null,
  
  noiseLevel: 0,
  noiseThreshold: 60,
  isNoisy: false,
  
  warnings: [],
  warningCount: 0,
  tabSwitchCount: 0,
  
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
    
    setNoiseThreshold: (state, action: PayloadAction<number>) => {
      state.noiseThreshold = action.payload;
    },
    
    addWarning: (state, action: PayloadAction<Omit<ProctoringWarning, 'id' | 'timestamp'>>) => {
      const warning: ProctoringWarning = {
        ...action.payload,
        id: `warning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      };
      state.warnings.push(warning);
      state.warningCount++;
      
      if (action.payload.type === 'tab_switch') {
        state.tabSwitchCount++;
      }
      
      state.activeWarningModal = warning;
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
  setFaceDetection,
  setNoiseLevel,
  setNoiseThreshold,
  addWarning,
  dismissWarningModal,
  completeSetup,
  resetProctoring,
} = proctoringSlice.actions;

export default proctoringSlice.reducer;
