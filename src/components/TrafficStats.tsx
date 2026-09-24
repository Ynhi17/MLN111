import { useEffect, useState } from 'react'

type Stats = { visits: number; pageViews: number; from: string; to: string }

export default function TrafficStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const response = await fetch('/api/analytics', { signal: controller.signal })
        const body = await response.json()
        if (!response.ok || !body.success) throw new Error('Unavailable')
        if (!controller.signal.aborted) { setStats(body.data); setFailed(false) }
      } catch { if (!controller.signal.aborted) setFailed(true) }
    }
    void load()
    const timer = window.setInterval(() => void load(), 300000)
    return () => { controller.abort(); window.clearInterval(timer) }
  }, [])
  return (
    <div className="max-w-6xl mx-auto mt-10 rounded-2xl border border-border bg-card p-6">
      <p className="text-sm text-muted-foreground mb-4">Thống kê truy cập</p>
      <dl className="flex flex-wrap gap-x-12 gap-y-6">
        <div><dt className="text-sm text-muted-foreground">Lượt truy cập</dt><dd className="text-3xl font-bold text-primary mt-1">{stats ? stats.visits.toLocaleString('vi-VN') : '—'}</dd></div>
        <div><dt className="text-sm text-muted-foreground">Lượt xem trang</dt><dd className="text-3xl font-bold text-primary mt-1">{stats ? stats.pageViews.toLocaleString('vi-VN') : '—'}</dd></div>
      </dl>
      {(failed || !stats) && <p role="status" className="text-xs text-muted-foreground mt-4">{failed ? (stats ? 'Chưa cập nhật được. Đang hiển thị dữ liệu lần tải gần nhất.' : 'Chưa tải được thống kê truy cập.') : 'Đang tải thống kê…'}</p>}
    </div>
  )
}
