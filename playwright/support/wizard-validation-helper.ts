import { expect, Locator, Page } from '@playwright/test';

export const computeNodeUpperLimitError = (max: number): string =>
  `Input cannot be more than ${max}`;

/**
 * Reads the effective max for the quota-bound compute node count field from inline validation.
 */
export async function getComputeNodeCountMax(
  page: Page,
  input: Locator,
  knownMaxValues: number[],
): Promise<number> {
  await input.fill('9999');
  await input.blur();
  const errorLocator = page.getByText(/Input cannot be more than \d+\./);
  await expect(errorLocator).toBeVisible();
  const text = (await errorLocator.textContent()) ?? '';
  const match = text.match(/Input cannot be more than (\d+)\./);
  if (!match) {
    throw new Error(`Could not parse compute node max from: ${text}`);
  }
  const max = Number(match[1]);
  expect(knownMaxValues).toContain(max);
  await input.fill(max.toString());
  await input.blur();
  return max;
}
