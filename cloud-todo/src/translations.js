export const translations = {
  en: {
    // Header
    appTitle: "Cloud Todo",
    appSubtitle: "Smart task management in the cloud",
    
    // Auth
    welcome: "Welcome!",
    signInMessage: "Sign in to start managing your tasks",
    signInButton: "Sign in with Google",
    signingIn: "Signing in...",
    logout: "Logout",
    hello: "Hello",
    
    // Stats
    total: "Total",
    active: "Active",
    done: "Done",
    overallProgress: "Overall Progress",
    
    // Add Todo Form
    addTaskPlaceholder: "Add a new task...",
    addButton: "Add",
    
    // Priority
    priorityLow: "Low",
    priorityMedium: "Medium",
    priorityHigh: "High",
    
    // Category
    categoryPersonal: "Personal",
    categoryWork: "Work",
    categoryShopping: "Shopping",
    categoryHealth: "Health",
    
    // Filter
    filterAll: "All",
    filterActive: "Active",
    filterCompleted: "Done",
    
    // Search
    searchPlaceholder: "Search tasks...",
    
    // Empty state
    noTasks: "No tasks yet",
    
    // Actions
    edit: "Edit",
    delete: "Delete",
    
    // Notifications
    loginSuccess: "Successfully logged in!",
    loginError: "Login error",
    logoutSuccess: "Logged out successfully",
    taskAdded: "New task added!",
    taskCompleted: "Task completed!",
    taskDeleted: "Task deleted",
    changesSaved: "Changes saved",
    error: "Error",
    deleteError: "Delete error",
    loadError: "Error loading data",
    
    // Theme
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    
    // Language
    language: "Language",
    vietnamese: "Tiếng Việt",
    english: "English",
    japanese: "日本語",
    
    // Statistics
    statistics: "Statistics Dashboard",
    tasks: "Tasks",
    taskStatus: "Task Status",
    tasksByPriority: "Tasks by Priority",
    tasksByCategory: "Tasks by Category",
    last7DaysTrend: "Last 7 Days Trend",
    completed: "Completed",
    
    // Calendar
    calendarView: "Calendar View",
    tasksOn: "Tasks on",
    noTasksForDate: "No tasks for this date",
    hasTasks: "Has tasks",
    overdue: "Overdue",
    
    // AI Suggestions
    aiSuggestions: "AI Suggestions",
    aiPromptPlaceholder: "What kind of tasks do you need? (e.g., 'Workout routine', 'Study plan')",
    generate: "Generate",
    smartAnalyze: "Smart Analyze My Tasks",
    suggestedTasks: "Suggested Tasks",
    add: "Add",
    aiSetup: "Setup AI Assistant",
    aiSetupStep1: "Get a free API key from https://aistudio.google.com/app/apikey",
    aiSetupStep2: "Add VITE_GEMINI_API_KEY=your_key to .env file",
    aiSetupStep3: "Restart the dev server",
    enterPrompt: "Please enter a prompt",
    aiKeyMissing: "AI API key not found. Please add VITE_GEMINI_API_KEY to your .env file",
    aiError: "AI Error",
    aiParseError: "Could not parse AI response",
  },
  
  vi: {
    // Header
    appTitle: "Cloud Todo",
    appSubtitle: "Quản lý công việc thông minh trên đám mây",
    
    // Auth
    welcome: "Chào mừng bạn!",
    signInMessage: "Đăng nhập để bắt đầu quản lý công việc",
    signInButton: "Đăng nhập với Google",
    signingIn: "Đang đăng nhập...",
    logout: "Đăng xuất",
    hello: "Xin chào",
    
    // Stats
    total: "Tổng số",
    active: "Đang làm",
    done: "Hoàn thành",
    overallProgress: "Tiến độ tổng thể",
    
    // Add Todo Form
    addTaskPlaceholder: "Thêm công việc mới...",
    addButton: "Thêm",
    
    // Priority
    priorityLow: "Thấp",
    priorityMedium: "Trung bình",
    priorityHigh: "Cao",
    
    // Category
    categoryPersonal: "Cá nhân",
    categoryWork: "Công việc",
    categoryShopping: "Mua sắm",
    categoryHealth: "Sức khỏe",
    
    // Filter
    filterAll: "Tất cả",
    filterActive: "Đang làm",
    filterCompleted: "Hoàn thành",
    
    // Search
    searchPlaceholder: "Tìm kiếm công việc...",
    
    // Empty state
    noTasks: "Chưa có công việc nào",
    
    // Actions
    edit: "Chỉnh sửa",
    delete: "Xóa",
    
    // Notifications
    loginSuccess: "✅ Đăng nhập thành công!",
    loginError: "❌ Lỗi đăng nhập",
    logoutSuccess: "👋 Đã đăng xuất",
    taskAdded: "✨ Đã thêm công việc mới!",
    taskCompleted: "🎉 Hoàn thành công việc!",
    taskDeleted: "🗑️ Đã xóa công việc",
    changesSaved: "💾 Đã lưu thay đổi",
    error: "❌ Lỗi",
    deleteError: "❌ Lỗi xóa",
    loadError: "❌ Lỗi tải dữ liệu",
    
    // Theme
    darkMode: "Chế độ tối",
    lightMode: "Chế độ sáng",
    
    // Language
    language: "Ngôn ngữ",
    vietnamese: "Tiếng Việt",
    english: "English",
    japanese: "日本語",
    
    // Statistics
    statistics: "Bảng Thống Kê",
    tasks: "Công việc",
    taskStatus: "Trạng thái công việc",
    tasksByPriority: "Theo độ ưu tiên",
    tasksByCategory: "Theo danh mục",
    last7DaysTrend: "xu hướng 7 ngày",
    completed: "Hoàn thành",
    
    // Calendar
    calendarView: "Lịch công việc",
    tasksOn: "Công việc vào ngày",
    noTasksForDate: "Không có công việc nào",
    hasTasks: "Có công việc",
    overdue: "Quá hạn",
    
    // AI Suggestions
    aiSuggestions: "Gợi ý AI",
    aiPromptPlaceholder: "Bạn cần loại công việc gì? (VD: 'Lịch tập gym', 'Kế hoạch học tập')",
    generate: "Tạo gợi ý",
    smartAnalyze: "Phân tích thông minh",
    suggestedTasks: "Công việc được đề xuất",
    add: "Thêm",
    aiSetup: "Cài đặt AI",
    aiSetupStep1: "Lấy API key miễn phí từ https://aistudio.google.com/app/apikey",
    aiSetupStep2: "Thêm VITE_GEMINI_API_KEY=your_key vào file .env",
    aiSetupStep3: "Khởi động lại dev server",
    enterPrompt: "Vui lòng nhập yêu cầu",
    aiKeyMissing: "Không tìm thấy AI API key. Vui lòng thêm VITE_GEMINI_API_KEY vào file .env",
    aiError: "Lỗi AI",
    aiParseError: "Không thể phân tích phản hồi từ AI",
  },
  
  ja: {
    // Header
    appTitle: "クラウドTodo",
    appSubtitle: "クラウド上のスマートタスク管理",
    
    // Auth
    welcome: "ようこそ！",
    signInMessage: "タスク管理を開始するにはサインインしてください",
    signInButton: "Googleでサインイン",
    signingIn: "サインイン中...",
    logout: "ログアウト",
    hello: "こんにちは",
    
    // Stats
    total: "合計",
    active: "進行中",
    done: "完了",
    overallProgress: "全体の進捗",
    
    // Add Todo Form
    addTaskPlaceholder: "新しいタスクを追加...",
    addButton: "追加",
    
    // Priority
    priorityLow: "低",
    priorityMedium: "中",
    priorityHigh: "高",
    
    // Category
    categoryPersonal: "個人",
    categoryWork: "仕事",
    categoryShopping: "買い物",
    categoryHealth: "健康",
    
    // Filter
    filterAll: "すべて",
    filterActive: "進行中",
    filterCompleted: "完了",
    
    // Search
    searchPlaceholder: "タスクを検索...",
    
    // Empty state
    noTasks: "タスクはまだありません",
    
    // Actions
    edit: "編集",
    delete: "削除",
    
    // Notifications
    loginSuccess: "✅ ログインに成功しました！",
    loginError: "❌ ログインエラー",
    logoutSuccess: "👋 ログアウトしました",
    taskAdded: "✨ 新しいタスクが追加されました！",
    taskCompleted: "🎉 タスクが完了しました！",
    taskDeleted: "🗑️ タスクが削除されました",
    changesSaved: "💾 変更が保存されました",
    error: "❌ エラー",
    deleteError: "❌ 削除エラー",
    loadError: "❌ データの読み込みエラー",
    
    // Theme
    darkMode: "ダークモード",
    lightMode: "ライトモード",
    
    // Language
    language: "言語",
    vietnamese: "Tiếng Việt",
    english: "English",
    japanese: "日本語",
    
    // Statistics
    statistics: "統計ダッシュボード",
    tasks: "タスク",
    taskStatus: "タスクの状態",
    tasksByPriority: "優先度別",
    tasksByCategory: "カテゴリー別",
    last7DaysTrend: "過去7日間の傾向",
    completed: "完了",
    
    // Calendar
    calendarView: "カレンダー表示",
    tasksOn: "タスク：",
    noTasksForDate: "この日にタスクはありません",
    hasTasks: "タスクあり",
    overdue: "期限切れ",
    
    // AI Suggestions
    aiSuggestions: "AI提案",
    aiPromptPlaceholder: "どんなタスクが必要ですか？（例：「ワークアウトルーティン」「学習計画」）",
    generate: "生成",
    smartAnalyze: "スマート分析",
    suggestedTasks: "提案されたタスク",
    add: "追加",
    aiSetup: "AIアシスタント設定",
    aiSetupStep1: "https://aistudio.google.com/app/apikey から無料APIキーを取得",
    aiSetupStep2: ".envファイルにVITE_GEMINI_API_KEY=your_keyを追加",
    aiSetupStep3: "開発サーバーを再起動",
    enterPrompt: "プロンプトを入力してください",
    aiKeyMissing: "AI APIキーが見つかりません。.envファイルにVITE_GEMINI_API_KEYを追加してください",
    aiError: "AIエラー",
    aiParseError: "AI応答を解析できませんでした",
  }
};
