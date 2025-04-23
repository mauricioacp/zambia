import { Tables, TablesInsert, TablesUpdate } from './supabase.type';

/**
 * Type representing a Workshop entity from the database
 */
export type Workshop = Tables<'workshops'>;

/**
 * Type for inserting a new Workshop
 */
export type WorkshopInsert = TablesInsert<'workshops'>;

/**
 * Type for updating an existing Workshop
 */
export type WorkshopUpdate = TablesUpdate<'workshops'>;

/**
 * Type for Workshop status
 */
export type WorkshopStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';

/**
 * View model for Workshop with additional UI-specific properties
 */
export interface WorkshopViewModel extends Workshop {
  isSelected?: boolean;
  formattedStartDate?: string;
  formattedEndDate?: string;
  duration?: string;
  headquarterName?: string;
  seasonName?: string;
  facilitatorName?: string;
  enrollmentPercentage?: number;
  enrolledStudentsCount?: number;
}

/**
 * Type for Workshop with related entities
 */
export interface WorkshopWithRelations extends Workshop {
  headquarter?: {
    id: string;
    name: string;
  } | null;
  season?: {
    id: string;
    name: string;
  } | null;
  facilitator?: {
    id: string;
    user_id: string | null;
    role_id: string | null;
    agreement_id: string | null;
    agreement?: {
      id: string;
      name: string | null;
      last_name: string | null;
      email: string;
    } | null;
  } | null;
}

/**
 * Type for Workshop enrollment
 */
export interface WorkshopEnrollment {
  workshop_id: string;
  student_id: string;
  enrollment_date: string;
  attendance_status?: 'present' | 'absent' | 'excused' | 'late';
  feedback?: string;
  completion_status?: 'completed' | 'incomplete' | 'in_progress';
}
