# Requirement: Role-Based Access Control (RBAC)

**Status:** To implement
**Author:** (product) — implementation by Gemini, review by Claude
**Date:** 2026-06-17

---

## 1. Goal

Introduce proper role-based access control across the app with **four roles**: `ADMIN`, `INSTRUCTOR`, `STUDENT`, `GUEST`.

Today the app *has* roles but does **not enforce** them: the admin panel is gated only by "is there an auth cookie?", API routes do no role checks, and there is no `INSTRUCTOR` role at all. This requirement closes those gaps.

> ⚠️ **Important for the implementer:** This project uses a customized Next.js. Conventions (routing, middleware, server clients) may differ from public docs. **Read `node_modules/next/dist/docs/` for the relevant API before writing code**, and follow existing patterns in the repo rather than assuming.

---

## 2. Current state (do not break these)

- **Auth:** Supabase. Client setup in [src/lib/supabase.ts](../../src/lib/supabase.ts) (`supabase` anon client + `supabaseAdmin` service-role client). Auth hook: [src/hooks/useAuth.ts](../../src/hooks/useAuth.ts).
- **Role today:** stored in Supabase `auth.users.user_metadata.role`, values `"ADMIN" | "STUDENT" | "GUEST"`. Type also declared in [src/types/reading.ts](../../src/types/reading.ts) and resolved in [src/context/ReadingTestContext.tsx](../../src/context/ReadingTestContext.tsx).
- **Middleware:** [src/middleware.ts](../../src/middleware.ts) — only protects `/admin`, and only checks for the `sb-*-auth-token` cookie. **No role check.**
- **Admin panel:** under `src/app/[locale]/admin/` (dashboard, `users`, `exams`, `payments`, `activity-logs`, `settings`). [layout.tsx](../../src/app/[locale]/admin/layout.tsx) has a comment that route protection is "Bypassed per user request" — there is currently **no role gate inside the panel**.
- **Admin APIs:** under `src/app/api/admin/**` (e.g. `users`, `users/[id]`, `stats`). They accept/validate role values (`["ADMIN","STUDENT","GUEST"]`) but **do not verify the caller's role.**
- **Inconsistency to fix:** the bilingual reader uses a separate `profiles`-table role system (`super_admin`, `content_editor`). This requirement makes `profiles.role` the **single source of truth** — that feature must be migrated onto it (see §9).

---

## 3. Roles & permission matrix

Roles are **mutually exclusive** (one role per user). Hierarchy for convenience: `ADMIN > INSTRUCTOR > STUDENT > GUEST`. **Do not** auto-grant lower-role permissions to higher roles by inheritance unless a row below says so — use the explicit matrix.

| Capability / Area | GUEST | STUDENT | INSTRUCTOR | ADMIN |
|---|---|---|---|---|
| Browse public landing / marketing pages | ✅ | ✅ | ✅ | ✅ |
| Take practice/tests (reading, listening, speaking, writing) | Limited¹ | ✅ | ✅ | ✅ |
| Save vocab, notebook, personal progress | ❌ | ✅ | ✅ | ✅ |
| **Access admin panel** (`/admin/**`) | ❌ | ❌ | ✅ (scoped, see below) | ✅ (full) |
| Exam/content management (`/admin/exams`, content, vocab sets, book proposals "Đề xuất Sách", "Nội dung" moderation) | ❌ | ❌ | ✅ | ✅ |
| View student list & their submissions/progress | ❌ | ❌ | ✅ (read-only) | ✅ |
| Grade writing/speaking submissions | ❌ | ❌ | ✅ | ✅ |
| **User management** (create/edit/delete users, change roles, lock) | ❌ | ❌ | ❌ | ✅ |
| **Payments / billing** (`/admin/payments`) | ❌ | ❌ | ❌ | ✅ |
| **Leads** | ❌ | ❌ | ❌ | ✅ |
| **System settings** (`/admin/settings`) | ❌ | ❌ | ❌ | ✅ |
| Activity logs | ❌ | ❌ | Own actions only (optional) | ✅ (all) |
| Dashboard stats ("Thống kê") | ❌ | ❌ | Scoped to teaching metrics² | ✅ (all) |

¹ "Limited" = whatever the app currently allows unauthenticated users; this requirement does not change GUEST's learning access.
² Instructor dashboard should not expose revenue, total-leads, or conversion metrics — those are ADMIN-only.

**INSTRUCTOR summary:** can manage exams/content and can view students + grade their work. **Cannot** manage users, see payments/leads, or change system settings.

---

## 4. Data model

Make `profiles.role` the single source of truth.

### 4.1 Migration (new file under `supabase/migrations/`)

1. Create a Postgres enum type:
   ```sql
   CREATE TYPE user_role AS ENUM ('ADMIN', 'INSTRUCTOR', 'STUDENT', 'GUEST');
   ```
2. Add a `role` column to `profiles` (NOT NULL, default `'STUDENT'`):
   ```sql
   ALTER TABLE profiles
     ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'STUDENT';
   ```
3. **Backfill** from existing `auth.users.user_metadata.role` so no current user loses access. Map any legacy `GUEST` in metadata appropriately; existing `ADMIN` must stay `ADMIN`.
4. Migrate the bilingual reader roles: `super_admin → ADMIN`, `content_editor → INSTRUCTOR` (see §9), then stop reading the old values.
5. Ensure a `profiles` row is **auto-created on signup** (DB trigger on `auth.users` insert, or in the existing signup/callback flow) with `role = 'STUDENT'`.

### 4.2 Keep `user_metadata.role` in sync (optional but recommended)
Middleware reads the JWT (which carries `user_metadata`) without a DB round-trip. To allow middleware to gate routes cheaply, mirror `role` into `user_metadata` whenever it changes (on signup and whenever an admin updates a role). **`profiles.role` remains authoritative**; metadata is a cache. If they ever disagree, server-side checks must trust `profiles.role`.

---

## 5. Enforcement layers (defense in depth)

Implement **all three**. Never rely on the UI alone.

### 5.1 Middleware ([src/middleware.ts](../../src/middleware.ts))
- Decode the Supabase session/JWT and read the role.
- `/admin/**`: allow only `ADMIN` and `INSTRUCTOR`. If unauthenticated → redirect to `/login`. If authenticated but `STUDENT`/`GUEST` → redirect to home (or a 403 page) with a clear message.
- Within `/admin/**`, ADMIN-only sub-areas (`/admin/users`, `/admin/payments`, `/admin/settings`, leads) must reject `INSTRUCTOR`.
- Keep `[locale]` prefixing intact — match the existing locale-aware routing.

### 5.2 API route authorization (the real gate)
- Add a reusable server helper, e.g. `requireRole(req, allowedRoles[])`, that resolves the caller's user **server-side** from the Supabase session and checks `profiles.role`. Return `401` if not authenticated, `403` if role not allowed.
- Apply to **every** sensitive route:
  - `src/app/api/admin/users/**` and `users/[id]` (incl. `toggle-lock`), `users` POST/PUT/DELETE → **ADMIN only**.
  - `src/app/api/admin/payments/**`, `settings/**`, leads, full `stats` → **ADMIN only**.
  - `src/app/api/admin/exams/**`, content/vocab-set management, book-proposal moderation → **ADMIN or INSTRUCTOR**.
  - Student-list / submission-view / grading endpoints → **ADMIN or INSTRUCTOR**.
- The role-change endpoint must validate the new role against the 4-value set `["ADMIN","INSTRUCTOR","STUDENT","GUEST"]` and reject anything else (currently it only allows 3).

### 5.3 Row Level Security (RLS)
- Enable RLS on `profiles` and other user-owned tables. Policies:
  - A user can read/update **their own** profile (but **cannot** change their own `role`).
  - Only `ADMIN` may update another user's `role` / lock status.
  - `INSTRUCTOR`/`ADMIN` may read student submissions; students read only their own.
- Provide a SQL helper (e.g. a `current_app_role()` function reading the JWT claim) for use in policies. Document each policy in the migration.

---

## 6. Admin panel UI changes

- **Sidebar** ([src/app/[locale]/admin/layout.tsx](../../src/app/[locale]/admin/layout.tsx)): render menu items conditionally by role. INSTRUCTOR sees only: Thống kê (scoped), Quản lý đề (exams/content), Nội dung, Đề xuất Sách, and the student/grading views. INSTRUCTOR must **not** see Users, Leads, Payments, or Settings.
- Remove the "route protection bypassed" hack; the layout must verify the user is ADMIN or INSTRUCTOR (server-side preferred) and render accordingly.
- **Users page** role dropdown ([src/app/[locale]/admin/users/page.tsx](../../src/app/[locale]/admin/users/page.tsx)) must offer all four roles and the role filter must include `INSTRUCTOR`.
- If an INSTRUCTOR somehow lands on an ADMIN-only page, show a 403 / "không đủ quyền" state rather than a broken page.
- Update role labels/i18n: add Vietnamese label for INSTRUCTOR (e.g. "Giảng viên"). Existing labels: ADMIN = "Quản trị viên", STUDENT = "Học viên", GUEST = "Khách".

---

## 7. Type / constant cleanup (single source in code)

- Create one shared constant/type for roles (e.g. `src/lib/roles.ts`) exporting the `UserRole` union `'ADMIN' | 'INSTRUCTOR' | 'STUDENT' | 'GUEST'` and the allowed-roles arrays per area. Replace the duplicated definitions in [src/hooks/useAuth.ts](../../src/hooks/useAuth.ts), [src/types/reading.ts](../../src/types/reading.ts), and [src/context/ReadingTestContext.tsx](../../src/context/ReadingTestContext.tsx) so they import from this one place.
- `resolveRole()` fallback should remain `GUEST` for unknown/unauthenticated.

---

## 8. Acceptance criteria

A reviewer must be able to verify each:

1. A `STUDENT` (and `GUEST`) navigating to any `/admin/**` URL is redirected/blocked — both via direct URL and via middleware, not just hidden menu links.
2. An `INSTRUCTOR` can open `/admin/exams` and content/grading pages, but is blocked from `/admin/users`, `/admin/payments`, `/admin/settings`, and leads — at **both** the page level and the API level (calling the API directly with their session returns `403`).
3. An `ADMIN` has full access.
4. Hitting an admin API route **without** a session returns `401`; with a wrong-role session returns `403`. (Provide a quick way to test, e.g. curl/fetch examples or a short note.)
5. A non-admin **cannot** change roles by calling the user-update API directly (RLS + server check both prevent it).
6. A user cannot escalate **their own** role.
7. New signups land as `STUDENT` with a `profiles` row created automatically.
8. Existing users keep their current effective access after the migration/backfill (no ADMIN accidentally demoted).
9. The role dropdown and filters in the admin Users page include all four roles and persist correctly.
10. Bilingual reader still works for the migrated roles (no reference to `super_admin`/`content_editor` remains).
11. `profiles.role` and `user_metadata.role` (if mirrored) stay consistent after an admin changes a role.

---

## 9. Migration of the bilingual-reader role system

[src/app/[locale]/reading/bilingual/[publisherId]/page.tsx](../../src/app/[locale]/reading/bilingual/[publisherId]/page.tsx) reads `profiles.role` values `super_admin` / `content_editor`. After this change:
- `super_admin` capabilities → `ADMIN`.
- `content_editor` capabilities → `INSTRUCTOR`.
- Update the code to check the new enum values; remove the old strings. Confirm publishers/content editing still gates correctly.

---

## 10. Out of scope (do NOT do)

- Multi-role-per-user / granular per-permission tables. One role per user is enough.
- Changing what GUEST/STUDENT can do in the *learning* product (only access boundaries change).
- Building new instructor *features* beyond wiring access to **existing** screens/data. (Grading UI is in scope only if it already exists; if it doesn't, note it as a follow-up rather than inventing it.)
- Payment logic changes.

---

## 11. Deliverables checklist (for the implementer)

- [ ] SQL migration: enum, `profiles.role` column, backfill, signup trigger, RLS policies, bilingual backfill.
- [ ] `src/lib/roles.ts` shared role type + per-area allow-lists; refactor duplicates to import it.
- [ ] `requireRole()` server helper + applied to all admin/instructor API routes.
- [ ] Middleware role gating for `/admin/**` (incl. ADMIN-only sub-areas), locale-aware.
- [ ] Admin layout/sidebar conditional rendering + removal of the bypass hack + 403 state.
- [ ] Users page: 4-role dropdown + filter; role-update API validates the 4-value set.
- [ ] Signup/callback: ensure `profiles` row + `role = STUDENT` (+ optional metadata mirror).
- [ ] Bilingual reader migrated off `super_admin`/`content_editor`.
- [ ] Manual test notes covering every acceptance criterion in §8.

---

## 12. Notes for the reviewer (Claude)

Focus the review on: (a) **server-side enforcement actually present** on every sensitive API route — not just hidden UI; (b) RLS policies don't allow self-escalation; (c) the backfill can't silently demote an existing ADMIN; (d) middleware still respects `[locale]`; (e) no lingering references to the old 3-role list or `super_admin`/`content_editor`.
