import { Injectable, signal, computed } from '@angular/core';
import { SearchAgreementsParams, PaginatedAgreements } from '../types/search-agreements.types';

/**
 * Cache entry with timestamp for TTL management
 */
interface CacheEntry {
  data: PaginatedAgreements;
  timestamp: Date;
  params: SearchAgreementsParams;
}

/**
 * Cache statistics for monitoring
 */
export interface CacheStats {
  size: number;
  maxSize: number;
  ttl: number;
  hitRate: number;
  hits: number;
  misses: number;
  keys: string[];
}

/**
 * Service for caching agreements search results with LRU eviction
 * and stale-while-revalidate pattern support.
 *
 * Features:
 * - LRU (Least Recently Used) cache eviction
 * - TTL (Time To Live) for cache entries
 * - Stale-while-revalidate pattern for better UX
 * - Cache statistics and monitoring
 * - Configurable cache size and TTL
 *
 * @example
 * ```typescript
 * // Check cache before fetching
 * const cached = cacheService.get(params);
 * if (cached) {
 *   return cached;
 * }
 *
 * // Fetch and cache
 * const data = await fetchData(params);
 * cacheService.set(params, data);
 *
 * // Stale-while-revalidate pattern
 * const stale = cacheService.getStale(params);
 * if (stale && cacheService.isStale(params)) {
 *   // Return stale data immediately
 *   setTimeout(() => refetchInBackground(params), 0);
 *   return stale;
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class AgreementsCacheService {
  private cache = new Map<string, CacheEntry>();
  private accessOrder = new Map<string, number>(); // Track access for LRU
  private accessCounter = 0;

  // Cache configuration
  private readonly maxCacheSize = 50; // Maximum number of cached queries
  private readonly cacheTTL = 2 * 60 * 1000; // 2 minutes in milliseconds

  // Statistics signals
  private hits = signal(0);
  private misses = signal(0);

  /**
   * Computed cache hit rate (0-1)
   */
  hitRate = computed(() => {
    const total = this.hits() + this.misses();
    return total === 0 ? 0 : this.hits() / total;
  });

  /**
   * Generate a unique cache key from search parameters
   * Ensures consistent keys by sorting object keys
   */
  private getCacheKey(params: SearchAgreementsParams): string {
    // Sort keys for consistent hashing
    const sortedParams = Object.keys(params)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = params[key as keyof SearchAgreementsParams];
          return acc;
        },
        {} as Record<string, unknown>
      );

    return JSON.stringify(sortedParams);
  }

  /**
   * Get cached data if it exists and is not expired
   * Updates LRU access order
   *
   * @param params - Search parameters to lookup
   * @returns Cached data or null if not found or expired
   */
  get(params: SearchAgreementsParams): PaginatedAgreements | null {
    const key = this.getCacheKey(params);
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses.update((m) => m + 1);
      return null;
    }

    // Check if expired
    const age = Date.now() - entry.timestamp.getTime();
    if (age > this.cacheTTL) {
      this.cache.delete(key);
      this.accessOrder.delete(key);
      this.misses.update((m) => m + 1);
      return null;
    }

    // Update LRU access order
    this.accessCounter++;
    this.accessOrder.set(key, this.accessCounter);

    this.hits.update((h) => h + 1);
    return entry.data;
  }

  /**
   * Get cached data regardless of TTL (for stale-while-revalidate)
   * Returns stale data that can be shown while refetching in background
   *
   * @param params - Search parameters to lookup
   * @returns Cached data (even if stale) or null if not found
   */
  getStale(params: SearchAgreementsParams): PaginatedAgreements | null {
    const key = this.getCacheKey(params);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Update LRU access order
    this.accessCounter++;
    this.accessOrder.set(key, this.accessCounter);

    return entry.data;
  }

  /**
   * Check if cached data exists but is stale (expired)
   * Used for stale-while-revalidate pattern
   *
   * @param params - Search parameters to check
   * @returns True if data exists but is stale
   */
  isStale(params: SearchAgreementsParams): boolean {
    const key = this.getCacheKey(params);
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    const age = Date.now() - entry.timestamp.getTime();
    return age > this.cacheTTL;
  }

  /**
   * Check if data is cached and fresh (not expired)
   *
   * @param params - Search parameters to check
   * @returns True if data exists and is fresh
   */
  isFresh(params: SearchAgreementsParams): boolean {
    const key = this.getCacheKey(params);
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    const age = Date.now() - entry.timestamp.getTime();
    return age <= this.cacheTTL;
  }

  /**
   * Store data in cache with LRU eviction if needed
   * Automatically evicts least recently used entries when cache is full
   *
   * @param params - Search parameters used for the query
   * @param data - Paginated agreements data to cache
   */
  set(params: SearchAgreementsParams, data: PaginatedAgreements): void {
    const key = this.getCacheKey(params);

    // LRU eviction if cache is full
    if (this.cache.size >= this.maxCacheSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    // Update access order
    this.accessCounter++;
    this.accessOrder.set(key, this.accessCounter);

    // Store in cache
    this.cache.set(key, {
      data,
      timestamp: new Date(),
      params,
    });
  }

  /**
   * Evict the least recently used cache entry
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruAccess = Infinity;

    // Find least recently used entry
    for (const [key, accessTime] of this.accessOrder.entries()) {
      if (accessTime < lruAccess) {
        lruAccess = accessTime;
        lruKey = key;
      }
    }

    // Remove from cache
    if (lruKey) {
      this.cache.delete(lruKey);
      this.accessOrder.delete(lruKey);
    }
  }

  /**
   * Invalidate (remove) specific cache entry or all entries
   * Call this after mutations (create/update/delete agreements)
   *
   * @param params - Optional parameters to invalidate specific entry
   */
  invalidate(params?: SearchAgreementsParams): void {
    if (params) {
      const key = this.getCacheKey(params);
      this.cache.delete(key);
      this.accessOrder.delete(key);
    } else {
      // Invalidate all
      this.cache.clear();
      this.accessOrder.clear();
    }
  }

  /**
   * Invalidate all cache entries matching a filter
   * Useful for partial invalidation
   *
   * @param predicate - Function to test each cache entry
   * @example
   * ```typescript
   * // Invalidate all entries for a specific headquarter
   * cacheService.invalidateWhere(
   *   entry => entry.params.p_headquarter_id === 'hq-123'
   * );
   * ```
   */
  invalidateWhere(predicate: (entry: CacheEntry) => boolean): void {
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (predicate(entry)) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
      this.accessOrder.delete(key);
    }
  }

  /**
   * Prefetch data for a specific query
   * Useful for prefetching next page
   *
   * @param params - Search parameters to prefetch
   * @param fetcher - Async function that fetches the data
   * @returns Promise that resolves when prefetch is complete
   */
  async prefetch(params: SearchAgreementsParams, fetcher: () => Promise<PaginatedAgreements>): Promise<void> {
    // Don't prefetch if already cached and fresh
    if (this.isFresh(params)) {
      return;
    }

    try {
      const data = await fetcher();
      this.set(params, data);
    } catch (error) {
      console.warn('Prefetch failed:', error);
    }
  }

  /**
   * Get cache statistics for monitoring and debugging
   *
   * @returns Cache statistics object
   */
  getStats(): CacheStats {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      ttl: this.cacheTTL,
      hitRate: this.hitRate(),
      hits: this.hits(),
      misses: this.misses(),
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Reset cache statistics
   */
  resetStats(): void {
    this.hits.set(0);
    this.misses.set(0);
  }

  /**
   * Get all cache entries (for debugging)
   */
  getAllEntries(): CacheEntry[] {
    return Array.from(this.cache.values());
  }

  /**
   * Get cache entry age in milliseconds
   *
   * @param params - Search parameters to check
   * @returns Age in milliseconds or null if not cached
   */
  getAge(params: SearchAgreementsParams): number | null {
    const key = this.getCacheKey(params);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    return Date.now() - entry.timestamp.getTime();
  }

  /**
   * Warm up cache with initial data
   * Useful for preloading frequently accessed queries
   *
   * @param entries - Array of params and data to cache
   */
  warmUp(entries: Array<{ params: SearchAgreementsParams; data: PaginatedAgreements }>): void {
    for (const entry of entries) {
      this.set(entry.params, entry.data);
    }
  }
}
