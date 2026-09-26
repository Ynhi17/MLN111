import { cumulativeTraffic, type TrafficDB } from '../lib/traffic'
type Env = { CF_ANALYTICS_TOKEN?: string; TRAFFIC_DB?: TrafficDB }

export async function onRequest({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const unavailable = () => Response.json({ success: false, message: 'Chưa tải được thống kê truy cập.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  if (request.method !== 'GET') return new Response(null, { status: 405, headers: { Allow: 'GET' } })
  if (!env.CF_ANALYTICS_TOKEN || !env.TRAFFIC_DB) return unavailable()
  try {
    const data = await cumulativeTraffic(env.TRAFFIC_DB, env.CF_ANALYTICS_TOKEN)
    return Response.json({ success: true, data }, { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' } })
  } catch { return unavailable() }
}
