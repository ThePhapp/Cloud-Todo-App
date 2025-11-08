# ☁️ Cloud Todo App

Ứng dụng quản lý công việc (Todo List) thông minh trên đám mây với Firebase & React.

## ✨ Tính năng

### 🔐 Xác thực
- **Đăng nhập Google** - Xác thực an toàn qua Firebase Auth
- **Quản lý session** - Tự động lưu trạng thái đăng nhập

### 📝 Quản lý công việc
- **Thêm todo** - Tạo công việc mới nhanh chóng
- **Chỉnh sửa inline** - Sửa nội dung trực tiếp trên danh sách
- **Xóa todo** - Loại bỏ công việc không cần thiết
- **Đánh dấu hoàn thành** - Checkbox để theo dõi tiến độ

### 🎯 Tính năng nâng cao
- **Mức độ ưu tiên** - 3 cấp độ: Thấp 🟢, Trung bình 🟡, Cao 🔴
- **Danh mục** - 4 loại: Personal 👤, Work 💼, Shopping 🛒, Health 💪
- **Ngày hết hạn** - Đặt deadline cho công việc
- **Lọc công việc** - Xem tất cả / Đang làm / Hoàn thành
- **Tìm kiếm** - Tìm nhanh công việc theo từ khóa
- **Drag & Drop** - Kéo thả để sắp xếp thứ tự công việc
- **Dark Mode** - Chế độ sáng/tối, lưu preference
- **Multi-language** - Hỗ trợ tiếng Việt, English, 日本語

### 📊 Statistics Dashboard
- **Tổng quan** - Số lượng tasks theo trạng thái
- **Biểu đồ tròn** - Phân tích task completed vs active
- **Biểu đồ cột** - Tasks theo priority và category
- **Xu hướng 7 ngày** - Line chart theo dõi hoàn thành hàng ngày

### 📅 Calendar View
- **Lịch tương tác** - Xem tasks theo ngày
- **Màu sắc phân loại** - Xanh (completed), Xanh dương (có task), Đỏ (quá hạn)
- **Chi tiết ngày** - Click vào ngày để xem danh sách tasks
- **Quản lý nhanh** - Edit/Delete trực tiếp từ calendar

### 🤖 AI Suggestions (Gemini Pro)
- **Tạo task từ prompt** - Mô tả nhu cầu, AI tạo danh sách tasks
- **Smart Analysis** - AI phân tích tasks hiện tại và đề xuất tasks mới
- **Tự động phân loại** - AI gợi ý priority & category cho mỗi task
- **Multi-language** - AI hiểu và trả lời bằng ngôn ngữ bạn chọn

### 🎨 Giao diện
- **Gradient đẹp mắt** - Màu sắc chuyển tiếp mượt mà
- **Responsive** - Tương thích mọi thiết bị
- **Animations** - Hiệu ứng chuyển động mượt mà (shimmer, confetti)
- **Toast notifications** - Thông báo real-time
- **Progress bar** - Thanh tiến độ hoàn thành với animation
- **Tab navigation** - 4 tabs: Tasks, Statistics, Calendar, AI
- **Hover effects** - Tương tác trực quan

### ☁️ Đồng bộ đám mây
- **Real-time sync** - Cập nhật tức thì trên mọi thiết bị
- **Firebase Firestore** - Database NoSQL mạnh mẽ
- **Offline support** - Firebase tự động cache dữ liệu

## 🛠️ Công nghệ sử dụng

- **React 19** - UI framework hiện đại
- **Vite 7** - Build tool cực nhanh với HMR
- **Tailwind CSS 3** - Utility-first CSS framework
- **@dnd-kit** - Drag and drop library hiện đại
- **Recharts** - Thư viện biểu đồ cho React
- **React Calendar** - Calendar component
- **date-fns** - Thư viện xử lý ngày tháng
- **Firebase 12**
  - Authentication (Google Sign-in)
  - Firestore (Real-time database)
  - Hosting (Deploy tự động)
- **Google Generative AI (Gemini Pro)** - AI suggestions

## 📦 Cài đặt

### 1. Clone repository
```bash
git clone https://github.com/ThePhapp/Cloud-Todo-App.git
cd Cloud-Todo-App/cloud-todo
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình Firebase
- Tạo project tại [Firebase Console](https://console.firebase.google.com/)
- Bật **Authentication** > **Google Sign-in**
- Tạo **Firestore Database** (chế độ Test để bắt đầu)
- Copy config và tạo file `.env` trong thư mục root:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Optional: AI Suggestions (Gemini Pro)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Lưu ý:** 
- File `.env` đã được thêm vào `.gitignore` để bảo mật
- Để sử dụng AI Suggestions, lấy API key miễn phí tại [Google AI Studio](https://aistudio.google.com/app/apikey)

### 4. Cấu hình Firestore Rules
Vào **Firestore Database** > **Rules** và thêm:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{todoId} {
      // Chỉ cho phép user đọc/ghi todos của họ
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.user;
      // Cho phép tạo mới nếu đã đăng nhập
      allow create: if request.auth != null && 
                     request.auth.uid == request.resource.data.user;
    }
  }
}
```

## 🚀 Chạy dự án

### Development mode
```bash
npm run dev
```
Mở [http://localhost:5173](http://localhost:5173) để xem.

### Build production
```bash
npm run build
```
Output ở thư mục `dist/`

### Preview production build
```bash
npm run preview
```

## 🌐 Deploy lên Firebase Hosting

### 1. Cài đặt Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Đăng nhập Firebase
```bash
firebase login
```

### 3. Khởi tạo Firebase (lần đầu)
```bash
firebase init
```
- Chọn **Hosting**
- Chọn project đã tạo
- Public directory: `dist`
- Single-page app: **Yes**
- Auto deploy with GitHub: **No** (tùy chọn)

### 4. Build & Deploy
```bash
npm run build
firebase deploy
```

Ứng dụng sẽ được deploy tại: `https://your-project-id.web.app`

## 📁 Cấu trúc dự án

```
cloud-todo/
├── src/
│   ├── App.jsx          # Component chính với tất cả logic
│   ├── App.css          # Custom styles & animations
│   ├── firebase.js      # Firebase configuration & exports
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind directives
├── public/              # Static assets
├── dist/                # Build output
├── firebase.json        # Firebase hosting config
├── .firebaserc          # Firebase project config
├── tailwind.config.js   # Tailwind CSS config
├── postcss.config.js    # PostCSS config
├── vite.config.js       # Vite config
└── package.json         # Dependencies
```

## 🎯 Firestore Data Structure

```javascript
todos: {
  [todoId]: {
    text: string,           // Nội dung công việc
    completed: boolean,     // Trạng thái hoàn thành
    user: string,          // UID của user
    priority: string,      // "low" | "medium" | "high"
    dueDate: string | null, // ISO date string
    createdAt: timestamp   // Server timestamp
  }
}
```

## 🔒 Bảo mật

- ✅ Firebase Authentication bảo mật
- ✅ Firestore Rules giới hạn quyền truy cập
- ✅ Mỗi user chỉ thấy todos của mình
- ✅ HTTPS được bật mặc định trên Firebase Hosting

## 🐛 Troubleshooting

### Lỗi "Permission denied"
- Kiểm tra Firestore Rules
- Đảm bảo user đã đăng nhập
- Xác nhận `user.uid` khớp với `todo.user`

### Lỗi build Tailwind
```bash
npm uninstall tailwindcss
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

### Lỗi Firebase deploy
```bash
firebase logout
firebase login
firebase use --add  # Chọn lại project
firebase deploy
```

## 📝 TODO (Tính năng tương lai)

- [ ] Dark mode toggle
- [ ] Categories/Tags cho todos
- [ ] Drag & drop để sắp xếp
- [ ] Recurring todos (lặp lại hàng ngày/tuần)
- [ ] Rich text editor cho mô tả chi tiết
- [ ] File attachments
- [ ] Collaboration (chia sẻ todos với người khác)
- [ ] Export to PDF/CSV
- [ ] Progressive Web App (PWA)
- [ ] Push notifications cho deadline

## 📄 License

MIT License - Tự do sử dụng cho mọi mục đích

## 👨‍💻 Tác giả

**ThePhapp**
- GitHub: [@ThePhapp](https://github.com/ThePhapp)
- Project: [Cloud-Todo-App](https://github.com/ThePhapp/Cloud-Todo-App)

## 🙏 Đóng góp

Pull requests luôn được chào đón! Hãy:
1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

⭐ Nếu thấy hữu ích, hãy cho project một star nhé! ⭐
