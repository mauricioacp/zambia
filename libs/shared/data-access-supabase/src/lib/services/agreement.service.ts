// import { computed, Injectable, signal } from '@angular/core';
// import { PostgrestError } from '@supabase/supabase-js';
// import { from, map, Observable, shareReplay, tap } from 'rxjs';
//
// import { SupabaseService } from '../supabase.service';
//
//
// /**
//  * CRUD operations and retrieving agreements with their associated roles
//  */
// @Injectable({
//   providedIn: 'root',
// })
// export class AgreementService {
//   private agreementsSignal = signal<Agreement[]>([]);
//   private selectedAgreementIdSignal = signal<string | null>(null);
//
//   public selectedAgreement = computed(() => {
//     const id = this.selectedAgreementIdSignal();
//     if (!id) return null;
//     return this.agreementsSignal().find((agreement) => agreement.id === id) || null;
//   });
//
//   private agreementsWithRolesCache$: Observable<AgreementWithRoles[]> | null = null;
//
//   constructor(private supabaseService: SupabaseService) {}
//
//   /**
//    * @param status Optional status filter
//    * @param headquarterId Optional headquarter filter
//    * @param seasonId Optional season filter
//    * @returns Observable<Agreement[]>
//    */
//   public getAgreements(status?: AgreementStatus, headquarterId?: string, seasonId?: string): Observable<Agreement[]> {
//     this.supabaseService.loading.set(true);
//
//     let query = this.supabaseService.getClient().from('agreements').select('*');
//
//     if (status) {
//       query = query.eq('status', status);
//     }
//
//     if (headquarterId) {
//       query = query.eq('headquarter_id', headquarterId);
//     }
//
//     if (seasonId) {
//       query = query.eq('season_id', seasonId);
//     }
//
//     return from(query).pipe(
//       map(({ data, error }) => {
//         if (error) {
//           this.handleError(error);
//           return [];
//         }
//         return data as Agreement[];
//       }),
//       tap((agreements) => {
//         this.agreementsSignal.set(agreements);
//         this.supabaseService.loading.set(false);
//       })
//     );
//   }
//
//   public getAgreementById(id: string): Observable<Agreement | null> {
//     this.supabaseService.loading.set(true);
//
//     return from(this.supabaseService.getClient().from('agreements').select('*').eq('id', id).single()).pipe(
//       map(({ data, error }) => {
//         if (error) {
//           this.handleError(error);
//           return null;
//         }
//         return data as Agreement;
//       }),
//       tap(() => this.supabaseService.loading.set(false))
//     );
//   }
//
//   public getAgreementsWithRoles(): Observable<AgreementWithRoles[]> {
//     if (this.agreementsWithRolesCache$) {
//       return this.agreementsWithRolesCache$;
//     }
//
//     this.supabaseService.loading.set(true);
//
//     this.agreementsWithRolesCache$ = from(this.supabaseService.getClient().rpc('get_agreements_with_roles')).pipe(
//       map(({ data, error }) => {
//         if (error) {
//           this.handleError(error);
//           return [];
//         }
//         return data as AgreementWithRoles[];
//       }),
//       tap(() => this.supabaseService.loading.set(false)),
//       // Cache the result for 5 minutes, keep the last value, reset when there are no subscribers
//       shareReplay({ bufferSize: 1, refCount: true, windowTime: 5 * 60 * 1000 })
//     );
//
//     return this.agreementsWithRolesCache$;
//   }
//
//   public getAgreementsByRole(roleId: string): Observable<AgreementWithRoles[]> {
//     this.supabaseService.loading.set(true);
//
//     return from(this.supabaseService.getClient().rpc('get_agreements_by_role_id', { role_id: roleId })).pipe(
//       map(({ data, error }) => {
//         if (error) {
//           this.handleError(error);
//           return [];
//         }
//         return data as AgreementWithRoles[];
//       }),
//       tap(() => this.supabaseService.loading.set(false))
//     );
//   }
//
//   public createAgreement(agreement: AgreementInsert): Observable<Agreement | null> {
//     this.supabaseService.loading.set(true);
//
//     return from(this.supabaseService.getClient().from('agreements').insert(agreement).select().single()).pipe(
//       map(({ data, error }) => {
//         if (error) {
//           this.handleError(error);
//           return null;
//         }
//
//         // Update the agreements signal with the new agreement
//         const newAgreement = data as Agreement;
//         this.agreementsSignal.update((agreements) => [...agreements, newAgreement]);
//
//         return newAgreement;
//       }),
//       tap(() => this.supabaseService.loading.set(false))
//     );
//   }
//
//   public updateAgreement(id: string, updates: AgreementUpdate): Observable<Agreement | null> {
//     this.supabaseService.loading.set(true);
//
//     return from(
//       this.supabaseService.getClient().from('agreements').update(updates).eq('id', id).select().single()
//     ).pipe(
//       map(({ data, error }) => {
//         if (error) {
//           this.handleError(error);
//           return null;
//         }
//
//         // Update the agreements signal with the updated agreement
//         const updatedAgreement = data as Agreement;
//         this.agreementsSignal.update((agreements) => agreements.map((a) => (a.id === id ? updatedAgreement : a)));
//
//         return updatedAgreement;
//       }),
//       tap(() => this.supabaseService.loading.set(false))
//     );
//   }
//
//   public deleteAgreement(id: string): Observable<boolean> {
//     this.supabaseService.loading.set(true);
//
//     return from(this.supabaseService.getClient().from('agreements').delete().eq('id', id)).pipe(
//       map(({ error }) => {
//         if (error) {
//           this.handleError(error);
//           return false;
//         }
//
//         this.agreementsSignal.update((agreements) => agreements.filter((a) => a.id !== id));
//
//         if (this.selectedAgreementIdSignal() === id) {
//           this.selectedAgreementIdSignal.set(null);
//         }
//         this.invalidateCache();
//         return true;
//       }),
//       tap(() => this.supabaseService.loading.set(false))
//     );
//   }
//
//   public addRoleToAgreement(agreementId: string, roleId: string): Observable<boolean> {
//     this.supabaseService.loading.set(true);
//
//     const agreementRole: AgreementRole = {
//       agreement_id: agreementId,
//       role_id: roleId,
//     };
//
//     return from(this.supabaseService.getClient().from('agreement_roles').insert(agreementRole)).pipe(
//       map(({ error }) => {
//         if (error) {
//           this.handleError(error);
//           return false;
//         }
//         this.invalidateCache();
//
//         return true;
//       }),
//       tap(() => this.supabaseService.loading.set(false))
//     );
//   }
//
//   public removeRoleFromAgreement(agreementId: string, roleId: string): Observable<boolean> {
//     this.supabaseService.loading.set(true);
//
//     return from(
//       this.supabaseService
//         .getClient()
//         .from('agreement_roles')
//         .delete()
//         .eq('agreement_id', agreementId)
//         .eq('role_id', roleId)
//     ).pipe(
//       map(({ error }) => {
//         if (error) {
//           this.handleError(error);
//           return false;
//         }
//         this.invalidateCache();
//
//         return true;
//       }),
//       tap(() => this.supabaseService.loading.set(false))
//     );
//   }
//
//   public invalidateCache(): void {
//     this.agreementsWithRolesCache$ = null;
//   }
//
//   public setSelectedAgreement(id: string | null): void {
//     this.selectedAgreementIdSignal.set(id);
//   }
//
//   public toViewModel(agreements: Agreement[]): AgreementViewModel[] {
//     return agreements.map((agreement) => ({
//       ...agreement,
//       displayName: `${agreement.name || ''} ${agreement.last_name || ''}`.trim() || agreement.email,
//     }));
//   }
//
//   private handleError(error: PostgrestError): void {
//     console.error('Agreement service error:', error);
//     this.supabaseService.error.set(new Error(error.message));
//     this.supabaseService.loading.set(false);
//   }
// }
