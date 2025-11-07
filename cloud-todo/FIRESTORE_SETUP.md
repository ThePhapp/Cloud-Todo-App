# 🔥 Hướng dẫn Setup Firestore

## ⚠️ Lỗi thường gặp: Todos không hiển thị

Nếu bạn thêm todo nhưng không thấy hiển thị, có 2 nguyên nhân chính:

### 1. **Firestore Rules chưa đúng**

Mở Firebase Console → Firestore Database → Rules và paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{todoId} {
      // Cho phép đọc nếu user đã đăng nhập
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.user;
      
      // Cho phép tạo mới
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.user;
      
      // Cho phép cập nhật
      allow update: if request.auth != null && 
                       request.auth.uid == resource.data.user;
      
      // Cho phép xóa
      allow delete: if request.auth != null && 
                       request.auth.uid == resource.data.user;
    }
  }
}
```

Click **Publish** để lưu.

### 2. **Kiểm tra Console Log**

Mở DevTools (F12) → Console và kiểm tra:

- ✅ `👤 User logged in: xxx` - Xác nhận đã đăng nhập
- ✅ `➕ Adding todo: {...}` - Xác nhận đang thêm todo
- ✅ `✅ Todo added with ID: xxx` - Todo đã lưu thành công
- ✅ `📦 Received snapshot, docs count: X` - Đã nhận dữ liệu từ Firestore
- ✅ `📝 Todo: {...}` - Chi tiết từng todo

**Nếu thấy lỗi:**

#### Lỗi: "Missing or insufficient permissions"
→ **Sửa:** Cập nhật Firestore Rules như ở trên

#### Lỗi: "The query requires an index"
→ **Sửa:** Click vào link trong error message để tạo index tự động

#### Snapshot count = 0 (không có dữ liệu)
→ **Nguyên nhân:**
- User UID không khớp với field `user` trong todo
- Firestore Rules chặn quyền đọc
- Collection name sai (phải là "todos")

### 3. **Kiểm tra Firestore Database**

Mở Firebase Console → Firestore Database:

1. Xem collection có tên **"todos"** chưa?
2. Click vào 1 document, xem có field **"user"** không?
3. Copy giá trị field **"user"**, so sánh với UID khi đăng nhập

**Lấy UID của user:**
- Mở Console DevTools
- Xem log: `👤 User logged in: [UID_ở_đây]`
- Hoặc: Firebase Console → Authentication → Users → copy UID

### 4. **Test Rules bằng Firestore Console**

Firebase Console → Firestore → Rules → Tab "Rules Playground":

```
Location: /todos/[any-doc-id]
Read/Write: Read
Auth: Authenticated user
Authenticated UID: [paste-your-uid-here]
```

Click **Run** → Phải thấy "✅ Allowed"

## ✅ Checklist Troubleshooting

- [ ] Firebase config đúng trong `src/firebase.js`
- [ ] Authentication đã bật Google Sign-in
- [ ] Firestore Database đã tạo (chế độ Test hoặc có Rules)
- [ ] Firestore Rules cho phép read/write với user đã đăng nhập
- [ ] Console log hiển thị đúng user UID
- [ ] Console log hiển thị snapshot có dữ liệu
- [ ] Field "user" trong Firestore document khớp với user.uid

## 🔍 Debug bằng Console

Mở DevTools Console và chạy:

```javascript
// Xem user hiện tại
console.log("Current user:", auth.currentUser?.uid);

// Xem tất cả todos (không filter)
getDocs(collection(db, "todos")).then(snap => {
  console.log("All todos:", snap.docs.map(d => ({id: d.id, ...d.data()})));
});
```

## 🚀 Nếu vẫn không được

1. **Xóa hết todos cũ trong Firestore**
2. **Đăng xuất và đăng nhập lại**
3. **Hard refresh browser** (Ctrl + Shift + R)
4. **Thêm todo mới và xem Console**
5. **Check Network tab** - Xem request đến Firestore có lỗi không

## 📞 Cần trợ giúp?

Gửi screenshot của:
1. Console logs (khi thêm todo)
2. Firestore Rules
3. Firestore Database structure
4. Network tab (filter: "firestore")
