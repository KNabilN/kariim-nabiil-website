-- Separate free-preview flag from publish, then reset Agentic curriculum to the real outline.

ALTER TABLE public.paid_courses
  ADD COLUMN IF NOT EXISTS slug text;

CREATE UNIQUE INDEX IF NOT EXISTS paid_courses_slug_unique
  ON public.paid_courses (slug)
  WHERE slug IS NOT NULL;

ALTER TABLE public.course_lessons
  ADD COLUMN IF NOT EXISTS is_preview boolean NOT NULL DEFAULT false;

INSERT INTO public.paid_courses (title, price, currency, is_active, slug)
SELECT
  'Agentic AI Engineering: From Zero to Job-Ready',
  3500,
  'EGP',
  true,
  'agentic-ai-engineering'
WHERE NOT EXISTS (
  SELECT 1 FROM public.paid_courses WHERE slug = 'agentic-ai-engineering'
);

DO $$
DECLARE
  v_course_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_course_id
  FROM public.paid_courses
  WHERE slug = 'agentic-ai-engineering'
  LIMIT 1;

  IF v_course_id IS NULL THEN
    RETURN;
  END IF;

  -- Replace any test / partial content with the full curriculum
  DELETE FROM public.course_chapters WHERE course_id = v_course_id;

  -- Section 1: Start Here
  INSERT INTO public.course_chapters (course_id, title, description, order_index, is_published)
  VALUES (v_course_id, 'Start Here', NULL, 0, true)
  RETURNING id INTO v_chapter_id;
  INSERT INTO public.course_lessons (chapter_id, title, description, video_url, order_index, is_published, is_preview) VALUES
    (v_chapter_id, 'Introduction', NULL, NULL, 0, true, false);

  -- Section 2
  INSERT INTO public.course_chapters (course_id, title, description, order_index, is_published)
  VALUES (v_course_id, 'Let''s Learn More About AI!', NULL, 1, true)
  RETURNING id INTO v_chapter_id;
  INSERT INTO public.course_lessons (chapter_id, title, description, video_url, order_index, is_published, is_preview) VALUES
    (v_chapter_id, 'Section Introduction', NULL, NULL, 0, true, false),
    (v_chapter_id, 'Introduction to AI', NULL, NULL, 1, true, true),
    (v_chapter_id, 'What are LLMs', NULL, NULL, 2, true, false),
    (v_chapter_id, 'Prompt Engineering', NULL, NULL, 3, true, false),
    (v_chapter_id, 'LLMs Models', NULL, NULL, 4, true, false);

  -- Section 3
  INSERT INTO public.course_chapters (course_id, title, description, order_index, is_published)
  VALUES (v_course_id, 'Programming Basics', NULL, 2, true)
  RETURNING id INTO v_chapter_id;
  INSERT INTO public.course_lessons (chapter_id, title, description, video_url, order_index, is_published, is_preview) VALUES
    (v_chapter_id, 'Section Introduction', NULL, NULL, 0, true, false),
    (v_chapter_id, 'Programming Basics', NULL, NULL, 1, true, false),
    (v_chapter_id, 'API', NULL, NULL, 2, true, false),
    (v_chapter_id, 'Environment', NULL, NULL, 3, true, false),
    (v_chapter_id, 'Google Colab', NULL, NULL, 4, true, false),
    (v_chapter_id, 'Your First GenAI Application', NULL, NULL, 5, true, false),
    (v_chapter_id, 'AI Generated Code', NULL, NULL, 6, true, false),
    (v_chapter_id, 'AI Agent Code', NULL, NULL, 7, true, false);

  -- Section 4
  INSERT INTO public.course_chapters (course_id, title, description, order_index, is_published)
  VALUES (v_course_id, 'Agentic System', NULL, 3, true)
  RETURNING id INTO v_chapter_id;
  INSERT INTO public.course_lessons (chapter_id, title, description, video_url, order_index, is_published, is_preview) VALUES
    (v_chapter_id, 'Code Flow', NULL, NULL, 0, true, false),
    (v_chapter_id, 'LLM Flow Control - Part 1', NULL, NULL, 1, true, false),
    (v_chapter_id, 'LLM Flow Control - Part 2', NULL, NULL, 2, true, false),
    (v_chapter_id, 'LLM Flow Control - Part 3', NULL, NULL, 3, true, false);

  -- Section 5
  INSERT INTO public.course_chapters (course_id, title, description, order_index, is_published)
  VALUES (v_course_id, 'Agentic Design Patterns', NULL, 4, true)
  RETURNING id INTO v_chapter_id;
  INSERT INTO public.course_lessons (chapter_id, title, description, video_url, order_index, is_published, is_preview) VALUES
    (v_chapter_id, 'Agentic System Mindset', NULL, NULL, 0, true, true),
    (v_chapter_id, 'What is an AI Agent?', NULL, NULL, 1, true, false),
    (v_chapter_id, 'Prompt Chaining', NULL, NULL, 2, true, false),
    (v_chapter_id, 'Router', NULL, NULL, 3, true, false),
    (v_chapter_id, 'Parallelization', NULL, NULL, 4, true, false),
    (v_chapter_id, 'Async', NULL, NULL, 5, true, false),
    (v_chapter_id, 'Orchestration', NULL, NULL, 6, true, false),
    (v_chapter_id, 'Reviewer Optimizer', NULL, NULL, 7, true, false),
    (v_chapter_id, 'Gradio', NULL, NULL, 8, true, false),
    (v_chapter_id, 'Practice', NULL, NULL, 9, true, false);

  -- Section 6
  INSERT INTO public.course_chapters (course_id, title, description, order_index, is_published)
  VALUES (v_course_id, 'Quick Revision', NULL, 5, true)
  RETURNING id INTO v_chapter_id;
  INSERT INTO public.course_lessons (chapter_id, title, description, video_url, order_index, is_published, is_preview) VALUES
    (v_chapter_id, 'Revision Project', NULL, NULL, 0, true, false);

  -- Section 7
  INSERT INTO public.course_chapters (course_id, title, description, order_index, is_published)
  VALUES (v_course_id, 'Agent Tools', NULL, 6, true)
  RETURNING id INTO v_chapter_id;
  INSERT INTO public.course_lessons (chapter_id, title, description, video_url, order_index, is_published, is_preview) VALUES
    (v_chapter_id, 'LLMs Limitations and Tools Effect', NULL, NULL, 0, true, false),
    (v_chapter_id, 'What are Tools?', NULL, NULL, 1, true, false),
    (v_chapter_id, 'OpenRouter', NULL, NULL, 2, true, false),
    (v_chapter_id, 'Tools Description', NULL, NULL, 3, true, false),
    (v_chapter_id, 'Not That Smart', NULL, NULL, 4, true, false),
    (v_chapter_id, 'Tool Decision', NULL, NULL, 5, true, false),
    (v_chapter_id, 'Tool Calling', NULL, NULL, 6, true, false),
    (v_chapter_id, 'Push Notification Project', NULL, NULL, 7, true, false);

  -- Section 8
  INSERT INTO public.course_chapters (course_id, title, description, order_index, is_published)
  VALUES (v_course_id, 'RAG', NULL, 7, true)
  RETURNING id INTO v_chapter_id;
  INSERT INTO public.course_lessons (chapter_id, title, description, video_url, order_index, is_published, is_preview) VALUES
    (v_chapter_id, 'RAG Introduction', NULL, NULL, 0, true, false),
    (v_chapter_id, 'Retrieval', NULL, NULL, 1, true, false),
    (v_chapter_id, 'Fixed Size Chunking', NULL, NULL, 2, true, false),
    (v_chapter_id, 'Semantic Chunking', NULL, NULL, 3, true, false),
    (v_chapter_id, 'How Vector Database Works', NULL, NULL, 4, true, false);

  -- Section 9
  INSERT INTO public.course_chapters (course_id, title, description, order_index, is_published)
  VALUES (v_course_id, 'RAG in Code', NULL, 8, true)
  RETURNING id INTO v_chapter_id;
  INSERT INTO public.course_lessons (chapter_id, title, description, video_url, order_index, is_published, is_preview) VALUES
    (v_chapter_id, 'Pre-processing', NULL, NULL, 0, true, false),
    (v_chapter_id, 'RAG Coding - Part 1', NULL, NULL, 1, true, false),
    (v_chapter_id, 'RAG Coding - Part 2', NULL, NULL, 2, true, false),
    (v_chapter_id, 'RAG Coding - Part 3', NULL, NULL, 3, true, false),
    (v_chapter_id, 'RAG Coding - Part 4', NULL, NULL, 4, true, false);

  -- Section 10
  INSERT INTO public.course_chapters (course_id, title, description, order_index, is_published)
  VALUES (v_course_id, 'RAG in n8n', NULL, 9, true)
  RETURNING id INTO v_chapter_id;
  INSERT INTO public.course_lessons (chapter_id, title, description, video_url, order_index, is_published, is_preview) VALUES
    (v_chapter_id, 'Revision', NULL, NULL, 0, true, false),
    (v_chapter_id, 'Fetch Files', NULL, NULL, 1, true, false),
    (v_chapter_id, 'Pre-processing', NULL, NULL, 2, true, false),
    (v_chapter_id, 'RAG Agent', NULL, NULL, 3, true, false);

  -- Section 11
  INSERT INTO public.course_chapters (course_id, title, description, order_index, is_published)
  VALUES (v_course_id, 'HR RAG Case', NULL, 10, true)
  RETURNING id INTO v_chapter_id;
  INSERT INTO public.course_lessons (chapter_id, title, description, video_url, order_index, is_published, is_preview) VALUES
    (v_chapter_id, 'Case Introduction', NULL, NULL, 0, true, false),
    (v_chapter_id, 'Revision', NULL, NULL, 1, true, false),
    (v_chapter_id, 'Case Implementation - Part 1', NULL, NULL, 2, true, false),
    (v_chapter_id, 'Case Implementation - Part 2', NULL, NULL, 3, true, false),
    (v_chapter_id, 'Case Implementation - Part 3', NULL, NULL, 4, true, false);

  -- Section 12
  INSERT INTO public.course_chapters (course_id, title, description, order_index, is_published)
  VALUES (v_course_id, 'CrewAI', NULL, 11, true)
  RETURNING id INTO v_chapter_id;
  INSERT INTO public.course_lessons (chapter_id, title, description, video_url, order_index, is_published, is_preview) VALUES
    (v_chapter_id, 'CrewAI Introduction', NULL, NULL, 0, true, false),
    (v_chapter_id, 'Agent', NULL, NULL, 1, true, false),
    (v_chapter_id, 'Task', NULL, NULL, 2, true, false),
    (v_chapter_id, 'Crew', NULL, NULL, 3, true, false),
    (v_chapter_id, 'Tools', NULL, NULL, 4, true, false),
    (v_chapter_id, 'Custom Tools', NULL, NULL, 5, true, false),
    (v_chapter_id, 'Output Style', NULL, NULL, 6, true, false),
    (v_chapter_id, 'Memory', NULL, NULL, 7, true, false);
END $$;
