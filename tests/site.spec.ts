import { test, expect } from '@playwright/test'
for (const width of [320, 375, 430, 768, 1024, 1280, 1440]) {
  test(`layout and navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if ((message.type() === 'error' || message.type() === 'warning')) errors.push(message.text()) })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator('h1')).toContainText('CHÚNG TA HỌC')
    for (const section of await page.locator('section').all()) {
      await section.scrollIntoViewIfNeeded()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    }
    if (width < 1024) {
      await page.getByRole('button', { name: 'Mở menu' }).click()
      await page.locator('#mobile-menu').getByRole('button', { name: 'Triết học', exact: true }).click()
      await expect(page.locator('#mobile-menu')).toHaveCount(0)
    }
    await page.getByRole('button', { name: 'KHÁM PHÁ →', exact: true }).click()
    await expect.poll(() => page.locator('#co-so').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBeLessThan(100)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    await page.screenshot({ path: `test-results/layout-${width}.png`, fullPage: true })
    expect(errors).toEqual([])
  })
}
test('quiz completion and restart, scenarios and modal', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  const quiz = page.locator('#quiz')
  await expect(quiz.getByRole('button', { name: 'TIẾP THEO →' })).toBeDisabled()
  for (let i = 0; i < 3; i++) {
    await quiz.locator('.quiz-option').first().click()
    await quiz.getByRole('button', { name: i === 2 ? 'XEM KẾT QUẢ' : 'TIẾP THEO →' }).click()
  }
  await expect(quiz.getByRole('heading', { name: 'Đã hoàn thành 3 câu hỏi!' })).toBeVisible()
  await quiz.getByRole('button', { name: 'LÀM LẠI' }).click()
  await expect(quiz.getByRole('button', { name: 'TIẾP THEO →' })).toBeDisabled()
  const scenarios = page.locator('#tinh-huong')
  for (let i = 0; i < 5; i++) {
    await scenarios.getByRole('button').first().click()
    await scenarios.getByRole('button', { name: 'XEM PHÂN TÍCH' }).click()
    await scenarios.getByRole('button', { name: i === 4 ? 'HOÀN THÀNH' : 'TÌNH HUỐNG TIẾP THEO →' }).click()
  }
  await expect(scenarios.getByText('Bạn đã hoàn thành 5 tình huống.')).toBeVisible()
  await scenarios.getByRole('button', { name: 'THỬ LẠI' }).click()
  for (const section of ['#triet-hoc', '#sinh-vien']) {
    for (const button of await page.locator(`${section} > div button`).all()) {
      await button.click()
      await expect(page.getByRole('dialog')).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(button).toBeFocused()
    }
  }
  await page.locator('footer').getByRole('button').click()
  await page.getByRole('textbox', { name: 'Câu hỏi của bạn' }).fill('Triết học giúp mình học tốt hơn như thế nào?')
  await page.getByRole('dialog').getByRole('button', { name: 'GHI LẠI CÂU HỎI', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText('CÂU HỎI TRONG PHIÊN NÀY')
  await page.getByRole('button', { name: 'Đóng hộp thoại' }).click()
  expect(errors).toEqual([])
})
test('empty quiz, Vietnamese font and reduced motion keyboard navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route('**/api/quiz', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true, data: [] }) }))
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.fonts.check('16px "Be Vietnam Pro"', 'ă â ê ô ơ ư đ Ế Ề Ể Ễ Ệ'))).toBe(true)
  await expect(page.locator('#quiz')).toContainText('Chưa có câu hỏi')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Đến nội dung chính' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
})
test('submit error keeps selections and permits retry', async ({ page }) => {
  await page.route('**/api/quiz/submit', route => route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ success: false, message: 'Không gửi được kết quả.' }) }))
  await page.goto('/')
  const quiz = page.locator('#quiz')
  for (let i = 0; i < 3; i++) {
    await quiz.locator('.quiz-option').first().click()
    await quiz.getByRole('button', { name: i === 2 ? 'XEM KẾT QUẢ' : 'TIẾP THEO →' }).click()
  }
  await expect(quiz.getByRole('alert')).toContainText('Không gửi được')
  await expect(quiz.locator('.quiz-option').first()).toHaveAttribute('aria-pressed', 'true')
  await page.unroute('**/api/quiz/submit')
  await quiz.getByRole('button', { name: 'XEM KẾT QUẢ' }).click()
  await expect(quiz).toContainText('Đã hoàn thành 3 câu hỏi!')
  await quiz.locator('summary').first().click()
  await expect(quiz).toContainText('Đối chiếu 5 tin tuyển dụng')
})
test('API failure is isolated and can recover', async ({ page }) => {
  await page.route('**/api/quiz', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ success: false, message: 'Máy chủ tạm thời chưa sẵn sàng.' }) }))
  await page.goto('/')
  await expect(page.locator('#quiz').getByRole('alert')).toContainText('Máy chủ tạm thời')
  await expect(page.locator('h1')).toBeVisible()
  await page.unroute('**/api/quiz')
  await page.locator('#quiz').getByRole('button', { name: 'THỬ LẠI' }).click()
  await expect(page.locator('.quiz-option')).toHaveCount(4)
})

