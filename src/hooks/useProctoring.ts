import { useCallback, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import {
  setCameraPermission,
  setMicrophonePermission,
  setScreenPermission,
  setCameraStream,
  setMicrophoneStream,
  setScreenStream,
  addWarning,
} from '@/store/proctoringSlice';

export const useProctoring = () => {
  const dispatch = useAppDispatch();
  const proctoringState = useAppSelector((state) => state.proctoring);
  
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Request camera permission
  const requestCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 320, height: 240 },
      });
      cameraStreamRef.current = stream;
      dispatch(setCameraPermission('granted'));
      dispatch(setCameraStream(true));
      return stream;
    } catch (error) {
      console.error('Camera permission denied:', error);
      dispatch(setCameraPermission('denied'));
      dispatch(addWarning({
        type: 'camera_blocked',
        message: 'Camera access was denied. Please enable camera access to continue.',
        severity: 'high',
      }));
      return null;
    }
  }, [dispatch]);

  // Request microphone permission
  const requestMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      micStreamRef.current = stream;
      dispatch(setMicrophonePermission('granted'));
      dispatch(setMicrophoneStream(true));
      return stream;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      dispatch(setMicrophonePermission('denied'));
      dispatch(addWarning({
        type: 'mic_blocked',
        message: 'Microphone access was denied. Please enable microphone access to continue.',
        severity: 'high',
      }));
      return null;
    }
  }, [dispatch]);

  // Request screen recording (tab only)
  const requestScreen = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser',
        },
        audio: false,
        // @ts-ignore - preferCurrentTab is a newer API
        preferCurrentTab: true,
      });
      
      screenStreamRef.current = stream;
      dispatch(setScreenPermission('granted'));
      dispatch(setScreenStream(true));
      
      // Listen for screen share stop
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        dispatch(setScreenStream(false));
        dispatch(addWarning({
          type: 'screen_share_stopped',
          message: 'Screen sharing was stopped. This has been recorded.',
          severity: 'high',
        }));
      });
      
      return stream;
    } catch (error) {
      console.error('Screen permission denied:', error);
      dispatch(setScreenPermission('denied'));
      return null;
    }
  }, [dispatch]);

  // Stop all streams
  const stopAllStreams = useCallback(() => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
      cameraStreamRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    dispatch(setCameraStream(false));
    dispatch(setMicrophoneStream(false));
    dispatch(setScreenStream(false));
  }, [dispatch]);

  // Get camera stream ref
  const getCameraStream = useCallback(() => cameraStreamRef.current, []);
  const getMicStream = useCallback(() => micStreamRef.current, []);

  return {
    ...proctoringState,
    requestCamera,
    requestMicrophone,
    requestScreen,
    stopAllStreams,
    getCameraStream,
    getMicStream,
    cameraStreamRef,
    micStreamRef,
  };
};
