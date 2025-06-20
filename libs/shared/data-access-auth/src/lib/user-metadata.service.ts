import { computed, inject, Injectable } from '@angular/core';
import { z } from 'zod';
import { SESSION_SIGNAL_TOKEN } from './session.token';

const UserMetadataSchema = z.object({
  role: z.string().nullable(),
  roleLevel: z.number().nullable(),
  roleId: z.string().nullable(),
  hqId: z.string().nullable(),
  seasonId: z.string().nullable(),
  agreementId: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  userId: z.string().uuid().nullable(),
});

export type UserMetadata = z.infer<typeof UserMetadataSchema>;

const RawUserMetadataSchema = z
  .object({
    role: z.string().optional(),
    role_level: z.number().optional(),
    role_id: z.string().optional(),
    hq_id: z.string().optional(),
    season_id: z.string().optional(),
    agreement_id: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    phone: z.string().optional(),
  })
  .passthrough();

@Injectable({
  providedIn: 'root',
})
export class UserMetadataService {
  private sessionSignal = inject(SESSION_SIGNAL_TOKEN);
  private readonly DEFAULT_METADATA: UserMetadata = {
    role: null,
    roleLevel: null,
    roleId: null,
    hqId: null,
    seasonId: null,
    agreementId: null,
    firstName: null,
    lastName: null,
    phone: null,
    email: null,
    userId: null,
  };

  userMetadata = computed<UserMetadata>(() => {
    const session = this.sessionSignal();

    if (!session?.user) {
      return this.DEFAULT_METADATA;
    }

    try {
      const rawMetadata = RawUserMetadataSchema.parse(session.user.user_metadata || {});

      const metadata: UserMetadata = {
        role: rawMetadata.role ?? null,
        roleLevel: rawMetadata.role_level ?? null,
        roleId: rawMetadata.role_id ?? null,
        hqId: rawMetadata.hq_id ?? null,
        seasonId: rawMetadata.season_id ?? null,
        agreementId: rawMetadata.agreement_id ?? null,
        firstName: rawMetadata.first_name ?? null,
        lastName: rawMetadata.last_name ?? null,
        phone: rawMetadata.phone ?? null,
        email: session.user.email ?? null,
        userId: session.user.id ?? null,
      };

      return UserMetadataSchema.parse(metadata);
    } catch (error) {
      console.error('Failed to parse user metadata:', error);
      return this.DEFAULT_METADATA;
    }
  });

  displayName = computed(() => {
    const metadata = this.userMetadata();
    if (metadata.firstName && metadata.lastName) {
      return `${metadata.firstName} ${metadata.lastName}`;
    }
    if (metadata.firstName) {
      return metadata.firstName;
    }
    if (metadata.email) {
      return metadata.email.split('@')[0];
    }
    return 'User';
  });
}
