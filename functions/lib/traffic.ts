export const START = '2026-09-23T17:00:00.000Z' // 24/09/2026 in Vietnam
const DAY = 86400000
const INTERVAL = 300000
interface Statement {
  bind(...values: (string | number)[]): Statement
  first<T>(): Promise<T | null>
  run(): Promise<unknown>
}
export interface TrafficDB {
  prepare(sql: string): Statement
  batch(statements: Statement[]): Promise<unknown>
}
type Summary = { visits: number; pageViews: number; through: number; fetched: number; days: number }
export const SCHEMA = `CREATE TABLE IF NOT EXISTS traffic_days (
  day INTEGER PRIMARY KEY, visits INTEGER NOT NULL, pageViews INTEGER NOT NULL,
  through INTEGER NOT NULL, fetched INTEGER NOT NULL)`
export const UPSERT = `INSERT INTO traffic_days(day, visits, pageViews, through, fetched) VALUES (?, ?, ?, ?, ?)
  ON CONFLICT(day) DO UPDATE SET visits=excluded.visits, pageViews=excluded.pageViews,
  through=excluded.through, fetched=excluded.fetched
  WHERE excluded.through >= traffic_days.through AND excluded.fetched > traffic_days.fetched`
const SUMMARY = `SELECT SUM(visits) AS visits, SUM(pageViews) AS pageViews,
  MAX(through) AS through, MAX(fetched) AS fetched, COUNT(*) AS days FROM traffic_days`

export async function cumulativeTraffic(db: TrafficDB, token: string, now = Date.now()) {
  await db.prepare(SCHEMA).run()
  const previous = await db.prepare(SUMMARY).first<Summary>()
  const start = Date.parse(START)
  const end = Math.floor(now / INTERVAL) * INTERVAL
  let stale = false
  // Replacing daily aggregates makes synchronization idempotent across reloads.
  if (!previous?.days || now - previous.fetched >= INTERVAL) {
    try {
      // Refresh recent days for delayed beacons; keep older days permanently.
      const first = Math.max(start, previous?.days ? start + (previous.days - 3) * DAY : start)
      if (end - first > 180 * DAY) throw new Error('History outside retention')
      const stop = Math.min(end, first + 7 * DAY)
      const windows: { day: number; through: number }[] = []
      for (let day = first; day < stop; day += DAY) windows.push({ day, through: Math.min(day + DAY, stop) })
      if (!windows.length) throw new Error('No reporting window')
      const rows = await Promise.all(windows.map(async ({ day, through }) => {
        const query = `{ viewer { accounts(filter: { accountTag: "120e2eefeb2d7413a6f03bc035d26127" }) {
          rumPageloadEventsAdaptiveGroups(limit: 1, filter: {
            siteTag: "b098295c46d54e4184d14d5c4cc2660c",
            datetime_geq: "${new Date(day).toISOString()}", datetime_lt: "${new Date(through).toISOString()}"
          }) { count sum { visits } }
        } } }`
        const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
          method: 'POST', signal: AbortSignal.timeout(8000),
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        })
        if (!response.ok) throw new Error('Analytics unavailable')
        const body = await response.json() as { errors?: unknown[]; data?: { viewer?: { accounts?: { rumPageloadEventsAdaptiveGroups?: { count: number; sum: { visits: number } }[] }[] } } }
        const groups = body.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups
        if (body.errors?.length || !Array.isArray(groups)) throw new Error('Invalid analytics response')
        const totals = groups[0] ?? { count: 0, sum: { visits: 0 } }
        if (![totals.count, totals.sum?.visits].every(value => typeof value === 'number' && Number.isFinite(value) && value >= 0)) throw new Error('Invalid totals')
        return { day, through, visits: Math.round(totals.sum.visits), pageViews: Math.round(totals.count) }
      }))
      await db.batch(rows.map(row => db.prepare(UPSERT).bind(row.day, row.visits, row.pageViews, row.through, now)))
    } catch {
      if (!previous?.days) throw new Error('Analytics unavailable')
      stale = true
    }
  }
  const totals = await db.prepare(SUMMARY).first<Summary>()
  if (!totals?.days) throw new Error('No archived totals')
  return { visits: totals.visits, pageViews: totals.pageViews, from: START, to: new Date(totals.through).toISOString(), stale: stale || totals.through < end }
}
