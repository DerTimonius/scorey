import { expect, test } from '@playwright/test';

test('game creation with endsAtRound option and flow', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('start-game-button').click();
  await page.getByTestId('game-name-input').fill('Unknown');
  await page.getByTestId('player-name-input-1').fill('Jane');
  await page.getByTestId('add-player-button').click();
  await page.getByTestId('player-name-input-2').fill('John');

  await page.getByTestId('start-value-input').fill('100');
  await page.getByTestId('min-number-win').click();
  await page.getByTestId('ends-at-round-checkbox').check();
  await page.getByTestId('ends-at-round-input').fill('10');

  await page.getByTestId('create-game-button').click();

  for (let i = 0; i < 9; i++) {
    await page.getByTestId('plus-button-Jane').click();
    await page
      .getByTestId('score-input')
      .fill(Math.floor(Math.random() * 50 + 25).toString());
    await page.keyboard.press('Enter');

    await page.getByTestId('plus-button-John').click();
    await page
      .getByTestId('score-input')
      .fill(Math.floor(Math.random() * 50 + 25).toString());
    await page.keyboard.press('Enter');
  }

  await expect(page.getByTestId('game-chart')).not.toBeVisible();

  await page.getByTestId('plus-button-Jane').click();
  await page
    .getByTestId('score-input')
    .fill(Math.floor(Math.random() * 50 + 25).toString());
  await page.keyboard.press('Enter');

  await page.getByTestId('plus-button-John').click();
  await page
    .getByTestId('score-input')
    .fill(Math.floor(Math.random() * 50 + 25).toString());
  await page.keyboard.press('Enter');

  await expect(page.getByTestId('game-chart')).toBeVisible();
});

test.describe('endsAtScore option', () => {
  test('without canFinishRound option', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('start-game-button').click();
    await page.getByTestId('game-name-input').fill('Flip 7');
    await page.getByTestId('player-name-input-1').fill('Jane');
    await page.getByTestId('add-player-button').click();
    await page.getByTestId('player-name-input-2').fill('John');

    await page.getByTestId('ends-at-score-checkbox').check();
    await page.getByTestId('ends-at-score-input').fill('200');
    await page.getByTestId('ends-at-same-round-checkbox').uncheck();

    await page.getByTestId('create-game-button').click();

    for (let i = 0; i < 9; i++) {
      await page.getByTestId('plus-button-Jane').click();
      await page.getByTestId('score-input').fill('18');
      await page.keyboard.press('Enter');

      await page.getByTestId('plus-button-John').click();
      await page.getByTestId('score-input').fill('20');
      await page.keyboard.press('Enter');
    }

    await expect(page.getByTestId('game-chart')).not.toBeVisible();

    await page.getByTestId('plus-button-John').click();
    await page.getByTestId('score-input').fill('25');
    await page.keyboard.press('Enter');

    await expect(page.getByTestId('game-chart')).toBeVisible();
  });

  test('with canFinishRound option', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('start-game-button').click();
    await page.getByTestId('game-name-input').fill('Flip 7');
    await page.getByTestId('player-name-input-1').fill('Jane');
    await page.getByTestId('add-player-button').click();
    await page.getByTestId('player-name-input-2').fill('John');

    await page.getByTestId('ends-at-score-checkbox').check();
    await page.getByTestId('ends-at-score-input').fill('200');
    await page.getByTestId('ends-at-same-round-checkbox').check();

    await page.getByTestId('create-game-button').click();

    for (let i = 0; i < 9; i++) {
      await page.getByTestId('plus-button-Jane').click();
      await page.getByTestId('score-input').fill('18');
      await page.keyboard.press('Enter');

      await page.getByTestId('plus-button-John').click();
      await page.getByTestId('score-input').fill('20');
      await page.keyboard.press('Enter');
    }

    await page.getByTestId('plus-button-John').click();
    await page.getByTestId('score-input').fill('25');
    await page.keyboard.press('Enter');

    await expect(page.getByTestId('game-chart')).not.toBeVisible();

    await page.getByTestId('plus-button-Jane').click();
    await page.getByTestId('score-input').fill('25');
    await page.keyboard.press('Enter');

    await expect(page.getByTestId('game-chart')).toBeVisible();
  });
});
