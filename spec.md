# Home Page Redesign Specification

## Overview

Redesign the Zambia platform home page to replace the current z-panel and z-homepage with a unified, role-based dashboard that displays real data instead of mocks. The new home page will be accessible at `/dashboard/home` within the existing dashboard layout.

## Core Requirements

### 1. Route Structure

- **New route**: `/dashboard/home`
- **Layout**: Within existing dashboard layout (with sidebar)
- **Legacy routes**: Keep `/dashboard` and `/dashboard/homepage` unchanged for now

### 2. Role-Based Access Tiers

#### Tier 1: Students (Level 1)

**Widgets:**

- My Agreement (summary card with "View my agreement" link)
- My Headquarter Info
- Upcoming Workshops
- What's New

#### Tier 2: Operational Staff (Level 20-50)

**Includes:** Companions, Facilitators, Managers, Assistants, Headquarter Managers
**Widgets:**

- Headquarter Stats (real-time metrics)
- Recent Agreements Activity
- Quick Actions (manage agreements, view reports)
- My Agreement (if applicable)
- What's New

#### Tier 3: Leadership (Level 51+)

**Includes:** Coordinators, Leaders, Directors, Superadmin
**Widgets:**

- Organization Overview (aggregated metrics from all headquarters)
- Performance Metrics (real-time)
- Recent Activities Across Organization
- Quick Actions (system-wide actions)
- What's New

### 3. Data Architecture

#### Supabase Functions to Create:

```sql
-- Returns role-appropriate metrics for home dashboard
get_home_dashboard_stats(p_user_id uuid, p_role_level int)

-- Returns recent activities based on user's access level
get_recent_activities(p_user_id uuid, p_role_level int, p_limit int)

-- Returns pending tasks and actionable items
get_pending_tasks(p_user_id uuid, p_role_level int)

-- Returns user's agreement summary (for Tier 1 users)
get_my_agreement_summary(p_user_id uuid)

-- Returns headquarter-specific stats (for Tier 2 users)
get_headquarter_quick_stats(p_headquarter_id uuid)

-- Returns organization-wide metrics (for Tier 3 users)
get_organization_overview()
```

#### Data Access Rules:

- **Level 1-50**: See only data from their assigned headquarter
- **Level 51+**: See aggregated data from all headquarters
- All data respects existing RLS policies in Supabase

### 4. UI/UX Design

#### Visual Design:

- **Style**: Glass-morphism cards matching existing headquarters detail page
- **Grid**: Responsive layout (1 column mobile → 4 columns desktop)
- **Cards**: Interactive with hover effects, click to navigate to detailed views
- **Colors**:
  - Blue theme for management widgets
  - Green theme for operational widgets
  - Purple theme for strategic/leadership widgets
- **Dark mode**: Full support with existing theme service

#### Card Structure:

```html
<div
  class="rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg backdrop-blur-sm hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800/90"
>
  <!-- Widget content -->
</div>
```

### 5. Widget Specifications

#### 5.1 My Agreement Widget (All Tiers)

- **Display**: Agreement status, role, headquarter
- **Actions**: "View my agreement" button
- **Note**: Uses RLS, so each user only sees their own

#### 5.2 Headquarter Stats Widget (Tier 2)

- **Metrics**:
  - Active agreements count
  - Facilitators count
  - Companions count
  - Students (active/inactive/prospects)
- **Real-time**: Updates via Supabase subscriptions
- **Action**: Click to view headquarter details

#### 5.3 Organization Overview Widget (Tier 3)

- **Metrics**:
  - Total headquarters
  - Total active agreements
  - Total students across organization
  - System health indicators
- **Real-time**: Aggregated data with live updates

#### 5.4 Quick Actions Widget

- **Tier 2 Actions**:
  - Manage Agreements
  - View Reports
  - Add New Agreement
- **Tier 3 Actions**:
  - System Settings
  - Global Reports
  - User Management
  - Headquarters Overview

#### 5.5 What's New Section

- **Source**: Markdown file (`/assets/whats-new.md`)
- **Content**: Platform updates, new features, announcements
- **Filtering**: Can tag content by role level
- **Update**: No code changes needed, just edit markdown

### 6. Real-time Features

#### Subscriptions:

- Critical metrics update via Supabase real-time
- Only subscribe to metrics relevant to user's role
- Debounce updates to prevent UI thrashing

#### Update Triggers:

- New agreement created/updated
- Status changes
- User role changes
- Headquarter metrics changes

### 7. Performance Considerations

- **Lazy loading**: Load widgets based on viewport
- **Caching**: Cache static data (headquarter info, user profile)
- **Optimistic UI**: Show cached data immediately, update when fresh data arrives
- **Bundle size**: Use dynamic imports for role-specific widgets

### 8. Implementation Plan

#### Phase 1: Core Structure

1. Create new home component at `/dashboard/home`
2. Implement role detection service
3. Create base widget components

#### Phase 2: Data Layer

1. Create Supabase functions
2. Implement data services
3. Set up real-time subscriptions

#### Phase 3: Widgets

1. Implement each widget type
2. Add interactive features
3. Connect to real data

#### Phase 4: Polish

1. Add animations and transitions
2. Implement error states
3. Add loading skeletons
4. Test across all role types

### 9. Migration Strategy

1. Deploy new home page at `/dashboard/home`
2. Add link in navigation for testing
3. Gather feedback from users
4. Once stable, redirect old routes
5. Remove legacy components

### 10. Security Considerations

- All data access respects Supabase RLS
- No client-side role elevation
- Validate role level on every API call
- Audit log for sensitive actions
- No sensitive data in browser cache

### 11. Accessibility

- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader friendly widget titles
- High contrast mode support
- Focus indicators on all clickable elements

### 12. Success Metrics

- Page load time < 2 seconds
- Time to interactive < 3 seconds
- Real-time updates latency < 500ms
- User engagement increase of 25%
- Support tickets reduction for "finding information"
