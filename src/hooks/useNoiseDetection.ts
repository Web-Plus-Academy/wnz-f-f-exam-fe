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
  const sustainedNoiseStart = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive || !stream) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 1024; // Better accuracy
    analyser.smoothingTimeConstant = 0.8; // Heavy smoothing (less jumpy)

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.fftSize);

    const NOISE_THRESHOLD = 65;        // Increased threshold (was 45)
    const MIN_SUSTAIN_MS = 1500;       // Must sustain 1.5 seconds
    const COOLDOWN_MS = 10000;         // 10 sec cooldown

    const checkNoise = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteTimeDomainData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const value = (dataArray[i] - 128) / 128;
        sum += value * value;
      }

      const rms = Math.sqrt(sum / dataArray.length);
      const normalizedLevel = Math.min(100, rms * 200); // More realistic scaling

      dispatch(setNoiseLevel(normalizedLevel));

      const now = Date.now();

      if (normalizedLevel > NOISE_THRESHOLD) {
        if (!sustainedNoiseStart.current) {
          sustainedNoiseStart.current = now;
        }

        const sustainedDuration = now - sustainedNoiseStart.current;

        if (
          sustainedDuration > MIN_SUSTAIN_MS &&
          !activeWarningModal &&
          now - lastAlertTime.current > COOLDOWN_MS
        ) {
          dispatch(
            showWarningModal({
              severity: 'noise' as any,
              type: 'noise_violation' as any,
              message:
                'Excessive noise detected. Please maintain silence during the examination.',
            })
          );

          lastAlertTime.current = now;
          sustainedNoiseStart.current = null;
        }
      } else {
        sustainedNoiseStart.current = null;
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