

## Plan: Advanced n8n Course Platform with Payment Verification & Gated Content

### Overview

Build a full course platform on top of the existing portfolio. Users land on a dedicated course page, pay via manual transfer (PayPal / InstaPay / Vodafone Cash), upload a payment screenshot, and once approved by the team they get email-based access to course content (videos + downloadable resources). Device access is limited to 3 per email.

---

### Architecture

```text
┌─────────────┐     ┌──────────────────┐     ┌────────────────┐
│  Course Page │────▶│  Payment Form    │────▶│  Supabase DB   │
│  (public)    │     │  (upload screenshot)│   │  + Storage     │
└─────────────┘     └──────────────────┘     └───────┬────────┘
                                                      │
                    ┌──────────────────┐               │
                    │  Team Dashboard  │◀──────────────┘
                    │  /team-dashboard │  (review & approve)
                    └──────────────────┘
                              │
                              ▼ (on approve → user email activated)
                    ┌──────────────────┐
                    │  Student Portal  │
                    │  /course/learn   │  (email login, 3-device limit)
                    │  Videos + Files  │
                    └──────────────────┘

Admin (/admin) → Manage chapters, upload resources, add videos
```

---

### Database Schema (Supabase — External)

**Tables:**

1. **`payment_submissions`** — Payment requests from users
   - `id`, `full_name`, `email`, `phone`, `payment_method` (paypal/instapay/vodafone_cash), `screenshot_url` (Storage), `status` (pending/approved/rejected), `reviewed_by`, `reviewed_at`, `created_at`

2. **`course_students`** — Approved students
   - `id`, `email`, `full_name`, `is_active`, `created_at`, `added_by` (team/payment)

3. **`student_devices`** — Device tracking (max 3)
   - `id`, `student_id` (FK), `device_fingerprint`, `device_name`, `last_seen_at`, `created_at`

4. **`course_chapters`** — Course content structure
   - `id`, `title`, `description`, `youtube_url`, `order_index`, `is_published`, `created_at`

5. **`chapter_resources`** — Downloadable files per chapter
   - `id`, `chapter_id` (FK), `title`, `file_url` (Storage), `file_type`, `file_size`, `created_at`

6. **`team_members`** — Team login (email + password via Supabase Auth)
   - Uses Supabase Auth + a `user_roles` table with role enum (admin/team)

**Storage Buckets:**
- `payment-screenshots` — Public upload, private read (RLS: team/admin only)
- `course-resources` — Private bucket, accessible only to approved students

**RLS Policies:**
- Payment submissions: anyone can insert, only team/admin can read/update
- Course students: only team/admin can manage
- Student devices: read/write scoped to the student's own records
- Course chapters/resources: read for active students only, write for admin/team

---

### Pages & Components

**1. Course Landing Page (`/course/advanced-n8n`)**
- Hero section with course title, description, what you'll learn
- Pricing section showing payment methods (PayPal, InstaPay, Vodafone Cash) with account details
- Payment form: name, email, phone, payment method selector, screenshot upload
- Confirmation message after submission

**2. Student Portal (`/course/learn`)**
- Email-only login (no password): enter email → check if approved → generate device fingerprint → check device count (max 3)
- If new device and already 3 devices: block access with message
- Chapter list sidebar + video player (YouTube embed) + resource download links
- Clean, organized layout per chapter

**3. Team Dashboard (`/team-dashboard`)**
- Login via Supabase Auth (email/password for team members)
- Pending payments tab: list submissions with screenshot preview, approve/reject buttons
- Approved students tab: list with ability to deactivate
- Manual add: form to add a student email directly (for direct transfers)
- Shows payment method, date, name, screenshot for each submission

**4. Admin Panel Updates (`/admin`)**
- New "Course Content" tab alongside existing Hero/Stats/Courses/Projects tabs
- Add/edit/delete chapters (title, description, YouTube URL, order)
- Upload resources per chapter (file upload to Supabase Storage)
- Toggle chapter published/unpublished
- Manage team members (add/remove team email accounts)

---

### Device Fingerprinting (3-Device Limit)

- Generate a browser fingerprint using a combination of: `navigator.userAgent`, screen resolution, timezone, and a locally stored random UUID (stored in localStorage as `device_id`)
- On login, check `student_devices` count for this student
- If device already registered: allow access, update `last_seen_at`
- If new device and count < 3: register and allow
- If new device and count >= 3: deny access with a message to contact support

---

### Security

- Supabase Auth for team/admin authentication
- RLS on all tables — students can only see their own data, team sees payments and students
- `user_roles` table (separate from profiles) with `has_role()` security definer function
- No admin check via localStorage — all through Supabase Auth + roles
- Device fingerprint is supplementary, not a security boundary (it's a convenience limit)
- Storage: payment screenshots are private (team-only access), course resources check student status

---

### Implementation Order

1. **Connect Supabase** — Set up project connection
2. **Database migrations** — Create all tables, RLS policies, roles, storage buckets
3. **Auth setup** — Supabase Auth for team/admin, email-only access for students
4. **Course landing page** — `/course/advanced-n8n` with payment form and screenshot upload
5. **Team dashboard** — `/team-dashboard` for reviewing payments, approving students, manual add
6. **Student portal** — `/course/learn` with email login, device tracking, chapter viewer
7. **Admin course management** — New tab in `/admin` for chapters and resources
8. **Routing** — Add all new routes to App.tsx

---

### Files to Create/Modify

**Create:**
- `src/pages/CourseLanding.tsx` — Public course page with payment form
- `src/pages/CourseLearn.tsx` — Gated student portal
- `src/pages/TeamDashboard.tsx` — Team review panel
- `src/components/course/PaymentForm.tsx` — Payment submission form
- `src/components/course/ChapterViewer.tsx` — Video + resources viewer
- `src/components/course/DeviceGate.tsx` — Email login + device check
- `src/components/course/ChapterSidebar.tsx` — Chapter navigation
- `src/lib/deviceFingerprint.ts` — Device ID generation
- `src/integrations/supabase/` — Client setup (auto-generated by connection)
- Multiple SQL migrations for tables, RLS, storage buckets

**Modify:**
- `src/App.tsx` — Add new routes
- `src/pages/Admin.tsx` — Add course content management tab
- `src/components/Courses.tsx` — Link the Advanced n8n course card to `/course/advanced-n8n`

