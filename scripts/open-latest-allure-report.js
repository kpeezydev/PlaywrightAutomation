const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const dirs = fs
  .readdirSync(cwd)
  .filter((d) => d.startsWith('report_') && fs.statSync(path.join(cwd, d)).isDirectory())
  .sort()
  .reverse();

if (dirs.length === 0) {
  console.error('No report_* directories found. Run npm run allure:generate first.');
  process.exit(1);
}

const latest = path.join(cwd, dirs[0]);
console.log(`Opening: ${latest}`);
execSync(`allure open "${latest}"`, { stdio: 'inherit', cwd });
