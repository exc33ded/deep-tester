import { expect, test } from '@playwright/test';

const baseUrl = process.env.DEMO_URL || 'http://127.0.0.1:8081';

test('a user can create a task and see it on the board', async ({ page }) => {
  await page.goto(`${baseUrl}/#/board`);
  await page.getByLabel('New task').fill('Plan deep-tester demo');
  await page.getByRole('button', { name: 'Add task' }).click();
  await expect(page.getByText('Plan deep-tester demo')).toBeVisible();
});
