import { Json, Tables, TablesInsert, TablesUpdate } from './supabase.type';

/**
 * Type representing an Event entity from the database
 */
export type Event = Tables<'events'>;

/**
 * Type for inserting a new Event
 */
export type EventInsert = TablesInsert<'events'>;

/**
 * Type for updating an existing Event
 */
export type EventUpdate = TablesUpdate<'events'>;

/**
 * Type for Event status
 */
export type EventStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';

/**
 * Type for Event location
 */
export interface EventLocation {
  address: string;
  city: string;
  state?: string;
  country?: string;
  postalCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isVirtual: boolean;
  virtualMeetingUrl?: string;
}

/**
 * View model for Event with additional UI-specific properties
 */
export interface EventViewModel extends Event {
  isSelected?: boolean;
  formattedStartDate?: string;
  formattedEndDate?: string;
  duration?: string;
  headquarterName?: string;
  seasonName?: string;
  typedLocation?: EventLocation;
}

/**
 * Type for Event with related entities
 */
export interface EventWithRelations extends Event {
  headquarter?: {
    id: string;
    name: string;
  } | null;
  season?: {
    id: string;
    name: string;
  } | null;
}

/**
 * Helper function to parse the JSON location field into a typed EventLocation
 * @param locationJson The JSON location field from the database
 * @returns A typed EventLocation object
 */
export function parseEventLocation(locationJson: Json | null): EventLocation | null {
  if (!locationJson) return null;

  try {
    const location = locationJson as Record<string, any>;
    return {
      address: location.address || '',
      city: location.city || '',
      state: location.state,
      country: location.country,
      postalCode: location.postalCode,
      coordinates: location.coordinates ? {
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude
      } : undefined,
      isVirtual: !!location.isVirtual,
      virtualMeetingUrl: location.virtualMeetingUrl
    };
  } catch (error) {
    console.error('Error parsing event location:', error);
    return null;
  }
}
