/**
 * Innehållskontroll för Läsresan.
 *
 * Körs med `npm run check`. Läser src/lib/texts.ts via esbuild och kontrollerar
 * att alla texter och frågor är kompletta och att rätt svar finns bland
 * alternativen. Avslutar med felkod 1 om något är fel.
 */
import { build } from "esbuild";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const KINDS = ["rad", "mellan", "ord"];
const MIN_WORDS = 80;
const MAX_WORDS = 150;
const MIN_TEXTS = 12;

const errors = [];
const warnings = [];

const dir = await mkdtemp(join(tmpdir(), "lasresan-check-"));
const outfile = join(dir, "texts.mjs");

try {
  await build({
    entryPoints: ["src/lib/texts.ts"],
    bundle: true,
    format: "esm",
    platform: "node",
    outfile,
    logLevel: "silent",
  });

  const { TEXTS } = await import(pathToFileURL(outfile).href);

  if (!Array.isArray(TEXTS) || TEXTS.length < MIN_TEXTS) {
    errors.push(`För få texter: ${TEXTS?.length ?? 0} (krav: minst ${MIN_TEXTS})`);
  }

  const ids = new Set();
  const rows = [];

  for (const [i, text] of TEXTS.entries()) {
    const where = `text ${i + 1} (${text?.id ?? "utan id"})`;

    if (!text.id || !/^[a-z0-9-]+$/.test(text.id)) errors.push(`${where}: id måste vara a–z och bindestreck`);
    if (ids.has(text.id)) errors.push(`${where}: dubbelt id`);
    ids.add(text.id);
    if (!text.title || text.title.trim().length < 3) errors.push(`${where}: saknar titel`);
    if (!text.topic) errors.push(`${where}: saknar ämne`);
    if (![4, 5, 6].includes(text.level)) errors.push(`${where}: nivå måste vara 4, 5 eller 6`);

    if (!Array.isArray(text.body) || text.body.length === 0) {
      errors.push(`${where}: saknar brödtext`);
      continue;
    }
    const words = text.body.join(" ").split(/\s+/).filter(Boolean).length;
    if (words < MIN_WORDS || words > MAX_WORDS) {
      errors.push(`${where}: ${words} ord (krav: ${MIN_WORDS}–${MAX_WORDS})`);
    }
    for (const p of text.body) {
      if (!p.trim()) errors.push(`${where}: tomt stycke`);
      if (!/[.!?»”)]$/.test(p.trim())) warnings.push(`${where}: stycke slutar utan skiljetecken: ”${p.slice(-24)}”`);
    }

    if (!Array.isArray(text.questions) || text.questions.length !== 3) {
      errors.push(`${where}: ${text.questions?.length ?? 0} frågor (krav: exakt 3)`);
      continue;
    }
    if (new Set(text.questions.map((q) => q.kind)).size !== 3) {
      errors.push(`${where}: frågorna måste vara en av varje typ (rad, mellan, ord)`);
    }

    for (const [qi, q] of text.questions.entries()) {
      const qWhere = `${where} fråga ${qi + 1}`;
      if (!KINDS.includes(q.kind)) errors.push(`${qWhere}: okänd typ ”${q.kind}”`);
      if (!q.prompt || q.prompt.trim().length < 8) errors.push(`${qWhere}: för kort frågetext`);
      if (!Array.isArray(q.options) || q.options.length !== 3) {
        errors.push(`${qWhere}: ${q.options?.length ?? 0} alternativ (krav: 3)`);
        continue;
      }
      if (new Set(q.options.map((o) => o.trim())).size !== 3) errors.push(`${qWhere}: dubblerade alternativ`);
      if (q.options.some((o) => !o || !o.trim())) errors.push(`${qWhere}: tomt alternativ`);
      if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct > q.options.length - 1) {
        errors.push(`${qWhere}: correct=${q.correct} pekar utanför alternativen`);
      }
      if (!q.explain || q.explain.trim().length < 20) errors.push(`${qWhere}: förklaring saknas eller är för kort`);
    }

    rows.push({
      id: text.id,
      nivå: text.level,
      ämne: text.topic,
      ord: words,
      frågor: text.questions.length,
      rätt: text.questions.map((q) => "ABC"[q.correct] ?? "?").join(""),
    });
  }

  console.log("Läsresan – innehållskontroll\n");
  console.table(rows);

  const levelCounts = [4, 5, 6].map((lvl) => `${lvl}: ${TEXTS.filter((t) => t.level === lvl).length}`).join("  ·  ");
  const questions = TEXTS.reduce((sum, t) => sum + (t.questions?.length ?? 0), 0);
  const kinds = KINDS.map((k) => `${k}: ${TEXTS.reduce((sum, t) => sum + t.questions.filter((q) => q.kind === k).length, 0)}`).join("  ·  ");
  console.log(`\nTexter: ${TEXTS.length}   Nivåer: ${levelCounts}`);
  console.log(`Frågor: ${questions}   Typer: ${kinds}`);
  console.log(`Ord per text: min ${Math.min(...rows.map((r) => r.ord))}, max ${Math.max(...rows.map((r) => r.ord))}`);

  if (warnings.length) {
    console.log(`\nVarningar (${warnings.length}):`);
    for (const w of warnings) console.log(`  · ${w}`);
  }

  if (errors.length) {
    console.error(`\nFEL (${errors.length}):`);
    for (const e of errors) console.error(`  · ${e}`);
    process.exitCode = 1;
  } else {
    console.log("\n✓ Alla kontroller gick igenom.");
  }
} finally {
  await rm(dir, { recursive: true, force: true });
}