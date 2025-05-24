import { useState, useCallback } from 'react';
import { DiaryStorage } from './diaryStorage';

export const useDiaryStorage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveContent = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await DiaryStorage.saveDiaryContent(content);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save content';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const content = await DiaryStorage.loadDiaryContent();
      return content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load content';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await DiaryStorage.clearDiaryContent();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear content';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFilePath = useCallback(async () => {
    try {
      return await DiaryStorage.getDiaryFilePath();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get file path';
      setError(errorMessage);
      return null;
    }
  }, []);

  return {
    saveContent,
    loadContent,
    clearContent,
    getFilePath,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};
