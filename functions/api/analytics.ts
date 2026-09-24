type Env = { CF_ANALYTICS_TOKEN?: string }
type Totals = { count: number; sum: { visits: number } }

export async function onRequest({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const unavailable = () => Response.json({ success: false, message: 'Chưa tải được thống kê truy cập.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  if (request.method !== 'GET') return new Response(null, { status: 405, headers: { Allow: 'GET' } })
  if (!env.CF_ANALYTICS_TOKEN) return unavailable()
  // A fixed five-minute boundary allows all visitors to share the same cached window.
  const end = new Date(Math.floor(Date.now() / 300000) * 300000)
  const start = new Date(end.getTime() - 86400000)
  const query = `{ viewer { accounts(filter: { accountTag: "120e2eefeb2d7413a6f03bc035d26127" }) {
    rumPageloadEventsAdaptiveGroups(limit: 1, filter: {
      siteTag: "b098295c46d54e4184d14d5c4cc2660c",
      datetime_geq: "${start.toISOString()}", datetime_lt: "${end.toISOString()}"
    }) { count sum { visits } }
  } } }`
  try {
    const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST', signal: AbortSignal.timeout(8000),
      headers: { Authorization: `Bearer ${env.CF_ANALYTICS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    if (!response.ok) return unavailable()
    const body = await response.json() as { errors?: unknown[]; data?: { viewer?: { accounts?: { rumPageloadEventsAdaptiveGroups?: Totals[] }[] } } }
    const groups = body.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups
    if (body.errors?.length || !Array.isArray(groups)) return unavailable()
    const totals = groups[0] ?? { count: 0, sum: { visits: 0 } }
    if (![totals.count, totals.sum?.visits].every(value => typeof value === 'number' && Number.isFinite(value) && value >= 0)) return unavailable()
    return Response.json({ success: true, data: { visits: Math.round(totals.sum.visits), pageViews: Math.round(totals.count), from: start.toISOString(), to: end.toISOString() } }, {
      headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' },
    })
  } catch { return unavailable() }
}
