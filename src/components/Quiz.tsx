import { useEffect, useState } from 'react'
import { getQuiz, submitQuiz, type QuizAnswer, type QuizQuestion, type QuizResult } from '../services/api'

export default function Quiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<QuizResult | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true); setError('')
    getQuiz(controller.signal).then(setQuestions).catch((err: Error) => { if (!controller.signal.aborted) setError(err.message) }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [attempt])
  const reset = () => { setAnswers([]); setSelected(null); setResult(null); setError('') }
  const current = questions[answers.length]
  const next = async () => {
    if (!selected || !current || sending) return
    const nextAnswers = [...answers, { questionId: current.id, option: selected }]
    if (nextAnswers.length < questions.length) { setAnswers(nextAnswers); setSelected(null); return }
    setSending(true); setError('')
    try { setResult(await submitQuiz(nextAnswers)) } catch (err) { setError(err instanceof Error ? err.message : 'Có lỗi xảy ra. Hãy thử lại.') } finally { setSending(false) }
  }
  return <section id="quiz" className="py-28 px-6 bg-secondary">
    <div className="max-w-2xl mx-auto">
      <div className="mb-14"><span className="section-label">06 / QUIZ</span><h2 className="mt-3 text-4xl md:text-5xl font-bold">Góc nhìn của bạn là gì?</h2><p className="mt-4 text-muted-foreground">Chọn góc nhìn gần với bạn nhất, rồi xem căn cứ và giới hạn của lựa chọn. Quiz không chấm năng lực hay tính cách; các nhận định về sự việc vẫn cần bằng chứng.</p><p className="mt-3 text-sm text-muted-foreground">Đáp án được gửi tới backend để tạo phản hồi, không ghi vào cơ sở dữ liệu hay tệp. Kết quả chỉ giữ trong bộ nhớ trang đến khi làm lại, tải lại hoặc đóng trang.</p></div>
      {loading ? <p role="status" className="quiz-status">Đang tải câu hỏi…</p> : result ? <div className="quiz-status quiz-panel" role="status">
        <h3 className="text-2xl font-bold">Đã hoàn thành {result.completed} câu hỏi!</h3><p className="my-4">{result.message}</p>
        <ol className="space-y-6 mb-6">{result.reflections.map((item, index) => <li key={index}><p className="font-semibold">{index + 1}. {item.question}</p><p className="text-muted-foreground">Bạn chọn: {item.answer}</p><p className="mt-3">{item.perspective}</p><details className="learning-detail"><summary>Phân tích và hành động gợi ý</summary><p>{item.explanation}</p><p><strong>Thử áp dụng:</strong> {item.action}</p></details></li>)}</ol>
        <button className="btn-secondary" onClick={reset}>LÀM LẠI</button>
      </div> : <>
        {error && <div className="quiz-status mb-4" role="alert"><p>{error}</p>{questions.length === 0 && <button className="btn-secondary mt-4" onClick={() => setAttempt(attempt + 1)}>THỬ LẠI</button>}</div>}
        {current ? <div className="quiz-panel" key={current.id}>
          <p className="section-label" aria-live="polite">CÂU {answers.length + 1} / {questions.length}</p>
          <progress aria-label="Tiến độ quiz" value={answers.length} max={questions.length} />
          <h3 className="text-xl font-semibold mb-7" id="quiz-question">{current.question}</h3>
          <div role="group" aria-labelledby="quiz-question" className="flex flex-col gap-3 mb-8">{current.options.map((option) => <button key={option.key} className="quiz-option" aria-pressed={selected === option.key} disabled={sending} onClick={() => setSelected(option.key)}><span className="font-bold text-primary">{option.key}.</span><span>{option.text}</span></button>)}</div>
          <button className="btn-primary w-full" disabled={!selected || sending} onClick={next}>{sending ? 'ĐANG GỬI…' : answers.length === questions.length - 1 ? 'XEM KẾT QUẢ' : 'TIẾP THEO →'}</button>
        </div> : !error && <p className="quiz-status">Chưa có câu hỏi. Vui lòng quay lại sau.</p>}
      </>}
    </div>
  </section>
}
