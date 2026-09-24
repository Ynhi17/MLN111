import { test, expect } from '@playwright/test'
test('theory, role depth, conclusion and references remain accessible', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/')
  await expect(page.locator('#hero')).toContainText('Học triết học giúp sinh viên xây dựng cách nhìn có cơ sở')
  const foundations = page.locator('#co-so')
  await expect(foundations).toContainText('Thế giới quan — cách nhìn')
  await expect(foundations.locator('details')).toHaveCount(4)
  for (const summary of await foundations.locator('summary').all()) {
    await summary.focus()
    await page.keyboard.press('Enter')
    await expect(summary.locator('..')).toHaveAttribute('open', '')
  }
  await expect(page.locator('#triet-hoc')).toContainText('không phải một phương pháp triết học chính thống')
  for (const button of await page.locator('#sinh-vien > div button').all()) {
    await button.click()
    await expect(page.getByRole('dialog')).toContainText('Vì sao triết học có thể giúp?')
    await expect(page.getByRole('dialog')).toContainText('Thử áp dụng:')
    expect(await page.getByRole('dialog').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
    await page.keyboard.press('Escape')
  }
  await expect(page.locator('#ket-luan')).toContainText('Hành động có trách nhiệm')
  await expect(page.locator('#tai-lieu a')).toHaveCount(3)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
test('all scenario choices provide distinct analysis with four prompts', async ({ page }) => {
  test.setTimeout(60000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const analyses = new Set<string>()
  for (let option = 0; option < 4; option++) {
    await page.goto('/')
    const section = page.locator('#tinh-huong')
    for (let scenario = 0; scenario < 5; scenario++) {
      await section.locator('button[aria-pressed]').nth(option).click()
      await section.getByRole('button', { name: 'XEM PHÂN TÍCH' }).click()
      const feedback = section.locator('[aria-live="polite"]')
      for (const prompt of ['Bạn chú ý đến:', 'Có thể bỏ sót:', 'Cần kiểm tra:', 'Liên hệ triết học:']) await expect(feedback).toContainText(prompt)
      analyses.add(await feedback.innerText())
      await section.getByRole('button', { name: scenario === 4 ? 'HOÀN THÀNH' : 'TÌNH HUỐNG TIẾP THEO →' }).click()
    }
  }
  expect(analyses.size).toBe(20)
})
