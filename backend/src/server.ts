import { app } from './app.js'
const port = Number(process.env.PORT || 3001)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT không hợp lệ')
app.listen(port, '127.0.0.1', () => console.info(`THINK! API: http://localhost:${port}`))
