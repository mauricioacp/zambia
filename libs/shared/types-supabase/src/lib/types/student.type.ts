import { Json, Tables, TablesInsert, TablesUpdate } from './supabase.type';

/**
 * Type representing a Student entity from the database
 */
export type Student = Tables<'students'>;

/**
 * Type for inserting a new Student
 */
export type StudentInsert = TablesInsert<'students'>;

/**
 * Type for updating an existing Student
 */
export type StudentUpdate = TablesUpdate<'students'>;

/**
 * Type for Student status
 */
export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'dropped' | 'on_leave';

/**
 * Type for Student program progress comments
 */
export interface StudentProgramProgress {
  modules?: {
    [moduleId: string]: {
      completed: boolean;
      score?: number;
      comments?: string;
      completedDate?: string;
    };
  };
  overallProgress?: number;
  lastUpdated?: string;
  notes?: string[];
  achievements?: {
    id: string;
    name: string;
    date: string;
    description?: string;
  }[];
}

/**
 * View model for Student with additional UI-specific properties
 */
export interface StudentViewModel extends Student {
  isSelected?: boolean;
  formattedEnrollmentDate?: string;
  headquarterName?: string;
  seasonName?: string;
  agreementDetails?: {
    name: string | null;
    last_name: string | null;
    email: string;
  };
  typedProgramProgress?: StudentProgramProgress;
}

/**
 * Type for Student with related entities
 */
export interface StudentWithRelations extends Student {
  headquarter?: {
    id: string;
    name: string;
  } | null;
  season?: {
    id: string;
    name: string;
  } | null;
  agreement?: {
    id: string;
    name: string | null;
    last_name: string | null;
    email: string;
  } | null;
}

/**
 * Helper function to parse the JSON program_progress_comments field into a typed StudentProgramProgress
 * @param progressJson The JSON program_progress_comments field from the database
 * @returns A typed StudentProgramProgress object
 */
export function parseStudentProgramProgress(progressJson: Json | null): StudentProgramProgress | null {
  if (!progressJson) return null;

  try {
    return progressJson as StudentProgramProgress;
  } catch (error) {
    console.error('Error parsing student program progress:', error);
    return null;
  }
}
