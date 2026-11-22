import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv(path) {
  const out = {};
  for (const line of fs.readFileSync(path, "utf8").split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 0) continue;
    let v = line.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[line.slice(0, i).trim()] = v;
  }
  return out;
}

function nameFromEmail(email) {
  const local = email.split("@")[0] || email;
  return local.replace(/[._+-]+/g, " ").replace(/\s+/g, " ").trim() || email;
}

const env = loadEnv(".env");
const url = env.VITE_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) {
  console.error("Missing Supabase URL/key in .env");
  process.exit(1);
}

const usingServiceRole = Boolean(env.SUPABASE_SERVICE_ROLE_KEY);
console.log(usingServiceRole ? "Using service role key" : "Using publishable key (RLS may block inserts)");

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const emails = JSON.parse(fs.readFileSync("scripts/agentic-access-emails.json", "utf8"));

const { data: courses, error: courseError } = await supabase
  .from("paid_courses")
  .select("id, title, slug")
  .or("slug.eq.agentic-ai-engineering,title.ilike.%Agentic AI Engineering%");

if (courseError) {
  console.error("Course lookup failed:", courseError.message);
  process.exit(1);
}

const course =
  courses?.find((c) => c.slug === "agentic-ai-engineering") || courses?.[0] || null;

if (!course) {
  console.error("Agentic course not found in paid_courses");
  process.exit(1);
}

console.log(`Course: ${course.title} (${course.id})`);
console.log(`Students to grant: ${emails.length}`);

const chunkSize = 100;
let upserted = 0;
let accessGranted = 0;
let failed = 0;

for (let i = 0; i < emails.length; i += chunkSize) {
  const chunk = emails.slice(i, i + chunkSize);
  const rows = chunk.map((email) => ({
    email,
    full_name: nameFromEmail(email),
    is_active: true,
    added_by: "bulk",
  }));

  const { data: students, error: upsertError } = await supabase
    .from("course_students")
    .upsert(rows, { onConflict: "email" })
    .select("id, email");

  if (upsertError) {
    console.error(`Upsert failed at ${i}:`, upsertError.message);
    failed += chunk.length;
    continue;
  }

  upserted += students?.length || 0;
  const accessRows = (students || []).map((s) => ({
    student_id: s.id,
    course_id: course.id,
  }));

  const { error: accessError, count } = await supabase
    .from("course_student_access")
    .upsert(accessRows, { onConflict: "student_id,course_id", count: "exact" });

  if (accessError) {
    console.error(`Access grant failed at ${i}:`, accessError.message);
    failed += chunk.length;
    continue;
  }

  accessGranted += accessRows.length;
  console.log(`Progress ${Math.min(i + chunkSize, emails.length)}/${emails.length}`);
}

console.log(
  JSON.stringify(
    {
      courseId: course.id,
      emails: emails.length,
      upserted,
      accessGranted,
      failed,
      usingServiceRole,
    },
    null,
    2,
  ),
);

if (!usingServiceRole && failed > 0) {
  console.log("\nRLS blocked inserts. Run scripts/grant-agentic-access.sql in Supabase SQL Editor.");
  process.exit(2);
}
