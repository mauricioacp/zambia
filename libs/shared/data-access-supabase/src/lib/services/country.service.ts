import { Injectable, computed, signal } from '@angular/core';
import { PostgrestError } from '@supabase/supabase-js';
import { Observable, from, map, shareReplay, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

import { SupabaseService } from '../supabase.service';
import {
  Country,
  CountryInsert,
  CountryStatus,
  CountryUpdate,
  CountryViewModel,
  CountryWithHeadquartersCount,
} from '@zambia/shared/types-supabase';

/**
 * Service for managing Country data
 * Provides methods for CRUD operations with caching for better performance
 * since country data rarely changes
 */
@Injectable({
  providedIn: 'root',
})
export class CountryService {
  // Signal for all countries
  private countriesSignal = signal<Country[]>([]);

  // Signal for selected country
  private selectedCountryIdSignal = signal<string | null>(null);

  // Computed signal for selected country
  public selectedCountry = computed(() => {
    const id = this.selectedCountryIdSignal();
    if (!id) return null;
    return this.countriesSignal().find((country) => country.id === id) || null;
  });

  // Observable for countries signal
  private countries$ = toObservable(this.countriesSignal);

  // Cache for countries
  private countriesCache$: Observable<Country[]> | null = null;

  constructor(private supabaseService: SupabaseService) {}

  /**
   * Get all countries
   * Uses caching for better performance since country data rarely changes
   * @param status Optional status filter
   * @returns Observable of countries
   */
  public getCountries(status?: CountryStatus): Observable<Country[]> {
    // If status is provided, don't use cache
    if (status || !this.countriesCache$) {
      this.supabaseService.loading.set(true);

      let query = this.supabaseService.getClient().from('countries').select('*').order('name');

      if (status) {
        query = query.eq('status', status);
      }

      const countries$ = from(query).pipe(
        map(({ data, error }) => {
          if (error) {
            this.handleError(error);
            return [];
          }
          return data as Country[];
        }),
        tap((countries) => {
          this.countriesSignal.set(countries);
          this.supabaseService.loading.set(false);
        })
      );

      // Only cache if no status filter is applied
      if (!status) {
        this.countriesCache$ = countries$.pipe(
          // Cache indefinitely until manually invalidated, keep last 1 value
          shareReplay({ bufferSize: 1, refCount: false })
        );
      }

      return countries$;
    }

    return this.countriesCache$;
  }

  /**
   * Get a country by ID
   * @param id Country ID
   * @returns Observable of country
   */
  public getCountryById(id: string): Observable<Country | null> {
    // First check if we have it in the signal
    const countries = this.countriesSignal();
    const country = countries.find((c) => c.id === id);

    if (country) {
      return new Observable<Country>((observer) => {
        observer.next(country);
        observer.complete();
      });
    }

    this.supabaseService.loading.set(true);

    return from(this.supabaseService.getClient().from('countries').select('*').eq('id', id).single()).pipe(
      map(({ data, error }) => {
        if (error) {
          this.handleError(error);
          return null;
        }
        return data as Country;
      }),
      tap(() => this.supabaseService.loading.set(false))
    );
  }

  /**
   * Get countries with headquarters count
   * @returns Observable of countries with headquarters count
   */
  public getCountriesWithHeadquartersCount(): Observable<CountryWithHeadquartersCount[]> {
    this.supabaseService.loading.set(true);

    return from(
      this.supabaseService.getClient().from('countries').select(`
          *,
          headquarters:headquarters(id)
        `)
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          this.handleError(error);
          return [];
        }

        // Transform the data to include headquarters count
        return (data as any[]).map((item) => ({
          ...item,
          headquartersCount: item.headquarters ? item.headquarters.length : 0,
        })) as CountryWithHeadquartersCount[];
      }),
      tap(() => this.supabaseService.loading.set(false))
    );
  }

  /**
   * Create a new country
   * @param country Country data
   * @returns Observable of created country
   */
  public createCountry(country: CountryInsert): Observable<Country | null> {
    this.supabaseService.loading.set(true);

    return from(this.supabaseService.getClient().from('countries').insert(country).select().single()).pipe(
      map(({ data, error }) => {
        if (error) {
          this.handleError(error);
          return null;
        }

        // Update the countries signal with the new country
        const newCountry = data as Country;
        this.countriesSignal.update((countries) => [...countries, newCountry]);

        // Invalidate cache
        this.countriesCache$ = null;

        return newCountry;
      }),
      tap(() => this.supabaseService.loading.set(false))
    );
  }

  /**
   * Update a country
   * @param id Country ID
   * @param updates Country updates
   * @returns Observable of updated country
   */
  public updateCountry(id: string, updates: CountryUpdate): Observable<Country | null> {
    this.supabaseService.loading.set(true);

    return from(this.supabaseService.getClient().from('countries').update(updates).eq('id', id).select().single()).pipe(
      map(({ data, error }) => {
        if (error) {
          this.handleError(error);
          return null;
        }

        // Update the countries signal with the updated country
        const updatedCountry = data as Country;
        this.countriesSignal.update((countries) => countries.map((c) => (c.id === id ? updatedCountry : c)));

        // Invalidate cache
        this.countriesCache$ = null;

        return updatedCountry;
      }),
      tap(() => this.supabaseService.loading.set(false))
    );
  }

  /**
   * Delete a country
   * @param id Country ID
   * @returns Observable of success status
   */
  public deleteCountry(id: string): Observable<boolean> {
    this.supabaseService.loading.set(true);

    return from(this.supabaseService.getClient().from('countries').delete().eq('id', id)).pipe(
      map(({ error }) => {
        if (error) {
          this.handleError(error);
          return false;
        }

        // Update the countries signal by removing the deleted country
        this.countriesSignal.update((countries) => countries.filter((c) => c.id !== id));

        // Reset selected country if it was the deleted one
        if (this.selectedCountryIdSignal() === id) {
          this.selectedCountryIdSignal.set(null);
        }

        // Invalidate cache
        this.countriesCache$ = null;

        return true;
      }),
      tap(() => this.supabaseService.loading.set(false))
    );
  }

  /**
   * Set the selected country
   * @param id Country ID
   */
  public setSelectedCountry(id: string | null): void {
    this.selectedCountryIdSignal.set(id);
  }

  /**
   * Convert countries to view models
   * @param countries Countries to convert
   * @returns Country view models
   */
  public toViewModel(countries: Country[]): CountryViewModel[] {
    return countries.map((country) => ({
      ...country,
      flagUrl: `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`,
    }));
  }

  /**
   * Invalidate the countries cache
   * Call this when you know the countries data has changed
   */
  public invalidateCache(): void {
    this.countriesCache$ = null;
  }

  /**
   * Handle errors from Supabase operations
   * @param error The error to handle
   */
  private handleError(error: PostgrestError): void {
    console.error('Country service error:', error);
    this.supabaseService.error.set(new Error(error.message));
    this.supabaseService.loading.set(false);
  }
}
