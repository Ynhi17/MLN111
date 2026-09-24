import { Router } from 'express'
import { questions, reflectOnAnswers } from '../services/quiz.js'
export const quizRouter = Router()
quizRouter.get('/', (_req, res) => res.json({ success: true, data: questions }))
quizRouter.post('/submit', (req, res) => {
  const result = reflectOnAnswers(req.body)
  if (!result) { res.status(400).json({ success: false, message: 'Hãy gửi đủ câu trả lời hợp lệ, mỗi câu hỏi đúng một lần.' }); return }
  res.json({ success: true, data: result })
})
