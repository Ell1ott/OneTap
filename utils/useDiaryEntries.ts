import { useState, useCallback, useEffect } from 'react';
import { DiaryStorage, DiaryEntry, DiaryEntryMetadata } from './diaryStorage';

export const useDiaryEntries = () => {
  const [entries, setEntries] = useState<DiaryEntryMetadata[]>([]);
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all entries
  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allEntries = await DiaryStorage.getAllEntries();
      setEntries(allEntries);
      return allEntries;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load entries';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load a specific entry
  const loadEntry = useCallback(async (entryId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const entry = await DiaryStorage.loadEntry(entryId);
      if (entry) {
        setCurrentEntry(entry);
        await DiaryStorage.setCurrentEntry(entryId);
        return entry;
      }
      setError('Entry not found');
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load entry';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new entry
  const createEntry = useCallback(
    async (content?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const entryId = await DiaryStorage.createEntry(content);
        const newEntry = await DiaryStorage.loadEntry(entryId);
        if (newEntry) {
          setCurrentEntry(newEntry);
          await loadEntries(); // Refresh the entries list
          return newEntry;
        }
        throw new Error('Failed to load created entry');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create entry';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [loadEntries]
  );

  // Update current entry content
  const updateCurrentEntryContent = useCallback(
    async (content: string) => {
      if (!currentEntry) {
        setError('No current entry to update');
        return false;
      }

      setError(null);
      try {
        await DiaryStorage.updateEntryContent(currentEntry.id, content);

        // Update the current entry state
        const updatedEntry = { ...currentEntry };
        updatedEntry.content = content;
        updatedEntry.updatedAt = new Date().toISOString();
        setCurrentEntry(updatedEntry);

        // Refresh the entries list to update metadata
        await loadEntries();
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update entry';
        setError(errorMessage);
        return false;
      }
    },
    [currentEntry, loadEntries]
  );

  // Delete an entry
  const deleteEntry = useCallback(
    async (entryId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await DiaryStorage.deleteEntry(entryId);

        // If we deleted the current entry, clear it
        if (currentEntry && currentEntry.id === entryId) {
          setCurrentEntry(null);
        }

        await loadEntries(); // Refresh the entries list
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete entry';
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [currentEntry, loadEntries]
  );

  // Get or create today's entry
  const getTodaysEntry = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const todaysEntry = await DiaryStorage.getTodaysEntry();
      setCurrentEntry(todaysEntry);
      await loadEntries(); // Refresh the entries list
      return todaysEntry;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get today's entry";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadEntries]);

  // Clear all entries
  const clearAllEntries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await DiaryStorage.clearAllEntries();
      setEntries([]);
      setCurrentEntry(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear all entries';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Export all entries
  const exportAllEntries = useCallback(async () => {
    setError(null);
    try {
      const exportData = await DiaryStorage.exportAllEntries();
      return exportData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export entries';
      setError(errorMessage);
      return null;
    }
  }, []);

  // Initialize - load entries and current entry on mount
  useEffect(() => {
    const initialize = async () => {
      await loadEntries();

      const currentEntryId = await DiaryStorage.getCurrentEntryId();
      if (currentEntryId) {
        await loadEntry(currentEntryId);
      }
    };

    initialize();
  }, [loadEntry, loadEntries]);

  return {
    // State
    entries,
    currentEntry,
    isLoading,
    error,

    // Actions
    loadEntries,
    loadEntry,
    createEntry,
    updateCurrentEntryContent,
    deleteEntry,
    getTodaysEntry,
    clearAllEntries,
    exportAllEntries,

    // Utilities
    clearError: () => setError(null),
    hasEntries: entries.length > 0,
    currentEntryId: currentEntry?.id || null,
  };
};
