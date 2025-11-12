import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

// Music recommendations by task type
const MUSIC_LIBRARY = {
  // Work tasks
  work: {
    deep: {
      name: { en: 'Deep Focus', vi: 'Tập trung sâu', ja: 'ディープフォーカス' },
      emoji: '🧠',
      tracks: [
        { name: 'Lofi Hip Hop Radio', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', duration: '∞' },
        { name: 'Deep Focus Playlist', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ', duration: '180min' },
        { name: 'Brain Food', url: 'https://open.spotify.com/playlist/37i9dQZF1DWXLeA8Omikj7', duration: '120min' }
      ],
      color: 'from-blue-500 to-indigo-600'
    },
    coding: {
      name: { en: 'Coding Flow', vi: 'Dòng code', ja: 'コーディング' },
      emoji: '💻',
      tracks: [
        { name: 'Synthwave Mix', url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY', duration: '60min' },
        { name: 'Electronic Focus', url: 'https://open.spotify.com/playlist/37i9dQZF1DX5trt9i14X7j', duration: '150min' },
        { name: 'Cyberpunk 2077 OST', url: 'https://www.youtube.com/watch?v=P0YNa3bK_HQ', duration: '45min' }
      ],
      color: 'from-cyan-500 to-blue-600'
    },
    meeting: {
      name: { en: 'Upbeat Energy', vi: 'Năng lượng tích cực', ja: 'アップビート' },
      emoji: '🎤',
      tracks: [
        { name: 'Indie Pop', url: 'https://open.spotify.com/playlist/37i9dQZF1DX2sUQwD7tbmL', duration: '90min' },
        { name: 'Feel Good Mix', url: 'https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0', duration: '120min' }
      ],
      color: 'from-orange-500 to-red-600'
    }
  },
  
  // Personal tasks
  personal: {
    creative: {
      name: { en: 'Creative Flow', vi: 'Dòng sáng tạo', ja: 'クリエイティブ' },
      emoji: '🎨',
      tracks: [
        { name: 'Ambient Music', url: 'https://www.youtube.com/watch?v=maAgF_NZ0sg', duration: '180min' },
        { name: 'Peaceful Piano', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO', duration: '150min' },
        { name: 'Instrumental Study', url: 'https://www.youtube.com/watch?v=5qap5aO4i9A', duration: '120min' }
      ],
      color: 'from-purple-500 to-pink-600'
    },
    reading: {
      name: { en: 'Reading Ambiance', vi: 'Không gian đọc sách', ja: '読書用' },
      emoji: '📚',
      tracks: [
        { name: 'Coffee Shop Ambiance', url: 'https://www.youtube.com/watch?v=gaJWii_XOg', duration: '∞' },
        { name: 'Jazz Vibes', url: 'https://open.spotify.com/playlist/37i9dQZF1DX0SM0LYsmbMT', duration: '90min' },
        { name: 'Classical Study', url: 'https://www.youtube.com/watch?v=jgpJVI3tDbY', duration: '240min' }
      ],
      color: 'from-amber-500 to-orange-600'
    },
    relax: {
      name: { en: 'Chill Vibes', vi: 'Thư giãn', ja: 'リラックス' },
      emoji: '😌',
      tracks: [
        { name: 'Chillhop Radio', url: 'https://www.youtube.com/watch?v=5yx6BWlEVcY', duration: '∞' },
        { name: 'Peaceful Piano', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO', duration: '180min' },
        { name: 'Nature Sounds', url: 'https://www.youtube.com/watch?v=n3QXodJLzbI', duration: '60min' }
      ],
      color: 'from-green-500 to-teal-600'
    }
  },
  
  // Health tasks
  health: {
    workout: {
      name: { en: 'Workout Beast', vi: 'Quái vật tập luyện', ja: 'ワークアウト' },
      emoji: '💪',
      tracks: [
        { name: 'Workout Mix', url: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP', duration: '90min' },
        { name: 'Beast Mode', url: 'https://www.youtube.com/watch?v=oYSuSPxE4Mc', duration: '60min' },
        { name: 'Gym Motivation', url: 'https://open.spotify.com/playlist/37i9dQZF1DX70RN3TfWWJh', duration: '120min' }
      ],
      color: 'from-red-500 to-orange-600'
    },
    meditation: {
      name: { en: 'Zen Mode', vi: 'Thiền định', ja: '瞑想' },
      emoji: '🧘',
      tracks: [
        { name: 'Meditation Music', url: 'https://www.youtube.com/watch?v=lFcSrYw-ARY', duration: '30min' },
        { name: 'Sleep Sounds', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp', duration: '120min' },
        { name: 'Healing Frequencies', url: 'https://www.youtube.com/watch?v=1ZYbU82GVz4', duration: '60min' }
      ],
      color: 'from-indigo-500 to-purple-600'
    },
    yoga: {
      name: { en: 'Yoga Flow', vi: 'Dòng Yoga', ja: 'ヨガ' },
      emoji: '🕉️',
      tracks: [
        { name: 'Yoga Music', url: 'https://www.youtube.com/watch?v=a6Df6v6jPQo', duration: '60min' },
        { name: 'Spa Relaxation', url: 'https://open.spotify.com/playlist/37i9dQZF1DX1H8oeB4JXPE', duration: '90min' }
      ],
      color: 'from-teal-500 to-green-600'
    }
  },
  
  // Shopping tasks
  shopping: {
    planning: {
      name: { en: 'Shop Mood', vi: 'Mood mua sắm', ja: 'ショッピング' },
      emoji: '🛒',
      tracks: [
        { name: 'Pop Hits', url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M', duration: '120min' },
        { name: 'Feel Good Music', url: 'https://www.youtube.com/watch?v=GVCzdpagXOQ', duration: '90min' }
      ],
      color: 'from-pink-500 to-rose-600'
    }
  }
};

// AI Music Generator prompts
const AI_MUSIC_PROMPTS = {
  high: 'energetic, fast-paced, motivating instrumental music',
  medium: 'calm, focused, productive background music',
  low: 'relaxed, ambient, peaceful instrumental sounds'
};

function MusicPlayer({ darkMode, currentTask, category }) {
  const { t, language } = useLanguage();
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [taskTheme, setTaskTheme] = useState({});

  // Get music recommendation based on task
  const getMusicForTask = (task) => {
    if (!task) return null;

    const category = task.category || 'personal';
    const priority = task.priority || 'medium';
    
    // Smart matching based on keywords
    const text = task.text.toLowerCase();
    
    if (text.includes('code') || text.includes('program')) {
      return MUSIC_LIBRARY.work.coding;
    } else if (text.includes('meet') || text.includes('present')) {
      return MUSIC_LIBRARY.work.meeting;
    } else if (text.includes('write') || text.includes('study')) {
      return MUSIC_LIBRARY.personal.reading;
    } else if (text.includes('workout') || text.includes('exercise')) {
      return MUSIC_LIBRARY.health.workout;
    } else if (text.includes('meditat') || text.includes('relax')) {
      return MUSIC_LIBRARY.health.meditation;
    } else if (text.includes('yoga')) {
      return MUSIC_LIBRARY.health.yoga;
    } else if (text.includes('creative') || text.includes('design')) {
      return MUSIC_LIBRARY.personal.creative;
    } else if (category === 'work') {
      return MUSIC_LIBRARY.work.deep;
    } else if (category === 'health') {
      return MUSIC_LIBRARY.health.workout;
    } else if (category === 'shopping') {
      return MUSIC_LIBRARY.shopping.planning;
    } else {
      return MUSIC_LIBRARY.personal.relax;
    }
  };

  useEffect(() => {
    if (currentTask) {
      const playlist = getMusicForTask(currentTask);
      setCurrentPlaylist(playlist);
    }
  }, [currentTask]);

  // Save task theme song
  const saveTaskTheme = (taskId, track) => {
    const newTheme = { ...taskTheme, [taskId]: track };
    setTaskTheme(newTheme);
    localStorage.setItem('taskThemes', JSON.stringify(newTheme));
  };

  // Load task themes
  useEffect(() => {
    const saved = localStorage.getItem('taskThemes');
    if (saved) {
      setTaskTheme(JSON.parse(saved));
    }
  }, []);

  const getName = (obj) => {
    return obj[language] || obj.en;
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        🎵 {t('musicPlayer')}
      </h2>

      {/* Current Playing */}
      {currentPlaylist && (
        <div className={`p-6 rounded-xl bg-gradient-to-r ${currentPlaylist.color} text-white mb-6`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">{currentPlaylist.emoji}</div>
            <div className="flex-1">
              <div className="text-sm opacity-80">{t('nowSuggested')}</div>
              <div className="text-2xl font-bold">{getName(currentPlaylist.name)}</div>
              {currentTask && (
                <div className="text-sm opacity-90 mt-1">
                  {t('for')}: {currentTask.text}
                </div>
              )}
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 mb-4">
            <span>🔊</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="flex-1 h-2 bg-white/30 rounded-full appearance-none cursor-pointer"
            />
            <span className="text-sm font-semibold w-12">{volume}%</span>
          </div>

          {/* Play Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-2xl">{isPlaying ? '⏸️' : '▶️'}</span>
            {isPlaying ? t('pause') : t('play')}
          </button>
        </div>
      )}

      {/* Track List */}
      {currentPlaylist && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">{t('recommendedTracks')}:</h3>
          <div className="space-y-2">
            {currentPlaylist.tracks.map((track, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 hover:border-purple-500'
                    : 'bg-gray-50 border-gray-200 hover:border-purple-500'
                } transition-colors duration-200 cursor-pointer`}
                onClick={() => window.open(track.url, '_blank')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🎧</span>
                    <div>
                      <div className="font-medium">{track.name}</div>
                      <div className="text-xs text-gray-500">{track.duration}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {currentTask && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          saveTaskTheme(currentTask.id, track);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg"
                        title={t('setAsTheme')}
                      >
                        ⭐
                      </button>
                    )}
                    <span className="text-gray-400">▶️</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Music Generator */}
      <div className={`p-4 rounded-xl border-2 border-dashed ${
        darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-gray-50'
      }`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🤖</span>
          <div>
            <div className="font-semibold">{t('aiFocusMusic')}</div>
            <div className="text-xs text-gray-500">{t('aiMusicDesc')}</div>
          </div>
        </div>
        <button
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          onClick={() => window.open('https://www.youtube.com/watch?v=jfKfPfyJRdk', '_blank')}
        >
          {t('generateMusic')} ✨
        </button>
      </div>

      {/* Music Library Browser */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3">{t('browseLibrary')}:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(MUSIC_LIBRARY).map(([cat, playlists]) =>
            Object.entries(playlists).map(([key, playlist]) => (
              <button
                key={`${cat}-${key}`}
                onClick={() => setCurrentPlaylist(playlist)}
                className={`p-4 rounded-xl text-center transition-all duration-200 bg-gradient-to-br ${playlist.color} text-white hover:scale-105 transform`}
              >
                <div className="text-3xl mb-2">{playlist.emoji}</div>
                <div className="text-xs font-semibold">{getName(playlist.name)}</div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
