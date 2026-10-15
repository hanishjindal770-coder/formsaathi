import { loadExamFiles } from "../lib/exams/load";

const { exams, issues } = loadExamFiles();
if (issues.length) {
  console.error(`✗ ${issues.length} problem(s) in data/exams:`);
  for (const i of issues) console.error(`  ${i.file}: ${i.message}`);
  process.exit(1);
}
const unverified = exams.filter((e) => !e.verified).length;
console.log(`✓ ${exams.length} exam files valid (${unverified} not yet verified against official notifications)`);
