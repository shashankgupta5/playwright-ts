import { test, expect } from '@playwright/test';

test('User plays game and captures final score', async ({ page }) => {
  await page.goto('https://focus-check-lkm-001.web.app/');

  await page.locator('[placeholder="Your Name"]').fill('PW User');
  await page.getByRole('button', { name: 'Start Game' }).click();

  await playGameUntilOver(page);

  const scoreElement = await page.getByText('score').locator('span');
  const score = await scoreElement.textContent();
  console.log(`Final Score: ${score}`);
  await page.screenshot({ path: 'screenshots/final-score.png' });
});

async function playGameUntilOver(page: any): Promise<void> {
  const hitElement = page.locator('li:has-text("HIT") span').first();
  const text = await hitElement.textContent();
  console.log(`Clicking on: ${text}`);
  await page.locator(`p:has-text("${text}")`).first().click();

  const timerElement = page.locator('li:has-text("TIMER") span').first();
  const timeLeftText = await timerElement.textContent();
  const timeLeft = Number(timeLeftText);

  if (timeLeft === 0) {
    console.log('Game Over');
    return;
  } else {
    await playGameUntilOver(page);
  }
}
