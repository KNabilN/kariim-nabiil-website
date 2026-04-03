

## Plan: Multi-Course Support, Student Filtering, and Payment Insights

### Summary
Introduce a proper "paid courses" system so students are enrolled in specific courses, add filtering/search for students, and add payment analytics with totals by course and date range. Mirror changes in the Employee Dashboard.

### Database Changes

**1. New `paid_courses` table** — stores courses that can be sold
```sql
CREATE TABLE public.paid_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  price numeric DEFAULT 0,
  currency text DEFAULT 'EGP',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```
With RLS: admin/team can manage, public can read active courses.

**2. New `course_student_access` junction table** — links students to courses
```sql
CREATE TABLE public.course_student_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.course_students(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.paid_courses(id) ON DELETE CASCADE,
  granted_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id)
);
```

**3. Add `course_id` column to `payment_submissions`**
```sql
ALTER TABLE public.payment_submissions ADD COLUMN course_id uuid REFERENCES public.paid_courses(id);
```

### Code Changes

**4. Admin Dashboard (`src/pages/Admin.tsx`)**

- **New "Courses" management section** inside Advanced Course tab (as a sub-tab or at the top of Content):
  - Add/edit/deactivate paid courses (title, price, currency)
  - Simple list with inline editing

- **Students sub-tab enhancements**:
  - Course selector when adding a student (required) — dropdown of paid courses
  - The student gets an entry in `course_student_access` for that course
  - Search/filter bar: filter by name/email text search, filter by course dropdown, filter by active/inactive
  - Show which courses each student has access to

- **Payments sub-tab enhancements**:
  - Course selector when approving payments (link payment to a course)
  - **Insights panel** at the top:
    - Total revenue (sum of approved amounts)
    - Filter by course dropdown
    - Filter by date range (from/to date pickers)
    - Revenue breakdown cards update based on filters
  - Each payment row shows which course it's for

**5. Employee Dashboard (`src/pages/EmployeeDashboard.tsx`)**
  - Mirror the same student filtering, course assignment on add, and payment insights
  - Employee Add Student form also gets course selector

**6. Course Learn page (`src/pages/CourseLearn.tsx`)**
  - When a student logs in, check `course_student_access` to verify they have access to the course being viewed (future-proofing for multiple courses)

### File Summary

| File | Action |
|------|--------|
| Migration SQL | Create `paid_courses`, `course_student_access` tables; add `course_id` to `payment_submissions` |
| `src/pages/Admin.tsx` | Add course management UI, student filters, course assignment on add, payment insights with date/course filters |
| `src/pages/EmployeeDashboard.tsx` | Mirror student filters, course assignment, payment insights |
| `src/integrations/supabase/types.ts` | Auto-updated after migration |

### UI/UX Details

- **Payment Insights**: Glass cards at top showing Total Revenue, Approved Count, and Average Payment — all reactive to course and date range filters
- **Student Filters**: A row of controls above the student list — text search input, course dropdown, active/inactive toggle — results update instantly
- **Course Management**: A simple collapsible section within the Advanced Course tab for adding/editing paid courses before the Content sub-tab

