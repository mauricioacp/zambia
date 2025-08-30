// Types for the new search_agreements RPC function
import { Database } from '@zambia/types-supabase';

// Use the Args type from the generated Supabase types
export type SearchAgreementsParams = Database['public']['Functions']['search_agreements']['Args'];

export interface AgreementRole {
  role_id: string;
  role_name: string;
  role_description: string;
  role_code: string;
  role_level: number;
}

export interface AgreementHeadquarter {
  headquarter_id: string;
  headquarter_name: string;
  headquarter_address: string | null;
  country_id: string;
  country_name: string;
}

export interface SearchAgreementResult {
  id: string;
  name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  document_number: string | null;
  birth_date: string | null;
  gender: string | null;
  address: string | null;
  status: string | null;
  ethical_document_agreement: boolean | null;
  mailing_agreement: boolean | null;
  volunteering_agreement: boolean | null;
  age_verification: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string | null;
  season_id: string;
  season_name: string;
  role: AgreementRole;
  headquarter: AgreementHeadquarter;
}

export interface SearchAgreementsPagination {
  total: number;
  limit: number;
  offset: number;
  page: number;
  pages: number;
}

export interface SearchAgreementsFilters {
  status: string[];
  headquarters: Array<{ id: string; name: string }>;
  roles: Array<{ id: string; name: string }>;
  seasons: Array<{ id: string; name: string }>;
  countries: Array<{ id: string; name: string }>;
}

export interface SearchAgreementsResponse {
  data: SearchAgreementResult[];
  pagination: SearchAgreementsPagination;
  filters: SearchAgreementsFilters;
}
