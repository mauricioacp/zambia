import { inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthService } from '@zambia/data-access-auth';
import { SupabaseService } from '@zambia/data-access-supabase';

interface ProfileRecord {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  address: string | null;
  bio: string | null;
  dni: string | null;
  role: string | null;
  season: string | null;
  headquarter: string | null;
}

interface UserMetadataPayload {
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  phoneNumber?: string;
  phone_number?: string;
  phone?: string;
  address?: string;
  bio?: string;
  dni?: string;
  role?: string;
  season?: string;
  headquarter?: string;
}

interface ProfileUpsertPayload {
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string | null;
  bio: string | null;
}

export interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  bio: string;
  dni: string;
  role: string;
  season: string;
  headquarter: string;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  bio: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  // Supabase typings currently do not expose the "profiles" table, so we fall back to a loose cast.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly supabase = inject(SupabaseService).getClient() as SupabaseClient<any>;
  private readonly authService = inject(AuthService);

  async getProfile(): Promise<UserProfile> {
    const { data, error } = await this.supabase.auth.getUser();

    if (error) {
      throw error;
    }

    const user = data.user;

    if (!user) {
      throw new Error('User session not found');
    }

    const sessionValue = this.authService.session();
    const sessionUserId = sessionValue?.user.id;
    const userId = sessionUserId ?? user.id;

    const { data: profileRows, error: profileError } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId);

    if (profileError) {
      throw profileError;
    }

    const profile = (profileRows as ProfileRecord[] | null)?.[0] ?? null;

    const metadata = (user.user_metadata ?? {}) as UserMetadataPayload;

    const firstName = coalesceString(profile?.first_name, metadata.firstName, metadata.first_name);
    const lastName = coalesceString(profile?.last_name, metadata.lastName, metadata.last_name);
    const phoneNumber = coalesceString(
      profile?.phone_number,
      metadata.phoneNumber,
      metadata.phone_number,
      metadata.phone
    );
    const address = coalesceString(profile?.address, metadata.address);
    const bio = coalesceString(profile?.bio, metadata.bio);
    const dni = coalesceString(profile?.dni, metadata.dni);
    const role = coalesceString(profile?.role, metadata.role);
    const season = coalesceString(profile?.season, metadata.season);
    const headquarter = coalesceString(profile?.headquarter, metadata.headquarter);

    return {
      userId,
      email: user.email ?? '',
      firstName,
      lastName,
      phoneNumber,
      address,
      bio,
      dni,
      role,
      season,
      headquarter,
    };
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<void> {
    const { data, error } = await this.supabase.auth.getUser();

    if (error) {
      throw error;
    }

    const user = data.user;

    if (!user) {
      throw new Error('User session not found');
    }

    const trimmedPayload = {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      phoneNumber: payload.phoneNumber.trim(),
      address: payload.address.trim(),
      bio: payload.bio.trim(),
    };

    const { error: authError } = await this.supabase.auth.updateUser({
      data: {
        firstName: trimmedPayload.firstName,
        lastName: trimmedPayload.lastName,
        phoneNumber: trimmedPayload.phoneNumber,
        address: trimmedPayload.address,
        bio: trimmedPayload.bio,
      },
    });

    if (authError) {
      throw authError;
    }

    const upsertPayload: ProfileUpsertPayload = {
      user_id: user.id,
      first_name: trimmedPayload.firstName,
      last_name: trimmedPayload.lastName,
      phone_number: trimmedPayload.phoneNumber,
      address: trimmedPayload.address.length ? trimmedPayload.address : null,
      bio: trimmedPayload.bio.length ? trimmedPayload.bio : null,
    };

    const { error: profileError } = await this.supabase
      .from('profiles')
      .upsert(upsertPayload, { onConflict: 'user_id' });

    if (profileError) {
      throw profileError;
    }
  }
}

function coalesceString(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return '';
}
