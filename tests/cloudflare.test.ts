import { test } from 'node:test'
import assert from 'node:assert/strict'
import { onRequest as analytics } from '../functions/api/analytics'
import { onRequest } from '../functions/api/[[path]]'
const call = (path: string, init?: RequestInit) => onRequest({ request: new Request(`https://example.pages.dev/api/${path}`, init) })

test('Analytics returns only aggregate data and never fabricates a count on failure', async (t) => {
  const request = new Request('https://mln111.pages.dev/api/analytics')
  assert.equal((await analytics({ request, env: {} })).status, 503)
  const mock = t.mock.method(globalThis, 'fetch', async (_url: unknown, options: RequestInit) => {
    assert.match(String(options.body), /b098295c46d54e4184d14d5c4cc2660c/)
    return Response.json({ data: { viewer: { accounts: [{ rumPageloadEventsAdaptiveGroups: [{ count: 11, sum: { visits: 7 } }] }] } } })
  })
  const response = await analytics({ request, env: { CF_ANALYTICS_TOKEN: 'test-only' } })
  const body = await response.json()
  assert.equal(body.data.visits, 7)
  assert.equal(body.data.pageViews, 11)
  assert.equal(Date.parse(body.data.to) - Date.parse(body.data.from), 86400000)
  assert.doesNotMatch(JSON.stringify(body), /test-only/)
  mock.mock.mockImplementation(async () => Response.json({ errors: [{ message: 'denied' }] }))
  assert.equal((await analytics({ request, env: { CF_ANALYTICS_TOKEN: 'test-only' } })).status, 503)
  mock.mock.restore()
})
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
