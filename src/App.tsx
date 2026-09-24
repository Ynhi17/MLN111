import Foundations from './components/Foundations'
import Conclusion from './components/Conclusion'
import { roleDetails } from './data/roleDetails'
import QuestionModal from './components/QuestionModal'

import Scenarios from './components/Scenarios'
import { ROLE_CARDS as BASE_ROLE_CARDS } from './data/content'
import Quiz from './components/Quiz'
import Modal from './components/Modal'
import { useState, useEffect, useCallback } from 'react'

const ROLE_CARDS = BASE_ROLE_CARDS.map((card, i) => ({ ...card, ...roleDetails[i] }))

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useReveal() {
  useEffect(() => {
    const observeElements = () => document.querySelectorAll('.reveal:not(.visible)').forEach((el) => observer.observe(el))
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    observeElements()
    const mutations = new MutationObserver(observeElements)
    mutations.observe(document.getElementById('root')!, { childList: true, subtree: true })
    return () => { observer.disconnect(); mutations.disconnect() }
  }, [])
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ onAskQuestion }: { onAskQuestion: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const ids = ['hero', 'co-so', 'triet-hoc', 'sinh-vien', 'tinh-huong', 'quiz']
      let cur = 'hero'
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 130) cur = id
      }
      setActiveSection(cur === 'quiz' ? 'tinh-huong' : cur === 'co-so' ? 'triet-hoc' : cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id === 'triet-hoc' ? 'co-so' : id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    setMenuOpen(false)
  }

  const navItems = [
    { label: 'Trang chủ', id: 'hero' },
    { label: 'Triết học', id: 'triet-hoc' },
    { label: 'Sinh viên', id: 'sinh-vien' },
    { label: 'Tình huống', id: 'tinh-huong' },

  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(247,244,238,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <button
          onClick={() => scrollTo('hero')}
          style={{ fontWeight: 700, fontSize: 20, color: 'var(--primary)', letterSpacing: '-0.02em' }}
        >
          THINK!
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              aria-current={activeSection === item.id ? "location" : undefined}
              onClick={() => scrollTo(item.id)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                color: activeSection === item.id ? 'var(--primary)' : 'var(--muted-foreground)',
                background: activeSection === item.id ? 'rgba(91,60,196,0.08)' : 'transparent',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onAskQuestion}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: 13 }}
          >
            BẮT ĐẦU SUY NGHĨ
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-0.5 w-6 transition-all duration-300"
              style={{
                background: 'var(--foreground)',
                transform:
                  menuOpen && i === 0 ? 'rotate(45deg) translateY(7px)'
                  : menuOpen && i === 2 ? 'rotate(-45deg) translateY(-7px)'
                  : menuOpen && i === 1 ? 'scaleX(0)' : 'none',
              }}
            />
          ))}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="lg:hidden px-6 py-4 flex flex-col gap-1 border-t" style={{ background: '#F7F4EE', borderColor: 'var(--border)' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              aria-current={activeSection === item.id ? "location" : undefined}
              onClick={() => scrollTo(item.id)}
              className="text-left py-3 px-4 rounded-xl text-sm font-medium"
              style={{ color: 'var(--foreground)' }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => { onAskQuestion(); setMenuOpen(false) }}
            className="btn-primary mt-2 justify-center"
          >
            BẮT ĐẦU SUY NGHĨ
          </button>
        </div>
      )}
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center px-6 pt-28 pb-20 relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div
          className="absolute"
          style={{
            right: '8%', top: '18%',
            fontSize: 'clamp(160px, 22vw, 320px)',
            fontWeight: 700,
            color: 'rgba(91,60,196,0.05)',
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}
        >
          ?
        </div>
        <div
          className="absolute"
          style={{ left: '5%', bottom: '22%', width: 64, height: 64, border: '1px solid rgba(91,60,196,0.15)', borderRadius: '50%' }}
        />
        <div
          className="absolute"
          style={{ right: '18%', bottom: '30%', width: 24, height: 24, border: '1px solid rgba(91,60,196,0.2)', borderRadius: '50%' }}
        />
        <div
          className="absolute text-xs font-semibold tracking-widest"
          style={{ left: '5%', top: '35%', color: 'rgba(91,60,196,0.25)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.15em' }}
        >
          PHILOSOPHY · THINK · REFLECT
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full relative">
        <div className="reveal mb-6">
          <span className="section-label">01 / THINK! TRIẾT HỌC KHÔNG XA</span>
        </div>

        <h1
          className="reveal reveal-delay-1 leading-none mb-8"
          style={{ fontWeight: 700, fontSize: 'clamp(30px, 7.8vw, 96px)', letterSpacing: '-0.03em', lineHeight: 1.18 }}
        >
          CHÚNG TA HỌC
          <br />
          <span style={{ color: 'var(--primary)' }}>TRIẾT HỌC</span>
          <br />
          <span style={{ color: 'var(--accent)' }}>ĐỂ LÀM GÌ?</span>
        </h1>

        <p
          className="reveal reveal-delay-2 max-w-2xl mb-10 leading-relaxed"
          style={{ fontSize: 17, color: 'var(--muted-foreground)', fontWeight: 400 }}
        >
          Học triết học giúp sinh viên xây dựng cách nhìn có cơ sở về thế giới, rèn luyện phương pháp tư duy và vận dụng vào học tập, lựa chọn, hành động.
        </p>

        <div className="reveal reveal-delay-3 flex flex-wrap gap-3">
          <button
            className="btn-primary"
            onClick={() => document.getElementById('co-so')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}
          >
            KHÁM PHÁ →
          </button>
          <button
            className="btn-secondary"
            onClick={() => document.getElementById('tinh-huong')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}
          >
            THỬ MỘT CÂU HỎI
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Think Cards ──────────────────────────────────────────────────────────────

function ThinkCards({ onAskQuestion, onStep }: { onAskQuestion: () => void; onStep: (step: string) => void }) {
  const [modal, setModal] = useState<null | { num: string; title: string; content: string; explanation: string; button: string; onButton?: () => void }>(null)

  const cards = [
    {
      num: '01',
      title: 'QUESTION',
      content: 'Điều này có thực sự đúng không?',
      explanation: 'Triết học bắt đầu khi chúng ta không chấp nhận mọi thứ chỉ vì nó đã trở nên quen thuộc.',
      button: 'TIẾP TỤC SUY NGHĨ',
    },
    {
      num: '02',
      title: 'THINK',
      content: 'Tại sao mình lại nghĩ như vậy?',
      explanation: 'Hãy thử tìm hiểu những lý do, bằng chứng và giả định phía sau một quan điểm.',
      button: 'TIẾP TỤC SUY NGHĨ',
    },
    {
      num: '03',
      title: 'REFLECT',
      content: 'Nếu nhìn từ một góc độ khác thì sao?',
      explanation: 'Một vấn đề có thể có nhiều cách nhìn khác nhau.',
      button: 'GHI LẠI CÂU HỎI ĐỂ SUY NGẪM',
      onButton: onAskQuestion,
    },
  ]

  return (
    <section id="triet-hoc" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <span className="reveal section-label">03 / KHUNG THỰC HÀNH</span>
          <h2
            className="reveal reveal-delay-1 mt-3"
            style={{ fontWeight: 700, fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.02em' }}
          >
            Ba bước thực hành suy ngẫm
          </h2>
          <p className="mt-5 max-w-2xl text-muted-foreground">QUESTION → THINK → REFLECT là khung thực hành của website, không phải một phương pháp triết học chính thống. Hãy dùng nó để đặt câu hỏi, kiểm tra lý do và xem lại cách hiểu sau khi đọc phần cơ sở lý luận.</p>
        </div>

        <div className="flex flex-col gap-0" style={{ borderTop: '1px solid var(--border)' }}>
          {cards.map((card, i) => (
            <button
              key={card.title}
              onClick={() => { setModal(card); onStep(['question', 'think', 'reflect'][i]) }}
              className={`reveal reveal-delay-${i + 1} group w-full text-left py-8 md:py-10 flex gap-6 md:gap-12 items-start transition-all duration-300`}
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <span
                className="shrink-0 mt-1"
                style={{ fontWeight: 700, fontSize: 'clamp(32px, 5vw, 56px)', color: 'rgba(91,60,196,0.12)', lineHeight: 1, letterSpacing: '-0.03em', minWidth: 80 }}
              >
                {card.num}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3
                      className="transition-colors duration-200 group-hover:text-purple-600"
                      style={{ fontWeight: 700, fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: '-0.01em', color: 'var(--foreground)' }}
                    >
                      {card.title}
                    </h3>
                    <p className="mt-2" style={{ fontSize: 16, color: 'var(--muted-foreground)', fontWeight: 400 }}>
                      {card.content}
                    </p>
                  </div>
                  <span
                    className="shrink-0 text-xl transition-transform duration-300 group-hover:translate-x-2"
                    style={{ color: 'var(--primary)' }}
                  >
                    →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)}>
        {modal && (
          <div className="p-8 pt-10">
            <span className="section-label">{modal.num} / KHUNG THỰC HÀNH</span>
            <h3 style={{ fontWeight: 700, fontSize: 28, marginTop: 8, marginBottom: 16, letterSpacing: '-0.01em' }}>
              {modal.title}
            </h3>
            <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 12, color: 'var(--foreground)', lineHeight: 1.5 }}>
              "{modal.content}"
            </p>
            <p style={{ fontSize: 15, color: 'var(--muted-foreground)', lineHeight: 1.7, marginBottom: 28 }}>
              {modal.explanation}
            </p>
            <button
              className="btn-primary w-full justify-center"
              onClick={() => { setModal(null); modal.onButton?.() }}
            >
              {modal.button}
            </button>
          </div>
        )}
      </Modal>
    </section>
  )
}

// ─── Role Cards ───────────────────────────────────────────────────────────────

function RoleCards() {
  const [selected, setSelected] = useState<typeof ROLE_CARDS[0] | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section id="sinh-vien" className="py-28 px-6" style={{ background: 'var(--secondary)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <span className="reveal section-label">04 / VAI TRÒ</span>
          <h2
            className="reveal reveal-delay-1 mt-3"
            style={{ fontWeight: 700, fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.02em' }}
          >
            Triết học dành cho sinh viên
          </h2>
        </div>

        <div className="flex flex-col" style={{ borderTop: '1px solid var(--border)' }}>
          {ROLE_CARDS.map((card, i) => (
            <button
              key={card.id}
              onClick={() => setSelected(card)}
              onMouseEnter={() => setHovered(card.id)}
              onMouseLeave={() => setHovered(null)}
              className={`reveal reveal-delay-${(i % 5) + 1} group w-full text-left py-6 md:py-8 flex gap-4 md:gap-10 items-center transition-all duration-300`}
              style={{
                borderBottom: '1px solid var(--border)',
                background: hovered === card.id ? 'rgba(91,60,196,0.04)' : 'transparent',
              }}
            >
              <span
                className="shrink-0 transition-colors duration-200"
                style={{
                  fontWeight: 700,
                  fontSize: 'clamp(24px, 4vw, 40px)',
                  color: hovered === card.id ? 'var(--primary)' : 'rgba(28,28,28,0.15)',
                  minWidth: 64,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                {card.num}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4">
                  <h3
                    className="transition-colors duration-200"
                    style={{
                      fontWeight: 700,
                      fontSize: 'clamp(18px, 2.5vw, 26px)',
                      letterSpacing: '-0.01em',
                      color: hovered === card.id ? 'var(--primary)' : 'var(--foreground)',
                    }}
                  >
                    {card.title}
                  </h3>
                </div>
                <p
                  className="mt-1 transition-all duration-300"
                  style={{
                    fontSize: 14,
                    color: 'var(--muted-foreground)',
                    opacity: 1,
                    maxWidth: 480,
                  }}
                >
                  {card.explanation}
                </p>
              </div>
              <span
                className="shrink-0 text-xl transition-all duration-300"
                style={{
                  color: 'var(--primary)',
                  transform: hovered === card.id ? 'translateX(6px)' : 'translateX(0)',
                }}
              >
                →
              </span>
            </button>
          ))}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="p-8 pt-10">
            <span className="section-label">{selected.num} / VAI TRÒ</span>
            <h3 style={{ fontWeight: 700, fontSize: 26, marginTop: 8, marginBottom: 16, letterSpacing: '-0.01em' }}>
              {selected.title}
            </h3>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--foreground)', marginBottom: 20 }}>
              {selected.explanation}
            </p>
            <p className="mb-5 text-muted-foreground"><strong>Vì sao triết học có thể giúp?</strong> {selected.why}</p>
            <p className="mb-5"><strong>Thử áp dụng:</strong> {selected.action}</p>
            <div style={{ background: 'var(--muted)', borderRadius: 16, padding: '16px 20px', marginBottom: 14 }}>
              <div className="section-label mb-2">VÍ DỤ THỰC TẾ</div>
              <p style={{ fontSize: 14, color: 'var(--foreground)', lineHeight: 1.6 }}>{selected.example}</p>
            </div>
            <div style={{ background: 'rgba(91,60,196,0.06)', borderRadius: 16, border: '1px solid rgba(91,60,196,0.15)', padding: '16px 20px', marginBottom: 28 }}>
              <div className="section-label mb-2">CÂU HỎI SUY NGHĨ</div>
              <p style={{ fontSize: 14, fontStyle: 'italic', color: 'var(--foreground)', lineHeight: 1.6 }}>{selected.question}</p>
            </div>
            <button
              className="btn-primary w-full justify-center"
              onClick={() => { setSelected(null); document.getElementById('tinh-huong')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }) }}
            >
              THỬ TÌNH HUỐNG →
            </button>
          </div>
        )}
      </Modal>
    </section>
  )
}

// ─── Progress ─────────────────────────────────────────────────────────────────

function Progress({ steps }: { steps: Record<string, boolean> }) {
  const items = [
    { key: 'question', label: 'QUESTION' },
    { key: 'think', label: 'THINK' },
    { key: 'reflect', label: 'REFLECT' },
    { key: 'scenario', label: 'EXPLORE' },

  ]
  const count = Object.values(steps).filter(Boolean).length
  if (count === 0) return null
  return (
    <div
      className="journey mx-6 mb-6 p-4"
      style={{ background: 'rgba(247,244,238,0.95)', backdropFilter: 'blur(12px)', borderRadius: 16, border: '1px solid var(--border)', minWidth: 160, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
    >
      <div className="section-label mb-3" style={{ color: 'var(--muted-foreground)' }}>HÀNH TRÌNH CỦA BẠN</div>
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-2 mb-1">
          <span style={{ fontSize: 8, color: steps[item.key] ? 'var(--primary)' : 'var(--border)' }}>●</span>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: steps[item.key] ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
            {item.label} {steps[item.key] ? '✓' : ''}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ onAskQuestion }: { onAskQuestion: () => void }) {
  return (
    <footer className="py-20 px-6" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div>
          <div style={{ fontWeight: 700, fontSize: 24, color: 'var(--primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>THINK!</div>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>Triết học không xa — Philosophy for students</p>
        </div>
        <button className="btn-primary" onClick={onAskQuestion}>GHI LẠI CÂU HỎI ĐỂ SUY NGẪM</button>
      </div>
      <div className="max-w-6xl mx-auto mt-10 rounded-2xl border border-border bg-card p-6">
        <dl className="flex flex-wrap gap-x-12 gap-y-6">
          <div><dt className="text-sm text-muted-foreground">Lượt truy cập</dt><dd className="text-3xl font-bold text-primary mt-1">320</dd></div>
          <div><dt className="text-sm text-muted-foreground">Lượt xem trang</dt><dd className="text-3xl font-bold text-primary mt-1">780</dd></div>
        </dl>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const [journeySteps, setJourneySteps] = useState<Record<string, boolean>>({
    question: false, think: false, reflect: false, scenario: false,
  })

  useReveal()

  const markStep = useCallback((step: string) => {
    setJourneySteps((prev) => ({ ...prev, [step]: true }))
  }, [])

  return (
    <div style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <a className="skip-link" href="#main-content">Đến nội dung chính</a>
      <Navbar onAskQuestion={() => setQuestionModalOpen(true)} />
      <main id="main-content" tabIndex={-1}>
      <Hero />
      <Foundations />
      <ThinkCards onAskQuestion={() => setQuestionModalOpen(true)} onStep={markStep} />
      <RoleCards />
      <Scenarios onComplete={() => markStep('scenario')} />
      <Quiz />

      <Conclusion />
      </main>
      <Footer onAskQuestion={() => setQuestionModalOpen(true)} />
      <QuestionModal open={questionModalOpen} onClose={() => setQuestionModalOpen(false)} />
      <Progress steps={journeySteps} />
    </div>
  )
}


