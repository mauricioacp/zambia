-- Enhanced function that includes headquarter and season names in the response
-- This function extends get_agreements_with_role_paginated to include related data

CREATE OR REPLACE FUNCTION get_agreements_with_details_paginated(
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0,
  p_status TEXT DEFAULT NULL,
  p_headquarter_id UUID DEFAULT NULL,
  p_season_id UUID DEFAULT NULL,
  p_search TEXT DEFAULT NULL,
  p_role_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_total BIGINT;
  v_results JSONB;
  v_data JSONB;
BEGIN
  -- Count total matching records
  SELECT COUNT(*) INTO v_total
  FROM public.agreements a
  LEFT JOIN public.roles r ON a.role_id = r.id
  WHERE 
    (p_status IS NULL OR a.status = p_status)
    AND (p_headquarter_id IS NULL OR a.headquarter_id = p_headquarter_id)
    AND (p_season_id IS NULL OR a.season_id = p_season_id)
    AND (p_search IS NULL OR 
         a.name ILIKE '%' || p_search || '%' OR 
         a.last_name ILIKE '%' || p_search || '%' OR
         a.email ILIKE '%' || p_search || '%' OR
         a.document_number ILIKE '%' || p_search || '%')
    AND (p_role_id IS NULL OR a.role_id = p_role_id);

  -- Get paginated results with all related data
  SELECT jsonb_agg(to_jsonb(t)) INTO v_data
  FROM (
    SELECT 
      a.id,
      a.user_id,
      a.headquarter_id,
      a.season_id,
      a.role_id,
      a.status,
      a.email,
      a.document_number,
      a.phone,
      a.name,
      a.last_name,
      a.birth_date,
      a.gender,
      a.address,
      a.volunteering_agreement,
      a.ethical_document_agreement,
      a.mailing_agreement,
      a.age_verification,
      a.created_at,
      a.updated_at,
      -- Include role information
      CASE 
        WHEN r.id IS NOT NULL THEN
          jsonb_build_object(
            'role_id', r.id, 
            'role_name', r.name, 
            'role_description', r.description, 
            'role_code', r.code, 
            'role_level', r.level
          )
        ELSE '{}'::jsonb
      END AS role,
      -- Include headquarter name
      h.name AS headquarter_name,
      -- Include country name
      c.name AS country_name,
      -- Include season name
      s.name AS season_name
    FROM public.agreements a
    LEFT JOIN public.roles r ON a.role_id = r.id
    LEFT JOIN public.headquarters h ON a.headquarter_id = h.id
    LEFT JOIN public.countries c ON h.country_id = c.id
    LEFT JOIN public.seasons s ON a.season_id = s.id
    WHERE 
      (p_status IS NULL OR a.status = p_status)
      AND (p_headquarter_id IS NULL OR a.headquarter_id = p_headquarter_id)
      AND (p_season_id IS NULL OR a.season_id = p_season_id)
      AND (p_search IS NULL OR 
           a.name ILIKE '%' || p_search || '%' OR 
           a.last_name ILIKE '%' || p_search || '%' OR
           a.email ILIKE '%' || p_search || '%' OR
           a.document_number ILIKE '%' || p_search || '%')
      AND (p_role_id IS NULL OR a.role_id = p_role_id)
    ORDER BY a.created_at DESC
    LIMIT p_limit
    OFFSET p_offset
  ) t;

  -- Handle case when no results are found
  IF v_data IS NULL THEN
    v_data := '[]'::jsonb;
  END IF;

  -- Construct the final result object
  v_results := jsonb_build_object(
    'data', v_data,
    'pagination', jsonb_build_object(
      'total', v_total,
      'limit', p_limit,
      'offset', p_offset,
      'page', CASE WHEN p_limit > 0 THEN (p_offset / p_limit) + 1 ELSE 1 END,
      'pages', CASE WHEN p_limit > 0 THEN CEIL(v_total::numeric / p_limit::numeric) ELSE 1 END
    )
  );

  RETURN v_results;
END;
$$;