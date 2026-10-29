'use strict';
/**
 * Repeats the exact UI/API suite, identifies flaky cases, and stores concise
 * failure details alongside each complete test-run log.
 *
 * Usage: node run-regression.js --runs=3 --count=all --pause=70 --prefix=reg
 * Env: CASES_FILE=ui-chatbot-generated.md (optional)
 */
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const arg = (name, fallback) => {
  const value = process.argv.find((item) => item.startsWith(`--${name}=`));
  return value ? value.slice(name.length + 3) : fallback;
};
const RUNS = Number(arg('runs', '3'));
const COUNT = arg('count', 'all') === 'all' ? '100000' : arg('count', 'all');
const PAUSE_S = Number(arg('pause', '70'));
const PREFIX = arg('prefix', 'reg');
const CASES_FILE = process.env.CASES_FILE
  ? path.resolve(process.env.CASES_FILE)
  : path.resolve(__dirname, 'ui-chatbot-50-prompts.md');
const ANSI = /\x1b\[[0-9;]*m/g;

if (!Number.isInteger(RUNS) || RUNS < 1) throw new Error('--runs must be a positive integer.');
if (!/^\d+$/.test(COUNT) || Number(COUNT) < 1) throw new Error('--count must be "all" or a positive integer.');
if (!Number.isFinite(PAUSE_S) || PAUSE_S < 0) throw new Error('--pause must be a non-negative number.');
if (!/^[\w.-]+$/.test(PREFIX)) throw new Error('--prefix may contain only letters, numbers, dot, underscore, and hyphen.');
if (!fs.existsSync(CASES_FILE)) throw new Error(`Cases file not found: ${CASES_FILE}`);

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function runOnce(logFile) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(logFile);
    const child = spawn(process.execPath, ['test-ui-chatbot-20.js', `--count=${COUNT}`], {
      cwd: __dirname,
      env: { ...process.env, CASES_FILE },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    child.stdout.pipe(output, { end: false });
    child.stderr.pipe(output, { end: false });
    child.on('error', (error) => {
      output.end(() => reject(error));
    });
    child.on('close', (code) => {
      output.end(() => resolve(code));
    });
  });
}

function parseSummary(logFile) {
  const text = fs.readFileSync(logFile, 'utf8').replace(ANSI, '');
  const summaryIndex = text.lastIndexOf('FINAL SUMMARY');
  const scores = new Map();
  if (summaryIndex >= 0) {
    for (const line of text.slice(summaryIndex).split('\n')) {
      const match = line.match(/^\s*(\d{2,4})\s+(\d+)%\s+(\d+)\/(\d+)\s+(\S+)\s+(.*)$/);
      if (match) scores.set(Number(match[1]), { score: Number(match[2]), model: match[5], part: match[6].trim() });
    }
  }
  return { text, scores, hasSummary: summaryIndex >= 0 };
}

function extractFailures(text, failingCases) {
  const sections = text.split(/^\s*Case (\d+) │.*$/m);
  const failures = {};
  for (let index = 1; index < sections.length; index += 2) {
    const caseNumber = Number(sections[index]);
    if (!failingCases.has(caseNumber)) continue;
    const lines = sections[index + 1].split('\n').filter((line) =>
      /originalQuery|withheld reason|requestedPart|identityMode|intent\s+:|✘|Expected|Got\s+:|RATE LIMIT|API ERROR/.test(line),
    ).slice(0, 40);
    failures[caseNumber] = lines.map((line) => line.trim());
  }
  return failures;
}

function loadMeta() {
  const metadata = new Map();
  if (!fs.existsSync(CASES_FILE)) return metadata;
  const markdown = fs.readFileSync(CASES_FILE, 'utf8');
  const blocks = markdown.split(/^## Case (\d+)/m);
  for (let index = 1; index < blocks.length; index += 2) {
    const variant = (blocks[index + 1].match(/^Variant:\s*(.+)$/m) || [])[1];
    const designation = (blocks[index + 1].match(/Désignation française[^:]*:\s*(.+)/) || [])[1];
    metadata.set(Number(blocks[index]), {
      variant: variant ? variant.trim().split(' ')[0] : 'n/a',
      designation: (designation ?? '').trim(),
    });
  }
  return metadata;
}

async function main() {
  console.log(`Regression: ${RUNS} run(s), cases file ${CASES_FILE}\n`);
  const results = [];
  const failureNotes = {};
  let incompleteRun = false;

  for (let run = 1; run <= RUNS; run++) {
    const logFile = path.resolve(__dirname, `${PREFIX}-run${run}.log`);
    console.log(`Run ${run}/${RUNS} -> ${path.basename(logFile)} ...`);
    const exitCode = await runOnce(logFile);
    const parsed = parseSummary(logFile);
    results.push(parsed);
    if (!parsed.hasSummary || parsed.scores.size === 0 || exitCode !== 0) incompleteRun = true;
    const failing = new Set([...parsed.scores].filter(([, score]) => score.score < 100).map(([number]) => number));
    const total = parsed.scores.size;
    console.log(parsed.hasSummary
      ? `  ${total - failing.size}/${total} cases at 100%`
      : '  NO SUMMARY (backend down or script crashed): see the log');
    failureNotes[run] = extractFailures(parsed.text, failing);
    if (run < RUNS) {
      console.log(`  waiting ${PAUSE_S}s (VIN rate limit)...`);
      await sleep(PAUSE_S * 1000);
    }
  }

  const metadata = loadMeta();
  const allCases = new Set(results.flatMap((result) => [...result.scores.keys()]));
  const rows = [];
  for (const number of [...allCases].sort((a, b) => a - b)) {
    const perRun = results.map((result) => result.scores.has(number) ? result.scores.get(number).score : null);
    const passes = perRun.filter((score) => score === 100).length;
    const status = passes === RUNS ? 'PASS' : passes === 0 ? 'FAIL' : 'FLAKY';
    const firstResult = results.find((result) => result.scores.has(number));
    rows.push({
      number,
      perRun,
      status,
      variant: metadata.get(number)?.variant ?? 'n/a',
      part: metadata.get(number)?.designation || firstResult.scores.get(number).part,
    });
  }

  const notPassing = rows.filter((row) => row.status !== 'PASS');
  console.log('\n══════ REGRESSION SUMMARY ══════');
  console.log(`Cases: ${rows.length} | PASS: ${rows.filter((row) => row.status === 'PASS').length} | FLAKY: ${rows.filter((row) => row.status === 'FLAKY').length} | FAIL: ${rows.filter((row) => row.status === 'FAIL').length}`);
  for (const row of notPassing) {
    console.log(`  ${String(row.number).padStart(3, '0')} ${row.status.padEnd(5)} [${row.perRun.map((score) => score == null ? '--' : `${score}%`).join(' ')}] ${row.variant.padEnd(9)} ${row.part.slice(0, 55)}`);
  }

  const byVariant = {};
  for (const row of rows) {
    byVariant[row.variant] ??= { count: 0, bad: 0 };
    byVariant[row.variant].count++;
    if (row.status !== 'PASS') byVariant[row.variant].bad++;
  }
  console.log('\nFailure rate by phrasing variant:');
  for (const [variant, tally] of Object.entries(byVariant)) {
    console.log(`  ${variant.padEnd(10)} ${tally.bad}/${tally.count}`);
  }

  const reportFile = path.resolve(__dirname, `${PREFIX}-failures.txt`);
  const report = [];
  for (const row of notPassing) {
    report.push(`=== Case ${row.number} (${row.status}) variant=${row.variant} part="${row.part}"`);
    results.forEach((_, index) => {
      const notes = failureNotes[index + 1]?.[row.number];
      if (notes) report.push(`--- run ${index + 1}`, ...notes);
    });
    report.push('');
  }
  fs.writeFileSync(reportFile, report.join('\n'), 'utf8');
  console.log(`\nFailure details: ${path.basename(reportFile)}`);
  process.exit(notPassing.length > 0 || incompleteRun || rows.length === 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
