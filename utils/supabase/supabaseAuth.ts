// Get the token from the .env
const token = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseAnonAuthHeaders = {
  Authorization: `Bearer ${token}`,
};
