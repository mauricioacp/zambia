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
      notification_deliveries: {
        Row: {
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          failed_at: string | null
          id: string
          metadata: Json | null
          notification_id: string
          sent_at: string | null
          status: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          metadata?: Json | null
          notification_id: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          metadata?: Json | null
          notification_id?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_deliveries_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          blocked_categories: string[] | null
          blocked_senders: string[] | null
          channel_preferences: Json | null
          created_at: string | null
          enabled: boolean | null
          id: string
          priority_threshold:
            | Database["public"]["Enums"]["notification_priority"]
            | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          blocked_categories?: string[] | null
          blocked_senders?: string[] | null
          channel_preferences?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          priority_threshold?:
            | Database["public"]["Enums"]["notification_priority"]
            | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          blocked_categories?: string[] | null
          blocked_senders?: string[] | null
          channel_preferences?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          priority_threshold?:
            | Database["public"]["Enums"]["notification_priority"]
            | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          body_template: string
          code: string
          created_at: string | null
          default_channels:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          default_priority:
            | Database["public"]["Enums"]["notification_priority"]
            | null
          description: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          title_template: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          body_template: string
          code: string
          created_at?: string | null
          default_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          default_priority?:
            | Database["public"]["Enums"]["notification_priority"]
            | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          title_template: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          body_template?: string
          code?: string
          created_at?: string | null
          default_channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          default_priority?:
            | Database["public"]["Enums"]["notification_priority"]
            | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          title_template?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          archived_at: string | null
          body: string
          category: string | null
          created_at: string | null
          data: Json | null
          expires_at: string | null
          id: string
          is_archived: boolean | null
          is_read: boolean | null
          priority: Database["public"]["Enums"]["notification_priority"] | null
          read_at: string | null
          recipient_id: string | null
          recipient_role_code: string | null
          recipient_role_level: number | null
          related_entity_id: string | null
          related_entity_type: string | null
          sender_id: string | null
          sender_type: string | null
          tags: string[] | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string | null
        }
        Insert: {
          action_url?: string | null
          archived_at?: string | null
          body: string
          category?: string | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          read_at?: string | null
          recipient_id?: string | null
          recipient_role_code?: string | null
          recipient_role_level?: number | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          sender_id?: string | null
          sender_type?: string | null
          tags?: string[] | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string | null
        }
        Update: {
          action_url?: string | null
          archived_at?: string | null
          body?: string
          category?: string | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          read_at?: string | null
          recipient_id?: string | null
          recipient_role_code?: string | null
          recipient_role_level?: number | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          sender_id?: string | null
          sender_type?: string | null
          tags?: string[] | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
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
      user_search_index: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          headquarter_name: string | null
          is_active: boolean | null
          last_seen: string | null
          role_code: string
          role_level: number
          role_name: string
          search_vector: unknown | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          headquarter_name?: string | null
          is_active?: boolean | null
          last_seen?: string | null
          role_code: string
          role_level: number
          role_name: string
          search_vector?: unknown | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          headquarter_name?: string | null
          is_active?: boolean | null
          last_seen?: string | null
          role_code?: string
          role_level?: number
          role_name?: string
          search_vector?: unknown | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      workflow_action_history: {
        Row: {
          action: string
          action_id: string
          comment: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_value: Json | null
          previous_value: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          action_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_value?: Json | null
          previous_value?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          action_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_value?: Json | null
          previous_value?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_action_history_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "workflow_actions"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_action_role_assignments: {
        Row: {
          action_type: string
          assigned_role_code: string | null
          assignment_rule: Json | null
          created_at: string | null
          id: string
          min_role_level: number | null
          template_stage_id: string
          updated_at: string | null
        }
        Insert: {
          action_type: string
          assigned_role_code?: string | null
          assignment_rule?: Json | null
          created_at?: string | null
          id?: string
          min_role_level?: number | null
          template_stage_id: string
          updated_at?: string | null
        }
        Update: {
          action_type?: string
          assigned_role_code?: string | null
          assignment_rule?: Json | null
          created_at?: string | null
          id?: string
          min_role_level?: number | null
          template_stage_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_action_role_assignments_template_stage_id_fkey"
            columns: ["template_stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_template_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_actions: {
        Row: {
          action_type: string
          assigned_by: string | null
          assigned_to: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          data: Json | null
          due_date: string | null
          id: string
          priority: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          result: Json | null
          stage_instance_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          action_type: string
          assigned_by?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          data?: Json | null
          due_date?: string | null
          id?: string
          priority?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          result?: Json | null
          stage_instance_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          action_type?: string
          assigned_by?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          data?: Json | null
          due_date?: string | null
          id?: string
          priority?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          result?: Json | null
          stage_instance_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_actions_stage_instance_id_fkey"
            columns: ["stage_instance_id"]
            isOneToOne: false
            referencedRelation: "workflow_stage_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_instances: {
        Row: {
          cancelled_at: string | null
          completed_at: string | null
          created_at: string | null
          current_stage_id: string | null
          data: Json | null
          id: string
          initiated_by: string | null
          status: string | null
          template_id: string
          updated_at: string | null
        }
        Insert: {
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_stage_id?: string | null
          data?: Json | null
          id?: string
          initiated_by?: string | null
          status?: string | null
          template_id: string
          updated_at?: string | null
        }
        Update: {
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_stage_id?: string | null
          data?: Json | null
          id?: string
          initiated_by?: string | null
          status?: string | null
          template_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_instances_current_stage_id_fkey"
            columns: ["current_stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_template_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_instances_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_notifications: {
        Row: {
          action_id: string | null
          channel: string
          created_at: string | null
          data: Json | null
          id: string
          notification_type: string
          read_at: string | null
          recipient_id: string | null
          sent_at: string | null
          workflow_instance_id: string
        }
        Insert: {
          action_id?: string | null
          channel: string
          created_at?: string | null
          data?: Json | null
          id?: string
          notification_type: string
          read_at?: string | null
          recipient_id?: string | null
          sent_at?: string | null
          workflow_instance_id: string
        }
        Update: {
          action_id?: string | null
          channel?: string
          created_at?: string | null
          data?: Json | null
          id?: string
          notification_type?: string
          read_at?: string | null
          recipient_id?: string | null
          sent_at?: string | null
          workflow_instance_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_notifications_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "workflow_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_notifications_workflow_instance_id_fkey"
            columns: ["workflow_instance_id"]
            isOneToOne: false
            referencedRelation: "workflow_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_stage_instances: {
        Row: {
          completed_actions: number | null
          completed_at: string | null
          created_at: string | null
          id: string
          started_at: string | null
          status: string | null
          template_stage_id: string
          updated_at: string | null
          workflow_instance_id: string
        }
        Insert: {
          completed_actions?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          template_stage_id: string
          updated_at?: string | null
          workflow_instance_id: string
        }
        Update: {
          completed_actions?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          template_stage_id?: string
          updated_at?: string | null
          workflow_instance_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_stage_instances_template_stage_id_fkey"
            columns: ["template_stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_template_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_stage_instances_workflow_instance_id_fkey"
            columns: ["workflow_instance_id"]
            isOneToOne: false
            referencedRelation: "workflow_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_template_permissions: {
        Row: {
          allowed_roles: string[] | null
          created_at: string | null
          id: string
          min_role_level: number
          template_id: string
          updated_at: string | null
        }
        Insert: {
          allowed_roles?: string[] | null
          created_at?: string | null
          id?: string
          min_role_level?: number
          template_id: string
          updated_at?: string | null
        }
        Update: {
          allowed_roles?: string[] | null
          created_at?: string | null
          id?: string
          min_role_level?: number
          template_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_template_permissions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: true
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_template_stages: {
        Row: {
          approval_threshold: number | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          name: string
          required_actions: number | null
          stage_number: number
          stage_type: string | null
          template_id: string
          updated_at: string | null
        }
        Insert: {
          approval_threshold?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          required_actions?: number | null
          stage_number: number
          stage_type?: string | null
          template_id: string
          updated_at?: string | null
        }
        Update: {
          approval_threshold?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          required_actions?: number | null
          stage_number?: number
          stage_type?: string | null
          template_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_template_stages_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      workflow_transitions: {
        Row: {
          created_at: string | null
          from_stage_id: string | null
          id: string
          to_stage_id: string | null
          transition_data: Json | null
          transition_type: string | null
          triggered_by: string | null
          workflow_instance_id: string
        }
        Insert: {
          created_at?: string | null
          from_stage_id?: string | null
          id?: string
          to_stage_id?: string | null
          transition_data?: Json | null
          transition_type?: string | null
          triggered_by?: string | null
          workflow_instance_id: string
        }
        Update: {
          created_at?: string | null
          from_stage_id?: string | null
          id?: string
          to_stage_id?: string | null
          transition_data?: Json | null
          transition_type?: string | null
          triggered_by?: string | null
          workflow_instance_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_transitions_from_stage_id_fkey"
            columns: ["from_stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stage_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_transitions_to_stage_id_fkey"
            columns: ["to_stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stage_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_transitions_workflow_instance_id_fkey"
            columns: ["workflow_instance_id"]
            isOneToOne: false
            referencedRelation: "workflow_instances"
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
      assign_workflow_action: {
        Args: {
          p_stage_instance_id: string
          p_action_type: string
          p_assigned_to: string
          p_due_date?: string
          p_priority?: string
          p_data?: Json
        }
        Returns: string
      }
      can_create_workflow_from_template: {
        Args: { p_template_id: string }
        Returns: boolean
      }
      can_perform_workflow_action: {
        Args: { p_action_id: string }
        Returns: boolean
      }
      cleanup_expired_notifications: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      complete_workflow_action: {
        Args: { p_action_id: string; p_result?: Json; p_comment?: string }
        Returns: boolean
      }
      create_notification_from_template: {
        Args: {
          p_template_code: string
          p_recipient_id: string
          p_variables?: Json
          p_sender_id?: string
          p_priority?: Database["public"]["Enums"]["notification_priority"]
          p_related_entity_type?: string
          p_related_entity_id?: string
          p_action_url?: string
        }
        Returns: string
      }
      create_workflow_instance: {
        Args: { p_template_id: string; p_data?: Json }
        Returns: string
      }
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
      get_my_pending_actions: {
        Args: Record<PropertyKey, never>
        Returns: {
          action_id: string
          workflow_id: string
          workflow_name: string
          stage_name: string
          action_type: string
          priority: string
          due_date: string
          is_overdue: boolean
          assigned_at: string
        }[]
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
      get_unread_notification_count: {
        Args: { p_user_id?: string }
        Returns: number
      }
      get_user_dashboard_stats: {
        Args: { target_user_id: string }
        Returns: Json
      }
      get_user_notifications: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_type?: Database["public"]["Enums"]["notification_type"]
          p_priority?: Database["public"]["Enums"]["notification_priority"]
          p_is_read?: boolean
          p_category?: string
        }
        Returns: {
          id: string
          type: Database["public"]["Enums"]["notification_type"]
          priority: Database["public"]["Enums"]["notification_priority"]
          sender_id: string
          sender_name: string
          title: string
          body: string
          data: Json
          is_read: boolean
          read_at: string
          created_at: string
          action_url: string
          total_count: number
        }[]
      }
      get_workflow_status: {
        Args: { p_workflow_id: string }
        Returns: {
          workflow_id: string
          template_name: string
          status: string
          current_stage: string
          total_stages: number
          completed_stages: number
          total_actions: number
          completed_actions: number
          pending_actions: number
          overdue_actions: number
        }[]
      }
      is_workflow_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_workflow_participant: {
        Args: { p_workflow_id: string }
        Returns: boolean
      }
      mark_notifications_read: {
        Args: { p_notification_ids: string[] }
        Returns: number
      }
      reject_workflow_action: {
        Args: { p_action_id: string; p_reason: string; p_comment?: string }
        Returns: boolean
      }
      search_users_vector: {
        Args: {
          p_query: string
          p_role_code?: string
          p_min_role_level?: number
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          user_id: string
          full_name: string
          email: string
          role_code: string
          role_name: string
          role_level: number
          headquarter_name: string
          similarity: number
        }[]
      }
      send_role_based_notification: {
        Args: {
          p_role_codes: string[]
          p_title: string
          p_body: string
          p_min_role_level?: number
          p_type?: Database["public"]["Enums"]["notification_type"]
          p_priority?: Database["public"]["Enums"]["notification_priority"]
          p_data?: Json
        }
        Returns: number
      }
    }
    Enums: {
      collaborator_status: "active" | "inactive" | "standby"
      notification_channel: "in_app" | "email" | "sms" | "push"
      notification_priority: "low" | "medium" | "high" | "urgent"
      notification_type:
        | "system"
        | "direct_message"
        | "action_required"
        | "reminder"
        | "alert"
        | "achievement"
        | "role_based"
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
      notification_channel: ["in_app", "email", "sms", "push"],
      notification_priority: ["low", "medium", "high", "urgent"],
      notification_type: [
        "system",
        "direct_message",
        "action_required",
        "reminder",
        "alert",
        "achievement",
        "role_based",
      ],
    },
  },
} as const

