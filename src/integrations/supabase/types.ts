export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      category_progress: {
        Row: {
          average_score: number | null
          category_id: string
          created_at: string | null
          id: string
          quizzes_completed: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          average_score?: number | null
          category_id: string
          created_at?: string | null
          id?: string
          quizzes_completed?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          average_score?: number | null
          category_id?: string
          created_at?: string | null
          id?: string
          quizzes_completed?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_progress_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "study_material_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          category_id: string
          correct_answers: number
          created_at: string | null
          id: string
          points_earned: number
          score_percentage: number
          total_questions: number
          user_id: string
        }
        Insert: {
          category_id: string
          correct_answers: number
          created_at?: string | null
          id?: string
          points_earned: number
          score_percentage: number
          total_questions: number
          user_id: string
        }
        Update: {
          category_id?: string
          correct_answers?: number
          created_at?: string | null
          id?: string
          points_earned?: number
          score_percentage?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "study_material_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      study_material_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      study_materials: {
        Row: {
          category_id: string
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id: string
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_materials_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "study_material_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          average_score: number | null
          created_at: string | null
          daily_quizzes: number | null
          id: string
          quizzes_completed: number | null
          rank: number | null
          streak: number | null
          total_points: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          average_score?: number | null
          created_at?: string | null
          daily_quizzes?: number | null
          id?: string
          quizzes_completed?: number | null
          rank?: number | null
          streak?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          average_score?: number | null
          created_at?: string | null
          daily_quizzes?: number | null
          id?: string
          quizzes_completed?: number | null
          rank?: number | null
          streak?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      category_progress_view: {
        Row: {
          average_score: number | null
          category_id: string | null
          category_name: string | null
          quizzes_completed: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_progress_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "study_material_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_history_view: {
        Row: {
          date: string | null
          points_earned: number | null
          score_percentage: number | null
          user_id: string | null
        }
        Insert: {
          date?: never
          points_earned?: number | null
          score_percentage?: number | null
          user_id?: string | null
        }
        Update: {
          date?: never
          points_earned?: number | null
          score_percentage?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      increment_user_points: {
        Args: { user_id_param: string; points_to_add: number }
        Returns: {
          new_points: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
