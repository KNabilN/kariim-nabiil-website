

## Plan: Add Image Slider to Project Pop-ups

### Changes

**1. `src/data/projects.ts`** — Add `images: string[]` to the `Project` interface. Default projects get empty arrays.

**2. `src/components/Projects.tsx`** — Add an image carousel/slider at the top of the project detail Dialog using the existing shadcn `Carousel` component. Only renders when `project.images.length > 0`. Includes prev/next arrows and dot indicators.

**3. `src/pages/Admin.tsx`** — Add an "Images" field in the project editor where admins can:
- Add image URLs (input + "Add" button)
- See a list of added image URLs with remove buttons
- Reorder isn't needed for MVP — images display in order added

### Technical Details

- Images stored as URL strings in the `images` array on each project
- Uses the existing `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext` from `@/components/ui/carousel`
- Admin enters image URLs (external hosting like Imgur, Cloudinary, etc.)
- The `addProject` function initializes `images: []`

