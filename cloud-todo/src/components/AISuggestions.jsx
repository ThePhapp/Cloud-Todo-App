import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useLanguage } from '../LanguageContext';

function AISuggestions({ todos, darkMode, addTodoFromAI, user }) {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');

  const generateSuggestions = async () => {
    if (!prompt.trim()) {
      setError(t('enterPrompt'));
      return;
    }

    setLoading(true);
    setError('');
    setSuggestions([]);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        setError(t('aiKeyMissing'));
        setLoading(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      // Prepare context about existing todos
      const existingTasks = todos.map(t => `- ${t.text} (${t.category}, ${t.priority})`).join('\n');
      
      let languageInstruction = 'Respond in English';
      if (language === 'vi') languageInstruction = 'Trả lời bằng tiếng Việt';
      if (language === 'ja') languageInstruction = '日本語で答えてください';

      const fullPrompt = `${languageInstruction}. You are a productivity assistant. Based on this request: "${prompt}"

Current user's tasks:
${existingTasks || 'No existing tasks'}

Generate 3-5 relevant task suggestions. For each task, provide:
1. Task description (concise, actionable)
2. Priority (high/medium/low)
3. Category (personal/work/shopping/health)

Format your response as a JSON array like this:
[
  {
    "text": "Task description",
    "priority": "medium",
    "category": "work"
  }
]

Only return the JSON array, no additional text.`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setSuggestions(parsed);
      } else {
        setError(t('aiParseError'));
      }
    } catch (err) {
      console.error('AI Error:', err);
      setError(t('aiError') + ': ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const smartAnalyze = async () => {
    setLoading(true);
    setError('');
    setSuggestions([]);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setError(t('aiKeyMissing'));
        setLoading(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const existingTasks = todos.map(t => 
        `- ${t.text} (${t.category}, ${t.priority}, ${t.completed ? 'done' : 'pending'})`
      ).join('\n');

      let languageInstruction = 'Respond in English';
      if (language === 'vi') languageInstruction = 'Trả lời bằng tiếng Việt';
      if (language === 'ja') languageInstruction = '日本語で答えてください';

      const analysisPrompt = `${languageInstruction}. You are a productivity coach. Analyze these tasks and suggest 3-5 new tasks to improve work-life balance, productivity, or fill in missing areas:

Current tasks:
${existingTasks || 'No tasks yet'}

Suggest tasks as JSON array:
[
  {
    "text": "Task description",
    "priority": "medium",
    "category": "work"
  }
]`;

      const result = await model.generateContent(analysisPrompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setSuggestions(parsed);
      } else {
        setError(t('aiParseError'));
      }
    } catch (err) {
      console.error('AI Error:', err);
      setError(t('aiError') + ': ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        🤖 {t('aiSuggestions')}
      </h2>

      {/* Input Section */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && generateSuggestions()}
            placeholder={t('aiPromptPlaceholder')}
            className={`flex-1 border-2 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            } rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none`}
            disabled={loading}
          />
          <button
            onClick={generateSuggestions}
            disabled={loading || !prompt.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳' : '✨'} {t('generate')}
          </button>
        </div>

        <button
          onClick={smartAnalyze}
          disabled={loading}
          className={`w-full ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          } px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50`}
        >
          🧠 {t('smartAnalyze')}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border-2 border-red-300 text-red-700 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">{t('suggestedTasks')}:</h3>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`border-2 ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
              } rounded-xl p-4 flex items-start justify-between gap-3`}
            >
              <div className="flex-1">
                <p className="font-medium mb-2">{suggestion.text}</p>
                <div className="flex gap-2 text-sm">
                  <span className={`px-2 py-1 rounded ${
                    suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                    suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {suggestion.priority === 'high' ? '🔴' : suggestion.priority === 'medium' ? '🟡' : '🟢'} 
                    {' '}{t(`priority${suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1)}`)}
                  </span>
                  <span className={`px-2 py-1 rounded ${
                    darkMode ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    {suggestion.category === 'personal' ? '👤' :
                     suggestion.category === 'work' ? '💼' :
                     suggestion.category === 'shopping' ? '🛒' : '💪'}
                    {' '}{t(`category${suggestion.category.charAt(0).toUpperCase() + suggestion.category.slice(1)}`)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => addTodoFromAI(suggestion)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                ➕ {t('add')}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Setup Instructions */}
      {!import.meta.env.VITE_GEMINI_API_KEY && (
        <div className={`mt-4 p-4 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border-2 ${
          darkMode ? 'border-gray-600' : 'border-blue-200'
        } rounded-xl text-sm`}>
          <p className="font-semibold mb-2">⚙️ {t('aiSetup')}:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>{t('aiSetupStep1')}</li>
            <li>{t('aiSetupStep2')}</li>
            <li>{t('aiSetupStep3')}</li>
          </ol>
        </div>
      )}
    </div>
  );
}

export default AISuggestions;
