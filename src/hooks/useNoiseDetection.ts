import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { showWarningModal, setNoiseLevel } from '@/store/proctoringSlice';

export const useNoiseDetection = (stream: MediaStream | null, isActive: boolean) => {
  const dispatch = useAppDispatch();
  const { activeWarningModal } = useAppSelector((state) => state.proctoring);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastAlertTime = useRef(0);

  useEffect(() => {
    if (!isActive || !stream) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.4; // Smoother for exam mode

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const checkNoise = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i] * dataArray[i];
      const rms = Math.sqrt(sum / dataArray.length);
      
      // Normal sensitivity for Exam Mode
      const normalizedLevel = Math.min(100, (rms / 128) * 100);
      dispatch(setNoiseLevel(normalizedLevel));

      const currentTime = Date.now();

      // Trigger if noise > 45% (Slightly more lenient for exam taking)
      if (normalizedLevel > 45) {
        // Only dispatch if no modal is currently visible and 5s cooldown passed
        if (!activeWarningModal && (currentTime - lastAlertTime.current > 5000)) {
          dispatch(showWarningModal({
            severity: 'noise' as any,
            type: 'noise_violation' as any,
            message: 'Noise violation detected during exam. Please maintain silence.',
          }));
          lastAlertTime.current = currentTime;
        }
      }

      animationRef.current = requestAnimationFrame(checkNoise);
    };

    checkNoise();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [isActive, stream, dispatch, activeWarningModal]);
};