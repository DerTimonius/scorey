import { expect, test } from '@playwright/test';

test('color changes', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('global-color-select').click();
  await page.getByTestId('global-color-purple').click();
  await expect(page.locator('nav')).toContainClass('bg-purple-main');

  await page.getByTestId('single-game-mode').click();

  await page.getByTestId('game-name-input').fill('Qwirkle');
  await page.getByTestId('player-name-input-1').fill('Jane');
  await page.getByTestId('player-color-select-1').click();
  await page.getByTestId('player-color-amber-1').click();
  await page.getByTestId('add-player-button').click();
  await page.getByTestId('player-name-input-2').fill('John');
  await page.getByTestId('player-color-select-2').click();
  await page.getByTestId('player-color-sky-2').click();

  await page.getByTestId('create-game-button').click();

  await expect(page.getByTestId('player-card-Jane')).toContainClass(
    'bg-amber-background',
  );
  await expect(page.getByTestId('player-card-John')).toContainClass(
    'bg-sky-background',
  );

  await page.getByTestId('finish-game-button').click();
  await expect(page.getByTestId('finish-game-dialog')).toBeVisible();
  await page.getByTestId('confirm-finish-game').click();

  await expect(page.getByTestId('game-stats-card')).toContainClass(
    'bg-purple-background',
  );
  await page.getByTestId('global-color-select').click();
  await page.getByTestId('global-color-lime').click();
  await expect(page.locator('nav')).toContainClass('bg-lime-main');
  await expect(page.getByTestId('game-stats-card')).toContainClass(
    'bg-lime-background',
  );
});
