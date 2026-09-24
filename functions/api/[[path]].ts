import { questions, reflectOnAnswers } from '../../backend/src/services/quiz'

const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...headers } })

export async function onRequest({ request }: { request: Request }): Promise<Response> {
  const path = new URL(request.url).pathname.replace(/\/$/, '')
  const method = path === '/api/quiz/submit' ? 'POST' : ['/api/health', '/api/quiz'].includes(path) ? 'GET' : null
  if (!method) return json({ success: false, message: 'Không tìm thấy API.' }, 404)
  if (request.method !== method) return json({ success: false, message: 'Phương thức không được hỗ trợ.' }, 405, { Allow: method })
  if (path === '/api/health') return json({ success: true, data: { status: 'ok' } })
  if (path === '/api/quiz') return json({ success: true, data: questions })

  // Limit the streamed body as well as Content-Length (which clients may omit).
  const reader = request.body?.getReader()
  if (!reader) return json({ success: false, message: 'Thiếu dữ liệu câu trả lời.' }, 400)
  try {
    const chunks: Uint8Array[] = []
    let size = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 16384) {
        await reader.cancel()
        return json({ success: false, message: 'Dữ liệu gửi lên quá lớn.' }, 413)
      }
      chunks.push(value)
    }
    const bytes = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length }
    const result = reflectOnAnswers(JSON.parse(new TextDecoder().decode(bytes)))
    return result ? json({ success: true, data: result }) : json({ success: false, message: 'Hãy gửi đủ câu trả lời hợp lệ, mỗi câu hỏi đúng một lần.' }, 400)
  } catch {
    return json({ success: false, message: 'Dữ liệu không hợp lệ.' }, 400)
  } finally { reader.releaseLock() }
}
