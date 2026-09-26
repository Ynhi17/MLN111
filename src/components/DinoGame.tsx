import { useCallback, useEffect, useRef, useState } from 'react'
import { runnerQuestions } from '../data/runnerQuestions'
import { advance, DINO_X, FLOOR, jump, newRun } from '../lib/runner'

type Phase = 'idle' | 'running' | 'paused' | 'question'
const pixels = ['00000111111', '00000110111', '00000111111', '00000111000', '10001111100', '11011111000', '11111111000', '01111110000', '00111100000', '00100100000', '00110110000']

export default function DinoGame() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [ducking, setDucking] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [round, setRound] = useState(1)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const canvas = useRef<HTMLCanvasElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const questionHeading = useRef<HTMLHeadingElement>(null)
  const run = useRef(newRun())
  const width = useRef(800)
  const deck = useRef<number[]>([])
  const question = runnerQuestions[questionIndex]

  const draw = useCallback(() => {
    const ctx = canvas.current?.getContext('2d')
    if (!ctx) return
    const w = width.current
    ctx.clearRect(0, 0, w, 260)
    ctx.fillStyle = '#F1EDF9'; ctx.fillRect(0, 0, w, 260)
    ctx.strokeStyle = '#D5CCE9'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(0, FLOOR + 1); ctx.lineTo(w, FLOOR + 1); ctx.stroke()
    // Quiet, slow-moving scenery; the obstacles carry the game motion.
    ctx.fillStyle = '#E2DAF1'
    for (let i = 0; i < 6; i++) {
      const x = ((i * 170 - run.current.distance * 0.12) % (w + 170) + w + 170) % (w + 170) - 60
      ctx.fillRect(x, 56 + (i % 3) * 22, 44, 5)
      ctx.fillRect(x + 12, 48 + (i % 3) * 22, 22, 8)
    }
    ctx.fillStyle = '#C6B9E2'
    for (let i = 0; i < w / 38 + 2; i++) ctx.fillRect(i * 38 - run.current.distance % 38, FLOOR + 12 + i % 3 * 5, 8, 2)
    ctx.fillStyle = '#5B3CC4'
    const pixelHeight = run.current.ducking && run.current.y === 0 ? 1.7 : 3.5
    pixels.forEach((row, y) => [...row].forEach((pixel, x) => {
      if (pixel === '1') ctx.fillRect(DINO_X + x * 3.5, FLOOR - 11 * pixelHeight - run.current.y + y * pixelHeight, 3.5, pixelHeight)
    }))
    for (const obstacle of run.current.obstacles) {
      const top = FLOOR - obstacle.height - (obstacle.altitude ?? 0)
      const x = obstacle.x
      if (obstacle.kind === 'bird') {
        const flap = Math.sin(run.current.distance / 90) * 8
        ctx.fillStyle = '#5B3CC4'
        ctx.fillRect(x + 13, top + 9, 23, 10)
        ctx.fillRect(x + 30, top + 3, 10, 11)
        ctx.fillStyle = '#D98B52'; ctx.fillRect(x + 40, top + 8, 4, 4)
        ctx.strokeStyle = '#5B3CC4'; ctx.lineWidth = 5
        ctx.beginPath(); ctx.moveTo(x, top + 8 + flap); ctx.lineTo(x + 19, top + 13); ctx.lineTo(x + 27, top + 3 + flap); ctx.stroke()
      } else if (obstacle.kind === 'rock') {
        ctx.fillStyle = '#777181'
        ctx.beginPath(); ctx.moveTo(x, FLOOR); ctx.lineTo(x + 3, top + 10); ctx.lineTo(x + 15, top); ctx.lineTo(x + 28, top + 5); ctx.lineTo(x + 34, FLOOR); ctx.closePath(); ctx.fill()
        ctx.fillStyle = '#ABA5B3'; ctx.fillRect(x + 10, top + 9, 11, 4)
      } else if (obstacle.kind === 'tree') {
        ctx.fillStyle = '#805430'; ctx.fillRect(x + 14, top + 26, 8, 32)
        ctx.fillStyle = '#427A55'
        ctx.beginPath(); ctx.moveTo(x + 17, top); ctx.lineTo(x + 34, top + 37); ctx.lineTo(x, top + 37); ctx.closePath(); ctx.fill()
      } else {
        ctx.fillStyle = '#A65B29'; ctx.fillRect(x + 7, top, obstacle.width - 14, obstacle.height)
        ctx.fillRect(x, top + 9, 7, 18); ctx.fillRect(x + obstacle.width - 7, top + 4, 7, 17)
        ctx.fillRect(x, top + 21, obstacle.width, 6)
      }
    }
  }, [])

  useEffect(() => {
    try { const saved = Number(localStorage.getItem('think-dino-best')); if (Number.isFinite(saved) && saved >= 0) setBest(saved) } catch { /* Storage is optional. */ }
    try {
      const pending = JSON.parse(localStorage.getItem('think-dino-pending') || 'null')
      if (pending && Number.isInteger(pending.index) && runnerQuestions[pending.index]?.question === pending.question) {
        setQuestionIndex(pending.index); setPhase('question'); setUnlocked(false)
      }
    } catch { /* Storage may be unavailable. */ }
    const element = canvas.current!
    const resize = new ResizeObserver(() => {
      width.current = element.clientWidth
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      element.width = Math.round(width.current * dpr); element.height = 260 * dpr
      element.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw()
      setPhase(current => current === 'running' ? 'paused' : current)
    })
    resize.observe(element)
    const pause = () => setPhase(current => current === 'running' ? 'paused' : current)
    const visibility = () => { if (document.hidden) pause() }
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) pause() }, { threshold: 0 })
    observer.observe(stage.current!)
    window.addEventListener('blur', pause); document.addEventListener('visibilitychange', visibility)
    return () => { resize.disconnect(); observer.disconnect(); window.removeEventListener('blur', pause); document.removeEventListener('visibilitychange', visibility) }
  }, [draw])

  useEffect(() => {
    if (phase !== 'running') return
    let frame = 0
    let last = 0
    const tick = (time: number) => {
      const dt = last ? Math.min((time - last) / 1000, 0.033) : 0
      last = time
      const collided = advance(run.current, dt, width.current)
      const points = Math.floor(run.current.distance / 10)
      setScore(points); draw()
      if (collided) {
        setBest(previous => {
          const value = Math.max(previous, points)
          try { localStorage.setItem('think-dino-best', String(value)) } catch { /* Optional storage. */ }
          return value
        })
        if (!deck.current.length) {
          deck.current = runnerQuestions.map((_, index) => index)
          for (let i = deck.current.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[deck.current[i], deck.current[j]] = [deck.current[j], deck.current[i]]
          }
        }
        const nextIndex = deck.current.pop()!
        try { localStorage.setItem('think-dino-pending', JSON.stringify({ index: nextIndex, question: runnerQuestions[nextIndex].question })) } catch { /* Keep the in-page lock when storage is unavailable. */ }
        setQuestionIndex(nextIndex); setSelected(null); setFeedback(''); setUnlocked(false); setPhase('question')
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [phase, draw])

  useEffect(() => { if (phase === 'question') questionHeading.current?.focus({ preventScroll: true }) }, [phase])
  const start = () => {
    if (phase === 'question' && !unlocked) return
    if (phase !== 'paused') { run.current = newRun(); setDucking(false); setScore(0); if (phase === 'question') setRound(value => value + 1) }
    canvas.current?.scrollIntoView({ block: 'center', behavior: 'instant' })
    setPhase('running'); canvas.current?.focus({ preventScroll: true })
  }
  const restart = () => {
    if (phase === 'question' && !unlocked) return
    run.current = newRun(); setDucking(false); deck.current = []
    setScore(0); setRound(1); setQuestionIndex(0); setSelected(null); setFeedback(''); setUnlocked(false)
    draw(); setPhase('running')
    canvas.current?.scrollIntoView({ block: 'center', behavior: 'instant' })
    canvas.current?.focus({ preventScroll: true })
  }
  useEffect(() => { if (phase !== 'running') { run.current.ducking = false; setDucking(false); draw() } }, [phase, draw])
  const duck = (value: boolean) => { if (phase === 'running') { run.current.ducking = value; setDucking(value) } }
  const hop = () => { if (phase === 'running') jump(run.current) }

  return <section id="tro-choi" className="py-20 px-6 scroll-mt-20" aria-labelledby="dino-title">
    <div className="max-w-4xl mx-auto">
      <div className="section-label mb-4">CHƠI MỘT CHÚT · NGHĨ THÊM MỘT CHÚT</div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div><h2 id="dino-title" className="text-3xl sm:text-4xl font-bold tracking-tight">Nhảy qua. Nghĩ tiếp.</h2>
          <p className="text-muted-foreground mt-3 max-w-xl leading-relaxed">Tốc độ cực nhanh ngay từ đầu! Nhảy qua đá, cây và xương rồng; giữ ↓ hoặc bấm CÚI để né chim bay thấp. Sau 30 giây, tốc độ và mật độ chướng ngại vật tăng cực mạnh để chuyển sang phần câu hỏi. Va chạm? Trả lời đúng một câu triết học để chạy tiếp. Không có đích đến — chỉ có kỷ lục mới.</p></div>
        <span className="rounded-full border border-border px-4 py-2 text-xs font-semibold">∞ CHẾ ĐỘ VÔ TẬN</span>
      </div>
      <div className="rounded-3xl border border-border overflow-hidden bg-card shadow-sm">
        <div className="flex flex-wrap justify-between gap-3 px-5 py-4 text-sm border-b border-border">
          <span>Lượt <strong>{round}</strong></span><div className="flex gap-5 tabular-nums"><span>Điểm <strong className="text-primary">{score}</strong></span><span>Kỷ lục <strong>{best}</strong></span></div>
        </div>
        <div ref={stage} className="relative">
          <canvas ref={canvas} className="block w-full h-[260px] outline-offset-[-4px] touch-manipulation" tabIndex={0} role="button" aria-label="Sân chơi khủng long. Nhấn Space hoặc mũi tên lên để nhảy; mũi tên xuống để cúi; Escape để tạm dừng." aria-describedby="dino-controls"
            onPointerDown={() => { canvas.current?.focus({ preventScroll: true }); hop() }}
            onKeyDown={event => {
              if ([' ', 'ArrowUp', 'Enter'].includes(event.key)) { event.preventDefault(); if (!event.repeat) hop() }
              if (event.key === 'ArrowDown') { event.preventDefault(); duck(true) }
              if (event.key === 'Escape' && phase === 'running') { event.preventDefault(); setPhase('paused') }
            }} onKeyUp={event => { if (event.key === 'ArrowDown') { event.preventDefault(); duck(false) } }} onBlur={() => duck(false)}>Game khủng long né đá, cây, xương rồng và chim bay. Các câu hỏi triết học xuất hiện bên dưới sau khi va chạm.</canvas>
          {(phase === 'idle' || phase === 'paused') && <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 bg-[#F1EDF9]/90 px-5 text-center">
            <p className="text-lg font-bold">{phase === 'idle' ? 'Một cú nhảy. Một góc nhìn mới.' : 'Nghỉ một nhịp nhé.'}</p>
            <button className="btn-primary" onClick={start}>{phase === 'idle' ? 'CHƠI NGAY →' : 'TIẾP TỤC CHẠY →'}</button>
          </div>}
          {phase === 'question' && <div className="absolute top-5 inset-x-4 text-center"><span className="inline-block bg-white rounded-full px-4 py-2 text-sm font-semibold shadow-sm">Va chạm rồi! Đến lượt tư duy ↓</span></div>}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-border">
          <p id="dino-controls" className="text-xs text-muted-foreground leading-relaxed">Space / ↑ hoặc chạm sân để nhảy. Giữ ↓ để cúi; trên điện thoại bấm CÚI / ĐỨNG.<br />Chuyển tab hay rời sân chơi sẽ tự tạm dừng.</p>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full border border-border px-4 py-3 text-sm font-semibold" disabled={phase === 'question' && !unlocked} onClick={restart}>Chơi lại từ đầu</button>
            <button className="rounded-full border border-border px-4 py-3 text-sm font-semibold disabled:opacity-40" disabled={phase !== 'running'} onClick={() => setPhase('paused')}>Tạm dừng</button>
            <button className="btn-secondary disabled:opacity-40" disabled={phase !== 'running'} aria-pressed={ducking} onClick={() => duck(!ducking)}>{ducking ? 'ĐỨNG ↑' : 'CÚI ↓'}</button>
            <button className="btn-primary disabled:opacity-40" disabled={phase !== 'running'} onClick={hop}>NHẢY ↑</button>
          </div>
        </div>
      </div>
      {phase === 'question' && <div className="mt-5 rounded-3xl border border-primary/25 bg-card p-5 sm:p-8">
        <p className="section-label mb-3">TRẢ LỜI ĐỂ CHƠI TIẾP</p>
        <h3 ref={questionHeading} tabIndex={-1} className="text-xl font-semibold leading-relaxed outline-none">{question.question}</h3>
        <p className="text-sm text-muted-foreground mt-2 mb-5">Trả lời đúng để mở khóa chơi tiếp hoặc chơi lại. Tải lại trang vẫn giữ câu hỏi chưa hoàn thành. Chưa đúng thì thử lại, không giới hạn lượt.</p>
        <div role="group" aria-label="Đáp án câu hỏi triết học" className="grid gap-3">
          {question.options.map((option, index) => <button key={`${questionIndex}-${index}`} disabled={unlocked} aria-pressed={selected === index}
            onClick={() => {
              setSelected(index)
              if (index === question.answer) {
                try { localStorage.removeItem('think-dino-pending') } catch { /* Optional storage. */ }
                setUnlocked(true); setFeedback(`Chính xác! ${question.explanation}`) }
              else setFeedback('Chưa đúng. Hãy suy nghĩ thêm và chọn lại nhé.')
            }}
            className={`text-left rounded-xl border px-4 py-4 text-sm leading-relaxed transition-colors ${selected === index ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
            <span className="font-bold text-primary mr-2">{String.fromCharCode(65 + index)}.</span>{option}
          </button>)}
        </div>
        <p role="status" className="text-sm leading-relaxed mt-4 min-h-6">{feedback}</p>
        <button className="btn-primary mt-4 disabled:opacity-40 disabled:cursor-not-allowed" disabled={!unlocked} onClick={start}>CHẠY TIẾP →</button>
      </div>}
      <p className="mt-4 text-xs text-muted-foreground leading-relaxed">Câu hỏi ôn tập dựa trên nội dung triết học của website. Game và câu hỏi vẫn chơi được khi mất kết nối sau khi trang đã tải xong.</p>
    </div>
  </section>
}
