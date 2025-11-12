# ☁️ Cloud Todo App

A smart cloud-based Todo List application built with Firebase & React.

## ✨ Features

### 🔐 Authentication
- **Google Sign-in** – Secure authentication via Firebase Auth
- **Session management** – Automatically saves login state

### 📝 Task Management
- **Add todos** – Quickly create new tasks
- **Inline editing** – Edit tasks directly in the list
- **Delete todos** – Remove unnecessary tasks
- **Mark as completed** – Checkbox to track progress

### 🎯 Advanced Features
- **Priority levels** – 3 levels: Low 🟢, Medium 🟡, High 🔴
- **Categories** – 4 types: Personal 👤, Work 💼, Shopping 🛒, Health 💪
- **Due date** – Set deadlines for tasks
- **Filtering** – View All / Active / Completed tasks
- **Search** – Quickly find tasks by keyword
- **Drag & Drop** – Reorder tasks with drag and drop
- **Dark Mode** – Light/Dark theme toggle, saves preference
- **Multi-language** – Supports Vietnamese, English, 日本語

### 📊 Statistics Dashboard
- **Overview** – Task counts by status
- **Pie chart** – Completed vs active tasks
- **Bar chart** – Tasks by priority and category
- **7-day trend** – Line chart for daily completion

### 📅 Calendar View
- **Interactive calendar** – View tasks by date
- **Color coding** – Green (completed), Blue (has tasks), Red (overdue)
- **Day details** – Click a date to see its tasks
- **Quick management** – Edit/Delete directly from calendar

### 🤖 AI Suggestions (Gemini Pro)
- **Create tasks from prompt** – Describe your needs, AI generates tasks
- **Smart analysis** – AI analyzes current tasks and suggests new ones
- **Auto-categorization** – AI suggests priority & category for each task
- **Multi-language** – AI understands and responds in your chosen language

### 🎮 Gamification System
- **XP & Levels** – Earn experience points for completing tasks
- **Streak Counter** – Track consecutive productive days
- **Badges/Achievements** – Unlock badges for milestones (100 tasks, 30-day streak, etc.)
- **Leaderboard** – Compare with friends/colleagues
- **Boss Battles** – Mark difficult tasks as "Boss", defeat for big rewards

### 🎵 Music & Task Correlation
- **Spotify Integration** – Play playlists based on task type
- **Focus Music Generator** – AI creates instrumental music for focus
- **Task-to-Song Mapping** – Each project can have its own theme song

### 🎨 UI/UX
- **Beautiful gradients** – Smooth color transitions
- **Responsive design** – Works on all devices
- **Animations** – Smooth transitions (shimmer, confetti)
- **Toast notifications** – Real-time feedback
- **Progress bar** – Animated completion bar
- **Tab navigation** – Tasks, Statistics, Calendar, AI, Game, Music, Mood
- **Hover effects** – Intuitive interactions

### ☁️ Cloud Sync
- **Real-time sync** – Instant updates across devices
- **Firebase Firestore** – Powerful NoSQL database
- **Offline support** – Firebase caches data automatically

## 🛠️ Tech Stack

- **React 19** – Modern UI framework
- **Vite 7** – Fast build tool with HMR
- **Tailwind CSS 3** – Utility-first CSS framework
- **@dnd-kit** – Modern drag and drop library
- **Recharts** – Chart library for React
- **React Calendar** – Calendar component
- **date-fns** – Date utility library
- **Firebase 12**
  - Authentication (Google Sign-in)
  - Firestore (Real-time database)
  - Hosting (Auto deploy)
- **Google Generative AI (Gemini Pro)** – AI suggestions

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/ThePhapp/Cloud-Todo-App.git
cd Cloud-Todo-App/cloud-todo
```
