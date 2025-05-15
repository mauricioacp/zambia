export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      agreements: {
        Row: {
          activation_date: string | null
          address: string | null
          age_verification: boolean | null
          birth_date: string | null
          created_at: string | null
          document_number: string | null
          email: string
          ethical_document_agreement: boolean | null
          fts_name_lastname: unknown | null
          gender: string | null
          headquarter_id: string
          id: string
          last_name: string | null
          mailing_agreement: boolean | null
          name: string | null
          phone: string | null
          role_id: string
          season_id: string
          signature_data: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          volunteering_agreement: boolean | null
        }
        Insert: {
          activation_date?: string | null
          address?: string | null
          age_verification?: boolean | null
          birth_date?: string | null
          created_at?: string | null
          document_number?: string | null
          email: string
          ethical_document_agreement?: boolean | null
          fts_name_lastname?: unknown | null
          gender?: string | null
          headquarter_id: string
          id?: string
          last_name?: string | null
          mailing_agreement?: boolean | null
          name?: string | null
          phone?: string | null
          role_id: string
          season_id: string
          signature_data?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          volunteering_agreement?: boolean | null
        }
        Update: {
          activation_date?: string | null
          address?: string | null
          age_verification?: boolean | null
          birth_date?: string | null
          created_at?: string | null
          document_number?: string | null
          email?: string
          ethical_document_agreement?: boolean | null
          fts_name_lastname?: unknown | null
          gender?: string | null
          headquarter_id?: string
          id?: string
          last_name?: string | null
          mailing_agreement?: boolean | null
          name?: string | null
          phone?: string | null
          role_id?: string
          season_id?: string
          signature_data?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          volunteering_agreement?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "agreements_headquarter_id_fkey"
            columns: ["headquarter_id"]
            isOneToOne: false
            referencedRelation: "headquarters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agreements_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agreements_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string | null
          changed_at: string | null
          changed_by: string | null
          diff: Json | null
          id: number
          record_id: string | null
          table_name: string | null
          user_name: string | null
        }
        Insert: {
          action?: string | null
          changed_at?: string | null
          changed_by?: string | null
          diff?: Json | null
          id?: number
          record_id?: string | null
          table_name?: string | null
          user_name?: string | null
        }
        Update: {
          action?: string | null
          changed_at?: string | null
          changed_by?: string | null
          diff?: Json | null
          id?: number
          record_id?: string | null
          table_name?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      collaborators: {
        Row: {
          end_date: string | null
          headquarter_id: string
          id: string
          role_id: string
          start_date: string | null
          status: Database["public"]["Enums"]["collaborator_status"] | null
          user_id: string
        }
        Insert: {
          end_date?: string | null
          headquarter_id: string
          id?: string
          role_id: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["collaborator_status"] | null
          user_id: string
        }
        Update: {
          end_date?: string | null
          headquarter_id?: string
          id?: string
          role_id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["collaborator_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborators_headquarter_id_fkey"
            columns: ["headquarter_id"]
            isOneToOne: false
            referencedRelation: "headquarters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborators_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      companion_student_map: {
        Row: {
          companion_id: string
          created_at: string
          headquarter_id: string
          season_id: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          companion_id: string
          created_at?: string
          headquarter_id: string
          season_id: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          companion_id?: string
          created_at?: string
          headquarter_id?: string
          season_id?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companion_student_map_companion_id_fkey"
            columns: ["companion_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "companion_student_map_headquarter_id_fkey"
            columns: ["headquarter_id"]
            isOneToOne: false
            referencedRelation: "headquarters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companion_student_map_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companion_student_map_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["user_id"]
          },
        ]
      }
      countries: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      event_types: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          data: Json | null
          description: string | null
          end_datetime: string | null
          event_type_id: number | null
          headquarter_id: string | null
          id: string
          season_id: string | null
          start_datetime: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          description?: string | null
          end_datetime?: string | null
          event_type_id?: number | null
          headquarter_id?: string | null
          id?: string
          season_id?: string | null
          start_datetime?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          description?: string | null
          end_datetime?: string | null
          event_type_id?: number | null
          headquarter_id?: string | null
          id?: string
          season_id?: string | null
          start_datetime?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_headquarter_id_fkey"
            columns: ["headquarter_id"]
            isOneToOne: false
            referencedRelation: "headquarters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      facilitator_workshop_map: {
        Row: {
          created_at: string
          facilitator_id: string
          headquarter_id: string
          season_id: string
          updated_at: string | null
          workshop_id: string
        }
        Insert: {
          created_at?: string
          facilitator_id: string
          headquarter_id: string
          season_id: string
          updated_at?: string | null
          workshop_id: string
        }
        Update: {
          created_at?: string
          facilitator_id?: string
          headquarter_id?: string
          season_id?: string
          updated_at?: string | null
          workshop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "facilitator_workshop_map_facilitator_id_fkey"
            columns: ["facilitator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "facilitator_workshop_map_headquarter_id_fkey"
            columns: ["headquarter_id"]
            isOneToOne: false
            referencedRelation: "headquarters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facilitator_workshop_map_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facilitator_workshop_map_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "scheduled_workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      headquarters: {
        Row: {
          address: string | null
          contact_info: Json | null
          country_id: string | null
          created_at: string | null
          id: string
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_info?: Json | null
          country_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_info?: Json | null
          country_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "headquarters_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      master_workshop_types: {
        Row: {
          created_at: string
          id: number
          master_description: string | null
          master_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          master_description?: string | null
          master_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          master_description?: string | null
          master_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      processes: {
        Row: {
          content: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          required_approvals: string[] | null
          status: string | null
          type: string | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          required_approvals?: string[] | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          required_approvals?: string[] | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          level: number
          name: string
          permissions: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          level: number
          name: string
          permissions?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          level?: number
          name?: string
          permissions?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      scheduled_workshops: {
        Row: {
          created_at: string
          end_datetime: string
          facilitator_id: string
          headquarter_id: string
          id: string
          local_name: string
          location_details: string | null
          master_workshop_type_id: number
          season_id: string
          start_datetime: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          end_datetime: string
          facilitator_id: string
          headquarter_id: string
          id?: string
          local_name: string
          location_details?: string | null
          master_workshop_type_id: number
          season_id: string
          start_datetime: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          end_datetime?: string
          facilitator_id?: string
          headquarter_id?: string
          id?: string
          local_name?: string
          location_details?: string | null
          master_workshop_type_id?: number
          season_id?: string
          start_datetime?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_workshops_facilitator_id_fkey"
            columns: ["facilitator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "scheduled_workshops_headquarter_id_fkey"
            columns: ["headquarter_id"]
            isOneToOne: false
            referencedRelation: "headquarters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_workshops_master_workshop_type_id_fkey"
            columns: ["master_workshop_type_id"]
            isOneToOne: false
            referencedRelation: "master_workshop_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_workshops_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          created_at: string | null
          end_date: string | null
          headquarter_id: string
          id: string
          manager_id: string | null
          name: string
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          headquarter_id: string
          id?: string
          manager_id?: string | null
          name: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          headquarter_id?: string
          id?: string
          manager_id?: string | null
          name?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seasons_headquarter_id_fkey"
            columns: ["headquarter_id"]
            isOneToOne: false
            referencedRelation: "headquarters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seasons_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["user_id"]
          },
        ]
      }
      strapi_migrations: {
        Row: {
          created_at: string
          error_message: string | null
          id: number
          last_migrated_at: string
          migration_timestamp: string
          records_processed: number
          status: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: never
          last_migrated_at: string
          migration_timestamp?: string
          records_processed?: number
          status: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: never
          last_migrated_at?: string
          migration_timestamp?: string
          records_processed?: number
          status?: string
        }
        Relationships: []
      }
      student_attendance: {
        Row: {
          attendance_status: string
          attendance_timestamp: string
          created_at: string
          id: string
          notes: string | null
          scheduled_workshop_id: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          attendance_status: string
          attendance_timestamp?: string
          created_at?: string
          id?: string
          notes?: string | null
          scheduled_workshop_id: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          attendance_status?: string
          attendance_timestamp?: string
          created_at?: string
          id?: string
          notes?: string | null
          scheduled_workshop_id?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_attendance_scheduled_workshop_id_fkey"
            columns: ["scheduled_workshop_id"]
            isOneToOne: false
            referencedRelation: "scheduled_workshops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["user_id"]
          },
        ]
      }
      students: {
        Row: {
          enrollment_date: string
          headquarter_id: string
          id: string
          program_progress_comments: Json | null
          season_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          enrollment_date: string
          headquarter_id: string
          id?: string
          program_progress_comments?: Json | null
          season_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          enrollment_date?: string
          headquarter_id?: string
          id?: string
          program_progress_comments?: Json | null
          season_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_headquarter_id_fkey"
            columns: ["headquarter_id"]
            isOneToOne: false
            referencedRelation: "headquarters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      agreement_with_role: {
        Row: {
          address: string | null
          age_verification: boolean | null
          created_at: string | null
          document_number: string | null
          email: string | null
          ethical_document_agreement: boolean | null
          fts_name_lastname: unknown | null
          headquarter_id: string | null
          id: string | null
          last_name: string | null
          mailing_agreement: boolean | null
          name: string | null
          phone: string | null
          role: Json | null
          season_id: string | null
          signature_data: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          volunteering_agreement: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "agreements_headquarter_id_fkey"
            columns: ["headquarter_id"]
            isOneToOne: false
            referencedRelation: "headquarters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agreements_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      fn_get_current_agreement_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      fn_get_current_hq_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      fn_get_current_role_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      fn_get_current_role_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      fn_get_current_role_level: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      fn_get_current_season_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      fn_get_current_user_metadata: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      fn_is_collaborator_or_higher: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      fn_is_current_user_hq_equal_to: {
        Args: { hq_id: string }
        Returns: boolean
      }
      fn_is_general_director_or_higher: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      fn_is_konsejo_member_or_higher: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      fn_is_local_manager_or_higher: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      fn_is_manager_assistant_or_higher: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      fn_is_role_level_below: {
        Args: { p_role_id: string; p_level_threshold: number }
        Returns: boolean
      }
      fn_is_student_or_higher: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      fn_is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      fn_is_valid_facilitator_for_hq: {
        Args: { p_user_id: string; p_headquarter_id: string }
        Returns: boolean
      }
      get_agreement_by_role_id: {
        Args: { role_id: string }
        Returns: {
          address: string | null
          age_verification: boolean | null
          created_at: string | null
          document_number: string | null
          email: string | null
          ethical_document_agreement: boolean | null
          fts_name_lastname: unknown | null
          headquarter_id: string | null
          id: string | null
          last_name: string | null
          mailing_agreement: boolean | null
          name: string | null
          phone: string | null
          role: Json | null
          season_id: string | null
          signature_data: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          volunteering_agreement: boolean | null
        }[]
      }
      get_agreement_with_role_by_id: {
        Args: { p_agreement_id: string }
        Returns: Json
      }
      get_agreements_by_role: {
        Args: { role_name: string }
        Returns: {
          address: string | null
          age_verification: boolean | null
          created_at: string | null
          document_number: string | null
          email: string | null
          ethical_document_agreement: boolean | null
          fts_name_lastname: unknown | null
          headquarter_id: string | null
          id: string | null
          last_name: string | null
          mailing_agreement: boolean | null
          name: string | null
          phone: string | null
          role: Json | null
          season_id: string | null
          signature_data: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          volunteering_agreement: boolean | null
        }[]
      }
      get_agreements_by_role_string: {
        Args: { role_string: string }
        Returns: {
          address: string | null
          age_verification: boolean | null
          created_at: string | null
          document_number: string | null
          email: string | null
          ethical_document_agreement: boolean | null
          fts_name_lastname: unknown | null
          headquarter_id: string | null
          id: string | null
          last_name: string | null
          mailing_agreement: boolean | null
          name: string | null
          phone: string | null
          role: Json | null
          season_id: string | null
          signature_data: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          volunteering_agreement: boolean | null
        }[]
      }
      get_agreements_with_role: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string | null
          age_verification: boolean | null
          created_at: string | null
          document_number: string | null
          email: string | null
          ethical_document_agreement: boolean | null
          fts_name_lastname: unknown | null
          headquarter_id: string | null
          id: string | null
          last_name: string | null
          mailing_agreement: boolean | null
          name: string | null
          phone: string | null
          role: Json | null
          season_id: string | null
          signature_data: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          volunteering_agreement: boolean | null
        }[]
      }
      get_agreements_with_role_paginated: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_status?: string
          p_headquarter_id?: string
          p_season_id?: string
          p_search?: string
          p_role_id?: string
        }
        Returns: Json
      }
      get_companion_effectiveness_metrics: {
        Args: { target_hq_id?: string }
        Returns: Json
      }
      get_companion_student_attendance_issues: {
        Args: { last_n_items?: number }
        Returns: {
          student_id: string
          student_first_name: string
          student_last_name: string
          missed_workshops_count: number
          total_workshops_count: number
          attendance_percentage: number
        }[]
      }
      get_dashboard_agreement_review_statistics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_dashboard_statistics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_dashboard_statistics_by_prospect_agreements: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_facilitator_multiple_roles_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_global_agreement_breakdown: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_global_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_headquarter_dashboard_stats: {
        Args: { target_hq_id: string }
        Returns: Json
      }
      get_hq_agreement_breakdown: {
        Args: { target_hq_id: string }
        Returns: Json
      }
      get_hq_agreement_ranking_this_year: {
        Args: Record<PropertyKey, never>
        Returns: {
          headquarter_id: string
          headquarter_name: string
          agreements_this_year_count: number
          agreements_graduated_count: number
          graduation_percentage: number
        }[]
      }
      get_hq_graduation_ranking: {
        Args: { months_back?: number }
        Returns: Json
      }
      get_prospect_to_active_avg_time: {
        Args: { target_hq_id?: string }
        Returns: Json
      }
      get_student_progress_stats: {
        Args: { target_hq_id?: string }
        Returns: Json
      }
      get_student_trend_by_quarter: {
        Args: { quarters_back?: number }
        Returns: Json
      }
      get_user_dashboard_stats: {
        Args: { target_user_id: string }
        Returns: Json
      }
    }
    Enums: {
      collaborator_status: "active" | "inactive" | "standby"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      collaborator_status: ["active", "inactive", "standby"],
    },
  },
} as const

