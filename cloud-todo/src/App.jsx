import { useEffect, useState } from "react";
import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  db,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, completed
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  // Đăng nhập Google
  const login = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      showNotification("✅ Đăng nhập thành công!");
    } catch (error) {
      showNotification("❌ Lỗi đăng nhập: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Đăng xuất
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setTodos([]);
    showNotification("👋 Đã đăng xuất");
  };

  // Hiển thị thông báo
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // Lấy todo real-time
  useEffect(() => {
    if (!user) return;
    
    console.log("👤 User logged in:", user.uid);
    
    const q = query(
      collection(db, "todos"),
      where("user", "==", user.uid)
    );
    
    const unsub = onSnapshot(q, (snapshot) => {
      console.log("📦 Received snapshot, docs count:", snapshot.docs.length);
      
      const todosData = snapshot.docs.map((d) => {
        const data = { id: d.id, ...d.data() };
        console.log("📝 Todo:", data);
        return data;
      });
      
      // Sort locally by createdAt (nếu có)
      todosData.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
      
      console.log("✅ Setting todos, count:", todosData.length);
      setTodos(todosData);
    }, (error) => {
      console.error("❌ Lỗi lấy todos:", error);
      showNotification("❌ Lỗi tải dữ liệu: " + error.message);
    });
    return () => unsub();
  }, [user]);

  // Thêm todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    try {
      setLoading(true);
      console.log("➕ Adding todo:", { text: input, user: user.uid, priority, dueDate });
      
      const docRef = await addDoc(collection(db, "todos"), {
        text: input,
        completed: false,
        user: user.uid,
        priority: priority,
        dueDate: dueDate || null,
        createdAt: serverTimestamp(),
      });
      
      console.log("✅ Todo added with ID:", docRef.id);
      
      setInput("");
      setDueDate("");
      setPriority("medium");
      showNotification("✨ Đã thêm công việc mới!");
    } catch (error) {
      console.error("❌ Error adding todo:", error);
      showNotification("❌ Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Xóa todo
  const removeTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id));
      showNotification("🗑️ Đã xóa công việc");
    } catch (error) {
      showNotification("❌ Lỗi xóa: " + error.message);
    }
  };

  // Đánh dấu hoàn thành
  const toggleComplete = async (id, current) => {
    try {
      await updateDoc(doc(db, "todos", id), { completed: !current });
    } catch (error) {
      showNotification("❌ Lỗi: " + error.message);
    }
  };

  // Bắt đầu chỉnh sửa
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  // Lưu chỉnh sửa
  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      await updateDoc(doc(db, "todos", id), { text: editText });
      setEditingId(null);
      setEditText("");
      showNotification("💾 Đã lưu thay đổi");
    } catch (error) {
      showNotification("❌ Lỗi: " + error.message);
    }
  };

  // Hủy chỉnh sửa
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // Lọc todos
  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    })
    .filter((todo) =>
      todo.text.toLowerCase().includes(search.toLowerCase())
    );

  // Đếm số lượng
  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  // Priority colors
  const getPriorityColor = (p) => {
    if (p === "high") return "text-red-500 border-red-200 bg-red-50";
    if (p === "low") return "text-green-500 border-green-200 bg-green-50";
    return "text-yellow-500 border-yellow-200 bg-yellow-50";
  };

  const getPriorityBadge = (p) => {
    if (p === "high") return "🔴";
    if (p === "low") return "🟢";
    return "🟡";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 py-8 px-4">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg px-6 py-3 z-50 animate-bounce">
          <p className="text-sm font-medium">{notification}</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            ☁️ Cloud Todo App
          </h1>
          <p className="text-gray-600">Quản lý công việc thông minh trên đám mây</p>
        </div>

        {!user ? (
          /* Login Screen */
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                ☁️
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Chào mừng bạn!</h2>
              <p className="text-gray-600">Đăng nhập để bắt đầu quản lý công việc</p>
            </div>
            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Đăng nhập với Google
                </>
              )}
            </button>
          </div>
        ) : (
          /* Main App */
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
            {/* User Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                  />
                  <div>
                    <p className="font-semibold">Xin chào, {user.displayName}!</p>
                    <p className="text-sm text-purple-100">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Đăng xuất
                </button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{todos.length}</p>
                  <p className="text-xs text-purple-100">Tổng số</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{activeCount}</p>
                  <p className="text-xs text-purple-100">Đang làm</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{completedCount}</p>
                  <p className="text-xs text-purple-100">Hoàn thành</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Add Todo Form */}
              <form onSubmit={addTodo} className="mb-6">
                <div className="flex gap-2 mb-3">
                  <input
                    className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors duration-200"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Thêm công việc mới..."
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "..." : "➕ Thêm"}
                  </button>
                </div>
                
                {/* Priority & Due Date */}
                <div className="flex gap-2">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                  >
                    <option value="low">🟢 Thấp</option>
                    <option value="medium">🟡 Trung bình</option>
                    <option value="high">🔴 Cao</option>
                  </select>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </form>

              {/* Search & Filter */}
              <div className="mb-6 space-y-3">
                <input
                  type="text"
                  placeholder="🔍 Tìm kiếm công việc..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-purple-500 focus:outline-none transition-colors duration-200"
                />
                
                <div className="flex gap-2">
                  {["all", "active", "completed"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        filter === f
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {f === "all" ? "📋 Tất cả" : f === "active" ? "⏳ Đang làm" : "✅ Hoàn thành"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Todo List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredTodos.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-4xl mb-2">📝</p>
                    <p>Chưa có công việc nào</p>
                  </div>
                ) : (
                  filteredTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`group border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
                        todo.completed
                          ? "bg-gray-50 border-gray-200"
                          : `border-l-4 ${getPriorityColor(todo.priority)}`
                      }`}
                    >
                      {editingId === todo.id ? (
                        /* Edit Mode */
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 border-2 border-purple-500 rounded-lg px-3 py-2 focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit(todo.id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                          >
                            💾
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                          >
                            ✖️
                          </button>
                        </div>
                      ) : (
                        /* Display Mode */
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <input
                              type="checkbox"
                              checked={todo.completed}
                              onChange={() => toggleComplete(todo.id, todo.completed)}
                              className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                            />
                            <div className="flex-1">
                              <p
                                className={`font-medium ${
                                  todo.completed
                                    ? "line-through text-gray-400"
                                    : "text-gray-800"
                                }`}
                              >
                                {getPriorityBadge(todo.priority)} {todo.text}
                              </p>
                              {todo.dueDate && (
                                <p className="text-xs text-gray-500 mt-1">
                                  📅 {new Date(todo.dueDate).toLocaleDateString("vi-VN")}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => startEdit(todo)}
                              className="text-blue-500 hover:text-blue-700 p-2"
                              title="Chỉnh sửa"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => removeTodo(todo.id)}
                              className="text-red-500 hover:text-red-700 p-2"
                              title="Xóa"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
