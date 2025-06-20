# Administration Dashboard Specification

## Overview

The Administration Dashboard provides a comprehensive view of the entire organization's data, including students, staff roles, agreements, countries, and headquarters. It offers both a global overview and country-specific detailed views with drill-down capabilities.

## Key Requirements

### 1. Data Display Structure

- **Static widgets** that load data on demand (no real-time updates)
- **Two-tier view**:
  - Global overview (loads on dashboard open)
  - Country-specific details (loads on country card click)
- **Manual refresh button** for updating data

### 2. Global Overview Metrics

#### 2.1 Student Metrics

- Total students
- Active students
- Inactive students
- Graduated students
- Prospect students
- Students per country (count)

#### 2.2 Role-Based Metrics (All Collaborators)

Display individual counts for each role:

- **Directors**: General Directors, Local Directors
- **Leaders**: Executive Leaders, Pedagogical Leaders, Communication Leaders
- **Konsejo Members**
- **Facilitators**
- **Companions**
- **Assistant Directors**

For each role, show:

- Total count
- Active count
- Inactive count
- Prospect count (agreements pending review)

#### 2.3 Agreement Metrics

- Total agreements by status:
  - Prospect (pending review)
  - Active
  - Inactive
  - Graduated
- **Breakdown of prospect agreements by role type**
  - Example: "5 student agreements, 3 facilitator agreements pending"

#### 2.4 Organization Structure Metrics

- Total countries
- Total headquarters
- Active countries
- Active headquarters

### 3. Country View

#### 3.1 Country Cards Display

- **Order**: Alphabetical by country name
- **Summary data per country**:
  - Country name
  - Total headquarters
  - Total users (all roles combined)
  - Total prospect agreements needing review
  - Active/Inactive breakdown

#### 3.2 Country Detail View (On Click)

When a country card is clicked, display:

##### 3.2.1 Headquarters List

For each headquarter in the country:

- Headquarter name
- Total members
- Active members
- Students count
- Staff count
- Prospect agreements count

##### 3.2.2 Country-Specific Breakdowns

- **Students**: Total, Active, Inactive, Graduated, Prospect
- **Each Role Type**: Total, Active, Inactive, Prospect
- **Agreements**: Prospect, Active, Inactive, Graduated

### 4. Data Organization

#### 4.1 Global Overview Layout

Group metrics by **entity type**:

1. Students section
2. Roles section (all collaborator roles)
3. Agreements section
4. Organization structure section

#### 4.2 Visual Hierarchy

- Most critical metric: Agreements needing review (prospect status)
- Secondary: Active counts for all entities
- Tertiary: Status breakdowns

### 5. Technical Implementation

#### 5.1 Supabase Functions to Use

**For Global Overview:**

- `get_global_dashboard_stats()` - Main statistics
- `get_dashboard_statistics()` - Entity counts by category
- `get_dashboard_agreement_review_statistics()` - Agreement review breakdown

**For Country Details:**

- Custom RPC function needed to get country-specific breakdowns
- Will need to aggregate data from existing functions or create new ones

#### 5.2 Data Service Structure

```typescript
interface GlobalDashboardStats {
  students: {
    total: number;
    active: number;
    inactive: number;
    graduated: number;
    prospect: number;
    byCountry: { [countryId: string]: number };
  };

  roles: {
    [roleType: string]: {
      total: number;
      active: number;
      inactive: number;
      prospect: number;
    };
  };

  agreements: {
    total: number;
    prospect: number;
    active: number;
    inactive: number;
    graduated: number;
    prospectByRole: {
      [roleType: string]: number;
    };
  };

  organization: {
    totalCountries: number;
    activeCountries: number;
    totalHeadquarters: number;
    activeHeadquarters: number;
  };
}

interface CountryDetailStats {
  countryId: string;
  countryName: string;
  headquarters: HeadquarterSummary[];
  breakdown: {
    students: StatusBreakdown;
    roles: { [roleType: string]: StatusBreakdown };
    agreements: StatusBreakdown;
  };
}

interface StatusBreakdown {
  total: number;
  active: number;
  inactive: number;
  graduated?: number;
  prospect: number;
}
```

#### 5.3 Service Methods

```typescript
class AdministrationDashboardService {
  // Load global overview on dashboard init
  getGlobalDashboardStats(): Observable<GlobalDashboardStats>;

  // Load country details on demand
  getCountryDetailStats(countryId: string): Observable<CountryDetailStats>;

  // Get all countries with summary for cards
  getCountriesSummary(): Observable<CountrySummary[]>;

  // Manual refresh
  refreshDashboardData(): Observable<GlobalDashboardStats>;
}
```

### 6. User Interactions

1. **Dashboard Load**: Automatically fetch and display global overview
2. **Country Card Click**: Fetch and display detailed breakdown for selected country
3. **Refresh Button**: Re-fetch all currently displayed data
4. **Navigation**: Breadcrumb or back button to return from country detail to overview

### 7. Error Handling

- **No data**: Display zeros for all metrics
- **Empty countries**: Show country card with zero values
- **Failed data fetch**: Display error message with retry option
- **Loading states**: Handled by UI implementation

### 8. Performance Considerations

- Load global overview first (single call combining multiple function results)
- Load country details only on demand
- No caching in v1 (can be added in v2)
- Batch API calls where possible

### 9. Security

- All data access controlled by existing Supabase RLS policies
- Administration dashboard only accessible to users with appropriate role level
- Functions already include role-level security checks

### 10. Future Enhancements (v2)

- Filtering capabilities (by time period, status, etc.)
- Data export functionality
- Trend visualizations
- Real-time updates for critical metrics
- Caching strategy for better performance
- Comparative analytics between countries/headquarters

## Implementation Priority

1. Create TypeScript interfaces for data structures
2. Implement administration dashboard service
3. Create Supabase RPC functions for country-specific data (if needed)
4. Build component structure with loading states
5. Implement refresh functionality
6. Add error handling

## Success Criteria

- Administrators can see organization-wide metrics at a glance
- Country-specific data is easily accessible with one click
- All role types are individually tracked
- Prospect agreements are clearly visible with role breakdown
- Performance is acceptable (< 3 seconds for initial load)
