import fs from "node:fs";

const emails = JSON.parse(fs.readFileSync("scripts/agentic-access-emails.json", "utf8"));
const batches = [];
for (let i = 0; i < emails.length; i += 10) {
  batches.push(emails.slice(i, i + 10));
}

let multiline = "";
batches.forEach((batch, idx) => {
  multiline += `=== Batch ${idx + 1} (${batch.length}) ===\n${batch.join(",\n")}\n\n`;
});

const oneline = batches
  .map((batch, idx) => `# Batch ${idx + 1}\n${batch.join(",")}`)
  .join("\n\n");

fs.writeFileSync("scripts/agentic-emails-batches-10.txt", multiline);
fs.writeFileSync("scripts/agentic-emails-batches-10-oneline.txt", `${oneline}\n`);
console.log(`emails=${emails.length} batches=${batches.length}`);
