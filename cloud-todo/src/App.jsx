import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import { useLanguage } from "./LanguageContext";
import StatisticsPanel from "./components/StatisticsPanel";
import CalendarView from "./components/CalendarView";
import AISuggestions from "./components/AISuggestions";
import MoodTracker from "./components/MoodTracker";
import MoodBasedSuggestions from "./components/MoodBasedSuggestions";
import { MOODS } from "./components/MoodTracker";
import GamificationPanel, { awardXPForTask } from "./components/Gamification";
import MusicPlayer from "./components/MusicPlayer";

// Sortable Todo Item Component
function SortableTodoItem({ 
  todo, 
  darkMode, 
  textClass, 
  subTextClass,
  editingId, 
  editText, 
  setEditText,
  saveEdit,
  cancelEdit,
  toggleComplete,
  startEdit,
  removeTodo,
  getPriorityColor,
  getPriorityBadge,
  getCategoryColor,
  getCategoryIcon,
  t
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
        todo.completed
          ? darkMode 
            ? "bg-gray-700/50 border-gray-600"
            : "bg-gray-50 border-gray-200"
          : `border-l-4 ${getPriorityColor(todo.priority)}`
      } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      {editingId === todo.id ? (
        /* Edit Mode */
        <div className="flex gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className={`flex-1 border-2 border-purple-500 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} rounded-lg px-3 py-2 focus:outline-none`}
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
            {/* Drag Handle */}
            <div {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing touch-none">
              <span className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg">⋮⋮</span>
            </div>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id, todo.completed)}
              className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p
                  className={`font-medium ${
                    todo.completed
                      ? darkMode ? "line-through text-gray-500" : "line-through text-gray-400"
                      : textClass
                  }`}
                >
                  {getPriorityBadge(todo.priority)} {todo.text}
                </p>
                {todo.category && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(todo.category)}`}>
                    {getCategoryIcon(todo.category)}
                  </span>
                )}
              </div>
              {todo.dueDate && (
                <p className={`text-xs ${subTextClass} mt-1`}>
                  📅 {new Date(todo.dueDate).toLocaleDateString("en-US")}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => startEdit(todo)}
              className="text-blue-500 hover:text-blue-700 p-2"
              title={t("edit")}
            >
              ✏️
            </button>
            <button
              onClick={() => removeTodo(todo.id)}
              className="text-red-500 hover:text-red-700 p-2"
              title={t("delete")}
            >
              🗑️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const { t, language, changeLanguage } = useLanguage();
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks"); // tasks, statistics, calendar, ai, mood
  const [currentMood, setCurrentMood] = useState(null);

  // Drag and Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredTodos.findIndex((todo) => todo.id === active.id);
      const newIndex = filteredTodos.findIndex((todo) => todo.id === over.id);

      const newTodos = arrayMove(filteredTodos, oldIndex, newIndex);
      
      // Update order in Firestore
      try {
        for (let i = 0; i < newTodos.length; i++) {
          const todoRef = doc(db, "todos", newTodos[i].id);
          await updateDoc(todoRef, { order: i });
        }
        // Update local state will happen via onSnapshot
      } catch (error) {
        showNotification(t("error") + ": " + error.message);
      }
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  // Login with Google
  const login = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      showNotification(t("loginSuccess"));
    } catch (error) {
      showNotification(t("loginError") + ": " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setTodos([]);
    showNotification(t("logoutSuccess"));
  };

  // Show notification
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // Fetch todos real-time
  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, "todos"),
      where("user", "==", user.uid)
    );
    
    const unsub = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      // Sort by order field (for drag & drop), then by createdAt
      todosData.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
      
      setTodos(todosData);
      
      // Show confetti when all tasks completed
      if (todosData.length > 0 && todosData.every(t => t.completed)) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }, (error) => {
      showNotification(t("loadError") + ": " + error.message);
    });
    return () => unsub();
  }, [user, t]);

  // Add todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    try {
      setLoading(true);
      await addDoc(collection(db, "todos"), {
        text: input,
        completed: false,
        user: user.uid,
        priority,
        category,
        dueDate: dueDate || null,
        createdAt: serverTimestamp(),
        order: todos.length, // Add order field
      });
      
      setInput("");
      setDueDate("");
      setPriority("medium");
      setCategory("personal");
      showNotification(t("taskAdded"));
    } catch (error) {
      showNotification(t("error") + ": " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add todo from AI suggestion
  const addTodoFromAI = async (suggestion) => {
    try {
      setLoading(true);
      await addDoc(collection(db, "todos"), {
        text: suggestion.text,
        completed: false,
        user: user.uid,
        priority: suggestion.priority || "medium",
        category: suggestion.category || "personal",
        dueDate: null,
        createdAt: serverTimestamp(),
        order: todos.length,
      });
      showNotification(t("taskAdded"));
    } catch (error) {
      showNotification(t("error") + ": " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add todo from mood suggestion
  const addTodoFromMood = async (template) => {
    try {
      setLoading(true);
      await addDoc(collection(db, "todos"), {
        text: template.text,
        completed: false,
        user: user.uid,
        priority: template.priority || "medium",
        category: template.category || "personal",
        dueDate: null,
        createdAt: serverTimestamp(),
        order: todos.length,
      });
      showNotification(t("taskAdded"));
    } catch (error) {
      showNotification(t("error") + ": " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle mood change
  const handleMoodChange = (moodId) => {
    setCurrentMood(moodId);
    // Apply mood-based color theme to the app
    const mood = MOODS.find(m => m.id === moodId);
    if (mood) {
      document.documentElement.style.setProperty('--mood-color', mood.color);
    }
  };

  // Delete todo
  const removeTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id));
      showNotification(t("taskDeleted"));
    } catch (error) {
      showNotification(t("deleteError") + ": " + error.message);
    }
  };

  // Toggle complete
  const toggleComplete = async (id, current) => {
    try {
      await updateDoc(doc(db, "todos", id), { completed: !current });
      if (!current) {
        showNotification(t("taskCompleted"));
        // Award XP for completing task
        const todo = todos.find(t => t.id === id);
        if (todo && user) {
          try {
            await awardXPForTask(user, todo, false);
          } catch (error) {
            console.error("Error awarding XP:", error);
          }
        }
      }
    } catch (error) {
      showNotification(t("error") + ": " + error.message);
    }
  };

  // Start editing
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  // Save edit
  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      await updateDoc(doc(db, "todos", id), { text: editText });
      setEditingId(null);
      setEditText("");
      showNotification(t("changesSaved"));
    } catch (error) {
      showNotification(t("error") + ": " + error.message);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // Filter todos
  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    })
    .filter((todo) =>
      todo.text.toLowerCase().includes(search.toLowerCase())
    );

  // Count stats
  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;
  const completionPercentage = todos.length > 0 
    ? Math.round((completedCount / todos.length) * 100) 
    : 0;

  // Priority helpers
  const getPriorityColor = (p) => {
    if (p === "high") return darkMode 
      ? "text-red-400 border-red-800 bg-red-900/20"
      : "text-red-500 border-red-200 bg-red-50";
    if (p === "low") return darkMode
      ? "text-green-400 border-green-800 bg-green-900/20"
      : "text-green-500 border-green-200 bg-green-50";
    return darkMode
      ? "text-yellow-400 border-yellow-800 bg-yellow-900/20"
      : "text-yellow-500 border-yellow-200 bg-yellow-50";
  };

  const getPriorityBadge = (p) => {
    if (p === "high") return "🔴";
    if (p === "low") return "🟢";
    return "🟡";
  };

  // Category helpers
  const getCategoryColor = (c) => {
    const colors = {
      personal: darkMode ? "bg-purple-900/30 text-purple-300" : "bg-purple-100 text-purple-700",
      work: darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-700",
      shopping: darkMode ? "bg-pink-900/30 text-pink-300" : "bg-pink-100 text-pink-700",
      health: darkMode ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700",
    };
    return colors[c] || colors.personal;
  };

  const getCategoryIcon = (c) => {
    const icons = {
      personal: "👤",
      work: "💼",
      shopping: "🛒",
      health: "💪",
    };
    return icons[c] || "📌";
  };

  // Theme classes
  const bgClass = darkMode 
    ? "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" 
    : "bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100";
  const cardBgClass = darkMode ? "bg-gray-800/90" : "bg-white/90";
  const textClass = darkMode ? "text-gray-100" : "text-gray-800";
  const subTextClass = darkMode ? "text-gray-400" : "text-gray-600";
  const inputBgClass = darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200";

  return (
    <div className={`min-h-screen ${bgClass} py-8 px-4 transition-colors duration-300`}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: `${Math.random() * 20 + 10}px`,
              }}
            >
              {['🎉', '⭐', '✨', '🎊', '🌟'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg rounded-lg px-6 py-3 z-50 animate-bounce`}>
          <p className="text-sm font-medium">{notification}</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 flex items-center justify-between">
          <div className="flex-1 flex justify-start gap-2">
            {/* Language Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className={`${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300'} border-2 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer hover:border-purple-500 transition-colors`}
                title={t("language")}
              >
                <option value="en">🇬🇧 {t("english")}</option>
                <option value="vi">🇻🇳 {t("vietnamese")}</option>
                <option value="ja">🇯🇵 {t("japanese")}</option>
              </select>
            </div>
          </div>
          <div className="flex-1">
            <h1 className={`text-5xl font-bold ${darkMode ? 'bg-gradient-to-r from-purple-400 to-blue-400' : 'bg-gradient-to-r from-purple-600 to-blue-600'} bg-clip-text text-transparent mb-2`}>
              ☁️ {t("appTitle")}
            </h1>
            <p className={subTextClass}>{t("appSubtitle")}</p>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-full ${darkMode ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-800 hover:bg-gray-700'} text-white transition-all duration-200 transform hover:scale-110`}
              title={darkMode ? t("lightMode") : t("darkMode")}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {!user ? (
          /* Login Screen */
          <div className={`${cardBgClass} backdrop-blur-sm rounded-2xl shadow-2xl p-12 text-center max-w-md mx-auto transform hover:scale-105 transition-transform duration-300`}>
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                ☁️
              </div>
              <h2 className={`text-2xl font-bold ${textClass} mb-2`}>{t("welcome")}</h2>
              <p className={subTextClass}>{t("signInMessage")}</p>
            </div>
            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t("signingIn")}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t("signInButton")}
                </>
              )}
            </button>
          </div>
        ) : (
          /* Main App */
          <div className={`${cardBgClass} backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden`}>
            {/* User Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                  />
                  <div>
                    <p className="font-semibold">{t("hello")}, {user.displayName}!</p>
                    <p className="text-sm text-purple-100">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  {t("logout")}
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>{t("overallProgress")}</span>
                  <span>{completionPercentage}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className="bg-white rounded-full h-3 transition-all duration-500 relative overflow-hidden"
                    style={{ width: `${completionPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{todos.length}</p>
                  <p className="text-xs text-purple-100">{t("total")}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{activeCount}</p>
                  <p className="text-xs text-purple-100">{t("active")}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{completedCount}</p>
                  <p className="text-xs text-purple-100">{t("done")}</p>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className={`border-b-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} px-6`}>
              <div className="flex gap-2 overflow-x-auto">
                {[
                  { id: 'tasks', icon: '📝', label: 'Tasks' },
                  { id: 'mood', icon: '🎭', label: 'Mood' },
                  { id: 'gamification', icon: '🎮', label: 'Game' },
                  { id: 'music', icon: '🎵', label: 'Music' },
                  { id: 'statistics', icon: '📊', label: 'Stats' },
                  { id: 'calendar', icon: '📅', label: 'Calendar' },
                  { id: 'ai', icon: '🤖', label: 'AI' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-purple-600 text-purple-600'
                        : darkMode
                        ? 'border-transparent text-gray-400 hover:text-gray-300'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Tasks Tab */}
              {activeTab === 'tasks' && (
                <>
              {/* Add Todo Form */}
              <form onSubmit={addTodo} className="mb-6">
                <div className="flex gap-2 mb-3">
                  <input
                    className={`flex-1 border-2 ${inputBgClass} rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors duration-200`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("addTaskPlaceholder")}
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "..." : `➕ ${t("addButton")}`}
                  </button>
                </div>
                
                {/* Priority, Category & Due Date */}
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={`border-2 ${inputBgClass} rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none`}
                  >
                    <option value="low">🟢 {t("priorityLow")}</option>
                    <option value="medium">🟡 {t("priorityMedium")}</option>
                    <option value="high">🔴 {t("priorityHigh")}</option>
                  </select>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`border-2 ${inputBgClass} rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none`}
                  >
                    <option value="personal">👤 {t("categoryPersonal")}</option>
                    <option value="work">💼 {t("categoryWork")}</option>
                    <option value="shopping">🛒 {t("categoryShopping")}</option>
                    <option value="health">💪 {t("categoryHealth")}</option>
                  </select>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`border-2 ${inputBgClass} rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none`}
                  />
                </div>
              </form>

              {/* Search & Filter */}
              <div className="mb-6 space-y-3">
                <input
                  type="text"
                  placeholder={`🔍 ${t("searchPlaceholder")}`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full border-2 ${inputBgClass} rounded-xl px-4 py-2 focus:border-purple-500 focus:outline-none transition-colors duration-200`}
                />
                
                <div className="flex gap-2">
                  {["all", "active", "completed"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        filter === f
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                          : darkMode 
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {f === "all" ? `📋 ${t("filterAll")}` : f === "active" ? `⏳ ${t("active")}` : `✅ ${t("done")}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Todo List */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredTodos.map(todo => todo.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredTodos.length === 0 ? (
                      <div className={`text-center py-12 ${subTextClass}`}>
                        <p className="text-4xl mb-2">📝</p>
                        <p>{t("noTasks")}</p>
                      </div>
                    ) : (
                      filteredTodos.map((todo) => (
                        <SortableTodoItem
                          key={todo.id}
                          todo={todo}
                          darkMode={darkMode}
                          textClass={textClass}
                          subTextClass={subTextClass}
                          editingId={editingId}
                          editText={editText}
                          setEditText={setEditText}
                          saveEdit={saveEdit}
                          cancelEdit={cancelEdit}
                          toggleComplete={toggleComplete}
                          startEdit={startEdit}
                          removeTodo={removeTodo}
                          getPriorityColor={getPriorityColor}
                          getPriorityBadge={getPriorityBadge}
                          getCategoryColor={getCategoryColor}
                          getCategoryIcon={getCategoryIcon}
                          t={t}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </DndContext>
                </>
              )}

              {/* Mood Tab */}
              {activeTab === 'mood' && (
                <>
                  <MoodTracker 
                    darkMode={darkMode}
                    onMoodChange={handleMoodChange}
                    currentMood={currentMood}
                  />
                  {currentMood && (
                    <MoodBasedSuggestions
                      todos={todos}
                      currentMood={currentMood}
                      darkMode={darkMode}
                      addTodoFromMood={addTodoFromMood}
                    />
                  )}
                </>
              )}

              {/* Statistics Tab */}
              {activeTab === 'statistics' && (
                <StatisticsPanel todos={todos} darkMode={darkMode} />
              )}

              {/* Gamification Tab */}
              {activeTab === 'gamification' && (
                <GamificationPanel 
                  user={user}
                  todos={todos}
                  darkMode={darkMode}
                />
              )}

              {/* Music Tab */}
              {activeTab === 'music' && (
                <MusicPlayer 
                  darkMode={darkMode}
                  currentTask={todos.find(t => !t.completed)}
                  category={todos.find(t => !t.completed)?.category}
                />
              )}

              {/* Calendar Tab */}
              {activeTab === 'calendar' && (
                <CalendarView 
                  todos={todos}
                  darkMode={darkMode}
                  toggleComplete={toggleComplete}
                  startEdit={startEdit}
                  removeTodo={removeTodo}
                />
              )}

              {/* AI Suggestions Tab */}
              {activeTab === 'ai' && (
                <AISuggestions
                  todos={todos}
                  darkMode={darkMode}
                  addTodoFromAI={addTodoFromAI}
                  user={user}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
