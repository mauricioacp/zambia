-- ============================================================================
-- Performance Optimizations for Agreements Feature
-- ============================================================================
-- This migration adds optimized statistics functions and indexes
-- for better performance in the agreements list page.
--
-- Run this migration in your Supabase SQL editor or via Supabase CLI:
-- supabase db push
-- ============================================================================

-- ============================================================================
-- 1. STATISTICS RPC FUNCTION
-- ============================================================================
-- Creates an optimized function to get agreement statistics with counts
-- by status, role, and headquarter. Uses efficient aggregations and
-- respects RLS policies.
-- ============================================================================

CREATE OR REPLACE FUNCTION get_agreements_stats(
  p_headquarter_id UUID DEFAULT NULL,
  p_season_id UUID DEFAULT NULL,
  p_role_id UUID DEFAULT NULL,
  p_status TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
  v_role_level INT;
  v_user_hq_id UUID;
BEGIN
  -- Get user's role level and headquarters for RLS
  v_role_level := fn_get_current_role_level();
  v_user_hq_id := fn_get_current_hq_id();

  -- Build aggregated statistics respecting RLS
  SELECT json_build_object(
    'total', COUNT(*),
    'active', COUNT(*) FILTER (WHERE status = 'active'),
    'pending', COUNT(*) FILTER (WHERE status = 'prospect'),
    'inactive', COUNT(*) FILTER (WHERE status = 'inactive'),
    'by_role', (
      SELECT COALESCE(json_object_agg(r.name, role_counts.count), '{}'::json)
      FROM (
        SELECT a.role_id, COUNT(*) as count
        FROM agreements a
        WHERE fn_can_access_agreement(a.id, v_role_level, v_user_hq_id)
          AND (p_headquarter_id IS NULL OR a.headquarter_id = p_headquarter_id)
          AND (p_season_id IS NULL OR a.season_id = p_season_id)
          AND (p_status IS NULL OR a.status = p_status)
        GROUP BY a.role_id
      ) role_counts
      LEFT JOIN roles r ON r.id = role_counts.role_id
    ),
    'by_headquarter', (
      SELECT COALESCE(json_object_agg(h.name, hq_counts.count), '{}'::json)
      FROM (
        SELECT a.headquarter_id, COUNT(*) as count
        FROM agreements a
        WHERE fn_can_access_agreement(a.id, v_role_level, v_user_hq_id)
          AND (p_season_id IS NULL OR a.season_id = p_season_id)
          AND (p_role_id IS NULL OR a.role_id = p_role_id)
          AND (p_status IS NULL OR a.status = p_status)
        GROUP BY a.headquarter_id
      ) hq_counts
      LEFT JOIN headquarters h ON h.id = hq_counts.headquarter_id
    ),
    'by_season', (
      SELECT COALESCE(json_object_agg(s.name, season_counts.count), '{}'::json)
      FROM (
        SELECT a.season_id, COUNT(*) as count
        FROM agreements a
        WHERE fn_can_access_agreement(a.id, v_role_level, v_user_hq_id)
          AND (p_headquarter_id IS NULL OR a.headquarter_id = p_headquarter_id)
          AND (p_role_id IS NULL OR a.role_id = p_role_id)
          AND (p_status IS NULL OR a.status = p_status)
        GROUP BY a.season_id
      ) season_counts
      LEFT JOIN seasons s ON s.id = season_counts.season_id
    ),
    'last_updated', NOW()
  ) INTO v_result
  FROM agreements a
  WHERE fn_can_access_agreement(a.id, v_role_level, v_user_hq_id)
    AND (p_headquarter_id IS NULL OR a.headquarter_id = p_headquarter_id)
    AND (p_season_id IS NULL OR a.season_id = p_season_id)
    AND (p_role_id IS NULL OR a.role_id = p_role_id)
    AND (p_status IS NULL OR a.status = p_status);

  RETURN COALESCE(v_result, json_build_object(
    'total', 0,
    'active', 0,
    'pending', 0,
    'inactive', 0,
    'by_role', '{}'::json,
    'by_headquarter', '{}'::json,
    'by_season', '{}'::json,
    'last_updated', NOW()
  ));
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_agreements_stats TO authenticated;

COMMENT ON FUNCTION get_agreements_stats IS
'Returns aggregated statistics for agreements including counts by status, role, headquarter, and season. Respects RLS policies.';


-- ============================================================================
-- 2. PERFORMANCE INDEXES
-- ============================================================================
-- Creates indexes to optimize common query patterns in the agreements feature
-- ============================================================================

-- Index for status filtering (most common filter)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agreements_status
  ON agreements(status)
  WHERE status IS NOT NULL;

-- Composite index for headquarter + season filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agreements_hq_season
  ON agreements(headquarter_id, season_id)
  WHERE headquarter_id IS NOT NULL AND season_id IS NOT NULL;

-- Index for role filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agreements_role
  ON agreements(role_id)
  WHERE role_id IS NOT NULL;

-- Index for date sorting and filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agreements_created_at
  ON agreements(created_at DESC NULLS LAST);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agreements_updated_at
  ON agreements(updated_at DESC NULLS LAST);

-- Full-text search index for name, last_name, and email
-- Using Spanish configuration for better text search
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agreements_fts
  ON agreements USING gin((
    setweight(to_tsvector('spanish', COALESCE(name, '')), 'A') ||
    setweight(to_tsvector('spanish', COALESCE(last_name, '')), 'A') ||
    setweight(to_tsvector('spanish', COALESCE(email, '')), 'B') ||
    setweight(to_tsvector('spanish', COALESCE(document_number, '')), 'B')
  ));

-- Composite index for common filter combinations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agreements_status_hq_season
  ON agreements(status, headquarter_id, season_id)
  WHERE status IS NOT NULL;

-- Index for user_id lookups (used when checking if agreement has a user)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agreements_user_id
  ON agreements(user_id)
  WHERE user_id IS NOT NULL;


-- ============================================================================
-- 3. STATISTICS TABLE (Optional - for ultra-fast stats)
-- ============================================================================
-- Creates a denormalized statistics table updated via triggers
-- This is optional but provides instant statistics without computation
-- ============================================================================

CREATE TABLE IF NOT EXISTS agreement_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headquarter_id UUID REFERENCES headquarters(id) ON DELETE CASCADE,
  season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
  status TEXT,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  count INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure unique combination of filters
  UNIQUE(headquarter_id, season_id, status, role_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_agreement_stats_lookup
  ON agreement_statistics(headquarter_id, season_id, status);

-- Grant permissions
GRANT SELECT ON agreement_statistics TO authenticated;

COMMENT ON TABLE agreement_statistics IS
'Denormalized statistics table for ultra-fast agreement counts. Updated via triggers.';


-- ============================================================================
-- 4. TRIGGER TO UPDATE STATISTICS TABLE
-- ============================================================================
-- Automatically updates the statistics table when agreements change
-- ============================================================================

CREATE OR REPLACE FUNCTION update_agreement_statistics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- On INSERT or UPDATE, increment new stats
  IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE') THEN
    INSERT INTO agreement_statistics (
      headquarter_id,
      season_id,
      status,
      role_id,
      count,
      last_updated
    )
    VALUES (
      NEW.headquarter_id,
      NEW.season_id,
      NEW.status,
      NEW.role_id,
      1,
      NOW()
    )
    ON CONFLICT (headquarter_id, season_id, status, role_id)
    DO UPDATE SET
      count = agreement_statistics.count + 1,
      last_updated = NOW();
  END IF;

  -- On UPDATE or DELETE, decrement old stats
  IF (TG_OP = 'UPDATE') OR (TG_OP = 'DELETE') THEN
    UPDATE agreement_statistics
    SET
      count = GREATEST(count - 1, 0),
      last_updated = NOW()
    WHERE
      headquarter_id = OLD.headquarter_id
      AND season_id = OLD.season_id
      AND status = OLD.status
      AND role_id = OLD.role_id;

    -- Clean up zero count entries
    DELETE FROM agreement_statistics
    WHERE count = 0;
  END IF;

  RETURN NULL;
END;
$$;

-- Create trigger on agreements table
DROP TRIGGER IF EXISTS trg_update_agreement_statistics ON agreements;
CREATE TRIGGER trg_update_agreement_statistics
  AFTER INSERT OR UPDATE OR DELETE ON agreements
  FOR EACH ROW
  EXECUTE FUNCTION update_agreement_statistics();

COMMENT ON FUNCTION update_agreement_statistics IS
'Trigger function to maintain denormalized agreement statistics.';


-- ============================================================================
-- 5. FUNCTION TO GET FAST STATISTICS FROM DENORMALIZED TABLE
-- ============================================================================
-- Alternative statistics function using the denormalized table
-- Much faster but requires trigger maintenance
-- ============================================================================

CREATE OR REPLACE FUNCTION get_agreements_stats_fast(
  p_headquarter_id UUID DEFAULT NULL,
  p_season_id UUID DEFAULT NULL,
  p_status TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'total', COALESCE(SUM(count), 0),
    'active', COALESCE(SUM(count) FILTER (WHERE status = 'active'), 0),
    'pending', COALESCE(SUM(count) FILTER (WHERE status = 'prospect'), 0),
    'inactive', COALESCE(SUM(count) FILTER (WHERE status = 'inactive'), 0),
    'by_role', (
      SELECT COALESCE(json_object_agg(r.name, role_stats.total), '{}'::json)
      FROM (
        SELECT role_id, SUM(count) as total
        FROM agreement_statistics
        WHERE (p_headquarter_id IS NULL OR headquarter_id = p_headquarter_id)
          AND (p_season_id IS NULL OR season_id = p_season_id)
          AND (p_status IS NULL OR status = p_status)
        GROUP BY role_id
      ) role_stats
      LEFT JOIN roles r ON r.id = role_stats.role_id
    ),
    'by_headquarter', (
      SELECT COALESCE(json_object_agg(h.name, hq_stats.total), '{}'::json)
      FROM (
        SELECT headquarter_id, SUM(count) as total
        FROM agreement_statistics
        WHERE (p_season_id IS NULL OR season_id = p_season_id)
          AND (p_status IS NULL OR status = p_status)
        GROUP BY headquarter_id
      ) hq_stats
      LEFT JOIN headquarters h ON h.id = hq_stats.headquarter_id
    ),
    'last_updated', NOW()
  ) INTO v_result
  FROM agreement_statistics
  WHERE (p_headquarter_id IS NULL OR headquarter_id = p_headquarter_id)
    AND (p_season_id IS NULL OR season_id = p_season_id)
    AND (p_status IS NULL OR status = p_status);

  RETURN COALESCE(v_result, json_build_object(
    'total', 0,
    'active', 0,
    'pending', 0,
    'inactive', 0,
    'by_role', '{}'::json,
    'by_headquarter', '{}'::json,
    'last_updated', NOW()
  ));
END;
$$;

GRANT EXECUTE ON FUNCTION get_agreements_stats_fast TO authenticated;

COMMENT ON FUNCTION get_agreements_stats_fast IS
'Ultra-fast statistics using denormalized table. Requires trigger maintenance.';


-- ============================================================================
-- 6. REBUILD STATISTICS TABLE (Run once after migration)
-- ============================================================================
-- Populates the statistics table with current data
-- ============================================================================

CREATE OR REPLACE FUNCTION rebuild_agreement_statistics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Clear existing stats
  TRUNCATE agreement_statistics;

  -- Rebuild from current data
  INSERT INTO agreement_statistics (
    headquarter_id,
    season_id,
    status,
    role_id,
    count,
    last_updated
  )
  SELECT
    headquarter_id,
    season_id,
    status,
    role_id,
    COUNT(*) as count,
    NOW() as last_updated
  FROM agreements
  GROUP BY headquarter_id, season_id, status, role_id
  HAVING COUNT(*) > 0;

  RAISE NOTICE 'Agreement statistics rebuilt successfully. Total rows: %',
    (SELECT COUNT(*) FROM agreement_statistics);
END;
$$;

COMMENT ON FUNCTION rebuild_agreement_statistics IS
'Rebuilds the denormalized statistics table from current agreements data. Run once after migration.';

-- Run the rebuild function once
SELECT rebuild_agreement_statistics();


-- ============================================================================
-- 7. ANALYZE TABLES FOR QUERY PLANNER
-- ============================================================================
-- Updates table statistics for PostgreSQL query planner
-- ============================================================================

ANALYZE agreements;
ANALYZE agreement_statistics;
ANALYZE roles;
ANALYZE headquarters;
ANALYZE seasons;


-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Performance optimizations successfully applied!
--
-- Summary:
-- ✓ Created get_agreements_stats() function for optimized statistics
-- ✓ Created get_agreements_stats_fast() function using denormalized table
-- ✓ Added 8 performance indexes for common query patterns
-- ✓ Created agreement_statistics denormalized table
-- ✓ Set up automatic triggers to maintain statistics
-- ✓ Rebuilt statistics from current data
--
-- Next steps:
-- 1. Test the new functions in Supabase SQL Editor:
--    SELECT get_agreements_stats();
--    SELECT get_agreements_stats_fast();
--
-- 2. Update TypeScript types after running migration:
--    npm run supabase:gen:types:local
--
-- 3. Deploy the Angular services to use these new functions
-- ============================================================================
