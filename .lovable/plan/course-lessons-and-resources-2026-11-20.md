# Course Lessons and Resources

## Overview
Expand course content from course → chapters with a single chapter video into course → chapters → multiple lessons. Each lesson has its own link and downloadable resources.

## Work
- Add a `course_lessons` table linked to chapters, with lesson title, description, video link, order, and publish status. Add lesson ownership to chapter resources, with the existing table grants and role policies respected.
- Migrate existing chapter video links and resources into a first lesson so current course content remains available.
- Update the admin Content tab to create/select a course, add and edit chapters, and manage ordered lessons and their resource uploads under each chapter.
- Update the student course view to navigate lessons within chapters, show each lesson’s video/link and its own resources, and retain signed resource downloads.

## Technical details
Keep chapter ordering in `course_chapters` and lesson ordering in `course_lessons`. Existing `course_chapters.youtube_url` remains during migration for compatibility; its content is copied to lessons. Store resource object paths rather than public URLs so downloads use signed links.