#!/usr/bin/env node
/**
 * Fix common Vietnamese mojibake caused by encoding mistakes.
 *
 * Handles:
 * - UTF-8 bytes misread as CP1252/Latin-1 (e.g. "Báº£ng Ä‘iá»u khiá»ƒn" -> "Bảng điều khiển")
 * - double-encoded UTF-8 (e.g. "MÃƒÂ´ hÃƒÂ¬nh" -> "MÃ´ hÃ¬nh")
 */
const fs = require("fs");
const path = require("path");

const cp1252Extra = new Map([
  ["â‚¬", 0x80],
  ["â€š", 0x82],
  ["Æ’", 0x83],
  ["â€ž", 0x84],
  ["â€¦", 0x85],
  ["â€ ", 0x86],
  ["â€¡", 0x87],
  ["Ë†", 0x88],
  ["â€°", 0x89],
  ["Å ", 0x8a],
  ["â€¹", 0x8b],
  ["Å’", 0x8c],
  ["Å½", 0x8e],
  ["â€˜", 0x91],
  ["â€™", 0x92],
  ["â€œ", 0x93],
  ["â€", 0x94],
  ["â€¢", 0x95],
  ["â€“", 0x96],
  ["â€”", 0x97],
  ["Ëœ", 0x98],
  ["â„¢", 0x99],
  ["Å¡", 0x9a],
  ["â€º", 0x9b],
  ["Å“", 0x9c],
  ["Å¾", 0x9e],
  ["Å¸", 0x9f],
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
    const utf8 = Buffer.from(ch, "utf8");
    for (const b of utf8) bytes.push(b);
  }
  return Buffer.from(bytes).toString("utf8");
}

function mojibakeScore(s) {
  // Heuristic: these sequences almost never appear in correctly-encoded Vietnamese UI.
  // - "Ã"/"Â"/"Ä"/"Æ" are common when UTF-8 was mis-decoded as CP1252
  // - "áº"/"á»" show up a LOT in Vietnamese mojibake ("Báº£ng", "Ä‘iá»u", ...)
  const matches = s.match(/Ã|Â|Ä|Æ|áº|á»/g);
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

