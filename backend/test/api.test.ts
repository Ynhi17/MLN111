import { after, test } from 'node:test'
import assert from 'node:assert/strict'
import { app } from '../src/app.js'
const server = app.listen(0, '127.0.0.1')
await new Promise<void>((resolve) => server.once('listening', resolve))
const address = server.address() as { port: number }
const url = `http://127.0.0.1:${address.port}/api`
after(() => server.close())
test('health, quiz and complete reflection', async () => {
  assert.equal((await (await fetch(`${url}/health`)).json()).success, true)
  const { data } = await (await fetch(`${url}/quiz`)).json()
  assert.equal(data.length, 3)
  const response = await fetch(`${url}/quiz/submit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers: data.map((q: { id: number }) => ({ questionId: q.id, option: 'D' })) }) })
  assert.equal(response.status, 200)
  const result = (await response.json()).data
  assert.equal(result.completed, 3)
  assert.match(result.reflections[0].action, /5 tin tuyển dụng/)
  assert.match(result.reflections[0].perspective, /nhiều nguyên nhân/)
  assert.match(result.reflections[2].explanation, /mục tiêu và giá trị/)
})
test('reject missing, duplicate and invalid answers', async () => {
  for (const answers of [[], [null, null, null], [1, 1, 1].map(questionId => ({ questionId, option: 'A' })), [1, 2, 3].map(questionId => ({ questionId, option: 'Z' }))]) {
    const response = await fetch(`${url}/quiz/submit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers }) })
    assert.equal(response.status, 400)
    assert.equal((await response.json()).success, false)
  }
})
test('JSON errors, missing route and restricted CORS', async () => {
  const malformed = await fetch(`${url}/quiz/submit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })
  assert.equal(malformed.status, 400)
  assert.equal((await malformed.json()).success, false)
  assert.equal((await fetch(`${url}/missing`)).status, 404)
  assert.equal((await fetch(`${url}/quiz`, { headers: { Origin: 'https://untrusted.example' } })).status, 403)
  const allowed = await fetch(`${url}/quiz`, { headers: { Origin: 'http://localhost:8443' } })
  assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:8443')
})
