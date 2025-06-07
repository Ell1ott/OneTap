import { supabaseAnonAuthHeaders } from 'utils/supabaseAuth';
import { create } from 'zustand';

interface ApiKeyStore {
  apiKey: string | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;

  // Actions
  fetchApiKey: () => Promise<void>;
  clearError: () => void;
}

const API_REFRESH_INTERVAL = 3 * 60 * 1000; // 3 minutes

export const useApiKeyStore = create<ApiKeyStore>((set, get) => ({
  apiKey: null,
  isLoading: false,
  error: null,
  lastUpdated: null,

  fetchApiKey: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(
        'https://pobfzmtkkaybunlhhmny.supabase.co/functions/v1/deepgram-api-key',
        {
          headers: supabaseAnonAuthHeaders,
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch API key: ${response.status}`);
      }

      const data = await response.json();
      set({
        apiKey: data.key,
        isLoading: false,
        lastUpdated: Date.now(),
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch API key',
      });

      // Retry after 10 seconds on error
      setTimeout(() => {
        if (get().error) {
          get().fetchApiKey();
        }
      }, 10000);
    }
  },

  clearError: () => set({ error: null }),
}));

// Auto-start the refresh cycle when the store is created
const store = useApiKeyStore.getState();

// Initial fetch
store.fetchApiKey();

// Set up interval for auto-refresh
setInterval(() => {
  store.fetchApiKey();
}, API_REFRESH_INTERVAL);
