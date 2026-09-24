export type QuizQuestion = { id: number; question: string; options: { key: string; text: string }[] }
export type QuizAnswer = { questionId: number; option: string }
export type QuizResult = { completed: number; message: string; reflections: { question: string; answer: string; perspective: string; explanation: string; action: string }[] }
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '')

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, { ...options, signal: options.signal ?? AbortSignal.timeout(10000), headers: { 'Content-Type': 'application/json', ...options.headers } })
    const body = await response.json()
    if (!response.ok || !body.success) throw new Error(body.message || 'Không thể xử lý yêu cầu.')
    return body.data as T
  } catch (error) {
    if (error instanceof TypeError || (error instanceof DOMException && error.name === 'TimeoutError')) throw new Error('Không kết nối được máy chủ quiz. Hãy kiểm tra backend rồi thử lại.')
    throw error
  }
}
export const getQuiz = (signal?: AbortSignal) => request<QuizQuestion[]>('/quiz', { signal })
export const submitQuiz = (answers: QuizAnswer[]) => request<QuizResult>('/quiz/submit', { method: 'POST', body: JSON.stringify({ answers }) })
