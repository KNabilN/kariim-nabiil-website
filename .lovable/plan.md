

## Plan: Add Light/Dark Mode Toggle

### Overview
Add a light mode theme with a sun/moon toggle button in the navbar. The site currently has dark-only CSS variables. We'll add a proper light theme palette, a theme provider context, and a toggle button.

### Changes

#### 1. Create Theme Provider (`src/components/ThemeProvider.tsx`)
- React context that reads/writes `localStorage` key `"theme"` (`"light"` | `"dark"`)
- Defaults to `"dark"` (current behavior)
- Toggles `class="dark"` on `<html>` element
- Exports `useTheme()` hook

#### 2. Update CSS Variables (`src/index.css`)
- Move current dark variables under `.dark` selector
- Add light mode `:root` variables with a clean, professional light palette:
  - Background: white/light gray
  - Card: soft gray
  - Foreground: dark text
  - Primary: keep the same teal/cyan (`185 85% 45%` slightly adjusted for contrast on white)
  - Muted, border, input: light gray tones
  - Reduce glow intensity for light mode
- Update `.glass` class to adapt (lighter backdrop in light mode)

#### 3. Add Toggle Button to Navbar (`src/components/Navbar.tsx`)
- Sun/Moon icon button next to the nav links
- Calls `toggleTheme()` from the provider
- Also add to mobile menu

#### 4. Wrap App with ThemeProvider (`src/App.tsx`)
- Wrap the entire app in `<ThemeProvider>`

#### 5. Fix Component-Specific Issues
- **TrustedBy.tsx**: The `invert` class on logos needs to be conditional — invert in dark mode only, no invert in light mode (or vice versa). Use `dark:invert` instead of static `invert`.
- **Hero.tsx**: Background overlay gradients use `from-background/80` which will adapt automatically.
- **Experience.tsx, Courses.tsx, Contact.tsx**: `bg-card/30` sections will adapt via CSS variables.
- **Button hero variant**: The hardcoded HSL values in button variants will still work since they reference the brand color.
- **Admin/Team/Employee dashboards**: These use semantic Tailwind classes (`bg-background`, `text-foreground`, etc.) so they'll adapt automatically.

### Light Mode Color Palette

```
--background: 0 0% 100%        (white)
--foreground: 220 20% 10%      (near-black)
--card: 220 15% 97%            (very light gray)
--card-foreground: 220 20% 10%
--popover: 0 0% 100%
--popover-foreground: 220 20% 10%
--primary: 185 85% 40%         (teal, slightly darker for contrast on white)
--primary-foreground: 0 0% 100%
--secondary: 220 15% 93%       (light gray)
--secondary-foreground: 220 20% 20%
--muted: 220 15% 95%
--muted-foreground: 220 10% 45%
--border: 220 15% 88%
--input: 220 15% 88%
--ring: 185 85% 40%
--shadow-glow: 0 0 40px hsl(185 85% 50% / 0.15)
--shadow-glow-lg: 0 0 80px hsl(185 85% 50% / 0.2)
```

### Files to Create/Edit

| File | Action |
|------|--------|
| `src/components/ThemeProvider.tsx` | Create — context, hook, localStorage persistence |
| `src/index.css` | Edit — add light variables as `:root` default, move dark under `.dark` |
| `src/components/Navbar.tsx` | Edit — add theme toggle button |
| `src/App.tsx` | Edit — wrap with `<ThemeProvider>` |
| `src/components/TrustedBy.tsx` | Edit — change `invert` to `dark:invert` |
| `tailwind.config.ts` | Already has `darkMode: ["class"]` — no change needed |

