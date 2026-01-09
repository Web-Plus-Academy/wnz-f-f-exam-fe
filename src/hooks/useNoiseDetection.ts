import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { setNoiseLevel, addWarning } from '@/store/proctoringSlice';

export const useNoiseDetection = (
  micStream: MediaStream | null,
  isActive: boolean
) => {
  const dispatch = useAppDispatch();
  const { noiseThreshold } = useAppSelector((state) => state.proctoring);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastWarningRef = useRef<number>(0);

  const startNoiseDetection = useCallback(() => {
    if (!micStream || !isActive) return;

    try {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      const source = audioContextRef.current.createMediaStreamSource(micStream);
      source.connect(analyserRef.current);
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkNoise = () => {
        if (!analyserRef.current || !isActive) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
        const normalizedLevel = Math.min(100, Math.round((average / 255) * 100 * 2));
        
        dispatch(setNoiseLevel(normalizedLevel));
        
        const now = Date.now();
        // Warn if noise is consistently high (every 15 seconds)
        if (normalizedLevel > noiseThreshold && now - lastWarningRef.current > 15000) {
          dispatch(addWarning({
            type: 'noise_detected',
            message: 'High ambient noise detected. Please ensure a quiet environment.',
            severity: 'low',
          }));
          lastWarningRef.current = now;
        }
        
        animationFrameRef.current = requestAnimationFrame(checkNoise);
      };

      checkNoise();
    } catch (error) {
      console.error('Error starting noise detection:', error);
    }
  }, [micStream, isActive, dispatch, noiseThreshold]);

  const stopNoiseDetection = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (micStream && isActive) {
      startNoiseDetection();
    } else {
      stopNoiseDetection();
    }

    return () => {
      stopNoiseDetection();
    };
  }, [micStream, isActive, startNoiseDetection, stopNoiseDetection]);

  return { startNoiseDetection, stopNoiseDetection };
};
