

## Plan: Reorganize Admin Dashboard

### Summary
Restructure the admin dashboard into cleaner, more focused tabs. Merge course-related management (content, resources, students, payments) into a single "Advanced Course" tab, and improve the overall layout of remaining tabs.

### New Tab Structure

```text
Current:  Projects | Hero | Stats | Courses | Course Content | Employees
New:      Portfolio | Advanced Course | Employees
```

- **Portfolio** tab: Combines Projects, Hero, Stats, and Courses editors into sub-sections with collapsible cards. All portfolio site content in one place.
- **Advanced Course** tab: A dedicated course management hub with internal sub-tabs:
  - **Content** — Chapter management with resource uploads (existing CourseContentEditor + ChapterResourcesEditor)
  - **Students** — Student list with count, emails, active/inactive toggle (from TeamDashboard's StudentsTab + AddStudentTab)
  - **Payments** — Payment submissions review (from TeamDashboard's PaymentsTab)
- **Employees** tab: Stays as-is (add/remove team members)

### File Changes

| File | Action |
|------|--------|
| `src/pages/Admin.tsx` | Major rewrite — reorganize tabs, move student/payment management into the Advanced Course tab, add sub-tab navigation within the course tab, consolidate portfolio editors under one tab with sections |

### Technical Details

1. **Portfolio tab**: Render all 4 editors (Projects, Hero, Stats, Courses) vertically with section headers and collapsible `<details>` or accordion-style cards to keep it scannable.

2. **Advanced Course tab**: Use a nested `Tabs` component inside the main tab content area with three sub-tabs: Content, Students, Payments. Reuse the existing `CourseContentEditor`, `StudentsTab`, `AddStudentTab`, and `PaymentsTab` components — just move them inline into Admin.tsx (they're already defined in TeamDashboard, so we'll duplicate the logic or extract shared components).

3. **Students sub-tab enhancements**: Show total count prominently, display emails clearly, include the "Add Student" form inline below the student list rather than as a separate tab.

4. **No database changes needed** — all data sources remain the same.

