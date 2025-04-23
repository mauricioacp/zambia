import { Injectable, computed, signal } from '@angular/core';
import { PostgrestError } from '@supabase/supabase-js';
import { Observable, from, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { SupabaseService } from '../supabase.service';
import {
  Agreement,
  AgreementInsert,
  AgreementRole,
  AgreementStatus,
  AgreementUpdate,
  AgreementViewModel,
  AgreementWithRoles
} from '@zambia/shared/types-supabase';

/**
 * Service for managing Agreement data
 * Provides methods for CRUD operations and retrieving agreements with their associated roles
 */
@Injectable({
  providedIn: 'root',
})
export class AgreementService {
  // Signal for all agreements
  private agreementsSignal = signal<Agreement[]>([]);

  // Signal for selected agreement
  private selectedAgreementIdSignal = signal<string | null>(null);

  // Computed signal for selected agreement
  public selectedAgreement = computed(() => {
    const id = this.selectedAgreementIdSignal();
    if (!id) return null;
    return this.agreementsSignal().find(agreement => agreement.id === id) || null;
  });

  // Observable for agreements signal
  private agreements$ = toObservable(this.agreementsSignal);

  // Cache for agreements with roles
  private agreementsWithRolesCache$: Observable<AgreementWithRoles[]> | null = null;

  constructor(private supabaseService: SupabaseService) {}

  /**
   * Get all agreements
   * @param status Optional status filter
   * @param headquarterId Optional headquarter filter
   * @param seasonId Optional season filter
   * @returns Observable of agreements
   */
  public getAgreements(
    status?: AgreementStatus,
    headquarterId?: string,
    seasonId?: string
  ): Observable<Agreement[]> {
    this.supabaseService.loading.set(true);

    let query = this.supabaseService.getClient()
      .from('agreements')
      .select('*');

    if (status) {
      query = query.eq('status', status);
    }

    if (headquarterId) {
      query = query.eq('headquarter_id', headquarterId);
    }

    if (seasonId) {
      query = query.eq('season_id', seasonId);
    }

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) {
          this.handleError(error);
          return [];
        }
        return data as Agreement[];
      }),
      tap(agreements => {
        this.agreementsSignal.set(agreements);
        this.supabaseService.loading.set(false);
      })
    );
  }

  /**
   * Get an agreement by ID
   * @param id Agreement ID
   * @returns Observable of agreement
   */
  public getAgreementById(id: string): Observable<Agreement | null> {
    this.supabaseService.loading.set(true);

    return from(
      this.supabaseService.getClient()
        .from('agreements')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          this.handleError(error);
          return null;
        }
        return data as Agreement;
      }),
      tap(() => this.supabaseService.loading.set(false))
    );
  }

  /**
   * Get agreements with their associated roles
   * Uses caching for better performance
   * @returns Observable of agreements with roles
   */
  public getAgreementsWithRoles(): Observable<AgreementWithRoles[]> {
    if (this.agreementsWithRolesCache$) {
      return this.agreementsWithRolesCache$;
    }

    this.supabaseService.loading.set(true);

    this.agreementsWithRolesCache$ = from(
      this.supabaseService.getClient()
        .rpc('get_agreements_with_roles')
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          this.handleError(error);
          return [];
        }
        return data as AgreementWithRoles[];
      }),
      tap(() => this.supabaseService.loading.set(false)),
      // Cache the result for 5 minutes, keep last 1 value, reset when there are no subscribers
      shareReplay({ bufferSize: 1, refCount: true, windowTime: 5 * 60 * 1000 })
    );

    return this.agreementsWithRolesCache$;
  }

  /**
   * Get agreements by role
   * @param roleId Role ID
   * @returns Observable of agreements with roles
   */
  public getAgreementsByRole(roleId: string): Observable<AgreementWithRoles[]> {
    this.supabaseService.loading.set(true);

    return from(
      this.supabaseService.getClient()
        .rpc('get_agreements_by_role_id', { role_id: roleId })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          this.handleError(error);
          return [];
        }
        return data as AgreementWithRoles[];
      }),
      tap(() => this.supabaseService.loading.set(false))
    );
  }

  /**
   * Create a new agreement
   * @param agreement Agreement data
   * @returns Observable of created agreement
   */
  public createAgreement(agreement: AgreementInsert): Observable<Agreement | null> {
    this.supabaseService.loading.set(true);

    return from(
      this.supabaseService.getClient()
        .from('agreements')
        .insert(agreement)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          this.handleError(error);
          return null;
        }

        // Update the agreements signal with the new agreement
        const newAgreement = data as Agreement;
        this.agreementsSignal.update(agreements => [...agreements, newAgreement]);

        return newAgreement;
      }),
      tap(() => this.supabaseService.loading.set(false))
    );
  }

  /**
   * Update an agreement
   * @param id Agreement ID
   * @param updates Agreement updates
   * @returns Observable of updated agreement
   */
  public updateAgreement(id: string, updates: AgreementUpdate): Observable<Agreement | null> {
    this.supabaseService.loading.set(true);

    return from(
      this.supabaseService.getClient()
        .from('agreements')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          this.handleError(error);
          return null;
        }

        // Update the agreements signal with the updated agreement
        const updatedAgreement = data as Agreement;
        this.agreementsSignal.update(agreements =>
          agreements.map(a => a.id === id ? updatedAgreement : a)
        );

        return updatedAgreement;
      }),
      tap(() => this.supabaseService.loading.set(false))
    );
  }

  /**
   * Delete an agreement
   * @param id Agreement ID
   * @returns Observable of success status
   */
  public deleteAgreement(id: string): Observable<boolean> {
    this.supabaseService.loading.set(true);

    return from(
      this.supabaseService.getClient()
        .from('agreements')
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) {
          this.handleError(error);
          return false;
        }

        // Update the agreements signal by removing the deleted agreement
        this.agreementsSignal.update(agreements =>
          agreements.filter(a => a.id !== id)
        );

        // Reset selected agreement if it was the deleted one
        if (this.selectedAgreementIdSignal() === id) {
          this.selectedAgreementIdSignal.set(null);
        }

        // Invalidate cache
        this.agreementsWithRolesCache$ = null;

        return true;
      }),
      tap(() => this.supabaseService.loading.set(false))
    );
  }

  /**
   * Add a role to an agreement
   * @param agreementId Agreement ID
   * @param roleId Role ID
   * @returns Observable of success status
   */
  public addRoleToAgreement(agreementId: string, roleId: string): Observable<boolean> {
    this.supabaseService.loading.set(true);

    const agreementRole: AgreementRole = {
      agreement_id: agreementId,
      role_id: roleId,
    };

    return from(
      this.supabaseService.getClient()
        .from('agreement_roles')
        .insert(agreementRole)
    ).pipe(
      map(({ error }) => {
        if (error) {
          this.handleError(error);
          return false;
        }

        // Invalidate cache
        this.agreementsWithRolesCache$ = null;

        return true;
      }),
      tap(() => this.supabaseService.loading.set(false))
    );
  }

  /**
   * Remove a role from an agreement
   * @param agreementId Agreement ID
   * @param roleId Role ID
   * @returns Observable of success status
   */
  public removeRoleFromAgreement(agreementId: string, roleId: string): Observable<boolean> {
    this.supabaseService.loading.set(true);

    return from(
      this.supabaseService.getClient()
        .from('agreement_roles')
        .delete()
        .eq('agreement_id', agreementId)
        .eq('role_id', roleId)
    ).pipe(
      map(({ error }) => {
        if (error) {
          this.handleError(error);
          return false;
        }

        // Invalidate cache
        this.agreementsWithRolesCache$ = null;

        return true;
      }),
      tap(() => this.supabaseService.loading.set(false))
    );
  }

  /**
   * Set the selected agreement
   * @param id Agreement ID
   */
  public setSelectedAgreement(id: string | null): void {
    this.selectedAgreementIdSignal.set(id);
  }

  /**
   * Convert agreements to view models
   * @param agreements Agreements to convert
   * @returns Agreement view models
   */
  public toViewModel(agreements: Agreement[]): AgreementViewModel[] {
    return agreements.map(agreement => ({
      ...agreement,
      displayName: `${agreement.name || ''} ${agreement.last_name || ''}`.trim() || agreement.email,
    }));
  }

  /**
   * Handle errors from Supabase operations
   * @param error The error to handle
   */
  private handleError(error: PostgrestError): void {
    console.error('Agreement service error:', error);
    this.supabaseService.error.set(new Error(error.message));
    this.supabaseService.loading.set(false);
  }
}
