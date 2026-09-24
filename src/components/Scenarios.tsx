import { scenarioFeedback } from '../data/scenarioFeedback'
import { useState } from 'react'
import { SCENARIOS } from '../data/content'
export default function Scenarios({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [done, setDone] = useState(false)

  const scenario = SCENARIOS[current]
  const feedback = selected ? scenarioFeedback[scenario.id][selected] : null

  const handleNext = () => {
    if (current < SCENARIOS.length - 1) {
      setCurrent(current + 1); setSelected(null); setSubmitted(false)
    } else {
      setDone(true); onComplete()
    }
  }

  const reset = () => { setCurrent(0); setSelected(null); setSubmitted(false); setDone(false) }

  return (
    <section id="tinh-huong" className="py-28 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-14">
          <span className="reveal section-label">05 / TÌNH HUỐNG THỰC TẾ</span>
          <h2 className="reveal reveal-delay-1 mt-3" style={{ fontWeight: 700, fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.02em' }}>
            Bạn sẽ chọn gì?
          </h2>
        </div>

        {done ? (
          <div className="reveal text-center py-16">
            <div className="section-label mb-4">✓ HOÀN THÀNH</div>
            <p style={{ fontWeight: 700, fontSize: 24, marginBottom: 8 }}>Bạn đã hoàn thành 5 tình huống.</p>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: 32, fontSize: 15 }}>Lựa chọn giá trị cần cân nhắc hoàn cảnh và trách nhiệm; nhận định về sự việc cần bằng chứng. Các lựa chọn không có cơ sở ngang nhau.</p>
            <button className="btn-secondary" onClick={reset}>THỬ LẠI</button>
          </div>
        ) : (
          <div className="reveal">
            {/* Progress */}
            <div className="flex items-center justify-between mb-2" style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)' }}>
              <span>{scenario.label}</span>
              <span>TÌNH HUỐNG {current + 1} / {SCENARIOS.length}</span>
            </div>
            <div style={{ height: 2, background: 'var(--border)', borderRadius: 2, marginBottom: 36, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${((current + 1) / SCENARIOS.length) * 100}%`, background: 'var(--primary)', transition: 'width 0.5s ease', borderRadius: 2 }} />
            </div>

            <p style={{ fontWeight: 700, fontSize: 'clamp(20px, 3vw, 26px)', lineHeight: 1.4, marginBottom: 8, whiteSpace: 'pre-line' }}>
              {scenario.situation}
            </p>
            <p style={{ fontSize: 15, color: 'var(--muted-foreground)', marginBottom: 28 }}>{scenario.question}</p>

            <div className="flex flex-col gap-3 mb-8">
              {scenario.options.map((opt) => {
                const isSelected = selected === opt.key
                return (
                  <button
                    key={opt.key}
                    aria-pressed={isSelected}
                    onClick={() => !submitted && setSelected(opt.key)}
                    disabled={submitted}
                    className="text-left flex gap-4 items-center transition-all duration-200"
                    style={{
                      padding: '16px 20px',
                      borderRadius: 16,
                      border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      background: isSelected ? 'rgba(91,60,196,0.06)' : 'var(--card)',
                      cursor: submitted ? 'default' : 'pointer',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 13, color: isSelected ? 'var(--primary)' : 'var(--muted-foreground)', minWidth: 24 }}>{opt.key}.</span>
                    <span style={{ fontSize: 15, color: 'var(--foreground)' }}>{opt.text}</span>
                  </button>
                )
              })}
            </div>

            {!submitted ? (
              <button
                className="btn-primary w-full justify-center"
                onClick={() => selected && setSubmitted(true)}
                disabled={!selected}
                style={{ opacity: selected ? 1 : 0.4 }}
              >
                XEM PHÂN TÍCH
              </button>
            ) : (
              <div>
                <div style={{ background: 'rgba(91,60,196,0.06)', border: '1px solid rgba(91,60,196,0.2)', borderRadius: 20, padding: '20px 24px', marginBottom: 16 }}>
                  <div className="section-label mb-2">PHÂN TÍCH LỰA CHỌN CỦA BẠN</div>
                  <div aria-live="polite" className="space-y-4 text-sm">{feedback && <><p><strong>Bạn chú ý đến:</strong> {feedback.focus}</p><p><strong>Có thể bỏ sót:</strong> {feedback.missing}</p><p><strong>Cần kiểm tra:</strong> {feedback.check}</p><p><strong>Liên hệ triết học:</strong> {feedback.lesson}</p></>}</div>
                </div>
                <button className="btn-primary w-full justify-center" onClick={handleNext}>
                  {current < SCENARIOS.length - 1 ? 'TÌNH HUỐNG TIẾP THEO →' : 'HOÀN THÀNH'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

