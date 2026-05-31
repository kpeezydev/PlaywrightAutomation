import { type FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

async function globalSetup(config: FullConfig): Promise<void> {
  const allureResultsDir = path.resolve(__dirname, 'allure-results');
  if (!fs.existsSync(allureResultsDir)) {
    fs.mkdirSync(allureResultsDir, { recursive: true });
  }

  const properties = [
    `OS=${os.type()} ${os.release()}`,
    `OS.Platform=${os.platform()}`,
    `Browser=${config.projects.map((p) => p.name).join(', ')}`,
    ...(process.env.CI
      ? [
          `CI_URL=${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
          `CI.RUN_ID=${process.env.GITHUB_RUN_ID}`,
          `CI.BRANCH=${process.env.GITHUB_REF_NAME}`,
        ]
      : []),
    '',
  ];

  fs.writeFileSync(path.join(allureResultsDir, 'environment.properties'), properties.join('\n'));
}

export default globalSetup;
