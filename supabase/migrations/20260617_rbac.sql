-- ============================================================================
-- RBAC migration: ADMIN / INSTRUCTOR / STUDENT / GUEST
-- Re-runnable (idempotent). Fixes the original "operator does not exist:
-- text = user_role" error, which was caused by profiles.role already existing
-- as a TEXT column (legacy bilingual-reader values super_admin/content_editor)
-- that was never converted to the enum.
-- ============================================================================

-- 1. Create user_role enum type ---------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'INSTRUCTOR', 'STUDENT', 'GUEST');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Ensure profiles table exists (no-op if it already does) -----------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'STUDENT',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Convert / add the role column ------------------------------------------
--    The real bug: profiles.role pre-existed as TEXT, so ADD COLUMN IF NOT
--    EXISTS did nothing and comparisons against the enum failed. Here we
--    detect the actual column type and convert in place, mapping legacy values.
DO $$
DECLARE
  col_type text;
BEGIN
  SELECT data_type INTO col_type
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role';

  IF col_type IS NULL THEN
    -- Column missing entirely: add it as the enum.
    ALTER TABLE public.profiles ADD COLUMN role user_role NOT NULL DEFAULT 'STUDENT';

  ELSIF col_type <> 'USER-DEFINED' THEN
    -- Column exists as text/varchar -> convert to the enum, mapping legacy values.
    ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;
    ALTER TABLE public.profiles
      ALTER COLUMN role TYPE user_role
      USING (
        CASE lower(coalesce(role, ''))
          WHEN 'super_admin'    THEN 'ADMIN'
          WHEN 'admin'          THEN 'ADMIN'
          WHEN 'content_editor' THEN 'INSTRUCTOR'
          WHEN 'instructor'     THEN 'INSTRUCTOR'
          WHEN 'student'        THEN 'STUDENT'
          WHEN 'guest'          THEN 'GUEST'
          ELSE 'STUDENT'
        END::user_role
      );
    ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'STUDENT';
    ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;
  END IF;
  -- If col_type = 'USER-DEFINED' the column is already the enum: nothing to do.
END $$;

-- 4. Backfill: don't lose admins who only had the role in auth metadata ------
--    (Existing profiles.role values were already mapped in step 3. This only
--    promotes rows that are still STUDENT but whose auth metadata says ADMIN.)
UPDATE public.profiles p
SET role = 'ADMIN'::user_role
FROM auth.users u
WHERE p.id = u.id
  AND u.raw_user_meta_data->>'role' = 'ADMIN'
  AND p.role <> 'ADMIN'::user_role;

-- 5. Helper: current user's role, SECURITY DEFINER so it bypasses profiles
--    RLS and avoids infinite recursion when used inside profiles policies.
CREATE OR REPLACE FUNCTION public.current_app_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 6. Prevent privilege escalation: only an ADMIN (or the service role used by
--    server-side admin APIs) may change a profile's role. This is the real
--    backstop for self-escalation — RLS WITH CHECK cannot compare OLD vs NEW.
CREATE OR REPLACE FUNCTION public.prevent_role_self_change()
RETURNS trigger AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role
     AND coalesce(auth.role(), '') <> 'service_role'
     AND current_user NOT IN ('postgres', 'supabase_admin', 'supabase_auth_admin')
     AND public.current_app_role() IS DISTINCT FROM 'ADMIN'::user_role THEN
    RAISE EXCEPTION 'Only an ADMIN can change a user role';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_role_self_change ON public.profiles;
CREATE TRIGGER trg_prevent_role_self_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_self_change();

-- 7. Enable RLS and define policies -----------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can manage all profiles" ON public.profiles;

-- Users can read their own profile.
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile. Role changes are blocked by the trigger
-- in step 6, so this is safe against self-escalation.
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can do anything. Uses current_app_role() (SECURITY DEFINER) instead of
-- a sub-SELECT on profiles, which would recurse infinitely under RLS.
CREATE POLICY "Admin can manage all profiles"
  ON public.profiles FOR ALL
  USING (public.current_app_role() = 'ADMIN'::user_role)
  WITH CHECK (public.current_app_role() = 'ADMIN'::user_role);
