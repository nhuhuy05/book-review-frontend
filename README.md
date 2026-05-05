# Haibazo Book Review Frontend

Frontend cho bài toán quản lý tác giả, sách và review sách. Dự án được xây dựng bằng React + Vite, dùng custom client-side router và gọi REST API bằng Axios để thực hiện các thao tác CRUD.

## Tổng quan

Ứng dụng quản lý 3 nhóm dữ liệu có quan hệ với nhau:

- `Authors`: tạo, sửa, xóa, xem danh sách tác giả.
- `Books`: tạo, sửa, xóa, xem danh sách sách và gán sách cho tác giả.
- `Reviews`: tạo, sửa, xóa, xem danh sách review và gán review cho sách.

Ràng buộc nghiệp vụ hiện tại ở frontend:

- Không thể tạo `Book` nếu chưa có `Author`.
- Không thể tạo `Review` nếu chưa có `Book`.
- Không thể xóa `Author` nếu tác giả đó còn sách.
- Không thể xóa `Book` nếu sách đó còn review.

## Tech stack

- React 19
- Vite 6
- JavaScript (ES Modules)
- Axios
- ESLint 9

## Cấu trúc thư mục

```text
src/
  components/   # UI dùng lại: form, button, table, dialog, pagination...
  hooks/        # Custom hooks như useFetch, useForm
  layouts/      # Layout tổng của ứng dụng
  pages/        # Các trang authors, books, reviews
  router/       # Custom router và navigation helper
  services/     # Lớp gọi API cho author/book/review
  utils/        # Validation và helper xử lý dữ liệu
public/         # Static assets
```

## Route hiện có

- `/`
- `/authors`
- `/authors/create`
- `/authors/:id/edit`
- `/books`
- `/books/create`
- `/books/:id/edit`
- `/reviews`
- `/reviews/create`
- `/reviews/:id/edit`

Route `/` hiện trỏ về danh sách tác giả.

## Cấu hình API

Base URL được đọc từ biến môi trường:

```env
VITE_API_BASE_URL=/api
```

Nếu không khai báo, frontend mặc định gọi API qua prefix `/api`. Trong môi trường development, Vite proxy prefix này đến backend được cấu hình trong `vite.config.js`.

Ví dụ file `.env.local` khi chạy với backend local:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Frontend hiện đang gọi các endpoint:

- `GET /authors`, `GET /authors/:id`, `POST /authors`, `PUT /authors/:id`, `DELETE /authors/:id`
- `GET /books`, `GET /books/:id`, `POST /books`, `PUT /books/:id`, `DELETE /books/:id`
- `GET /reviews`, `GET /reviews/:id`, `POST /reviews`, `PUT /reviews/:id`, `DELETE /reviews/:id`

## Cài đặt và chạy

Yêu cầu:

- Node.js 18+
- npm

Cài dependency:

```bash
npm install
```

Chạy development:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Preview bản build:

```bash
npm run preview
```

Kiểm tra lint:

```bash
npm run lint
```

## Hành vi UI

- Danh sách có phân trang, 5 bản ghi mỗi trang.
- Form có validate bắt buộc trước khi submit.
- Lỗi API được hiển thị trực tiếp trên giao diện.
- Xóa dữ liệu có hộp thoại xác nhận.

## Ghi chú

- Dự án không dùng `react-router-dom`, mà tự xử lý navigation bằng History API.
- Frontend đang dựa vào `book.authorName` và `review.bookName` để suy ra quan hệ hiển thị và ràng buộc khi xóa.
