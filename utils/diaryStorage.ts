import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const DIARY_CONTENT_KEY = 'diary_content';
const DIARY_FILE_NAME = 'diary_content.html';

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

  async writeFile(content: string): Promise<void> {
    // On web, we just use localStorage as the primary storage
    // Could also implement IndexedDB or other web storage APIs here
    await this.setItem(`${DIARY_CONTENT_KEY}_backup`, content);
  },

  async readFile(): Promise<string | null> {
    return await this.getItem(`${DIARY_CONTENT_KEY}_backup`);
  },

  async deleteFile(): Promise<void> {
    await this.removeItem(`${DIARY_CONTENT_KEY}_backup`);
  },

  async getFilePath(): Promise<string> {
    return 'localStorage://diary_content_backup';
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

  async writeFile(content: string): Promise<void> {
    const diaryDir = await this.getDiaryDirectory();
    const filePath = `${diaryDir}${DIARY_FILE_NAME}`;
    await FileSystem.writeAsStringAsync(filePath, content);
  },

  async readFile(): Promise<string | null> {
    try {
      const diaryDir = await this.getDiaryDirectory();
      const filePath = `${diaryDir}${DIARY_FILE_NAME}`;
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

  async deleteFile(): Promise<void> {
    try {
      const diaryDir = await this.getDiaryDirectory();
      const filePath = `${diaryDir}${DIARY_FILE_NAME}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);

      if (fileInfo.exists) {
        await FileSystem.deleteAsync(filePath);
      }
    } catch (error) {
      console.error('Error deleting native file:', error);
    }
  },

  async getFilePath(): Promise<string> {
    const diaryDir = await this.getDiaryDirectory();
    return `${diaryDir}${DIARY_FILE_NAME}`;
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

// Get current date content as fallback
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

export const DiaryStorage = {
  // Save diary content to primary storage and backup
  async saveDiaryContent(content: string): Promise<void> {
    try {
      // Save to primary storage (AsyncStorage on native, localStorage on web)
      await storage.setItem(DIARY_CONTENT_KEY, content);

      // Also save to backup storage
      await storage.writeFile(content);

      console.log('Diary content saved successfully');
    } catch (error) {
      console.error('Error saving diary content:', error);
      throw error;
    }
  },

  // Load diary content from primary storage first, then backup as fallback
  async loadDiaryContent(): Promise<string> {
    try {
      // Try primary storage first
      let content = await storage.getItem(DIARY_CONTENT_KEY);

      if (content) {
        return content;
      }

      // If not in primary storage, try backup storage
      content = await storage.readFile();

      if (content) {
        // Save back to primary storage for faster future access
        await storage.setItem(DIARY_CONTENT_KEY, content);
        return content;
      }

      // If no saved content exists, return current date content
      return getCurrentDateContent();
    } catch (error) {
      console.error('Error loading diary content:', error);
      // Return current date content as fallback
      return getCurrentDateContent();
    }
  },

  // Clear all saved diary content
  async clearDiaryContent(): Promise<void> {
    try {
      await storage.removeItem(DIARY_CONTENT_KEY);
      await storage.deleteFile();

      console.log('Diary content cleared successfully');
    } catch (error) {
      console.error('Error clearing diary content:', error);
      throw error;
    }
  },

  // Get the file path where diary content is stored
  async getDiaryFilePath(): Promise<string> {
    return await storage.getFilePath();
  },

  // Check if we're running on web platform
  isWeb(): boolean {
    return Platform.OS === 'web';
  },
};
