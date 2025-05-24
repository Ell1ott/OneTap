import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const DIARY_ENTRIES_INDEX_KEY = 'diary_entries_index';
const DIARY_ENTRY_PREFIX = 'diary_entry_';
const DIARY_CURRENT_ENTRY_KEY = 'diary_current_entry_id';

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiaryEntryMetadata {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  preview: string; // First 100 characters of content
}

// Platform-specific storage implementations
const WebStorage = {
  async setItem(key: string, value: string): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  },

  async getItem(key: string): Promise<string | null> {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },

  async removeItem(key: string): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  },

  async writeFile(filename: string, content: string): Promise<void> {
    // On web, we use localStorage with filename as key
    await this.setItem(`file_${filename}`, content);
  },

  async readFile(filename: string): Promise<string | null> {
    return await this.getItem(`file_${filename}`);
  },

  async deleteFile(filename: string): Promise<void> {
    await this.removeItem(`file_${filename}`);
  },

  async getFilePath(filename: string): Promise<string> {
    return `localStorage://file_${filename}`;
  },

  async listFiles(prefix: string): Promise<string[]> {
    if (typeof window !== 'undefined' && window.localStorage) {
      const files: string[] = [];
      const filePrefix = `file_${prefix}`;
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(filePrefix)) {
          files.push(key.replace('file_', ''));
        }
      }
      return files;
    }
    return [];
  },
};

const NativeStorage = {
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },

  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  },

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  async writeFile(filename: string, content: string): Promise<void> {
    const diaryDir = await this.getDiaryDirectory();
    const filePath = `${diaryDir}${filename}`;
    await FileSystem.writeAsStringAsync(filePath, content);
  },

  async readFile(filename: string): Promise<string | null> {
    try {
      const diaryDir = await this.getDiaryDirectory();
      const filePath = `${diaryDir}${filename}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);

      if (fileInfo.exists) {
        return await FileSystem.readAsStringAsync(filePath);
      }
      return null;
    } catch (error) {
      console.error('Error reading native file:', error);
      return null;
    }
  },

  async deleteFile(filename: string): Promise<void> {
    try {
      const diaryDir = await this.getDiaryDirectory();
      const filePath = `${diaryDir}${filename}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);

      if (fileInfo.exists) {
        await FileSystem.deleteAsync(filePath);
      }
    } catch (error) {
      console.error('Error deleting native file:', error);
    }
  },

  async getFilePath(filename: string): Promise<string> {
    const diaryDir = await this.getDiaryDirectory();
    return `${diaryDir}${filename}`;
  },

  async listFiles(prefix: string): Promise<string[]> {
    try {
      const diaryDir = await this.getDiaryDirectory();
      const files = await FileSystem.readDirectoryAsync(diaryDir);
      return files.filter((file) => file.startsWith(prefix));
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  },

  async getDiaryDirectory(): Promise<string> {
    if (!FileSystem.documentDirectory) {
      throw new Error('Document directory not available');
    }

    const diaryDir = `${FileSystem.documentDirectory}diary/`;

    // Create directory if it doesn't exist
    const dirInfo = await FileSystem.getInfoAsync(diaryDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(diaryDir, { intermediates: true });
    }

    return diaryDir;
  },
};

// Choose storage implementation based on platform
const storage = Platform.OS === 'web' ? WebStorage : NativeStorage;

// Utility functions
const generateEntryId = (): string => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = today.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
  return `${dateStr}_${timeStr}`;
};

const extractTextFromHtml = (html: string): string => {
  // Simple HTML tag removal for preview
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 100);
};

const getCurrentDateContent = (): string => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const prettyDate = today.toLocaleDateString('en-US', options);
  return `<h1>${prettyDate}</h1><p></p>`;
};

const generateEntryTitle = (content: string): string => {
  const textContent = extractTextFromHtml(content);
  if (textContent.length === 0) {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return textContent.substring(0, 50) + (textContent.length > 50 ? '...' : '');
};

export const DiaryStorage = {
  // Get list of all diary entries
  async getAllEntries(): Promise<DiaryEntryMetadata[]> {
    try {
      const indexData = await storage.getItem(DIARY_ENTRIES_INDEX_KEY);
      if (!indexData) {
        return [];
      }
      const entries: DiaryEntryMetadata[] = JSON.parse(indexData);
      return entries.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (error) {
      console.error('Error loading diary entries index:', error);
      return [];
    }
  },

  // Create a new diary entry
  async createEntry(content?: string): Promise<string> {
    try {
      const entryId = generateEntryId();
      const now = new Date().toISOString();
      const entryContent = content || getCurrentDateContent();

      const entry: DiaryEntry = {
        id: entryId,
        title: generateEntryTitle(entryContent),
        content: entryContent,
        createdAt: now,
        updatedAt: now,
      };

      // Save the entry content
      await this.saveEntry(entry);

      // Update the index
      await this.updateEntriesIndex(entry);

      // Set as current entry
      await storage.setItem(DIARY_CURRENT_ENTRY_KEY, entryId);

      console.log('New diary entry created:', entryId);
      return entryId;
    } catch (error) {
      console.error('Error creating diary entry:', error);
      throw error;
    }
  },

  // Save a diary entry
  async saveEntry(entry: DiaryEntry): Promise<void> {
    try {
      const filename = `${DIARY_ENTRY_PREFIX}${entry.id}.json`;
      await storage.writeFile(filename, JSON.stringify(entry));

      // Update the index
      await this.updateEntriesIndex(entry);

      console.log('Diary entry saved:', entry.id);
    } catch (error) {
      console.error('Error saving diary entry:', error);
      throw error;
    }
  },

  // Load a specific diary entry
  async loadEntry(entryId: string): Promise<DiaryEntry | null> {
    try {
      const filename = `${DIARY_ENTRY_PREFIX}${entryId}.json`;
      const entryData = await storage.readFile(filename);

      if (!entryData) {
        return null;
      }

      return JSON.parse(entryData);
    } catch (error) {
      console.error('Error loading diary entry:', error);
      return null;
    }
  },

  // Update entry content
  async updateEntryContent(entryId: string, content: string): Promise<void> {
    try {
      const entry = await this.loadEntry(entryId);
      if (!entry) {
        throw new Error(`Entry ${entryId} not found`);
      }

      entry.content = content;
      entry.updatedAt = new Date().toISOString();
      entry.title = generateEntryTitle(content);

      await this.saveEntry(entry);
    } catch (error) {
      console.error('Error updating diary entry content:', error);
      throw error;
    }
  },

  // Delete a diary entry
  async deleteEntry(entryId: string): Promise<void> {
    try {
      const filename = `${DIARY_ENTRY_PREFIX}${entryId}.json`;
      await storage.deleteFile(filename);

      // Remove from index
      const entries = await this.getAllEntries();
      const updatedEntries = entries.filter((entry) => entry.id !== entryId);
      await storage.setItem(DIARY_ENTRIES_INDEX_KEY, JSON.stringify(updatedEntries));

      // If this was the current entry, clear it
      const currentEntryId = await storage.getItem(DIARY_CURRENT_ENTRY_KEY);
      if (currentEntryId === entryId) {
        await storage.removeItem(DIARY_CURRENT_ENTRY_KEY);
      }

      console.log('Diary entry deleted:', entryId);
    } catch (error) {
      console.error('Error deleting diary entry:', error);
      throw error;
    }
  },

  // Get current active entry ID
  async getCurrentEntryId(): Promise<string | null> {
    return await storage.getItem(DIARY_CURRENT_ENTRY_KEY);
  },

  // Set current active entry
  async setCurrentEntry(entryId: string): Promise<void> {
    await storage.setItem(DIARY_CURRENT_ENTRY_KEY, entryId);
  },

  // Get or create today's entry
  async getTodaysEntry(): Promise<DiaryEntry> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const entries = await this.getAllEntries();

    // Look for an entry created today
    const todaysEntry = entries.find((entry) => entry.createdAt.split('T')[0] === today);

    if (todaysEntry) {
      const fullEntry = await this.loadEntry(todaysEntry.id);
      if (fullEntry) {
        await this.setCurrentEntry(fullEntry.id);
        return fullEntry;
      }
    }

    // Create a new entry for today
    const entryId = await this.createEntry();
    const newEntry = await this.loadEntry(entryId);
    if (!newEntry) {
      throw new Error("Failed to create today's entry");
    }
    return newEntry;
  },

  // Update entries index
  async updateEntriesIndex(entry: DiaryEntry): Promise<void> {
    try {
      const entries = await this.getAllEntries();
      const existingIndex = entries.findIndex((e) => e.id === entry.id);

      const metadata: DiaryEntryMetadata = {
        id: entry.id,
        title: entry.title,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
        preview: extractTextFromHtml(entry.content),
      };

      if (existingIndex >= 0) {
        entries[existingIndex] = metadata;
      } else {
        entries.push(metadata);
      }

      await storage.setItem(DIARY_ENTRIES_INDEX_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error updating entries index:', error);
      throw error;
    }
  },

  // Clear all diary entries
  async clearAllEntries(): Promise<void> {
    try {
      const entries = await this.getAllEntries();

      // Delete all entry files
      for (const entry of entries) {
        await this.deleteEntry(entry.id);
      }

      // Clear the index
      await storage.removeItem(DIARY_ENTRIES_INDEX_KEY);
      await storage.removeItem(DIARY_CURRENT_ENTRY_KEY);

      console.log('All diary entries cleared');
    } catch (error) {
      console.error('Error clearing all entries:', error);
      throw error;
    }
  },

  // Export all entries
  async exportAllEntries(): Promise<string> {
    try {
      const entries = await this.getAllEntries();
      const fullEntries: DiaryEntry[] = [];

      for (const entryMeta of entries) {
        const fullEntry = await this.loadEntry(entryMeta.id);
        if (fullEntry) {
          fullEntries.push(fullEntry);
        }
      }

      return JSON.stringify(fullEntries, null, 2);
    } catch (error) {
      console.error('Error exporting entries:', error);
      throw error;
    }
  },

  // Get file path for a specific entry
  async getEntryFilePath(entryId: string): Promise<string> {
    const filename = `${DIARY_ENTRY_PREFIX}${entryId}.json`;
    return await storage.getFilePath(filename);
  },

  // Check if we're running on web platform
  isWeb(): boolean {
    return Platform.OS === 'web';
  },

  // Legacy methods for backward compatibility
  async saveDiaryContent(content: string): Promise<void> {
    let currentEntryId = await this.getCurrentEntryId();

    if (!currentEntryId) {
      // Create a new entry if none exists
      currentEntryId = await this.createEntry(content);
    } else {
      await this.updateEntryContent(currentEntryId, content);
    }
  },

  async loadDiaryContent(): Promise<string> {
    const todaysEntry = await this.getTodaysEntry();
    return todaysEntry.content;
  },

  async clearDiaryContent(): Promise<void> {
    await this.clearAllEntries();
  },

  async getDiaryFilePath(): Promise<string> {
    const currentEntryId = await this.getCurrentEntryId();
    if (currentEntryId) {
      return await this.getEntryFilePath(currentEntryId);
    }
    return 'no-current-entry';
  },
};
