import { expect, test } from '@playwright/test';

test('basic info', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Scorey');
  await expect(page.locator('h1')).toHaveText('Scorey');
  await expect(page.getByTestId('tagline')).toBeVisible();
  await expect(page.getByTestId('start-game-button')).toBeVisible();
  await expect(page.getByTestId('start-game-button')).toBeEnabled();
});

test('basic game creation and flow', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('start-game-button').click();
  await expect(page.getByTestId('game-form')).toBeVisible();

  await page.getByTestId('game-name-input').fill('Everdell');

  await page.getByTestId('player-name-input-1').fill('Jane');
  await page.getByTestId('add-player-button').click();
  await page.getByTestId('player-name-input-2').fill('John');

  await page.getByTestId('create-game-button').click();

  await expect(page.getByTestId('game-form')).not.toBeVisible();

  await expect(page.locator('h1')).toHaveText('Everdell');
  await expect(page.getByTestId('enforce-rounds-switch')).toBeChecked();
  await expect(page.getByTestId('show-stats-switch')).toBeChecked();
  await expect(page.getByTestId(/^player-card/)).toHaveCount(2);
  await expect(page.getByTestId(/player-chart/)).not.toBeVisible();

  await page.getByTestId('plus-button-John').click();
  await page.getByTestId('score-input').fill('25');
  await page.keyboard.press('Enter');

  await expect(page.getByTestId('plus-button-John')).toBeDisabled();
  await expect(page.getByTestId('player-chart-John')).toBeVisible();

  await page.getByTestId('plus-button-Jane').click();
  await page.getByTestId('score-input').fill('28');
  await page.keyboard.press('Enter');

  await page.getByTestId('reset-game-button').click();
  await expect(page.getByTestId('reset-game-dialog')).toBeVisible();
  await page.getByTestId('cancel-reset-game').click();

  await page.getByTestId('finish-game-button').click();
  await expect(page.getByTestId('finish-game-dialog')).toBeVisible();
  await page.getByTestId('confirm-finish-game').click();

  await expect(page.getByTestId('winner-message')).toHaveText(
    'And the winner is Jane with 28 points!',
  );
  await expect(page.getByTestId('game-chart')).toBeVisible();
  await expect(page.getByTestId(/^player-chart/)).toHaveCount(2);

  await page.getByTestId('new-game-button').click();
  await expect(page.getByTestId('new-game-dialog')).toBeVisible();

  // start new round
  await page.getByTestId('confirm-new-round').click();
  await expect(page.getByTestId(/^player-card/)).toHaveCount(2);
  await expect(page.getByTestId(/player-chart/)).not.toBeVisible();
  await page.getByTestId('finish-game-button').click();
  await page.getByTestId('confirm-finish-game').click();
  await page.getByTestId('new-game-button').click();
  await expect(page.getByTestId('new-game-dialog')).toBeVisible();

  // start different game with same players
  await page.getByTestId('confirm-keep-players').click();
  await expect(page.getByTestId('player-name-input-1')).toHaveValue('Jane');
  await expect(page.getByTestId('player-name-input-2')).toHaveValue('John');
});
