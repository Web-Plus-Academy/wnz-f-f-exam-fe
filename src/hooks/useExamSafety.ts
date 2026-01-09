import { useEffect, useCallback } from 'react';

export const useExamSafety = (isExamActive: boolean) => {
  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (isExamActive) {
      e.preventDefault();
      e.returnValue = 'You have an ongoing exam. Are you sure you want to leave?';
      return e.returnValue;
    }
  }, [isExamActive]);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    if (isExamActive) {
      e.preventDefault();
    }
  }, [isExamActive]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isExamActive) {
      // Prevent F5, Ctrl+R, Ctrl+Shift+R (refresh)
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.ctrlKey && e.shiftKey && e.key === 'R')) {
        e.preventDefault();
      }
      // Prevent Ctrl+C, Ctrl+V, Ctrl+X (clipboard)
      if (e.ctrlKey && ['c', 'v', 'x'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      // Prevent Ctrl+P (print)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
      }
    }
  }, [isExamActive]);

  const handleVisibilityChange = useCallback(() => {
    if (isExamActive && document.hidden) {
      // Could implement warning logic here
      console.warn('Tab switch detected during exam');
    }
  }, [isExamActive]);

  useEffect(() => {
    if (isExamActive) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [isExamActive, handleBeforeUnload, handleContextMenu, handleKeyDown, handleVisibilityChange]);
};
