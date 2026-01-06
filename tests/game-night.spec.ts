import { expect, test } from '@playwright/test';
import { checkWinnerMessage } from './utils';

test('game night mode selection', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('single-game-mode')).toBeVisible();
  await expect(page.getByTestId('game-night-mode')).toBeVisible();

  await page.getByTestId('game-night-mode').click();
  await expect(page.getByTestId('game-night-form')).toBeVisible();

  await page.getByTestId('player-name-input-1').fill('Alice');
  await page.getByTestId('player-color-select-1').click();
  await page.getByTestId('player-color-red-1').click();

  await page.getByTestId('add-player-button').click();
  await page.getByTestId('player-name-input-2').fill('Bob');
  await page.getByTestId('player-color-select-2').click();
  await page.getByTestId('player-color-blue-2').click();

  await page.getByTestId('add-player-button').click();
  await page.getByTestId('player-name-input-3').fill('Charlie');
  await page.getByTestId('player-color-select-3').click();
  await page.getByTestId('player-color-green-3').click();

  await page.getByTestId('winner-only-scoring').click();

  await page.getByTestId('start-game-night-button').click();

  await expect(page.getByTestId('game-night-game-form')).toBeVisible();
  await expect(page.getByTestId('game-name-input')).toBeVisible();

  await page.getByTestId('game-name-input').fill('Game 1');
  await page.getByTestId('create-game-night-game-button').click();

  await expect(page.locator('h1')).toHaveText('Game 1');
  await expect(page.getByTestId(/^player-card/)).toHaveCount(3);
});

test('play two games in game night and see stats', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('game-night-mode').click();

  await page.getByTestId('player-name-input-1').fill('Alice');
  await page.getByTestId('player-color-select-1').click();
  await page.getByTestId('player-color-red-1').click();

  await page.getByTestId('add-player-button').click();
  await page.getByTestId('player-name-input-2').fill('Bob');
  await page.getByTestId('player-color-select-2').click();
  await page.getByTestId('player-color-blue-2').click();

  await page.getByTestId('ranked-scoring').click();

  await page.getByTestId('start-game-night-button').click();

  await page.getByTestId('game-name-input').fill('Game 1');
  await page.getByTestId('create-game-night-game-button').click();

  await page.getByTestId('plus-button-Alice').click();
  await page.getByTestId('score-input').fill('10');
  await page.keyboard.press('Enter');

  await page.getByTestId('plus-button-Bob').click();
  await page.getByTestId('score-input').fill('8');
  await page.keyboard.press('Enter');

  await page.getByTestId('finish-game-button').click();
  await page.getByTestId('confirm-finish-game').click();

  await checkWinnerMessage(page, 'And the winner with 10 points is Alice');
  await page.getByTestId('next-game-button').click();
  await page.getByTestId('confirm-next-game').click();

  await page.getByTestId('game-name-input').fill('Game 2');
  await page.getByTestId('create-game-night-game-button').click();

  await page.getByTestId('plus-button-Alice').click();
  await page.getByTestId('score-input').fill('5');
  await page.keyboard.press('Enter');

  await page.getByTestId('plus-button-Bob').click();
  await page.getByTestId('score-input').fill('12');
  await page.keyboard.press('Enter');

  await page.getByTestId('finish-game-button').click();
  await page.getByTestId('confirm-finish-game').click();

  await expect(page.getByTestId('game-night-stats')).toBeVisible();
  await expect(page.getByTestId('game-night-title')).toHaveText(
    'Game Night Rankings',
  );
});

test('finish game night and see overview with chart', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('game-night-mode').click();

  await page.getByTestId('player-name-input-1').fill('Alice');
  await page.getByTestId('player-color-select-1').click();
  await page.getByTestId('player-color-red-1').click();

  await page.getByTestId('add-player-button').click();
  await page.getByTestId('player-name-input-2').fill('Bob');
  await page.getByTestId('player-color-select-2').click();
  await page.getByTestId('player-color-blue-2').click();

  await page.getByTestId('game-points-scoring').click();

  await page.getByTestId('start-game-night-button').click();

  await page.getByTestId('game-name-input').fill('Game 1');
  await page.getByTestId('create-game-night-game-button').click();

  await page.getByTestId('plus-button-Alice').click();
  await page.getByTestId('score-input').fill('15');
  await page.keyboard.press('Enter');

  await page.getByTestId('plus-button-Bob').click();
  await page.getByTestId('score-input').fill('20');
  await page.keyboard.press('Enter');

  await page.getByTestId('finish-game-button').click();
  await page.getByTestId('confirm-finish-game').click();

  await page.getByTestId('finish-game-night-button').click();
  await page.getByTestId('confirm-finish-game-night').click();

  await expect(page.getByTestId('game-night-overview')).toBeVisible();
  await checkWinnerMessage(page, 'And the winner with 20 points is Bob');
  await expect(page.getByTestId('game-night-title')).toHaveText(
    'Game Night Rankings',
  );
  await expect(page.getByTestId('new-game-night-button')).toBeVisible();
});

test('game night with winner-only scoring', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('game-night-mode').click();

  await page.getByTestId('player-name-input-1').fill('Alice');
  await page.getByTestId('player-color-select-1').click();
  await page.getByTestId('player-color-red-1').click();

  await page.getByTestId('add-player-button').click();
  await page.getByTestId('player-name-input-2').fill('Bob');
  await page.getByTestId('player-color-select-2').click();
  await page.getByTestId('player-color-blue-2').click();

  await page.getByTestId('add-player-button').click();
  await page.getByTestId('player-name-input-3').fill('Charlie');
  await page.getByTestId('player-color-select-3').click();
  await page.getByTestId('player-color-green-3').click();

  await page.getByTestId('winner-only-scoring').click();

  await page.getByTestId('start-game-night-button').click();

  await page.getByTestId('game-name-input').fill('Game 1');
  await page.getByTestId('create-game-night-game-button').click();

  await page.getByTestId('plus-button-Alice').click();
  await page.getByTestId('score-input').fill('10');
  await page.keyboard.press('Enter');

  await page.getByTestId('plus-button-Bob').click();
  await page.getByTestId('score-input').fill('8');
  await page.keyboard.press('Enter');

  await page.getByTestId('plus-button-Charlie').click();
  await page.getByTestId('score-input').fill('6');
  await page.keyboard.press('Enter');

  await page.getByTestId('finish-game-button').click();
  await page.getByTestId('confirm-finish-game').click();

  await page.getByTestId('finish-game-night-button').click();
  await page.getByTestId('confirm-finish-game-night').click();

  await expect(page.getByTestId('game-night-overview')).toBeVisible();
  await checkWinnerMessage(page, 'And the winner with 1 points is Alice');
});
