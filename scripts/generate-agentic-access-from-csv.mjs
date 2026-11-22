import fs from "node:fs";

const csvPath = process.argv[2] || "C:/Users/nabil/Downloads/agentic-course.csv";
const outSql = process.argv[3] || "scripts/grant-agentic-access-from-csv.sql";
const outJson = process.argv[4] || "scripts/agentic-access-emails-from-csv.json";

const text = fs.readFileSync(csvPath, "utf8");
const lines = text.split(/\r?\n/).filter((line) => line.trim());

const emails = [];
for (const line of lines) {
  if (!line.includes("@")) continue;
  if (/^email address,/i.test(line)) continue;
  if (/^members for group/i.test(line)) continue;
  const first = line.split(",")[0]?.trim().toLowerCase() || "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(first)) continue;
  emails.push(first);
}

const unique = [...new Set(emails)];

function esc(value) {
  return value.replace(/'/g, "''");
}

function nameFromEmail(email) {
  const local = email.split("@")[0] || email;
  return local.replace(/[._+-]+/g, " ").replace(/\s+/g, " ").trim() || email;
}

const studentValues = unique
  .map((email) => `('${esc(email)}', '${esc(nameFromEmail(email))}', true, 'bulk')`)
  .join(",\n  ");

const emailArray = unique.map((email) => `'${esc(email)}'`).join(",\n    ");

const sql = `-- Grant Agentic course access from CSV (${unique.length} emails)
-- Source: ${csvPath}
-- Paste into Supabase → SQL Editor → Run

DO $$
DECLARE
  v_course_id uuid;
  v_inserted int;
BEGIN
  SELECT id INTO v_course_id
  FROM public.paid_courses
  WHERE slug = 'agentic-ai-engineering'
     OR title ILIKE '%Agentic AI Engineering%'
  ORDER BY CASE WHEN slug = 'agentic-ai-engineering' THEN 0 ELSE 1 END
  LIMIT 1;

  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'Agentic paid course not found. Create/link it in admin first.';
  END IF;

  INSERT INTO public.course_students (email, full_name, is_active, added_by)
  VALUES
  ${studentValues}
  ON CONFLICT (email) DO UPDATE
    SET is_active = true;

  INSERT INTO public.course_student_access (student_id, course_id)
  SELECT s.id, v_course_id
  FROM public.course_students s
  WHERE s.email = ANY(ARRAY[
    ${emailArray}
  ]::text[])
  ON CONFLICT (student_id, course_id) DO NOTHING;

  GET DIAGNOSTICS v_inserted = ROW_COUNT;
  RAISE NOTICE 'Agentic access ready for % emails on course % (new access rows this run: %)', ${unique.length}, v_course_id, v_inserted;
END
$$;
`;

fs.mkdirSync("scripts", { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(unique, null, 2));
fs.writeFileSync(outSql, sql);
console.log(`emails=${unique.length}`);
console.log(`sql=${outSql}`);
console.log(`json=${outJson}`);
