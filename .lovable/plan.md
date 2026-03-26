

## Plan: Project Detail Pop-ups + Admin Page

### 1. Project Detail Dialog

**File: `src/components/Projects.tsx`**

- Add expanded data to each project: `fullDescription`, `challenges`, `results`, `client` (optional fields)
- Make each project card clickable, opening a Dialog with full project details
- Dialog shows: title, domain badge, country, full description, highlight, all tools, challenges, and results
- Styled consistently with the dark glass theme

### 2. Shared Projects Data Store

**File: `src/data/projects.ts`**

- Extract the projects array into a shared data file with an extended type (adding `fullDescription`, `challenges`, `results`)
- Use localStorage to persist admin edits; fall back to default data
- Export a hook `useProjects()` that reads from localStorage or defaults

### 3. Admin Page

**File: `src/pages/Admin.tsx`**

- Login gate: simple form with hardcoded credentials (`karimnouh112` / `admin112`), session stored in `sessionStorage`
- Once logged in, show a dashboard with tabs/sections:
  - **Projects**: List all projects with edit/delete buttons, add new project form
  - **Hero**: Edit hero title, subtitle, description
  - **Stats**: Edit stat values
  - **Courses**: Edit course details
- All changes saved to localStorage
- Logout button

**File: `src/App.tsx`**

- Add route: `/admin` pointing to the Admin page

### 4. Content Management via localStorage

**File: `src/data/siteContent.ts`**

- Create a content store that holds editable sections (hero text, stats, courses)
- Export hooks like `useHeroContent()`, `useStats()`, `useCourses()` that read localStorage with defaults
- Update Hero, Stats, Courses, and Projects components to use these hooks instead of hardcoded data

### Technical Details

- Authentication: `sessionStorage` for login state (clears on tab close) with hardcoded check
- Data persistence: `localStorage` keys like `portfolio_projects`, `portfolio_hero`, `portfolio_stats`, `portfolio_courses`
- Dialog: Uses existing shadcn Dialog component
- No backend needed -- all client-side storage

### Files to create/modify:
- Create `src/data/projects.ts` - shared project data + type + hook
- Create `src/data/siteContent.ts` - editable content store + hooks
- Create `src/pages/Admin.tsx` - admin dashboard with login
- Modify `src/components/Projects.tsx` - add dialog, use shared data
- Modify `src/components/Hero.tsx` - use content hook
- Modify `src/components/Stats.tsx` - use content hook
- Modify `src/components/Courses.tsx` - use content hook
- Modify `src/App.tsx` - add /admin route

