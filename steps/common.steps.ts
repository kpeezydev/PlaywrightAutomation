import { createBdd } from 'playwright-bdd';
import { test } from './bdd-test';

const { BeforeAll, AfterAll } = createBdd(test);

BeforeAll(async () => {
  // Global setup before all BDD scenarios
});

AfterAll(async () => {
  // Global teardown after all BDD scenarios
});
