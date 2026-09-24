import { QUIZ_QUESTIONS } from '../data/quiz.js'
import { quizExplanations } from '../data/quizExplanations.js'
export const questions = QUIZ_QUESTIONS.map((question, index) => ({ id: index + 1, ...question }))
export function reflectOnAnswers(input: unknown) {
  if (!input || typeof input !== 'object' || !('answers' in input) || !Array.isArray(input.answers) || input.answers.length !== questions.length) return null
  const seen = new Set<number>()
  const reflections: { question: string; answer: string; perspective: string; explanation: string; action: string }[] = []
  for (const answer of input.answers) {
    if (!answer || typeof answer !== 'object' || !Number.isInteger(answer.questionId) || seen.has(answer.questionId)) return null
    const question = questions.find((item) => item.id === answer.questionId)
    const option = question?.options.find((item) => item.key === answer.option)
    if (!question || !option) return null
    seen.add(question.id)
    const analysis = quizExplanations[question.id]
    reflections.push({ question: question.question, answer: option.text, perspective: analysis.perspectives[option.key], explanation: analysis.explanation, action: analysis.action })
  }
  return { completed: reflections.length, message: 'Quiz không chấm năng lực triết học hay tính cách. Hãy phân biệt điều cần bằng chứng với điều cần cân nhắc giá trị, rồi chọn một hành động để kiểm tra cách hiểu của mình.', reflections }
}
