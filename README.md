# Book Review Frontend

Frontend quản lý Tác giả, Sách và Đánh giá — React + Vite, gọi REST API qua Axios.

## Tech Stack

- React 19, Vite 6, JavaScript (ES Modules)
- Axios, ESLint 9

## Chạy dự án

**Yêu cầu:** Node.js 18+

```bash
npm install
npm run dev
```

Server chạy tại `http://localhost:5173`

## Cấu trúc

```
src/
  components/   # UI: form, button, table, dialog, pagination
  hooks/        # useFetch, useForm, usePaginatedList
  layouts/      # Layout chính (Sidebar + Content)
  pages/        # Trang authors, books, reviews (list/create/edit)
  router/       # Custom router (History API, không dùng react-router)
  services/     # Gọi API: authorService, bookService, reviewService
  utils/        # Validation
```

## API

Mặc định proxy `/api` → `http://localhost:8080` qua Vite config.

Hoặc cấu hình trực tiếp:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Ràng buộc nghiệp vụ

- Không tạo Book nếu chưa có Author
- Không tạo Review nếu chưa có Book
- Không xóa Author nếu còn Book
- Không xóa Book nếu còn Review
