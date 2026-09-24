import { test } from 'node:test'
import assert from 'node:assert/strict'
import { onRequest } from '../functions/api/[[path]]'
const call = (path: string, init?: RequestInit) => onRequest({ request: new Request(`https://example.pages.dev/api/${path}`, init) })
test('Cloudflare quiz and health routes', async () => {
  assert.equal((await (await call('health')).json()).data.status, 'ok')
  assert.equal((await (await call('quiz')).json()).data.length, 3)
})
test('Cloudflare submit returns explanations without persistence', async () => {
  const response = await call('quiz/submit', { method: 'POST', body: JSON.stringify({ answers: [1, 2, 3].map(questionId => ({ questionId, option: 'D' })) }) })
  assert.equal(response.status, 200)
  const result = await response.json()
  assert.equal(result.data.completed, 3)
  assert.match(result.data.reflections[0].action, /5 tin tuyển dụng/)
})
test('Cloudflare rejects malformed, oversized and incomplete requests', async () => {
  for (const body of ['{', '{}', JSON.stringify({ answers: [] })]) assert.equal((await call('quiz/submit', { method: 'POST', body })).status, 400)
  assert.equal((await call('quiz/submit', { method: 'POST', body: 'x'.repeat(16385) })).status, 413)
  assert.equal((await call('quiz/submit')).status, 405)
  assert.equal((await call('missing')).status, 404)
})
