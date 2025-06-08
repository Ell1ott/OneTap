import { CustomJson } from './customJsonType';

export type Json = CustomJson;

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      categories: {
        Row: {
          counter: number;
          created_at: string;
          deleted: boolean | null;
          emoji: string | null;
          id: string;
          title: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          counter?: number;
          created_at?: string;
          deleted?: boolean | null;
          emoji?: string | null;
          id?: string;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          counter?: number;
          created_at?: string;
          deleted?: boolean | null;
          emoji?: string | null;
          id?: string;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      events: {
        Row: {
          category: string | null;
          counter: number;
          created_at: string;
          deleted: boolean | null;
          emoji: string | null;
          end: Json[] | null;
          id: string;
          note: string | null;
          remind_at: Json[] | null;
          repeat: Json | null;
          start: Json[];
          title: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          category?: string | null;
          counter?: number;
          created_at?: string;
          deleted?: boolean | null;
          emoji?: string | null;
          end?: Json[] | null;
          id?: string;
          note?: string | null;
          remind_at?: Json[] | null;
          repeat?: Json | null;
          start?: Json[];
          title?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          category?: string | null;
          counter?: number;
          created_at?: string;
          deleted?: boolean | null;
          emoji?: string | null;
          end?: Json[] | null;
          id?: string;
          note?: string | null;
          remind_at?: Json[] | null;
          repeat?: Json | null;
          start?: Json[];
          title?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      todos: {
        Row: {
          category: string | null;
          completed: boolean[] | null;
          counter: number;
          created_at: string;
          deleted: boolean | null;
          done_times: string[];
          emoji: string | null;
          end: Json | null;
          id: string;
          note: string | null;
          remind_at: Json[] | null;
          repeat: Json | null;
          soft_due: Json | null;
          soft_repeat: Json | null;
          start: Json | null;
          title: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          category?: string | null;
          completed?: boolean[] | null;
          counter?: number;
          created_at?: string;
          deleted?: boolean | null;
          done_times?: string[];
          emoji?: string | null;
          end?: Json | null;
          id?: string;
          note?: string | null;
          remind_at?: Json[] | null;
          repeat?: Json | null;
          soft_due?: Json | null;
          soft_repeat?: Json | null;
          start?: Json | null;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Update: {
          category?: string | null;
          completed?: boolean[] | null;
          counter?: number;
          created_at?: string;
          deleted?: boolean | null;
          done_times?: string[];
          emoji?: string | null;
          end?: Json | null;
          id?: string;
          note?: string | null;
          remind_at?: Json[] | null;
          repeat?: Json | null;
          soft_due?: Json | null;
          soft_repeat?: Json | null;
          start?: Json | null;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
