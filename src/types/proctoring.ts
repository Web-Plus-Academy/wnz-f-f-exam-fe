// Centralized warning types for the entire exam system
export type ProctoringWarningType =
  // Navigation / Focus
  | "tab_switch"
  | "window_blur"
  | "fullscreen_exit"

  // Camera / Face
  | "face_not_detected"
  | "multiple_faces"
  | "camera_blocked"

  // Microphone / Noise
  | "mic_blocked"
  | "noise_detected"

  // Screen / Sharing
  | "screen_permission_denied"
  | "screen_share_stopped"

  // System / Generic
  | "system_violation";


export interface ProctoringWarning {
  id: string;
  type: ProctoringWarningType;
  message: string;
  severity: "low" | "medium" | "high";
  timestamp: number;
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

    /* ✅ ADD THIS */
  cameraImage: string | null;
  
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
