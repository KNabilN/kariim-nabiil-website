

## Plan: Course-Specific Access Control and Fix Resource Downloads

### Problems
1. **All chapters shown to all students** — CourseLearn fetches all published chapters regardless of the student's enrolled courses.
2. **Resource downloads broken** — The `course-resources` storage bucket is private, but the code uses `getPublicUrl()` which only works for public buckets. Downloads return errors.

### Solution

#### 1. Filter chapters by student's enrolled courses

**`src/pages/CourseLearn.tsx`**:
- After DeviceGate returns `studentId`, query `course_student_access` to get the list of `course_id`s the student has access to.
- Filter `course_chapters` query to only return chapters whose `course_id` is in that list.
- Show course titles in the sidebar or as a course switcher if the student has multiple courses.

#### 2. Fix resource downloads with signed URLs

**`src/components/course/ChapterViewer.tsx`**:
- Replace the direct `file_url` link (which points to a non-public bucket) with a signed URL approach.
- Extract the storage path from the `file_url`, then call `supabase.storage.from("course-resources").createSignedUrl(path, 3600)` to generate a temporary download link.
- The download button triggers this signed URL generation on click.

**`src/pages/Admin.tsx`** (resource upload):
- Keep storing the file path (not the public URL) in `chapter_resources.file_url`, since the bucket is private. Store just the path like `{chapterId}/{timestamp}_{filename}` instead of the full public URL.
- Or: keep storing the full URL but extract the path portion when generating signed URLs on the learn page.

#### 3. Route change for multi-course support

**`src/App.tsx`**:
- Update route from `/course/learn` to `/course/learn/:courseId?` (optional param).
- If no courseId param, show a course selection screen listing the student's enrolled courses.
- If courseId provided, load chapters for that specific course.

### File Changes

| File | Change |
|------|--------|
| `src/pages/CourseLearn.tsx` | Add course access check via `course_student_access`, filter chapters by enrolled courses, add course selection UI |
| `src/components/course/ChapterViewer.tsx` | Replace direct file_url links with signed URL downloads from `course-resources` bucket |
| `src/App.tsx` | Update route to `/course/learn/:courseId?` |

### Technical Details

**Signed URL download handler:**
```typescript
const handleDownload = async (fileUrl: string) => {
  // Extract path from stored URL
  const path = fileUrl.split("/course-resources/")[1];
  const { data } = await supabase.storage
    .from("course-resources")
    .createSignedUrl(path, 3600);
  if (data?.signedUrl) window.open(data.signedUrl, "_blank");
};
```

**Chapter filtering by access:**
```typescript
const { data: access } = await supabase
  .from("course_student_access")
  .select("course_id")
  .eq("student_id", studentId);
const courseIds = access?.map(a => a.course_id) || [];

const { data: chapters } = await supabase
  .from("course_chapters")
  .select("*")
  .eq("is_published", true)
  .in("course_id", courseIds)
  .order("order_index");
```

No database migrations needed.

