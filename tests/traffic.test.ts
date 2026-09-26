import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { cumulativeTraffic, SCHEMA, START, UPSERT, type TrafficDB } from '../functions/lib/traffic'

function database() {
  const sqlite = new DatabaseSync(':memory:')
  const db: TrafficDB = {
    prepare(sql) {
      let values: (string | number)[] = []
      return {
        bind(...args) { values = args; return this },
        async run() { return sqlite.prepare(sql).run(...values) },
        async first<T>() { return (sqlite.prepare(sql).get(...values) ?? null) as T | null },
      }
    },
    async batch(statements) {
      sqlite.exec('BEGIN')
      try { for (const statement of statements) await statement.run(); sqlite.exec('COMMIT') }
      catch (error) { sqlite.exec('ROLLBACK'); throw error }
    },
  }
  return { db, sqlite }
}
const DAY = 86400000
test('Cumulative totals survive day rollover, repeated syncs and API outages', async (t) => {
  const { db, sqlite } = database()
  t.after(() => sqlite.close())
  const windows: [number, number][] = []
  const mock = t.mock.method(globalThis, 'fetch', async (_url: unknown, options: RequestInit) => {
    const query = JSON.parse(String(options.body)).query
    const from = Date.parse(query.match(/datetime_geq: "([^"]+)"/)[1])
    const to = Date.parse(query.match(/datetime_lt: "([^"]+)"/)[1])
    windows.push([from, to])
    return Response.json({ data: { viewer: { accounts: [{ rumPageloadEventsAdaptiveGroups: [{ count: 11, sum: { visits: 7 } }] }] } } })
  })
  let now = Date.parse(START) + 2 * DAY + 3600000
  const initial = await cumulativeTraffic(db, 'test-only', now)
  assert.equal(initial.visits, 21)
  assert.equal(initial.pageViews, 33)
  assert.equal(initial.from, START)
  assert.equal(initial.stale, false)
  assert.equal(windows[0][0], Date.parse(START))
  assert.equal(windows[0][1], windows[1][0])
  assert.ok(windows.every(([from, to]) => to - from <= DAY))
  assert.deepEqual(await cumulativeTraffic(db, 'test-only', now + 1000), initial)
  assert.equal(windows.length, 3)
  assert.equal((await cumulativeTraffic(db, 'test-only', now + 300000)).visits, 21)
  now += DAY
  assert.equal((await cumulativeTraffic(db, 'test-only', now)).visits, 28)
  mock.mock.mockImplementation(async () => Response.json({ errors: [{ message: 'denied' }] }))
  const failed = await cumulativeTraffic(db, 'test-only', now + 300000)
  assert.equal(failed.visits, 28)
  assert.equal(failed.stale, true)
  assert.doesNotMatch(JSON.stringify(failed), /test-only|denied/)
})

test('An older concurrent response cannot overwrite a newer daily total', async () => {
  const { db, sqlite } = database()
  try {
    await db.prepare(SCHEMA).run()
    await db.prepare(UPSERT).bind(1, 20, 30, 300, 400).run()
    await db.prepare(UPSERT).bind(1, 10, 15, 200, 500).run()
    await db.prepare(UPSERT).bind(1, 11, 16, 300, 350).run()
    assert.equal(sqlite.prepare('SELECT visits FROM traffic_days').get()?.visits, 20)
  } finally { sqlite.close() }
})
