import { useEffect, useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { addWarning } from '@/store/proctoringSlice';

export const useTabDetection = (isActive: boolean) => {
  const dispatch = useAppDispatch();

  // 🚨 Detect tab switch
  const handleVisibilityChange = useCallback(() => {
    if (!isActive) return;

    if (document.hidden) {
      dispatch(addWarning({
        type: 'tab_switch',
        message: 'Tab switch detected! This action has been recorded.',
        severity: 'high',
      }));
    }
  }, [dispatch, isActive]);

  // 🚨 Detect window blur
  const handleBlur = useCallback(() => {
    if (!isActive) return;

    dispatch(addWarning({
      type: 'window_blur',
      message: 'Window focus lost! Stay on the exam screen.',
      severity: 'medium',
    }));
  }, [dispatch, isActive]);

  // 🚨 Detect fullscreen exit
  const handleFullscreenExit = useCallback(() => {
    if (!isActive) return;

    if (!document.fullscreenElement) {
      dispatch(addWarning({
        type: 'fullscreen_exit',
        message: 'Fullscreen exited! Please return to fullscreen.',
        severity: 'high',
      }));
    }
  }, [dispatch, isActive]);

  useEffect(() => {
    if (!isActive) return;

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenExit);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenExit);
    };
  }, [isActive, handleVisibilityChange, handleBlur, handleFullscreenExit]);
};
