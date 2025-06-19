# Home Page Redesign Implementation Plan

## Overview

Implementation plan for redesigning the Zambia platform home page with role-based dashboards displaying real data from Supabase.

## Quality Assurance Requirements

**IMPORTANT**: After completing EACH task or subtask in this plan, you MUST:

1. Run `npm run build` to ensure the code compiles without errors
2. Run `npm run lint:all` to ensure code meets quality standards
3. Fix any errors before marking the task as complete
4. Only proceed to the next task after both commands pass successfully

This applies to ALL changes in the `/home/mcpo/developer/zambia/` directory.

### Quality Check Commands

**For Angular/Frontend tasks** (in `/home/mcpo/developer/zambia/`):

```bash
# Standard quality check
npm run build && npm run lint:all

# If lint fails, attempt auto-fix
npm run lint:all:fix

# For specific library checks
npx nx lint feat-home
npx nx test feat-home
```

**For Database tasks** (in `/home/mcpo/developer/supabase/`):

```bash
# Validate SQL syntax and reset database
supabase db reset

# If you need test data or specific migrations applied:
deno task generate:dev:environment

# Check if types generation succeeds
deno task generate:supabase:types

# Ensure no breaking changes
supabase db lint
```

**IMPORTANT**: Use `deno task generate:dev:environment` when:

- You need to reset the database with test data
- Required migrations need to be applied for development
- The standard `supabase db reset` doesn't include necessary seed data
- You're starting fresh development on a new feature

### Continuous Quality Monitoring

During development, keep these running in separate terminals:

```bash
# Terminal 1: Watch for TypeScript errors
npm run build:watch

# Terminal 2: Development server with HMR
npm run dev

# Terminal 3: Run tests in watch mode (when applicable)
npx nx test feat-home --watch
```

## Phase 1: Foundation & Infrastructure (2-3 days)

### 1.1 Create New Home Feature Module

- [ ] Generate new feature library: `libs/zambia/feat-home`
- [ ] **Quality Check**: `npm run build && npm run lint:all`
- [ ] Create routing structure for `/dashboard/home`
- [ ] **Quality Check**: `npm run build && npm run lint:all`
- [ ] Set up basic smart component structure
- [ ] **Quality Check**: `npm run build && npm run lint:all`
- [ ] Configure lazy loading in dashboard routes
- [ ] **Quality Check**: `npm run build && npm run lint:all`

### 1.2 Create Home Data Access Service

- [ ] Generate `HomeFacadeService` in the new feature
- [ ] Define TypeScript interfaces for dashboard data
- [ ] Create methods for role detection and tier assignment
- [ ] Set up base service structure for data fetching

### 1.3 Update Navigation Configuration

- [ ] Add new home route to `NAVIGATION_CONFIG`
- [ ] Update sidebar to include home link
- [ ] Configure role-based visibility
- [ ] Add translation keys for new navigation items

### 1.4 Create Markdown Content System

- [ ] Create `/assets/content/whats-new.md` file
- [ ] Implement markdown parsing service
- [ ] Create content loading mechanism
- [ ] Add role-based content filtering logic

## Phase 2: Database Layer (3-4 days)

**IMPORTANT**: All database changes MUST be implemented in `/home/mcpo/developer/supabase/`

### 2.1 Create Core Dashboard Functions

- [ ] In `/home/mcpo/developer/supabase/schemas/`: Create new file `home_dashboard_functions.sql`
- [ ] Create `get_home_dashboard_stats(p_user_id, p_role_level)` function
- [ ] Create `get_my_agreement_summary(p_user_id)` function
- [ ] Create `get_recent_activities(p_user_id, p_role_level, p_limit)` function
- [ ] Add proper role-based security checks
- [ ] Add new schema file to `/home/mcpo/developer/supabase/config.toml` schema_paths

### 2.2 Optimize Existing Functions

- [ ] Review existing functions in `/home/mcpo/developer/supabase/schemas/`
- [ ] Optimize `get_headquarter_quick_stats()` for home page use
- [ ] Enhance `get_organization_overview()` for leadership metrics
- [ ] Add indexes for performance optimization
- [ ] Test query performance with realistic data

### 2.3 Create Real-time Triggers

- [ ] Create new file `/home/mcpo/developer/supabase/schemas/home_dashboard_triggers.sql`
- [ ] Set up database triggers for agreement status changes
- [ ] Create triggers for headquarter metrics updates
- [ ] Configure change notifications for critical metrics
- [ ] Test real-time event propagation
- [ ] Add trigger file to `/home/mcpo/developer/supabase/config.toml`

### 2.4 Generate TypeScript Types

- [ ] From `/home/mcpo/developer/supabase/`: Run `deno task generate:supabase:types`
- [ ] Copy generated types to Angular project: `/home/mcpo/developer/zambia/`
- [ ] Create custom interfaces for dashboard data
- [ ] Ensure type safety across the application

## Phase 3: Widget Components (4-5 days)

### 3.1 Create Base Widget Components

- [ ] Create `BaseWidgetComponent` with glass-morphism styling
- [ ] Implement loading skeleton component
- [ ] Create error state component
- [ ] Add hover effects and transitions

### 3.2 Tier 1 Widgets (Students)

- [ ] Create `MyAgreementWidgetComponent`
- [ ] Create `MyHeadquarterInfoWidgetComponent`
- [ ] Create `UpcomingWorkshopsWidgetComponent`
- [ ] Implement responsive layouts

### 3.3 Tier 2 Widgets (Operational Staff)

- [ ] Create `HeadquarterStatsWidgetComponent`
- [ ] Create `RecentAgreementsActivityWidgetComponent`
- [ ] Create `QuickActionsWidgetComponent`
- [ ] Add real-time update capabilities

### 3.4 Tier 3 Widgets (Leadership)

- [ ] Create `OrganizationOverviewWidgetComponent`
- [ ] Create `PerformanceMetricsWidgetComponent`
- [ ] Create `SystemHealthWidgetComponent`
- [ ] Implement data aggregation displays

### 3.5 Common Widgets

- [ ] Create `WhatsNewWidgetComponent`
- [ ] Implement markdown rendering
- [ ] Add role-based content filtering
- [ ] Style with consistent theme

## Phase 4: Data Integration (3-4 days)

### 4.1 Implement Data Services

- [ ] Create methods for fetching dashboard data
- [ ] Implement caching strategy with signals
- [ ] Add error handling and retry logic
- [ ] Set up loading states management

### 4.2 Real-time Subscriptions

- [ ] Implement Supabase real-time client setup
- [ ] Create subscription management service
- [ ] Add debouncing for updates
- [ ] Handle connection lifecycle

### 4.3 Role-Based Data Loading

- [ ] Implement role detection on component init
- [ ] Load appropriate widgets based on tier
- [ ] Filter data based on RLS policies
- [ ] Handle edge cases and permissions

### 4.4 Performance Optimization

- [ ] Implement lazy loading for widgets
- [ ] Add virtual scrolling if needed
- [ ] Optimize change detection
- [ ] Minimize initial bundle size

## Phase 5: UI/UX Polish (2-3 days)

### 5.1 Responsive Design

- [ ] Implement mobile-first responsive grid
- [ ] Test on various screen sizes
- [ ] Optimize touch interactions
- [ ] Ensure proper spacing and alignment

### 5.2 Animations and Transitions

- [ ] Add entrance animations for widgets
- [ ] Implement smooth data update transitions
- [ ] Create loading shimmer effects
- [ ] Add micro-interactions on hover

### 5.3 Dark Mode Support

- [ ] Ensure all widgets support dark mode
- [ ] Test color contrasts
- [ ] Update glass-morphism effects
- [ ] Verify readability in both themes

### 5.4 Accessibility

- [ ] Add ARIA labels to all interactive elements
- [ ] Implement keyboard navigation
- [ ] Test with screen readers
- [ ] Ensure proper focus management

## Phase 6: Testing & Quality Assurance (2-3 days)

### 6.1 Unit Testing

- [ ] Write tests for all services
- [ ] Test widget components
- [ ] Mock Supabase responses
- [ ] Achieve 80%+ code coverage

### 6.2 Integration Testing

- [ ] Test role-based access
- [ ] Verify data flow
- [ ] Test real-time updates
- [ ] Validate error handling

### 6.3 E2E Testing

- [ ] Create Playwright tests for each user tier (basic) if you need to create users create them you have postgress mcp tool or you can create a deno script to create the testing users.
- [ ] Test navigation flows
- [ ] Verify widget interactions
- [ ] Test responsive behavior

## Phase 7: Documentation & Deployment (1-2 days)

### 7.1 Documentation

- [ ] Update component documentation
- [ ] Create usage guidelines
- [ ] Document new SQL functions
- [ ] Update architecture diagrams
- [ ] Document breaking changes

### 7.4 User Communication

- [ ] Prepare release notes
- [ ] Create user guide

## Detailed Task Breakdown

### Phase 1.1: Create New Home Feature Module

#### Task 1.1.1: Generate Feature Library

```bash
cd /home/mcpo/developer/zambia
npx nx g @nx/angular:library feat-home \
  --directory=libs/zambia \
  --tags=scope:zambia,type:feat \
  --routing \
  --lazy \
  --changeDetection=OnPush \
  --standalone

# Quality check after generation:
npm run build
npm run lint:all
```

#### Task 1.1.2: Create Home Smart Component

```bash
cd /home/mcpo/developer/zambia
npx nx g @nx/angular:component \
  --path=libs/zambia/feat-home/src/lib/components/smart \
  --name=home \
  --type=smart-component \
  --changeDetection=OnPush \
  --inlineStyle=true \
  --inlineTemplate=false \
  --standalone

# Quality check after generation:
npm run build
npm run lint:all
```

#### Task 1.1.3: Update Dashboard Routes

- Add new route to `feat-dashboard/src/lib/lib.routes.ts`
- Configure lazy loading
- Remove role restrictions (available to all authenticated users)

### Phase 2.1: Create Core Dashboard Functions

**Location**: `/home/mcpo/developer/supabase/schemas/home_dashboard_functions.sql`

#### Task 2.1.1: Create SQL Functions File

```sql
-- /home/mcpo/developer/supabase/schemas/home_dashboard_functions.sql

-- Function: get_home_dashboard_stats
CREATE OR REPLACE FUNCTION get_home_dashboard_stats(
    p_user_id uuid,
    p_role_level integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_result jsonb;
    v_hq_id uuid;
BEGIN
    -- Get user's headquarter
    SELECT fn_get_current_hq_id() INTO v_hq_id;

    -- Build appropriate response based on role level
    IF p_role_level >= 51 THEN
        -- Leadership tier: organization-wide stats
        v_result := jsonb_build_object(
            'tier', 3,
            'metrics', get_organization_overview(),
            'recent_activities', get_recent_activities(p_user_id, p_role_level, 10)
        );
    ELSIF p_role_level >= 20 THEN
        -- Operational tier: headquarter-specific stats
        v_result := jsonb_build_object(
            'tier', 2,
            'metrics', get_headquarter_quick_stats(v_hq_id),
            'recent_agreements', get_recent_agreements_by_hq(v_hq_id, 5)
        );
    ELSE
        -- Student tier: personal stats only
        v_result := jsonb_build_object(
            'tier', 1,
            'agreement', get_my_agreement_summary(p_user_id),
            'headquarter_info', get_basic_hq_info(v_hq_id)
        );
    END IF;

    RETURN v_result;
END;
$$;
```

#### Task 2.1.2: Update Supabase Config

```toml
# /home/mcpo/developer/supabase/config.toml
# Add to schema_paths section:
schema_paths = [
  # ... existing schemas ...
  "./schemas/home_dashboard_functions.sql",
  "./schemas/home_dashboard_triggers.sql"
]
```

### Phase 3.1: Create Base Widget Components

#### Task 3.1.1: BaseWidgetComponent Template

```typescript
// /home/mcpo/developer/zambia/libs/zambia/feat-home/src/lib/components/ui/base-widget.ui-component.ts
@Component({
  selector: 'z-base-widget',
  template: `
    <div
      class="widget-container rounded-2xl border border-gray-200/50
             bg-white/90 p-6 shadow-lg backdrop-blur-sm
             transition-all duration-300 hover:shadow-xl
             dark:border-slate-700/50 dark:bg-slate-800/90"
      [class.loading]="loading()"
      [class.error]="error()"
    >
      @if (loading()) {
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      } @else if (error()) {
        <div class="text-red-500 flex items-center gap-2">
          <tui-icon icon="@tui.alert-circle"></tui-icon>
          <span>{{ errorMessage() }}</span>
        </div>
      } @else {
        <ng-content></ng-content>
      }
    </div>
  `,
  styles: [`
    .widget-container {
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.1) 0%,
          transparent 100%
        );
        pointer-events: none;
      }
    }
  `]
})
```

### Phase 4.2: Real-time Subscriptions Setup

#### Task 4.2.1: Create Real-time Service

```typescript
// /home/mcpo/developer/zambia/libs/zambia/feat-home/src/lib/services/home-realtime.service.ts
@Injectable()
export class HomeRealtimeService {
  private supabase = inject(SupabaseService);
  private destroy$ = new Subject<void>();

  subscribeToMetrics(roleLevel: number, hqId?: string): Observable<MetricUpdate> {
    const channel = this.supabase.client.channel('home-metrics').on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'agreements',
        filter: roleLevel < 51 && hqId ? `headquarter_id=eq.${hqId}` : undefined,
      },
      (payload) => {
        // Process and emit updates
      }
    );

    return new Observable(/* ... */);
  }
}
```

## Backend Development Workflow

### Working in Supabase Directory

All backend development MUST happen in `/home/mcpo/developer/supabase/`:

1. **Create SQL Files**:

   ```bash
   cd /home/mcpo/developer/supabase
   # Create new schema files in schemas/ directory
   touch schemas/home_dashboard_functions.sql
   touch schemas/home_dashboard_triggers.sql
   ```

2. **Update Config**:

   ```bash
   # Edit config.toml to add new schema files
   nano config.toml
   ```

3. **Generate Migration**:

   ```bash
   # After creating/editing schemas
   supabase db diff -f add_home_dashboard_functions
   ```

4. **Test Locally**:

   ```bash
   # Reset local database with new changes
   supabase db reset

   # OR if you need full development environment with test data:
   deno task generate:dev:environment
   ```

5. **Generate Types**:

   ```bash
   # Generate TypeScript types for Angular
   deno task generate:supabase:types
   ```

6. **Copy Types to Angular**:

   ```bash
   # Copy generated types to Angular project
   cp types/supabase.ts ../zambia/libs/shared/types-supabase/src/lib/supabase.ts

   # IMPORTANT: After copying types, verify Angular project still builds
   cd ../zambia
   npm run build
   npm run lint:all
   ```

### Edge Functions (if needed)

If real-time processing is needed:

```bash
cd /home/mcpo/developer/supabase
# Create new edge function
supabase functions new home-dashboard

# Develop in functions/home-dashboard/index.ts
# Test locally
supabase functions serve home-dashboard --env-file ./functions/.env
```

## Success Criteria

1. **Performance Metrics**

   - Page load time < 2 seconds
   - Time to interactive < 3 seconds
   - Real-time update latency < 500ms
   - Bundle size increase < 50KB

2. **User Experience**

   - All role tiers see appropriate widgets
   - Smooth transitions and animations
   - Responsive on all devices
   - Accessible to screen readers

3. **Code Quality**

   - 80%+ test coverage
   - No ESLint warnings
   - Consistent with project patterns
   - Well-documented code

4. **Security**
   - RLS policies enforced
   - No data leaks between roles
   - Secure API endpoints
   - Audit logging implemented

## Risk Mitigation

1. **Performance Issues**

   - Pre-optimize SQL queries
   - Implement caching early
   - Use virtual scrolling
   - Monitor bundle sizes

2. **Real-time Overload**

   - Implement debouncing
   - Limit subscription scope
   - Add connection pooling
   - Monitor WebSocket usage

3. **Migration Risks**
   - Keep old routes active
   - Implement feature flags
   - Plan phased rollout
   - Have rollback ready
