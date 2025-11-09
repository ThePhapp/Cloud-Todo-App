import { useMemo } from 'react';
import { MOODS } from './MoodTracker';
import { useLanguage } from '../LanguageContext';

function MoodBasedSuggestions({ todos, currentMood, darkMode, addTodoFromMood }) {
  const { t } = useLanguage();

  const moodConfig = MOODS.find(m => m.id === currentMood);

  // Categorize todos based on keywords and characteristics
  const categorizedTodos = useMemo(() => {
    if (!currentMood) return [];

    const categories = {
      energetic: (todo) => {
        const keywords = ['workout', 'exercise', 'challenge', 'difficult', 'hard', 'complex'];
        return keywords.some(k => todo.text.toLowerCase().includes(k)) || 
               todo.priority === 'high';
      },
      happy: (todo) => {
        const keywords = ['create', 'design', 'brainstorm', 'idea', 'present', 'meeting'];
        return keywords.some(k => todo.text.toLowerCase().includes(k)) ||
               todo.category === 'personal';
      },
      focused: (todo) => {
        const keywords = ['write', 'code', 'analyze', 'study', 'read', 'research'];
        return keywords.some(k => todo.text.toLowerCase().includes(k)) ||
               todo.category === 'work';
      },
      calm: (todo) => {
        const keywords = ['plan', 'organize', 'schedule', 'review', 'sort'];
        return keywords.some(k => todo.text.toLowerCase().includes(k)) ||
               todo.priority === 'low';
      },
      stressed: (todo) => {
        const keywords = ['quick', 'easy', 'simple', 'email', 'reply', 'clean'];
        return keywords.some(k => todo.text.toLowerCase().includes(k)) ||
               (todo.priority === 'low' && !todo.dueDate);
      },
      tired: (todo) => {
        const keywords = ['email', 'check', 'review', 'light', 'easy'];
        return keywords.some(k => todo.text.toLowerCase().includes(k)) ||
               (todo.priority === 'low' && todo.completed === false);
      }
    };

    const matchingTodos = todos.filter(todo => 
      !todo.completed && categories[currentMood] && categories[currentMood](todo)
    );

    return matchingTodos.slice(0, 5); // Top 5 suggestions
  }, [todos, currentMood]);

  // Pre-made task templates based on mood
  const taskTemplates = {
    energetic: [
      { text: "Complete a challenging workout session", category: "health", priority: "high" },
      { text: "Tackle the most difficult task on my list", category: "work", priority: "high" },
      { text: "Learn something new and complex", category: "personal", priority: "medium" }
    ],
    happy: [
      { text: "Brainstorm creative ideas for upcoming project", category: "work", priority: "medium" },
      { text: "Design or create something artistic", category: "personal", priority: "medium" },
      { text: "Connect with friends or colleagues", category: "personal", priority: "low" }
    ],
    focused: [
      { text: "Deep work session on important project", category: "work", priority: "high" },
      { text: "Write detailed documentation or report", category: "work", priority: "medium" },
      { text: "Study and take notes on complex topic", category: "personal", priority: "medium" }
    ],
    calm: [
      { text: "Plan out the week ahead", category: "personal", priority: "medium" },
      { text: "Organize workspace and files", category: "work", priority: "low" },
      { text: "Review and prioritize task list", category: "personal", priority: "low" }
    ],
    stressed: [
      { text: "Complete 3 quick and easy tasks", category: "work", priority: "low" },
      { text: "Clean up email inbox", category: "work", priority: "low" },
      { text: "Take a 10-minute mindfulness break", category: "health", priority: "medium" }
    ],
    tired: [
      { text: "Light reading or casual learning", category: "personal", priority: "low" },
      { text: "Reply to simple emails", category: "work", priority: "low" },
      { text: "Take a power nap or rest", category: "health", priority: "high" }
    ]
  };

  if (!currentMood || !moodConfig) {
    return null;
  }

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-2xl shadow-xl p-6 mb-6`}>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="text-2xl">{moodConfig.emoji}</span>
        {t('moodBasedSuggestions')}
      </h3>

      {/* Matching Existing Tasks */}
      {categorizedTodos.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400">
            ✨ {t('recommendedFromYourTasks')}
          </h4>
          <div className="space-y-2">
            {categorizedTodos.map((todo) => (
              <div
                key={todo.id}
                className={`p-3 rounded-lg border-2 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                } hover:border-purple-500 transition-colors duration-200`}
              >
                <div className="flex items-center gap-2">
                  <span>
                    {todo.priority === 'high' ? '🔴' : 
                     todo.priority === 'medium' ? '🟡' : '🟢'}
                  </span>
                  <span className="flex-1">{todo.text}</span>
                  <span className="text-xs px-2 py-1 rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                    {t('perfect')}!
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template Suggestions */}
      <div>
        <h4 className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400">
          💡 {t('suggestedNewTasks')}
        </h4>
        <div className="space-y-2">
          {taskTemplates[currentMood].map((template, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-2 border-dashed ${
                darkMode 
                  ? 'bg-gray-700/50 border-gray-600' 
                  : 'bg-gray-50 border-gray-300'
              } flex items-center justify-between gap-3`}
            >
              <div className="flex items-center gap-2 flex-1">
                <span>
                  {template.priority === 'high' ? '🔴' : 
                   template.priority === 'medium' ? '🟡' : '🟢'}
                </span>
                <span className="text-sm">{template.text}</span>
              </div>
              <button
                onClick={() => addTodoFromMood(template)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                ➕ {t('add')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mood Tips */}
      <div className={`mt-4 p-3 rounded-lg text-xs ${
        darkMode ? moodConfig.darkBgColor : moodConfig.bgColor
      }`}>
        <p className="font-medium mb-1">💡 {t('tip')}:</p>
        <p className="text-gray-700 dark:text-gray-300">
          {getMoodTip(currentMood, t)}
        </p>
      </div>
    </div>
  );
}

function getMoodTip(mood, t) {
  const tips = {
    energetic: {
      en: "Ride this wave! Tackle your most challenging tasks now. Your energy won't last forever.",
      vi: "Hãy tận dụng! Giải quyết những công việc khó nhất ngay bây giờ. Năng lượng sẽ không kéo dài mãi.",
      ja: "この波に乗ろう！最も困難なタスクに今取り組みましょう。エネルギーは永遠には続きません。"
    },
    happy: {
      en: "Perfect time for creative work! Your positive mindset will enhance innovation.",
      vi: "Thời điểm hoàn hảo cho công việc sáng tạo! Tâm trạng tích cực sẽ tăng cường sự đổi mới.",
      ja: "クリエイティブな仕事に最適な時間！前向きな考え方が革新性を高めます。"
    },
    focused: {
      en: "Deep work mode! Minimize distractions and dive into complex tasks.",
      vi: "Chế độ làm việc sâu! Giảm thiểu phân tâm và tập trung vào công việc phức tạp.",
      ja: "ディープワークモード！気を散らすものを最小限にして、複雑なタスクに没頭しましょう。"
    },
    calm: {
      en: "Great for strategic thinking. Plan, organize, and prepare for upcoming challenges.",
      vi: "Tuyệt vời cho tư duy chiến lược. Lập kế hoạch, sắp xếp và chuẩn bị cho thử thách sắp tới.",
      ja: "戦略的思考に最適。計画し、整理し、今後の課題に備えましょう。"
    },
    stressed: {
      en: "Be gentle with yourself. Focus on quick wins to build momentum and reduce stress.",
      vi: "Hãy nhẹ nhàng với bản thân. Tập trung vào chiến thắng nhanh để tạo động lực và giảm căng thẳng.",
      ja: "自分に優しくしましょう。素早い成功に集中して勢いをつけ、ストレスを減らしましょう。"
    },
    tired: {
      en: "Listen to your body. Do light tasks or consider taking a proper break.",
      vi: "Hãy lắng nghe cơ thể. Làm công việc nhẹ nhàng hoặc cân nhắc nghỉ ngơi đúng cách.",
      ja: "体の声を聞きましょう。軽いタスクをするか、適切な休憩を取ることを検討してください。"
    }
  };

  const tip = tips[mood];
  const lang = t('language');
  
  if (lang === 'vi') return tip.vi;
  if (lang === 'ja') return tip.ja;
  return tip.en;
}

export default MoodBasedSuggestions;
