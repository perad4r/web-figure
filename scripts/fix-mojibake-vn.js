#!/usr/bin/env node
/**
 * Fix common UTF-8->CP1252 mojibake (e.g. "MÃ´ hÃ¬nh" -> "Mô hình")
 * in text files that accidentally got double-encoded.
 */
const fs = require("fs");
const path = require("path");

const cp1252Extra = new Map([
  ["€", 0x80],
  ["‚", 0x82],
  ["ƒ", 0x83],
  ["„", 0x84],
  ["…", 0x85],
  ["†", 0x86],
  ["‡", 0x87],
  ["ˆ", 0x88],
  ["‰", 0x89],
  ["Š", 0x8a],
  ["‹", 0x8b],
  ["Œ", 0x8c],
  ["Ž", 0x8e],
  ["‘", 0x91],
  ["’", 0x92],
  ["“", 0x93],
  ["”", 0x94],
  ["•", 0x95],
  ["–", 0x96],
  ["—", 0x97],
  ["˜", 0x98],
  ["™", 0x99],
  ["š", 0x9a],
  ["›", 0x9b],
  ["œ", 0x9c],
  ["ž", 0x9e],
  ["Ÿ", 0x9f],
]);

function decodeCp1252AsUtf8(input) {
  const bytes = [];
  for (const ch of input) {
    const code = ch.codePointAt(0);
    if (code <= 0xff) {
      bytes.push(code);
      continue;
    }
    const mapped = cp1252Extra.get(ch);
    if (mapped != null) {
      bytes.push(mapped);
      continue;
    }
    // Keep unicode chars that cannot be represented in CP1252.
    // Encode them as UTF-8 bytes directly.
    const utf8 = Buffer.from(ch, "utf8");
    for (const b of utf8) bytes.push(b);
  }
  return Buffer.from(bytes).toString("utf8");
}

function mojibakeScore(s) {
  // Rough heuristic: count common mojibake markers.
  const matches = s.match(/Ã|Â|Ä|Æ|Ð|Ø|Þ|Ý|áº|á»|â€|â€™|â€œ|â€|â†’|Ä‘/g);
  return matches ? matches.length : 0;
}

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
}

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return [".html", ".ejs", ".md", ".txt", ".js", ".css"].includes(ext);
}

function main() {
  const roots = process.argv.slice(2);
  if (roots.length === 0) {
    console.error("Usage: node scripts/fix-mojibake-vn.js <dir-or-file> [...]");
    process.exit(2);
  }

  const files = [];
  for (const root of roots) {
    const p = path.resolve(root);
    if (!fs.existsSync(p)) continue;
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p, files);
    else files.push(p);
  }

  let changed = 0;
  for (const filePath of files) {
    if (!shouldProcessFile(filePath)) continue;
    let raw;
    try {
      raw = fs.readFileSync(filePath, "utf8");
    } catch {
      continue;
    }

    const before = mojibakeScore(raw);
    if (before === 0) continue;

    const fixed = decodeCp1252AsUtf8(raw);
    const after = mojibakeScore(fixed);
    if (after >= before) continue;

    fs.writeFileSync(filePath, fixed, "utf8");
    changed++;
    console.log(`fixed: ${path.relative(process.cwd(), filePath)} (${before} -> ${after})`);
  }

  console.log(`done. changed ${changed} file(s).`);
}

main();

