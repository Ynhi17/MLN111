import { test, expect } from '@playwright/test'
import { runnerQuestions } from '../src/data/runnerQuestions'

test('loss persists across reload and only the right answer unlocks restart', async ({ page }) => {
  await page.goto('/')
  const game = page.locator('#tro-choi')
  await game.getByRole('button', { name: 'CHƠI NGAY' }).click()
  await expect(game.getByText('TRẢ LỜI ĐỂ CHƠI TIẾP', { exact: true })).toBeVisible({ timeout: 15000 })
  const pending = await page.evaluate(() => JSON.parse(localStorage.getItem('think-dino-pending')!))
  await page.reload()
  await expect(game.getByRole('heading', { name: pending.question, exact: true })).toBeVisible()
  await expect(game.getByRole('button', { name: 'Chơi lại từ đầu' })).toBeDisabled()
  const options = game.getByRole('group', { name: 'Đáp án câu hỏi triết học' }).getByRole('button')
  const correct = runnerQuestions[pending.index].answer
  await options.nth((correct + 1) % runnerQuestions[pending.index].options.length).click()
  await expect(game.getByRole('button', { name: 'Chơi lại từ đầu' })).toBeDisabled()
  await options.nth(correct).click()
  expect(await page.evaluate(() => localStorage.getItem('think-dino-pending'))).toBeNull()
  await game.getByRole('button', { name: 'Chơi lại từ đầu' }).click()
  await expect(game.getByRole('button', { name: 'NHẢY ↑', exact: true })).toBeEnabled()
})

