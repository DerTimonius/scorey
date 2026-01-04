import { expect, type Page } from '@playwright/test';

export async function checkWinnerMessage(page: Page, message: string) {
  await expect(page.getByTestId('winner-message')).toHaveText(message);
}
