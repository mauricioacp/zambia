import { Json, Tables, TablesInsert, TablesUpdate } from './supabase.type';

/**
 * Type representing a Process entity from the database
 */
export type Process = Tables<'processes'>;

/**
 * Type for inserting a new Process
 */
export type ProcessInsert = TablesInsert<'processes'>;

/**
 * Type for updating an existing Process
 */
export type ProcessUpdate = TablesUpdate<'processes'>;

/**
 * Type for Process status
 */
export type ProcessStatus = 'active' | 'inactive' | 'draft' | 'archived';

/**
 * Type for Process type
 */
export type ProcessType = 'onboarding' | 'training' | 'evaluation' | 'offboarding' | 'general';

/**
 * Type for Process content
 */
export interface ProcessContent {
  steps?: {
    id: string;
    title: string;
    description?: string;
    order: number;
    tasks?: {
      id: string;
      title: string;
      description?: string;
      order: number;
      isRequired: boolean;
      estimatedTime?: string;
      resources?: {
        id: string;
        title: string;
        type: 'document' | 'video' | 'link' | 'image';
        url: string;
      }[];
    }[];
  }[];
  metadata?: {
    createdBy?: string;
    lastUpdatedBy?: string;
    estimatedCompletionTime?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    tags?: string[];
  };
}

/**
 * View model for Process with additional UI-specific properties
 */
export interface ProcessViewModel extends Process {
  isSelected?: boolean;
  typedContent?: ProcessContent;
  roleNames?: string[];
}

/**
 * Helper function to parse the JSON content field into a typed ProcessContent
 * @param contentJson The JSON content field from the database
 * @returns A typed ProcessContent object
 */
export function parseProcessContent(contentJson: Json | null): ProcessContent | null {
  if (!contentJson) return null;

  try {
    return contentJson as ProcessContent;
  } catch (error) {
    console.error('Error parsing process content:', error);
    return null;
  }
}
