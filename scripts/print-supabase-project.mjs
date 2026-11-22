import fs from "node:fs";
const lines = fs.readFileSync(".env", "utf8").split(/\r?\n/);
for (const line of lines) {
  if (!line.startsWith("VITE_SUPABASE_")) continue;
  const i = line.indexOf("=");
  let v = line.slice(i + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
  console.log(line.slice(0, i) + "=" + (line.includes("KEY") ? "***" : v));
}
