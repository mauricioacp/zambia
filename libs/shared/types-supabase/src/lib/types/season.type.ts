import { Tables, TablesInsert, TablesUpdate } from './supabase.type';

/**
 * Type representing a Season entity from the database
 */
export type Season = Tables<'seasons'>;

/**
 * Type for inserting a new Season
 */
export type SeasonInsert = TablesInsert<'seasons'>;

/**
 * Type for updating an existing Season
 */
export type SeasonUpdate = TablesUpdate<'seasons'>;

/**
 * Type for Season status
 */
export type SeasonStatus = 'active' | 'inactive' | 'planned' | 'completed';

/**
 * View model for Season with additional UI-specific properties
 */
export interface SeasonViewModel extends Season {
  isSelected?: boolean;
  formattedStartDate?: string;
  formattedEndDate?: string;
  duration?: string;
  headquarterName?: string;
  managerName?: string;
  studentsCount?: number;
  eventsCount?: number;
  workshopsCount?: number;
  isCurrentSeason?: boolean;
}

/**
 * Type for Season with related entities
 */
export interface SeasonWithRelations extends Season {
  headquarter?: {
    id: string;
    name: string;
  } | null;
  manager?: {
    id: string;
    user_id: string | null;
    role_id: string | null;
    role?: {
      id: string;
      name: string;
    } | null;
  } | null;
  events?: {
    id: string;
    title: string;
    start_datetime: string | null;
    end_datetime: string | null;
  }[];
  workshops?: {
    id: string;
    name: string;
    start_datetime: string | null;
    end_datetime: string | null;
  }[];
  students?: {
    id: string;
    user_id: string | null;
    agreement_id: string | null;
  }[];
}
