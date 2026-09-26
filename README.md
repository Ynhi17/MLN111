# THINK! — Triết học dành cho sinh viên

Demo tiếng Việt giữ thiết kế nền kem, tím và các section từ Figma Make. Frontend dùng React 19 + TypeScript + Vite 8 + Tailwind CSS v4. Backend Express + TypeScript chạy độc lập; không cần database.

## Yêu cầu

Node.js 22.20+ và npm. Chạy các lệnh tại thư mục project. Font Be Vietnam Pro được đóng gói local, không phụ thuộc Google Fonts khi mở website.

## Frontend

```sh
npm install
```

Sao chép `.env.example` thành `.env` (PowerShell: `Copy-Item .env.example .env`). Biến `VITE_API_URL=http://localhost:3001/api` là địa chỉ API tập trung.

```sh
npm run dev
```

Frontend: http://localhost:8443. Project giữ cổng 8443 của Figma Make; biến `PORT` có thể đổi cổng. Nếu đổi cổng, cập nhật `FRONTEND_URL` của backend cho khớp. Khởi động lại Vite sau khi đổi `.env`.

## Backend

```sh
cd backend
npm install
```

Sao chép `.env.example` thành `.env` (PowerShell: `Copy-Item .env.example .env`).

```sh
npm run dev
```

Backend: http://localhost:3001. Health check: http://localhost:3001/api/health.

Biến môi trường: `PORT=3001`, `FRONTEND_URL=http://localhost:8443`. Chỉ origin được liệt kê mới được phép qua CORS; có thể phân cách nhiều origin bằng dấu phẩy nếu cần. Backend mặc định chỉ lắng nghe loopback để chạy local.

Sau khi cài dependency cho cả hai thư mục, có thể chạy đồng thời tại root:

```sh
npm run dev:all
```

## Cấu trúc và chức năng

- `src/App.tsx`: bố cục, navbar, hero, phương pháp, vai trò và tiến trình hành trình.
- `src/components/`: tình huống, thử thách 30 giây, câu hỏi cá nhân, modal có quản lý focus bằng native dialog; quiz với validation, loading, lỗi/thử lại, trạng thái rỗng và kết quả.
- `src/data/content.ts`: nội dung tĩnh được giữ từ bản thiết kế.
- `src/services/api.ts`: địa chỉ API, timeout và xử lý lỗi tập trung.
- `src/index.css`: font local, theme, responsive, focus và reduced motion.
- `backend/src/`: app/server, routes, services và dữ liệu quiz.
- `tests/`: kiểm tra trình duyệt ở 320, 375, 430, 768, 1024, 1280, 1440px và các tương tác chính.

Quiz có phản hồi theo đáp án, giải thích và hành động gợi ý; không chấm năng lực triết học hay xếp loại tính cách. Đáp án gửi tới backend để xử lý, không ghi vào database/tệp; kết quả nằm trong bộ nhớ trang đến khi làm lại, tải lại hoặc đóng trang. Câu hỏi cá nhân không gửi lên máy chủ và được xóa khi đóng hộp thoại hoặc ghi câu hỏi khác. Ghi chép sau thử thách 30 giây cũng chỉ nằm trong bộ nhớ trang, bị xóa khi thử lại, đổi câu hỏi, tải lại hoặc đóng trang. Website không có AI trả lời câu hỏi. Backend chưa chạy chỉ ảnh hưởng phần quiz; các section còn lại vẫn dùng được.

Nội dung gồm câu trả lời chủ đề ở hero, phần cơ sở lý luận phân biệt triết học nói chung với vận dụng Mác–Lênin, năm vai trò, 20 phản hồi tình huống theo lựa chọn và kết luận. QUESTION → THINK → REFLECT là khung thực hành của website. Các mục mở rộng dùng `details/summary` hỗ trợ bàn phím. Nguồn tham khảo được liên kết ở cuối trang: đề cương TRI114 của Đại học Ngoại thương, thông tin xuất bản từ NXB Chính trị quốc gia Sự thật và mục Critical Thinking của Stanford Encyclopedia of Philosophy. Nguồn [1] được xác minh thư mục qua đề cương, không tuyên bố đã đọc toàn văn giáo trình.

## API

- `GET /api/health`: trạng thái server.
- `GET /api/quiz`: danh sách câu hỏi và đáp án.
- `POST /api/quiz/submit`: kiểm tra đầy đủ câu trả lời, trả kết quả và các lựa chọn.

Ví dụ body:

```json
{"answers":[{"questionId":1,"option":"D"},{"questionId":2,"option":"A"},{"questionId":3,"option":"B"}]}
```

Thành công: `{ "success": true, "data": ... }`. Lỗi: `{ "success": false, "message": "..." }`. API kiểm tra ID, đáp án, số câu, trùng câu; xử lý JSON lỗi, giới hạn body 16 KB và không trả stack trace. Không có API feedback vì website hiện không có form gửi feedback.

## Kiểm tra và build

```sh
npm run typecheck
npm run lint
npm run build
npm --prefix backend run typecheck
npm --prefix backend run build
npm --prefix backend test
npx playwright install chromium
npm run test:e2e
```

Playwright tự chạy server nếu chưa có, tạo ảnh responsive trong `test-results/`. Frontend build ra `dist/`; `npm run preview` xem bản build. Backend build ra `backend/dist/`; chạy bằng `npm --prefix backend start`. Không chạy dev và preview cùng cổng một lúc.

## Deploy Cloudflare Pages

Project có API Pages Functions trong `functions/api/[[path]].ts`, tái sử dụng dữ liệu và logic quiz từ backend. Frontend build production mặc định gọi `/api` cùng tên miền; local vẫn gọi `http://localhost:3001/api`. Không cần chạy Express riêng khi deploy Pages.

Kết nối repository `Ynhi17/MLN111` ở Cloudflare → Workers & Pages → Pages. Chọn nhánh `main`, root để trống, build command `npm run build`, output `dist`. Đặt `NODE_VERSION=22.20.0` và `VITE_API_URL=/api` cho Production/Preview. File `.node-version` và mặc định production cũng cung cấp các giá trị tương ứng. Không đặt API URL localhost trên Cloudflare.

`wrangler.jsonc` cấu hình tên project `mln111` và output `dist`. Nếu dùng tên project khác, đổi tên trong file và script deploy cho khớp. Khi đã kết nối GitHub, push vào `main` sẽ kích hoạt build tự động. Nếu dashboard tự phát hiện pnpm, lockfile pnpm đã được đồng bộ với package.json.

Kiểm tra local bằng runtime Cloudflare:

```sh
npm run typecheck
npm run test:cloudflare
npm run build
npm run preview:cloudflare
```

Preview mặc định ở http://localhost:8788, bao gồm cả giao diện và API. Kiểm tra `/api/health`, `/api/quiz` và hoàn thành quiz. API kiểm tra dữ liệu, giới hạn body 16 KB và không lưu đáp án.

Deploy bằng CLI (cần đăng nhập tài khoản của bạn):

```sh
npx wrangler login
npx wrangler pages project create mln111 --production-branch main
npm run deploy:cloudflare
```

Chỉ chạy lệnh tạo project khi chưa có project đó. CLI tạo project Direct Upload; nếu muốn tự deploy theo GitHub thì tạo bằng dashboard theo hướng dẫn trên ngay từ đầu.

Demo chưa có lưu trữ lâu dài hay đăng nhập người dùng.
# Thống kê truy cập thật

Footer lấy visits và page views từ Cloudflare Web Analytics qua `/api/analytics`, cộng dồn từ ngày 24/09/2026 (giờ Việt Nam). Binding D1 `TRAFFIC_DB` lưu từng ngày vào bảng `traffic_days`; không có số liệu dự phòng cố định và không reset theo ngày. Mỗi lần đồng bộ thay thế tổng của ngày thay vì cộng thêm, tránh đếm trùng khi tải lại. Ba ngày gần nhất được cập nhật lại để nhận dữ liệu trễ; ngày cũ được lưu lâu dài. API đồng bộ khi có người xem, tối đa mỗi 5 phút, lấy bù tối đa 7 ngày mỗi đợt. Nếu ngừng đồng bộ quá thời hạn lưu lịch sử của Cloudflare (6 tháng), cần khôi phục từ bản sao lưu; hệ thống giữ tổng đã lưu và báo chưa cập nhật được, không tự bịa phần bị thiếu.

Pages cần secret `CF_ANALYTICS_TOKEN` có quyền đọc Account Analytics cho tài khoản chứa `mln111`. Lưu tại Settings → Variables and Secrets (Production), rồi redeploy. Không đặt token vào biến `VITE_*`, mã nguồn hoặc Git. Chạy thử endpoint bằng `npm run preview:cloudflare` với secret trong `.dev.vars` (đã được gitignore). API chỉ trả hai tổng số và khoảng thời gian, không trả token hay dữ liệu khách truy cập chi tiết.
