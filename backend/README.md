# THINK! API

Node.js 22.20+, Express 5, TypeScript. Chạy trong thư mục `backend`:

```sh
npm install
```

Copy `.env.example` thành `.env`, sau đó:

```sh
npm run dev
```

Mặc định http://localhost:3001; `FRONTEND_URL=http://localhost:8443` giới hạn CORS. `npm run build` biên dịch; `npm start` chạy bản build; `npm test` kiểm tra API.

`GET /api/health`, `GET /api/quiz`, `POST /api/quiz/submit`. Body submit gồm `answers`, mỗi phần tử có `questionId` và `option`. Kết quả được tính ngay, không lưu dữ liệu cá nhân. Chi tiết và cách chạy cả frontend ở README root.
