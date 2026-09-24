import { useState } from 'react'
import Modal from './Modal'
export default function QuestionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [saved, setSaved] = useState('')

  const submit = () => {
    if (!text.trim()) return
    setSaved(text); setSubmitted(true); setText('')
  }

  const reset = () => { setSubmitted(false); setSaved('') }

  return (
    <Modal open={open} onClose={() => { onClose(); reset(); setText('') }}>
      <div className="p-8 pt-10">
        {!submitted ? (
          <>
            <span className="section-label">GHI LẠI CÂU HỎI ĐỂ SUY NGẪM</span>
            <h3 style={{ fontWeight: 700, fontSize: 24, marginTop: 8, marginBottom: 24, letterSpacing: '-0.01em' }}>
              Ghi lại câu hỏi để suy ngẫm
            </h3>
            <p className="text-sm text-muted-foreground mb-4">Đây là sổ ghi chép, không có AI trả lời. Nội dung chỉ nằm trong bộ nhớ trang và được xóa khi đóng hộp thoại hoặc tải lại trang.</p>
            <label className="sr-only" htmlFor="personal-question">Câu hỏi của bạn</label>
            <textarea
              id="personal-question"
              maxLength={200}
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 200))}
              placeholder="Viết câu hỏi của bạn…"
              rows={4}
              className="w-full resize-none outline-none transition-all duration-200"
              style={{
                padding: '16px',
                borderRadius: 16,
                border: `1.5px solid ${text ? 'var(--primary)' : 'var(--border)'}`,
                background: 'var(--muted)',
                fontSize: 15,
                lineHeight: 1.6,
                
                color: 'var(--foreground)',
                marginBottom: 8,
              }}
            />
            <div style={{ fontSize: 13, color: 'var(--muted-foreground)', textAlign: 'right', marginBottom: 24 }}>
              {text.length} / 200
            </div>
            <button
              className="btn-primary w-full justify-center"
              onClick={submit}
              disabled={!text.trim()}
              style={{ opacity: text.trim() ? 1 : 0.4 }}
            >
              GHI LẠI CÂU HỎI
            </button>
          </>
        ) : (
          <>
            <span className="section-label" style={{ color: 'var(--primary)' }}>✓ CÂU HỎI TRONG PHIÊN NÀY</span>
            <p style={{ fontSize: 15, color: 'var(--muted-foreground)', marginTop: 8, marginBottom: 20 }}>
              Câu hỏi chỉ nằm trong bộ nhớ trang, không gửi lên máy chủ; được xóa khi đóng hộp thoại, ghi câu hỏi khác hoặc tải lại trang.
            </p>
            <div style={{ background: 'rgba(91,60,196,0.06)', border: '1px solid rgba(91,60,196,0.2)', borderRadius: 16, padding: '16px 20px', marginBottom: 24 }}>
              <p style={{ fontSize: 16, fontStyle: 'italic', lineHeight: 1.6 }}>"{saved}"</p>
            </div>
            <button className="btn-secondary w-full justify-center" onClick={reset}>ĐẶT CÂU HỎI KHÁC</button>
          </>
        )}
      </div>
    </Modal>
  )
}

