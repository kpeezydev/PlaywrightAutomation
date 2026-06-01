const { execSync } = require('child_process');
const path = require('path');

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

const reportDir = `report_${timestamp}`;
const fullPath = path.resolve(reportDir);

execSync(`allure generate allure-results --clean -o "${fullPath}"`, { stdio: 'inherit', cwd: process.cwd() });
console.log(`\nReport generated at: ${fullPath}`);
