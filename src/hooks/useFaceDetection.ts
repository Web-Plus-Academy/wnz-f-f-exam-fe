import { useEffect, useRef, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { useAppDispatch } from './useAppDispatch';
import { setFaceDetection, addWarning } from '@/store/proctoringSlice';

export const useFaceDetection = (
  videoRef: React.RefObject<HTMLVideoElement>,
  isActive: boolean
) => {
  const dispatch = useAppDispatch();
  const modelsLoadedRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastWarningRef = useRef<number>(0);

  // Load face-api models
  const loadModels = useCallback(async () => {
    if (modelsLoadedRef.current) return true;
    
    try {
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model';
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
      ]);
      
      modelsLoadedRef.current = true;
      console.log('Face detection models loaded');
      return true;
    } catch (error) {
      console.error('Error loading face detection models:', error);
      return false;
    }
  }, []);

  // Detect faces
  const detectFaces = useCallback(async () => {
    if (!videoRef.current || !modelsLoadedRef.current) return;
    
    try {
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
      );
      
      const faceCount = detections.length;
      const detected = faceCount === 1;
      
      dispatch(setFaceDetection({ detected, count: faceCount }));
      
      const now = Date.now();
      // Only warn every 10 seconds to avoid spam
      if (now - lastWarningRef.current > 10000) {
        if (faceCount === 0) {
          dispatch(addWarning({
            type: 'face_not_detected',
            message: 'No face detected. Please ensure your face is visible to the camera.',
            severity: 'medium',
          }));
          lastWarningRef.current = now;
        } else if (faceCount > 1) {
          dispatch(addWarning({
            type: 'multiple_faces',
            message: `Multiple faces (${faceCount}) detected. Only the candidate should be visible.`,
            severity: 'high',
          }));
          lastWarningRef.current = now;
        }
      }
    } catch (error) {
      console.error('Face detection error:', error);
    }
  }, [dispatch, videoRef]);

  // Start detection loop
  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const startDetection = async () => {
      await loadModels();
      
      // Run detection every 2 seconds
      intervalRef.current = setInterval(detectFaces, 2000);
    };

    startDetection();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, loadModels, detectFaces]);

  return { loadModels, detectFaces, isModelsLoaded: modelsLoadedRef.current };
};
