import { useEffect, useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { addWarning } from '@/store/proctoringSlice';

export const useTabDetection = (isActive: boolean) => {
  const dispatch = useAppDispatch();

  const handleVisibilityChange = useCallback(() => {
    if (!isActive) return;
    
    if (document.hidden) {
      dispatch(addWarning({
        type: 'tab_switch',
        message: 'Tab switch detected! This action has been recorded and may affect your exam.',
        severity: 'high',
      }));
    }
  }, [dispatch, isActive]);

  const handleBlur = useCallback(() => {
    if (!isActive) return;
    
    dispatch(addWarning({
      type: 'tab_switch',
      message: 'Window focus lost! Please stay on the exam tab.',
      severity: 'medium',
    }));
  }, [dispatch, isActive]);

  useEffect(() => {
    if (!isActive) return;

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isActive, handleVisibilityChange, handleBlur]);
};
