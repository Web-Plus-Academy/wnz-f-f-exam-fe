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

  const loadModels = useCallback(async () => {
    if (modelsLoadedRef.current) return true;
    try {
      // Using reliable CDN for models
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
      ]);
      modelsLoadedRef.current = true;
      return true;
    } catch (error) {
      console.error('Face-api models failed to load:', error);
      return false;
    }
  }, []);

  const detectFaces = useCallback(async () => {
    if (!videoRef.current || videoRef.current.paused || !modelsLoadedRef.current) return;

    try {
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
      );

      const faceCount = detections.length;
      dispatch(setFaceDetection({ detected: faceCount === 1, count: faceCount }));

      const now = Date.now();
      if (now - lastWarningRef.current > 10000) {
        if (faceCount === 0) {
          dispatch(addWarning({
            type: 'face_not_detected',
            message: 'No face detected. Stay within camera view.',
            severity: 'medium',
          }));
          lastWarningRef.current = now;
        } else if (faceCount > 1) {
          dispatch(addWarning({
            type: 'multiple_faces',
            message: 'Multiple people detected in frame.',
            severity: 'high',
          }));
          lastWarningRef.current = now;
        }
      }
    } catch (error) {
      console.warn('Detection frame skipped');
    }
  }, [dispatch, videoRef]);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    loadModels().then((loaded) => {
      if (loaded) intervalRef.current = setInterval(detectFaces, 2000);
    });
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive, loadModels, detectFaces]);

  return { isModelsLoaded: modelsLoadedRef.current };
};