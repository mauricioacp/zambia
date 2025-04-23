import { Tables, TablesInsert, TablesUpdate } from './supabase.type';

/**
 * Type representing a Country entity from the database
 */
export type Country = Tables<'countries'>;

/**
 * Type for inserting a new Country
 */
export type CountryInsert = TablesInsert<'countries'>;

/**
 * Type for updating an existing Country
 */
export type CountryUpdate = TablesUpdate<'countries'>;

/**
 * Type for Country status
 */
export type CountryStatus = 'active' | 'inactive';

/**
 * View model for Country with additional UI-specific properties
 */
export interface CountryViewModel extends Country {
  isSelected?: boolean;
  flagUrl?: string;
}

/**
 * Type for Country with related headquarters count
 */
export interface CountryWithHeadquartersCount extends Country {
  headquartersCount: number;
}
