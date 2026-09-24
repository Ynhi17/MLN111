import express, { type ErrorRequestHandler } from 'express'
import cors from 'cors'
import { quizRouter } from './routes/quiz.js'
export const app = express()
app.disable('x-powered-by')
const origins = (process.env.FRONTEND_URL || 'http://localhost:8443').split(',').map((origin) => origin.trim())
app.use(cors({ origin(origin, callback) {
  if (!origin || origins.includes(origin)) callback(null, true)
  else callback(Object.assign(new Error('Nguồn truy cập không được cho phép.'), { status: 403 }))
} }))
app.use(express.json({ limit: '16kb' }))
app.get('/api/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }))
app.use('/api/quiz', quizRouter)
app.use((_req, res) => res.status(404).json({ success: false, message: 'Không tìm thấy API.' }))
const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const status = typeof error.status === 'number' && error.status >= 400 && error.status < 500 ? error.status : 500
  const message = status === 403 ? 'Nguồn truy cập không được cho phép.' : status === 413 ? 'Dữ liệu gửi lên quá lớn.' : status === 400 ? 'JSON không hợp lệ.' : 'Máy chủ gặp lỗi. Vui lòng thử lại.'
  res.status(status).json({ success: false, message })
}
app.use(errorHandler)
