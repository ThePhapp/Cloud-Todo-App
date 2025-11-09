import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

const MOODS = [
  {
    id: 'energetic',
    emoji: '⚡',
    name: 'Energetic',
    nameVi: 'Tràn đầy năng lượng',
    nameJa: 'エネルギッシュ',
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-yellow-50',
    darkBgColor: 'bg-yellow-900/20',
    taskTypes: ['challenging', 'learning', 'problem-solving', 'workout']
  },
  {
    id: 'happy',
    emoji: '😊',
    name: 'Happy',
    nameVi: 'Vui vẻ',
    nameJa: '幸せ',
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-pink-50',
    darkBgColor: 'bg-pink-900/20',
    taskTypes: ['creative', 'brainstorming', 'presentation', 'social']
  },
  {
    id: 'focused',
    emoji: '🎯',
    name: 'Focused',
    nameVi: 'Tập trung',
    nameJa: '集中',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-50',
    darkBgColor: 'bg-blue-900/20',
    taskTypes: ['deep-work', 'writing', 'coding', 'analysis']
  },
  {
    id: 'calm',
    emoji: '😌',
    name: 'Calm',
    nameVi: 'Bình tĩnh',
    nameJa: '穏やか',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-50',
    darkBgColor: 'bg-green-900/20',
    taskTypes: ['planning', 'organizing', 'review', 'meditation']
  },
  {
    id: 'stressed',
    emoji: '😰',
    name: 'Stressed',
    nameVi: 'Căng thẳng',
    nameJa: 'ストレス',
    color: 'from-gray-400 to-gray-600',
    bgColor: 'bg-gray-50',
    darkBgColor: 'bg-gray-900/20',
    taskTypes: ['easy-wins', 'cleanup', 'simple-tasks', 'break']
  },
  {
    id: 'tired',
    emoji: '😴',
    name: 'Tired',
    nameVi: 'Mệt mỏi',
    nameJa: '疲れた',
    color: 'from-purple-400 to-violet-500',
    bgColor: 'bg-purple-50',
    darkBgColor: 'bg-purple-900/20',
    taskTypes: ['light-reading', 'email', 'routine', 'rest']
  }
];

function MoodTracker({ darkMode, onMoodChange, currentMood }) {
  const { t, language } = useLanguage();
  const [selectedMood, setSelectedMood] = useState(currentMood || null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Load saved mood from localStorage
    const savedMood = localStorage.getItem('todayMood');
    const savedDate = localStorage.getItem('moodDate');
    const today = new Date().toDateString();

    if (savedMood && savedDate === today) {
      setSelectedMood(savedMood);
      onMoodChange(savedMood);
    }
  }, [onMoodChange]);

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    setShowSuggestions(true);
    
    // Save to localStorage
    localStorage.setItem('todayMood', moodId);
    localStorage.setItem('moodDate', new Date().toDateString());
    
    // Trigger callback
    onMoodChange(moodId);

    // Hide suggestions after 3 seconds
    setTimeout(() => setShowSuggestions(false), 3000);
  };

  const getMoodName = (mood) => {
    if (language === 'vi') return mood.nameVi;
    if (language === 'ja') return mood.nameJa;
    return mood.name;
  };

  const getMoodSuggestion = (moodId) => {
    const suggestions = {
      energetic: {
        en: "Perfect for tackling challenging tasks! 💪",
        vi: "Hoàn hảo để giải quyết công việc khó! 💪",
        ja: "チャレンジングなタスクに最適！💪"
      },
      happy: {
        en: "Great time for creative work! 🎨",
        vi: "Thời điểm tuyệt vời cho công việc sáng tạo! 🎨",
        ja: "クリエイティブな仕事に最適！🎨"
      },
      focused: {
        en: "Deep work mode activated! 🧠",
        vi: "Chế độ tập trung sâu đã bật! 🧠",
        ja: "ディープワークモード起動！🧠"
      },
      calm: {
        en: "Good for planning and organizing! 📋",
        vi: "Tốt cho lập kế hoạch và sắp xếp! 📋",
        ja: "計画と整理に良い！📋"
      },
      stressed: {
        en: "Take it easy with simple tasks 🌸",
        vi: "Hãy làm những việc đơn giản thôi 🌸",
        ja: "簡単なタスクでゆっくり🌸"
      },
      tired: {
        en: "Time for light tasks or rest 😴",
        vi: "Đến lúc làm việc nhẹ hoặc nghỉ ngơi 😴",
        ja: "軽いタスクか休憩の時間😴"
      }
    };

    const suggestion = suggestions[moodId];
    if (language === 'vi') return suggestion.vi;
    if (language === 'ja') return suggestion.ja;
    return suggestion.en;
  };

  const activeMood = MOODS.find(m => m.id === selectedMood);

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-2xl shadow-xl p-6 mb-6`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          🎭 {t('moodTracker')}
        </h2>
        {selectedMood && (
          <button
            onClick={() => handleMoodSelect(null)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {t('reset')}
          </button>
        )}
      </div>

      {/* Mood Selection Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleMoodSelect(mood.id)}
            className={`relative p-4 rounded-xl transition-all duration-300 transform hover:scale-110 ${
              selectedMood === mood.id
                ? `bg-gradient-to-br ${mood.color} text-white shadow-lg scale-105`
                : darkMode
                ? mood.darkBgColor
                : mood.bgColor
            }`}
          >
            <div className="text-4xl mb-2">{mood.emoji}</div>
            <div className="text-xs font-medium">{getMoodName(mood)}</div>
            
            {selectedMood === mood.id && (
              <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-700 rounded-full p-1">
                ✓
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Mood Suggestion */}
      {showSuggestions && activeMood && (
        <div className={`p-4 rounded-xl ${darkMode ? activeMood.darkBgColor : activeMood.bgColor} 
          border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'}
          animate-pulse`}
        >
          <p className="text-center font-medium">
            {getMoodSuggestion(selectedMood)}
          </p>
        </div>
      )}

      {/* Current Mood Display */}
      {selectedMood && !showSuggestions && (
        <div className={`text-center p-3 rounded-lg ${
          darkMode ? activeMood.darkBgColor : activeMood.bgColor
        }`}>
          <span className="text-lg">
            {t('currentMood')}: {activeMood.emoji} {getMoodName(activeMood)}
          </span>
        </div>
      )}

      {/* Mood Tips */}
      {!selectedMood && (
        <div className={`text-center p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="text-sm">{t('moodPrompt')}</p>
        </div>
      )}
    </div>
  );
}

export default MoodTracker;
export { MOODS };
