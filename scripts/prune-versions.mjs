// Scrubs docs versions beyond the retention limit.
//
// The site keeps the newest versions listed in versions.json (newest first);
// everything past the limit is removed: the versioned_docs/version-X tree,
// the versioned_sidebars sidebar file, and the versions.json entry. Blog
// posts that pin links to a scrubbed version must be repointed to a
// surviving one — the docusaurus build fails on the broken links otherwise.
//
// Usage: node scripts/prune-versions.mjs [max-versions]
// Run via `make prune-versions` (also invoked by generate-version).
import fs from "node:fs";
import path from "node:path";

const max = Number(process.argv[2] ?? 5);
if (!Number.isInteger(max) || max < 1) {
	throw new Error(`invalid max-versions: ${process.argv[2]}`);
}

const versionsFile = "versions.json";
const versions = JSON.parse(fs.readFileSync(versionsFile, "utf8"));
const scrubbed = versions.slice(max);
if (scrubbed.length === 0) {
	console.log(`${versionsFile}: ${versions.length} version(s), nothing to prune`);
	process.exit(0);
}

for (const ver of scrubbed) {
	fs.rmSync(path.join("versioned_docs", `version-${ver}`), { recursive: true, force: true });
	fs.rmSync(path.join("versioned_sidebars", `version-${ver}-sidebars.json`), { force: true });
	console.log(`scrubbed version ${ver}`);
}
fs.writeFileSync(versionsFile, JSON.stringify(versions.slice(0, max), null, 2) + "\n");
