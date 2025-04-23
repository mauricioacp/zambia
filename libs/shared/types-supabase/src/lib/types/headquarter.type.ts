import { Tables, TablesInsert, TablesUpdate } from './supabase.type';

/**
 * Type representing a Headquarter entity from the database
 */
export type Headquarter = Tables<'headquarters'>;

/**
 * Type for inserting a new Headquarter
 */
export type HeadquarterInsert = TablesInsert<'headquarters'>;

/**
 * Type for updating an existing Headquarter
 */
export type HeadquarterUpdate = TablesUpdate<'headquarters'>;

/**
 * Type for Headquarter status
 */
export type HeadquarterStatus = 'active' | 'inactive' | 'pending';

/**
 * Type for Headquarter contact information
 */
export interface HeadquarterContactInfo {
  email?: string;
  phone?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  contactPerson?: {
    name: string;
    position?: string;
    email?: string;
    phone?: string;
  };
}

/**
 * View model for Headquarter with additional UI-specific properties
 */
export interface HeadquarterViewModel extends Headquarter {
  isSelected?: boolean;
  countryName?: string;
  typedContactInfo?: HeadquarterContactInfo;
  seasonsCount?: number;
  collaboratorsCount?: number;
  studentsCount?: number;
}

/**
 * Type for Headquarter with related entities
 */
export interface HeadquarterWithRelations extends Headquarter {
  country?: {
    id: string;
    name: string;
    code: string;
  } | null;
  seasons?: {
    id: string;
    name: string;
  }[];
}
