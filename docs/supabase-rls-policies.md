# Supabase Row-Level Security (RLS) Policies

This document outlines the Row-Level Security (RLS) policies for the Akademia application's Supabase database. These policies ensure that users can only access and modify data according to their assigned roles and permissions.

## Table of Contents

1. [Overview](#overview)
2. [Role Hierarchy](#role-hierarchy)
3. [RLS Policies by Table](#rls-policies-by-table)
   - [Headquarters Table](#headquarters-table)
   - [Students Table](#students-table)
   - [Collaborators Table](#collaborators-table)
   - [Agreements Table](#agreements-table)
   - [Workshops Table](#workshops-table)
4. [Database Functions (RPC)](#database-functions-rpc)
5. [Security Considerations](#security-considerations)

## Overview

Row-Level Security (RLS) in Supabase allows us to define access policies at the row level for each table. These policies are enforced by the database itself, ensuring that users can only access data they are authorized to see, regardless of how the data is accessed (API, direct SQL, etc.).

Our RLS strategy follows these principles:

1. **Default Deny**: All tables have RLS enabled with a default deny policy, meaning no access is granted unless explicitly allowed by a policy.
2. **Role-Based Access**: Policies are primarily based on user roles stored in the JWT token.
3. **Scope-Based Restrictions**: Users are restricted to data within their scope (e.g., headquarter managers can only access data for their headquarter).
4. **Operation-Specific Policies**: Different policies for SELECT, INSERT, UPDATE, and DELETE operations.
5. **Hierarchical Access**: Higher-level roles inherit access from lower-level roles.

## Role Hierarchy

Our application uses the following role hierarchy (from highest to lowest access level):

1. SUPERADMIN (level 100) - Complete access to all data
2. GENERAL_DIRECTOR, EXECUTIVE_LEADER (level 90) - Access to all headquarters and their data
3. Various LEADER roles (level 80) - Access to specific domains across all headquarters
4. COORDINATOR, KONSEJO_MEMBER (level 70) - Coordination-level access
5. HEADQUARTER_MANAGER (level 50) - Access to a specific headquarter and its data
6. Various MANAGER roles (level 40) - Access to specific domains within a headquarter
7. MANAGER_ASSISTANT (level 30) - Limited management access
8. COMPANION, FACILITATOR (level 20) - Access to assigned students/groups
9. STUDENT (level 1) - Access to own data only

## RLS Policies by Table

### Headquarters Table

```sql
-- Enable RLS
ALTER TABLE headquarters ENABLE ROW LEVEL SECURITY;

-- Policy for superadmins and directors to view all headquarters
CREATE POLICY headquarters_view_all ON headquarters
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND (
                auth.users.raw_user_meta_data->>'roles' ? 'superadmin' OR
                auth.users.raw_user_meta_data->>'roles' ? 'general_director' OR
                auth.users.raw_user_meta_data->>'roles' ? 'executive_leader'
            )
        )
    );

-- Policy for headquarter managers to view their own headquarter
CREATE POLICY headquarters_view_own ON headquarters
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM collaborators
            WHERE collaborators.user_id = auth.uid()
            AND collaborators.headquarter_id = headquarters.id
            AND EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.raw_user_meta_data->>'roles' ? 'headquarter_manager'
            )
        )
    );

-- Policy for superadmins to insert headquarters
CREATE POLICY headquarters_insert ON headquarters
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'roles' ? 'superadmin'
        )
    );

-- Policy for superadmins to update any headquarter
CREATE POLICY headquarters_update_all ON headquarters
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'roles' ? 'superadmin'
        )
    );

-- Policy for headquarter managers to update their own headquarter
CREATE POLICY headquarters_update_own ON headquarters
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM collaborators
            WHERE collaborators.user_id = auth.uid()
            AND collaborators.headquarter_id = headquarters.id
            AND EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.raw_user_meta_data->>'roles' ? 'headquarter_manager'
            )
        )
    );

-- Policy for superadmins to delete headquarters
CREATE POLICY headquarters_delete ON headquarters
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'roles' ? 'superadmin'
        )
    );
```

### Students Table

```sql
-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Policy for superadmins and directors to view all students
CREATE POLICY students_view_all ON students
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND (
                auth.users.raw_user_meta_data->>'roles' ? 'superadmin' OR
                auth.users.raw_user_meta_data->>'roles' ? 'general_director' OR
                auth.users.raw_user_meta_data->>'roles' ? 'executive_leader'
            )
        )
    );

-- Policy for headquarter managers to view students in their headquarter
CREATE POLICY students_view_headquarter ON students
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM collaborators
            WHERE collaborators.user_id = auth.uid()
            AND collaborators.headquarter_id = students.headquarter_id
            AND EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.raw_user_meta_data->>'roles' ? 'headquarter_manager'
            )
        )
    );

-- Policy for facilitators to view their assigned students
CREATE POLICY students_view_assigned ON students
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM student_facilitator_assignments
            WHERE student_facilitator_assignments.facilitator_id = auth.uid()
            AND student_facilitator_assignments.student_id = students.id
        )
    );

-- Policy for students to view their own data
CREATE POLICY students_view_self ON students
    FOR SELECT
    USING (students.user_id = auth.uid());

-- Policy for superadmins and headquarter managers to insert students
CREATE POLICY students_insert ON students
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND (
                auth.users.raw_user_meta_data->>'roles' ? 'superadmin' OR
                (
                    auth.users.raw_user_meta_data->>'roles' ? 'headquarter_manager' AND
                    EXISTS (
                        SELECT 1 FROM collaborators
                        WHERE collaborators.user_id = auth.uid()
                        AND collaborators.headquarter_id = NEW.headquarter_id
                    )
                )
            )
        )
    );

-- Policy for superadmins to update any student
CREATE POLICY students_update_all ON students
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'roles' ? 'superadmin'
        )
    );

-- Policy for headquarter managers to update students in their headquarter
CREATE POLICY students_update_headquarter ON students
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM collaborators
            WHERE collaborators.user_id = auth.uid()
            AND collaborators.headquarter_id = students.headquarter_id
            AND EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.raw_user_meta_data->>'roles' ? 'headquarter_manager'
            )
        )
    );

-- Policy for students to update their own non-sensitive data
CREATE POLICY students_update_self ON students
    FOR UPDATE
    USING (
        students.user_id = auth.uid()
    )
    WITH CHECK (
        students.user_id = auth.uid() AND
        -- Prevent updating sensitive fields
        OLD.headquarter_id = NEW.headquarter_id AND
        OLD.status = NEW.status
    );

-- Policy for superadmins to delete students
CREATE POLICY students_delete ON students
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'roles' ? 'superadmin'
        )
    );
```

### Collaborators Table

```sql
-- Enable RLS
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;

-- Policy for superadmins and directors to view all collaborators
CREATE POLICY collaborators_view_all ON collaborators
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND (
                auth.users.raw_user_meta_data->>'roles' ? 'superadmin' OR
                auth.users.raw_user_meta_data->>'roles' ? 'general_director' OR
                auth.users.raw_user_meta_data->>'roles' ? 'executive_leader'
            )
        )
    );

-- Policy for headquarter managers to view collaborators in their headquarter
CREATE POLICY collaborators_view_headquarter ON collaborators
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM collaborators AS manager_collab
            WHERE manager_collab.user_id = auth.uid()
            AND manager_collab.headquarter_id = collaborators.headquarter_id
            AND EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.raw_user_meta_data->>'roles' ? 'headquarter_manager'
            )
        )
    );

-- Policy for collaborators to view their own data
CREATE POLICY collaborators_view_self ON collaborators
    FOR SELECT
    USING (collaborators.user_id = auth.uid());

-- Policy for superadmins to insert collaborators
CREATE POLICY collaborators_insert ON collaborators
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'roles' ? 'superadmin'
        )
    );

-- Policy for superadmins to update any collaborator
CREATE POLICY collaborators_update_all ON collaborators
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'roles' ? 'superadmin'
        )
    );

-- Policy for headquarter managers to update collaborators in their headquarter
CREATE POLICY collaborators_update_headquarter ON collaborators
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM collaborators AS manager_collab
            WHERE manager_collab.user_id = auth.uid()
            AND manager_collab.headquarter_id = collaborators.headquarter_id
            AND EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.raw_user_meta_data->>'roles' ? 'headquarter_manager'
            )
        )
    );

-- Policy for collaborators to update their own non-sensitive data
CREATE POLICY collaborators_update_self ON collaborators
    FOR UPDATE
    USING (
        collaborators.user_id = auth.uid()
    )
    WITH CHECK (
        collaborators.user_id = auth.uid() AND
        -- Prevent updating sensitive fields
        OLD.headquarter_id = NEW.headquarter_id AND
        OLD.role_id = NEW.role_id AND
        OLD.status = NEW.status
    );

-- Policy for superadmins to delete collaborators
CREATE POLICY collaborators_delete ON collaborators
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'roles' ? 'superadmin'
        )
    );
```

### Agreements Table

```sql
-- Enable RLS
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;

-- Policy for superadmins to view all agreements
CREATE POLICY agreements_view_all ON agreements
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'roles' ? 'superadmin'
        )
    );

-- Policy for general directors to view agreements
CREATE POLICY agreements_view_directors ON agreements
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'roles' ? 'general_director'
        )
    );

-- Policy for headquarter managers to view agreements for their headquarter
CREATE POLICY agreements_view_headquarter ON agreements
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM collaborators
            WHERE collaborators.user_id = auth.uid()
            AND collaborators.headquarter_id = agreements.headquarter_id
            AND EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.raw_user_meta_data->>'roles' ? 'headquarter_manager'
            )
        )
    );

-- Policy for users to view their own agreements
CREATE POLICY agreements_view_self ON agreements
    FOR SELECT
    USING (agreements.user_id = auth.uid());

-- Policy for superadmins to insert agreements
CREATE POLICY agreements_insert ON agreements
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'roles' ? 'superadmin'
        )
    );

-- Policy for superadmins to update any agreement
CREATE POLICY agreements_update_all ON agreements
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'roles' ? 'superadmin'
        )
    );

-- Policy for superadmins to delete agreements
CREATE POLICY agreements_delete ON agreements
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'roles' ? 'superadmin'
        )
    );
```

### Workshops Table

```sql
-- Enable RLS
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

-- Policy for superadmins and directors to view all workshops
CREATE POLICY workshops_view_all ON workshops
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND (
                auth.users.raw_user_meta_data->>'roles' ? 'superadmin' OR
                auth.users.raw_user_meta_data->>'roles' ? 'general_director' OR
                auth.users.raw_user_meta_data->>'roles' ? 'executive_leader'
            )
        )
    );

-- Policy for headquarter managers to view workshops in their headquarter
CREATE POLICY workshops_view_headquarter ON workshops
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM collaborators
            WHERE collaborators.user_id = auth.uid()
            AND collaborators.headquarter_id = workshops.headquarter_id
            AND EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.raw_user_meta_data->>'roles' ? 'headquarter_manager'
            )
        )
    );

-- Policy for facilitators to view workshops they are assigned to
CREATE POLICY workshops_view_assigned ON workshops
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workshop_facilitators
            WHERE workshop_facilitators.facilitator_id = auth.uid()
            AND workshop_facilitators.workshop_id = workshops.id
        )
    );

-- Policy for students to view workshops they are enrolled in
CREATE POLICY workshops_view_enrolled ON workshops
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workshop_students
            WHERE workshop_students.student_id = auth.uid()
            AND workshop_students.workshop_id = workshops.id
        )
    );

-- Policy for superadmins and headquarter managers to insert workshops
CREATE POLICY workshops_insert ON workshops
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND (
                auth.users.raw_user_meta_data->>'roles' ? 'superadmin' OR
                (
                    auth.users.raw_user_meta_data->>'roles' ? 'headquarter_manager' AND
                    EXISTS (
                        SELECT 1 FROM collaborators
                        WHERE collaborators.user_id = auth.uid()
                        AND collaborators.headquarter_id = NEW.headquarter_id
                    )
                )
            )
        )
    );

-- Policy for superadmins to update any workshop
CREATE POLICY workshops_update_all ON workshops
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'roles' ? 'superadmin'
        )
    );

-- Policy for headquarter managers to update workshops in their headquarter
CREATE POLICY workshops_update_headquarter ON workshops
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM collaborators
            WHERE collaborators.user_id = auth.uid()
            AND collaborators.headquarter_id = workshops.headquarter_id
            AND EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.raw_user_meta_data->>'roles' ? 'headquarter_manager'
            )
        )
    );

-- Policy for facilitators to update workshops they are assigned to
CREATE POLICY workshops_update_assigned ON workshops
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM workshop_facilitators
            WHERE workshop_facilitators.facilitator_id = auth.uid()
            AND workshop_facilitators.workshop_id = workshops.id
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workshop_facilitators
            WHERE workshop_facilitators.facilitator_id = auth.uid()
            AND workshop_facilitators.workshop_id = workshops.id
        ) AND
        -- Prevent updating sensitive fields
        OLD.headquarter_id = NEW.headquarter_id AND
        OLD.status = NEW.status
    );

-- Policy for superadmins and headquarter managers to delete workshops
CREATE POLICY workshops_delete ON workshops
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND (
                auth.users.raw_user_meta_data->>'roles' ? 'superadmin' OR
                (
                    auth.users.raw_user_meta_data->>'roles' ? 'headquarter_manager' AND
                    EXISTS (
                        SELECT 1 FROM collaborators
                        WHERE collaborators.user_id = auth.uid()
                        AND collaborators.headquarter_id = workshops.headquarter_id
                    )
                )
            )
        )
    );
```

## Database Functions (RPC)

For complex operations that can't be easily handled with RLS policies alone, we use PostgreSQL functions (callable via Supabase RPC):

### Dashboard Statistics Functions

```sql
-- Function to get global dashboard stats (for superadmins and directors)
CREATE OR REPLACE FUNCTION get_global_dashboard_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSON;
BEGIN
    -- Check if user has appropriate role
    IF NOT EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND (
            auth.users.raw_user_meta_data->>'roles' ? 'superadmin' OR
            auth.users.raw_user_meta_data->>'roles' ? 'general_director' OR
            auth.users.raw_user_meta_data->>'roles' ? 'executive_leader'
        )
    ) THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    -- Get statistics
    SELECT json_build_object(
        'students_count', (SELECT COUNT(*) FROM students),
        'facilitators_count', (SELECT COUNT(*) FROM collaborators WHERE role_id = 'facilitator'),
        'companions_count', (SELECT COUNT(*) FROM collaborators WHERE role_id = 'companion'),
        'headquarters_count', (SELECT COUNT(*) FROM headquarters)
    ) INTO result;

    RETURN result;
END;
$$;

-- Function to get headquarter dashboard stats (for headquarter managers)
CREATE OR REPLACE FUNCTION get_headquarter_dashboard_stats(headquarter_id UUID DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSON;
    user_headquarter_id UUID;
BEGIN
    -- If no headquarter_id is provided, get the user's headquarter
    IF headquarter_id IS NULL THEN
        SELECT collaborators.headquarter_id INTO user_headquarter_id
        FROM collaborators
        WHERE collaborators.user_id = auth.uid();

        IF user_headquarter_id IS NULL THEN
            RAISE EXCEPTION 'No headquarter found for user';
        END IF;
    ELSE
        user_headquarter_id := headquarter_id;
    END IF;

    -- Check if user has appropriate role and access to this headquarter
    IF NOT EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND (
            auth.users.raw_user_meta_data->>'roles' ? 'superadmin' OR
            auth.users.raw_user_meta_data->>'roles' ? 'general_director' OR
            auth.users.raw_user_meta_data->>'roles' ? 'executive_leader' OR
            (
                auth.users.raw_user_meta_data->>'roles' ? 'headquarter_manager' AND
                EXISTS (
                    SELECT 1 FROM collaborators
                    WHERE collaborators.user_id = auth.uid()
                    AND collaborators.headquarter_id = user_headquarter_id
                )
            )
        )
    ) THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    -- Get statistics for the headquarter
    SELECT json_build_object(
        'students_count', (SELECT COUNT(*) FROM students WHERE students.headquarter_id = user_headquarter_id),
        'facilitators_count', (SELECT COUNT(*) FROM collaborators WHERE collaborators.headquarter_id = user_headquarter_id AND role_id = 'facilitator'),
        'companions_count', (SELECT COUNT(*) FROM collaborators WHERE collaborators.headquarter_id = user_headquarter_id AND role_id = 'companion'),
        'workshops_count', (SELECT COUNT(*) FROM workshops WHERE workshops.headquarter_id = user_headquarter_id)
    ) INTO result;

    RETURN result;
END;
$$;

-- Function to get user-specific dashboard stats
CREATE OR REPLACE FUNCTION get_user_dashboard_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSON;
    user_role TEXT;
BEGIN
    -- Get user's primary role
    SELECT auth.users.raw_user_meta_data->>'roles'->0->>'code' INTO user_role
    FROM auth.users
    WHERE auth.users.id = auth.uid();

    -- Return different stats based on role
    IF user_role = 'facilitator' THEN
        SELECT json_build_object(
            'assigned_students_count', (
                SELECT COUNT(*) FROM student_facilitator_assignments
                WHERE student_facilitator_assignments.facilitator_id = auth.uid()
            ),
            'workshops_count', (
                SELECT COUNT(*) FROM workshop_facilitators
                WHERE workshop_facilitators.facilitator_id = auth.uid()
            ),
            'pending_tasks_count', (
                SELECT COUNT(*) FROM tasks
                WHERE tasks.assigned_to = auth.uid() AND tasks.status = 'pending'
            ),
            'announcements_count', (
                SELECT COUNT(*) FROM announcements
                WHERE announcements.created_at > NOW() - INTERVAL '7 days'
            )
        ) INTO result;
    ELSIF user_role = 'student' THEN
        SELECT json_build_object(
            'enrolled_workshops_count', (
                SELECT COUNT(*) FROM workshop_students
                WHERE workshop_students.student_id = auth.uid()
            ),
            'completed_assignments_count', (
                SELECT COUNT(*) FROM student_assignments
                WHERE student_assignments.student_id = auth.uid() AND student_assignments.status = 'completed'
            ),
            'pending_assignments_count', (
                SELECT COUNT(*) FROM student_assignments
                WHERE student_assignments.student_id = auth.uid() AND student_assignments.status = 'pending'
            ),
            'announcements_count', (
                SELECT COUNT(*) FROM announcements
                WHERE announcements.created_at > NOW() - INTERVAL '7 days'
            )
        ) INTO result;
    ELSE
        -- Default stats for other roles
        SELECT json_build_object(
            'announcements_count', (
                SELECT COUNT(*) FROM announcements
                WHERE announcements.created_at > NOW() - INTERVAL '7 days'
            ),
            'pending_tasks_count', (
                SELECT COUNT(*) FROM tasks
                WHERE tasks.assigned_to = auth.uid() AND tasks.status = 'pending'
            )
        ) INTO result;
    END IF;

    RETURN result;
END;
$$;
```

### Recent Activities Function

```sql
-- Function to get recent activities for the current user
CREATE OR REPLACE FUNCTION get_recent_activities_for_user(limit_count INT DEFAULT 10)
RETURNS TABLE (
    id UUID,
    title TEXT,
    created_at TIMESTAMPTZ,
    activity_type TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_id UUID := auth.uid();
    user_role TEXT;
    user_headquarter_id UUID;
BEGIN
    -- Get user's primary role and headquarter
    SELECT auth.users.raw_user_meta_data->>'roles'->0->>'code' INTO user_role
    FROM auth.users
    WHERE auth.users.id = user_id;

    SELECT collaborators.headquarter_id INTO user_headquarter_id
    FROM collaborators
    WHERE collaborators.user_id = user_id;

    -- Return activities based on role
    IF user_role IN ('superadmin', 'general_director', 'executive_leader') THEN
        -- Global activities for top-level roles
        RETURN QUERY
        SELECT 
            activities.id,
            activities.title,
            activities.created_at,
            activities.activity_type
        FROM activities
        ORDER BY activities.created_at DESC
        LIMIT limit_count;
    ELSIF user_role = 'headquarter_manager' AND user_headquarter_id IS NOT NULL THEN
        -- Headquarter-specific activities for managers
        RETURN QUERY
        SELECT 
            activities.id,
            activities.title,
            activities.created_at,
            activities.activity_type
        FROM activities
        WHERE activities.headquarter_id = user_headquarter_id
        ORDER BY activities.created_at DESC
        LIMIT limit_count;
    ELSE
        -- User-specific activities for everyone else
        RETURN QUERY
        SELECT 
            activities.id,
            activities.title,
            activities.created_at,
            activities.activity_type
        FROM activities
        WHERE 
            activities.user_id = user_id OR
            activities.scope = 'public' OR
            (
                activities.headquarter_id = user_headquarter_id AND
                activities.scope = 'headquarter'
            )
        ORDER BY activities.created_at DESC
        LIMIT limit_count;
    END IF;
END;
$$;
```

## Security Considerations

1. **SECURITY DEFINER vs INVOKER**: Most functions use `SECURITY DEFINER` to run with the privileges of the function creator rather than the caller. This is necessary for functions that need to access tables that the caller might not have direct access to. However, it's important to always include explicit permission checks within these functions to prevent privilege escalation.

2. **JWT Claims**: The RLS policies rely on roles stored in the JWT token's `user_metadata`. Ensure that this data is properly validated and that roles can only be assigned by authorized administrators.

3. **Nested Queries**: Many policies use nested EXISTS queries to check both the user's role and their relationship to the data (e.g., whether they manage a specific headquarter). While this approach is secure, it can impact performance on large tables. Consider adding appropriate indexes.

4. **Default Deny**: All tables have RLS enabled with a default deny policy. This ensures that even if a policy is accidentally omitted, access is still restricted.

5. **Explicit Checks**: Policies include explicit checks for each operation type (SELECT, INSERT, UPDATE, DELETE) rather than using ALL. This provides more granular control and makes the security model easier to audit.

6. **WITH CHECK Clauses**: UPDATE policies use both USING and WITH CHECK clauses to validate both the rows being updated and the new values being set.

7. **Sensitive Field Protection**: Policies for self-updates include checks to prevent users from modifying sensitive fields like status or role assignments.

8. **Error Messages**: Functions include specific error messages (e.g., 'Unauthorized' or 'No headquarter found for user') to aid in debugging without revealing sensitive information.

9. **Search Path**: Functions set a specific search path to prevent search path injection attacks.

10. **Regular Auditing**: Implement regular auditing of RLS policies and functions to ensure they remain effective as the application evolves.
