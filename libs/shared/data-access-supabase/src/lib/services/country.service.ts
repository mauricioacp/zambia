// import { computed, Injectable, signal } from '@angular/core';
// import { PostgrestError } from '@supabase/supabase-js';
// import { from, map, Observable, shareReplay, tap } from 'rxjs';
//
// import { SupabaseService } from '../supabase.service';
//
// /**
//  * Provides CRUD operations with caching for better performance
//  * since country data rarely changes
//  */
// @Injectable({
//   providedIn: 'root',
// })
// export class CountryService {
//   private countriesSignal = signal<Country[]>([]);
//   private selectedCountryIdSignal = signal<string | null>(null);
//   public selectedCountry = computed(() => {
//     const id = this.selectedCountryIdSignal();
//     if (!id) return null;
//     return this.countriesSignal().find((country) => country.id === id) || null;
//   });
//
//   private countriesCache$: Observable<Country[]> | null = null;
//
//   constructor(private supabaseService: SupabaseService) {}
//
//   public getCountries(status?: CountryStatus): Observable<Country[]> {
//     if (status || !this.countriesCache$) {
//       this.supabaseService.loading.set(true);
//
//       let query = this.supabaseService.getClient().from('countries').select('*').order('name');
//
//       if (status) {
//         query = query.eq('status', status);
//       }
//
//       const countries$ = from(query).pipe(
//         map(({ data, error }) => {
//           if (error) {
//             this.handleError(error);
//             return [];
//           }
//           return data as Country[];
//         }),
//         tap((countries) => {
//           this.countriesSignal.set(countries);
//           this.supabaseService.loading.set(false);
//         })
//       );
//
//       if (!status) {
//         this.countriesCache$ = countries$.pipe(shareReplay({ bufferSize: 1, refCount: false }));
//       }
//
//       return countries$;
//     }
//
//     return this.countriesCache$;
//   }
//
//   public getCountryById(id: string): Observable<Country | null> {
//     const countries = this.countriesSignal();
//     const country = countries.find((c) => c.id === id);
//
//     if (country) {
//       return new Observable<Country>((observer) => {
//         observer.next(country);
//         observer.complete();
//       });
//     }
//
//     this.supabaseService.loading.set(true);
//
//     return from(this.supabaseService.getClient().from('countries').select('*').eq('id', id).single()).pipe(
//       map(({ data, error }) => {
//         if (error) {
//           this.handleError(error);
//           return null;
//         }
//         return data as Country;
//       }),
//       tap(() => this.supabaseService.loading.set(false))
//     );
//   }
//
//   public getCountriesWithHeadquartersCount(): Observable<CountryWithHeadquartersCount[]> {
//     this.supabaseService.loading.set(true);
//
//     return from(
//       this.supabaseService.getClient().from('countries').select(`
//           *,
//           headquarters:headquarters(id)
//         `)
//     ).pipe(
//       map(({ data, error }) => {
//         if (error) {
//           this.handleError(error);
//           return [];
//         }
//
//         return data.map((item) => ({
//           ...item,
//           headquartersCount: item.headquarters ? item.headquarters.length : 0,
//         })) as CountryWithHeadquartersCount[];
//       }),
//       tap(() => this.supabaseService.loading.set(false))
//     );
//   }
//
//   public createCountry(country: CountryInsert): Observable<Country | null> {
//     this.supabaseService.loading.set(true);
//
//     return from(this.supabaseService.getClient().from('countries').insert(country).select().single()).pipe(
//       map(({ data, error }) => {
//         if (error) {
//           this.handleError(error);
//           return null;
//         }
//
//         const newCountry = data as Country;
//         this.countriesSignal.update((countries) => [...countries, newCountry]);
//         this.invalidateCache();
//
//         return newCountry;
//       }),
//       tap(() => this.supabaseService.loading.set(false))
//     );
//   }
//
//   public updateCountry(id: string, updates: CountryUpdate): Observable<Country | null> {
//     this.supabaseService.loading.set(true);
//
//     return from(this.supabaseService.getClient().from('countries').update(updates).eq('id', id).select().single()).pipe(
//       map(({ data, error }) => {
//         if (error) {
//           this.handleError(error);
//           return null;
//         }
//
//         const updatedCountry = data as Country;
//         this.countriesSignal.update((countries) => countries.map((c) => (c.id === id ? updatedCountry : c)));
//         this.invalidateCache();
//
//         return updatedCountry;
//       }),
//       tap(() => this.supabaseService.loading.set(false))
//     );
//   }
//
//   public deleteCountry(id: string): Observable<boolean> {
//     this.supabaseService.loading.set(true);
//
//     return from(this.supabaseService.getClient().from('countries').delete().eq('id', id)).pipe(
//       map(({ error }) => {
//         if (error) {
//           this.handleError(error);
//           return false;
//         }
//
//         this.countriesSignal.update((countries) => countries.filter((c) => c.id !== id));
//
//         if (this.selectedCountryIdSignal() === id) {
//           this.selectedCountryIdSignal.set(null);
//         }
//
//         this.invalidateCache();
//         return true;
//       }),
//       tap(() => this.supabaseService.loading.set(false))
//     );
//   }
//
//   public setSelectedCountry(id: string | null): void {
//     this.selectedCountryIdSignal.set(id);
//   }
//
//   public toViewModel(countries: Country[]): CountryViewModel[] {
//     return countries.map((country) => ({
//       ...country,
//       flagUrl: `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`,
//     }));
//   }
//
//   public invalidateCache(): void {
//     this.countriesCache$ = null;
//   }
//
//   private handleError(error: PostgrestError): void {
//     console.error('Country service error:', error);
//     this.supabaseService.error.set(new Error(error.message));
//     this.supabaseService.loading.set(false);
//   }
// }
