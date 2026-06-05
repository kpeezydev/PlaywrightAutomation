const fs = require('fs');
const path = require('path');
const allure = require('allure-commandline');

async function main() {
  const historyDir = path.resolve('allure-history');
  const resultsDir = path.resolve('allure-results');

  // Restore history from previous run for trend charts
  if (fs.existsSync(historyDir)) {
    const historyFiles = fs.readdirSync(historyDir);
    for (const file of historyFiles) {
      const src = path.join(historyDir, file);
      const dst = path.join(resultsDir, file);
      if (fs.statSync(src).isFile()) {
        fs.cpSync(src, dst);
      }
    }
    console.log(`Restored ${historyFiles.length} history file(s) from allure-history/`);
  }

  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

  const reportDir = `report_${timestamp}`;
  const fullPath = path.resolve(reportDir);

  const exitCode = await new Promise((resolve) => {
    const generation = allure(['generate', 'allure-results', '--clean', '-o', fullPath]);
    generation.on('exit', (code) => resolve(code));
  });

  if (exitCode !== 0) {
    process.exit(exitCode);
  }

  console.log(`\nReport is generated at: ${fullPath}`);

  // Save history for next run
  const reportHistoryDir = path.join(fullPath, 'history');
  if (fs.existsSync(reportHistoryDir)) {
    if (!fs.existsSync(historyDir)) {
      fs.mkdirSync(historyDir, { recursive: true });
    }
    const historyFiles = fs.readdirSync(reportHistoryDir);
    for (const file of historyFiles) {
      const src = path.join(reportHistoryDir, file);
      const dst = path.join(historyDir, file);
      if (fs.statSync(src).isFile()) {
        fs.cpSync(src, dst);
      }
    }
    console.log(`Saved ${historyFiles.length} history file(s) to allure-history/ for next run`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

