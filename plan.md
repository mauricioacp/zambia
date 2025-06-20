# Administration Dashboard Implementation Plan

## Overview

Implementation plan for the Administration Dashboard that provides comprehensive organization-wide metrics with role-based access control, using a combination of existing Supabase functions and optimized direct queries.

## Technology Stack

- **Frontend**: Angular 19 with Signals and RxJS
- **Backend**: Supabase (PostgreSQL functions + direct queries)
- **UI**: TaigaUI components + Tailwind CSS
- **State Management**: Angular Signals + RxJS Observables
- **Data Access**: Hybrid approach (functions + direct queries)

## Phase 1: Query Architecture

### Global Overview Queries

#### 1. Primary Statistics Query

```sql
-- Using existing function
SELECT * FROM get_global_dashboard_stats();
```

**Returns**: Total counts, agreement stats, conversion metrics
**Performance**: ~100ms

#### 2. Role-Based Statistics

```sql
-- Using existing function
SELECT * FROM get_dashboard_statistics();
```

**Returns**: Counts per role type (directors, facilitators, etc.)
**Performance**: ~50ms

#### 3. Agreement Review Stats

```sql
-- Using existing function
SELECT * FROM get_dashboard_agreement_review_statistics();
```

**Returns**: Pending agreements by role with percentages
**Performance**: ~75ms

#### 4. Agreement Breakdown

```sql
-- Using existing function
SELECT * FROM get_global_agreement_breakdown();
```

**Returns**: Detailed role/status combinations
**Performance**: ~150ms

#### 5. Countries Summary

```typescript
// Direct Supabase query
supabase
  .from('countries')
  .select(
    `
    id, name, is_active,
    headquarters!inner(
      id, name, is_active,
      agreements!inner(id, status, role)
    )
  `
  )
  .eq('is_active', true)
  .order('name');
```

**Performance**: ~200ms

### Country-Specific Queries (On-Demand)

#### 1. Country Headquarters Detail

```typescript
supabase
  .from('headquarters')
  .select(
    `
    id, name, is_active,
    agreements!inner(
      id, status, role,
      users!inner(id, first_name, last_name, role_level)
    )
  `
  )
  .eq('country_id', countryId)
  .eq('is_active', true);
```

#### 2. Headquarter Statistics

```sql
-- Per HQ using existing function
SELECT * FROM get_headquarter_quick_stats(p_headquarter_id);
```

## Phase 2: Data Models

### Core TypeScript Interfaces

```typescript
interface AdminDashboardData {
  students: StudentMetrics;
  roles: RoleMetrics;
  agreements: AgreementMetrics;
  organization: OrganizationMetrics;
  countries: CountrySummary[];
}

interface StudentMetrics {
  total: number;
  active: number;
  inactive: number;
  graduated: number;
  prospect: number;
  byCountry: Map<string, number>;
}

interface RoleMetrics {
  generalDirectors: RoleStatus;
  localDirectors: RoleStatus;
  executiveLeaders: RoleStatus;
  pedagogicalLeaders: RoleStatus;
  communicationLeaders: RoleStatus;
  konsejoMembers: RoleStatus;
  facilitators: RoleStatus;
  companions: RoleStatus;
  assistantDirectors: RoleStatus;
}

interface RoleStatus {
  total: number;
  active: number;
  inactive: number;
  prospect: number;
}

interface AgreementMetrics {
  total: number;
  prospect: number;
  active: number;
  inactive: number;
  graduated: number;
  prospectByRole: Map<string, number>;
}

interface CountrySummary {
  id: string;
  name: string;
  totalHeadquarters: number;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  prospectAgreements: number;
}
```

## Phase 3: Service Implementation

### AdministrationDashboardService

```typescript
@Injectable({ providedIn: 'root' })
export class AdministrationDashboardService {
  private supabase = inject(SupabaseService);

  getGlobalDashboardData(): Observable<AdminDashboardData> {
    return forkJoin({
      globalStats: this.fetchGlobalStats(),
      roleStats: this.fetchRoleStatistics(),
      reviewStats: this.fetchReviewStatistics(),
      agreementBreakdown: this.fetchAgreementBreakdown(),
      countries: this.fetchCountriesSummary(),
    }).pipe(
      map((results) => this.transformToAdminDashboard(results)),
      catchError((error) => of(this.getEmptyDashboardData()))
    );
  }

  getCountryDetailData(countryId: string): Observable<CountryDetailData> {
    return forkJoin({
      headquarters: this.fetchCountryHeadquarters(countryId),
      agreements: this.fetchCountryAgreements(countryId),
    }).pipe(
      map((results) => this.transformToCountryDetail(countryId, results)),
      catchError((error) => of(this.getEmptyCountryDetail(countryId)))
    );
  }

  // Private methods for queries and transformations...
}
```

## Phase 4: Component Structure

### Component Hierarchy

1. **AdminDashboardComponent** (Smart)

   - Loads global data on init
   - Handles refresh actions
   - Manages country selection

2. **MetricCardsComponent** (UI)

   - Displays global metrics in grid
   - Shows role breakdowns
   - Highlights prospect agreements

3. **CountriesGridComponent** (UI)

   - Displays country cards
   - Emits selection events
   - Shows summary metrics per country

4. **CountryDetailComponent** (Smart)
   - Loads country-specific data
   - Shows headquarters breakdown
   - Displays detailed metrics

## Phase 5: Implementation Steps

### Step 1: Service Creation (30 min)

- Generate service in shared-data-access-dashboard
- Implement query methods
- Add error handling

### Step 2: Data Transformations (45 min)

- Create transformation utilities
- Map Supabase responses to models
- Handle null/empty states

### Step 3: Caching Layer (20 min)

- Implement in-memory cache
- Add refresh capability
- Use shareReplay for deduplication

### Step 4: Component Development (1 hour)

- Create dashboard container
- Build metric card components
- Implement country grid
- Add detail view

### Step 5: Testing & Optimization (30 min)

- Test with production data
- Verify role-based access
- Optimize query performance

## Performance Metrics

### Expected Load Times

- **Initial Dashboard**: 200-300ms (parallel queries)
- **Country Details**: 200-250ms per country
- **Refresh**: Same as initial load

### Optimization Strategies

1. Parallel query execution with forkJoin
2. On-demand country loading
3. Client-side caching for session
4. Minimal data transfer (select only needed fields)

## Security Considerations

1. **Role-Based Access**

   - Functions verify role_level >= 80
   - RLS policies enforced on all queries

2. **Data Privacy**

   - No personal information in dashboard
   - Only aggregate statistics shown

3. **Error Handling**
   - Graceful fallbacks for failed queries
   - Empty states for missing data

## Next Steps

1. Review and approve implementation plan
2. Create service and interfaces
3. Implement query methods
4. Build UI components
5. Test with production data
6. Deploy to staging environment

## Success Criteria

- ✅ Dashboard loads in < 3 seconds
- ✅ All role types individually tracked
- ✅ Prospect agreements clearly visible
- ✅ Country drill-down works smoothly
- ✅ Manual refresh updates all data
- ✅ Error states handled gracefully
