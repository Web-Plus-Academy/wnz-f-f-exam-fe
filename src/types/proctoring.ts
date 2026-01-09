export interface ProctoringWarning {
  id: string;
  type: 'tab_switch' | 'face_not_detected' | 'multiple_faces' | 'noise_detected' | 'screen_share_stopped' | 'camera_blocked' | 'mic_blocked';
  message: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
}

export interface ProctoringState {
  // Setup status
  setupCompleted: boolean;
  currentStep: 'privacy' | 'camera' | 'microphone' | 'screen' | 'ready';
  
  // Permission status
  cameraPermission: 'pending' | 'granted' | 'denied';
  microphonePermission: 'pending' | 'granted' | 'denied';
  screenPermission: 'pending' | 'granted' | 'denied';
  
  // Stream status
  cameraStream: boolean;
  microphoneStream: boolean;
  screenStream: boolean;
  
  // Face detection
  faceDetected: boolean;
  faceCount: number;
  lastFaceCheck: number | null;
  
  // Noise detection
  noiseLevel: number; // 0-100
  noiseThreshold: number;
  isNoisy: boolean;
  
  // Warnings
  warnings: ProctoringWarning[];
  warningCount: number;
  tabSwitchCount: number;
  
  // Active modal
  activeWarningModal: ProctoringWarning | null;
  
  // Privacy consent
  privacyConsent: boolean;
}
