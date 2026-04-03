

## Plan: Migrate Admin to Supabase Auth + Employee Management

### Summary
Replace the hardcoded admin login with Supabase authentication, create the admin user with the specified credentials, and add the ability for the admin to create employee accounts (with name, email, password) that can log into their own dashboard page.

### Database Changes

**1. Create an edge function to manage employees**
- An `invite-employee` edge function that uses the Supabase Admin API (`supabase.auth.admin.createUser`) to create new auth users with email + password
- Automatically inserts a `team` role into `user_roles` for the new user
- Requires the `SUPABASE_SERVICE_ROLE_KEY` secret (already available)

**2. Create admin user manually**
- Use Supabase dashboard or edge function to create user `karimnouh112@gmail.com` with password `K@admin123`
- Insert an `admin` role into `user_roles` for this user

### Code Changes

**3. Rewrite `src/pages/Admin.tsx` login flow**
- Replace hardcoded credentials with `supabase.auth.signInWithPassword`
- After login, check `user_roles` for `admin` role; deny access if not admin
- Keep all existing admin tabs (Projects, Hero, Stats, Courses, Course Content)
- Add a new **"Employees"** tab with:
  - Form to add employee: Name, Email, Password fields
  - Calls the `invite-employee` edge function
  - Lists existing team members (from `user_roles` joined concept)
  - Ability to remove employees

**4. Create `src/pages/EmployeeDashboard.tsx`**
- Similar to TeamDashboard but specifically for employees with `team` role
- Supabase auth login (email/password)
- After login, verify user has `team` role
- Shows the same tabs as TeamDashboard: Payments, Students, Add Student
- Reuses the existing PaymentsTab, StudentsTab, AddStudentTab components

**5. Update `src/App.tsx`**
- Add route `/employee-dashboard` pointing to EmployeeDashboard
- Keep `/team-dashboard` as alias or redirect

**6. Create `supabase/functions/invite-employee/index.ts`**
- Edge function that:
  - Verifies caller is admin (checks JWT + `user_roles`)
  - Creates auth user with `supabase.auth.admin.createUser({ email, password, email_confirm: true })`
  - Inserts `team` role into `user_roles`
  - Returns success/error

### File Summary
| File | Action |
|------|--------|
| `supabase/functions/invite-employee/index.ts` | Create |
| `src/pages/Admin.tsx` | Rewrite login + add Employees tab |
| `src/pages/EmployeeDashboard.tsx` | Create (team role gated dashboard) |
| `src/App.tsx` | Add employee-dashboard route |

### Technical Notes
- The admin user (`karimnouh112@gmail.com`) needs to be created in Supabase Auth and assigned the `admin` role in `user_roles` — this will be done via SQL insert after creating the user through the edge function or dashboard
- Employee passwords are set directly (no email confirmation needed) using `email_confirm: true` in `createUser`
- The edge function uses `SUPABASE_SERVICE_ROLE_KEY` which is already configured

