import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../LanguageContext';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// XP Rewards based on task characteristics
const XP_REWARDS = {
  low: 10,
  medium: 25,
  high: 50,
  streak_bonus: 5,
  boss_defeat: 100,
};

// Level thresholds
const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000,
  20000, 26000, 33000, 41000, 50000
];

// Achievements/Badges
const ACHIEVEMENTS = [
  {
    id: 'first-blood',
    name: { en: 'First Blood', vi: 'Nhiệm vụ đầu tiên', ja: '初タスク' },
    description: { en: 'Complete your first task', vi: 'Hoàn thành task đầu tiên', ja: '最初のタスクを完了' },
    icon: '🎯',
    xp: 50,
    condition: (stats) => stats.totalCompleted >= 1
  },
  {
    id: 'on-fire',
    name: { en: 'On Fire!', vi: 'Bùng cháy!', ja: '燃えている！' },
    description: { en: '7 day streak', vi: '7 ngày liên tiếp', ja: '7日連続' },
    icon: '🔥',
    xp: 200,
    condition: (stats) => stats.currentStreak >= 7
  },
  {
    id: 'unstoppable',
    name: { en: 'Unstoppable', vi: 'Không thể cản', ja: '止められない' },
    description: { en: '30 day streak', vi: '30 ngày liên tiếp', ja: '30日連続' },
    icon: '⚡',
    xp: 1000,
    condition: (stats) => stats.currentStreak >= 30
  },
  {
    id: 'century',
    name: { en: 'Century Club', vi: 'Câu lạc bộ 100', ja: '100達成' },
    description: { en: '100 tasks completed', vi: '100 task hoàn thành', ja: '100タスク完了' },
    icon: '💯',
    xp: 500,
    condition: (stats) => stats.totalCompleted >= 100
  },
  {
    id: 'legendary',
    name: { en: 'Legendary', vi: 'Huyền thoại', ja: '伝説' },
    description: { en: '500 tasks completed', vi: '500 task hoàn thành', ja: '500タスク完了' },
    icon: '👑',
    xp: 2000,
    condition: (stats) => stats.totalCompleted >= 500
  },
  {
    id: 'boss-slayer',
    name: { en: 'Boss Slayer', vi: 'Sát thủ Boss', ja: 'ボス討伐者' },
    description: { en: 'Defeat 10 boss tasks', vi: 'Đánh bại 10 boss', ja: 'ボス10体撃破' },
    icon: '⚔️',
    xp: 800,
    condition: (stats) => stats.bossesDefeated >= 10
  },
  {
    id: 'speed-demon',
    name: { en: 'Speed Demon', vi: 'Ác quỷ tốc độ', ja: 'スピード悪魔' },
    description: { en: 'Complete 10 tasks in one day', vi: '10 task trong 1 ngày', ja: '1日で10タスク' },
    icon: '🚀',
    xp: 300,
    condition: (stats) => stats.maxTasksPerDay >= 10
  },
  {
    id: 'night-owl',
    name: { en: 'Night Owl', vi: 'Cú đêm', ja: '夜ふかし' },
    description: { en: 'Complete task after midnight', vi: 'Hoàn thành task sau 12h đêm', ja: '深夜にタスク完了' },
    icon: '🦉',
    xp: 100,
    condition: (stats) => stats.nightTasksCompleted >= 1
  }
];

function GamificationPanel({ user, todos, darkMode }) {
  const { t, language } = useLanguage();
  const [gameStats, setGameStats] = useState({
    xp: 0,
    level: 1,
    totalCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastCompletionDate: null,
    bossesDefeated: 0,
    maxTasksPerDay: 0,
    nightTasksCompleted: 0,
    unlockedAchievements: []
  });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);

  // Load game stats from Firestore
  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      const statsRef = doc(db, 'gameStats', user.uid);
      const statsDoc = await getDoc(statsRef);
      
      if (statsDoc.exists()) {
        setGameStats(statsDoc.data());
      } else {
        // Initialize stats for new user
        const initialStats = {
          xp: 0,
          level: 1,
          totalCompleted: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastCompletionDate: null,
          bossesDefeated: 0,
          maxTasksPerDay: 0,
          nightTasksCompleted: 0,
          unlockedAchievements: []
        };
        await setDoc(statsRef, initialStats);
        setGameStats(initialStats);
      }
    };

    loadStats();
  }, [user]);

  // Calculate current level and XP
  const currentLevelInfo = useMemo(() => {
    const level = gameStats.level;
    const currentXP = gameStats.xp;
    const levelThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    const nextLevelThreshold = LEVEL_THRESHOLDS[level + 1] || levelThreshold + 10000;
    const xpInLevel = currentXP - levelThreshold;
    const xpNeeded = nextLevelThreshold - levelThreshold;
    const progress = Math.min((xpInLevel / xpNeeded) * 100, 100);

    return {
      level,
      currentXP,
      xpInLevel,
      xpNeeded,
      progress,
      nextLevelThreshold
    };
  }, [gameStats.xp, gameStats.level]);

  // Award XP and update stats
  const awardXP = async (xpAmount, reason = '') => {
    if (!user) return;

    const newXP = gameStats.xp + xpAmount;
    const newLevel = calculateLevel(newXP);
    const leveledUp = newLevel > gameStats.level;

    const updatedStats = {
      ...gameStats,
      xp: newXP,
      level: newLevel
    };

    setGameStats(updatedStats);

    // Save to Firestore
    const statsRef = doc(db, 'gameStats', user.uid);
    await updateDoc(statsRef, updatedStats);

    // Show level up animation
    if (leveledUp) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  };

  const calculateLevel = (xp) => {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  };

  // Check for new achievements
  const checkAchievements = async () => {
    if (!user) return;

    const newUnlocked = [];

    for (const achievement of ACHIEVEMENTS) {
      if (!gameStats.unlockedAchievements.includes(achievement.id)) {
        if (achievement.condition(gameStats)) {
          newUnlocked.push(achievement);
          
          // Award XP for achievement
          await awardXP(achievement.xp, `Achievement: ${achievement.id}`);
        }
      }
    }

    if (newUnlocked.length > 0) {
      const updatedAchievements = [...gameStats.unlockedAchievements, ...newUnlocked.map(a => a.id)];
      const updatedStats = { ...gameStats, unlockedAchievements: updatedAchievements };
      
      setGameStats(updatedStats);
      
      const statsRef = doc(db, 'gameStats', user.uid);
      await updateDoc(statsRef, { unlockedAchievements: updatedAchievements });

      // Show achievement notification
      setNewAchievement(newUnlocked[0]);
      setTimeout(() => setNewAchievement(null), 3000);
    }
  };

  useEffect(() => {
    checkAchievements();
  }, [gameStats.totalCompleted, gameStats.currentStreak, gameStats.bossesDefeated]);

  // Calculate streak
  const calculateStreak = () => {
    const completedTodos = todos.filter(t => t.completed);
    if (completedTodos.length === 0) return 0;

    // Sort by completion date
    const sorted = completedTodos.sort((a, b) => {
      const dateA = a.completedAt || a.createdAt;
      const dateB = b.completedAt || b.createdAt;
      return dateB.toMillis() - dateA.toMillis();
    });

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const todo of sorted) {
      const todoDate = new Date((todo.completedAt || todo.createdAt).toDate());
      todoDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((currentDate - todoDate) / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }

    return streak;
  };

  // Boss task identification
  const isBossTask = (todo) => {
    return todo.priority === 'high' && !todo.completed;
  };

  const bossTasks = todos.filter(isBossTask);

  const getAchievementName = (achievement) => {
    return achievement.name[language] || achievement.name.en;
  };

  const getAchievementDesc = (achievement) => {
    return achievement.description[language] || achievement.description.en;
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
      {/* Level Up Animation */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-8 rounded-3xl text-white text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-4xl font-bold mb-2">LEVEL UP!</div>
            <div className="text-6xl font-bold">{currentLevelInfo.level}</div>
          </div>
        </div>
      )}

      {/* New Achievement Animation */}
      {newAchievement && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl shadow-2xl animate-slideIn">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{newAchievement.icon}</div>
            <div>
              <div className="text-sm font-semibold opacity-80">{t('achievementUnlocked')}</div>
              <div className="text-xl font-bold">{getAchievementName(newAchievement)}</div>
              <div className="text-sm opacity-90">+{newAchievement.xp} XP</div>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-3xl">🎮</span> {t('gamification')}
      </h2>

      {/* Level & XP Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
              Lv.{currentLevelInfo.level}
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('experience')}</div>
              <div className="text-xs text-gray-500">
                {currentLevelInfo.xpInLevel} / {currentLevelInfo.xpNeeded} XP
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{gameStats.xp.toLocaleString()}</div>
            <div className="text-xs text-gray-500">{t('totalXP')}</div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="relative w-full h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all duration-500 flex items-center justify-end px-3"
            style={{ width: `${currentLevelInfo.progress}%` }}
          >
            <span className="text-white font-bold text-sm">{Math.floor(currentLevelInfo.progress)}%</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon="✅"
          value={gameStats.totalCompleted}
          label={t('tasksCompleted')}
          darkMode={darkMode}
        />
        <StatCard
          icon="🔥"
          value={gameStats.currentStreak}
          label={t('currentStreak')}
          darkMode={darkMode}
          highlight={gameStats.currentStreak >= 7}
        />
        <StatCard
          icon="⚔️"
          value={gameStats.bossesDefeated}
          label={t('bossesDefeated')}
          darkMode={darkMode}
        />
        <StatCard
          icon="🏆"
          value={gameStats.unlockedAchievements.length}
          label={t('achievements')}
          darkMode={darkMode}
        />
      </div>

      {/* Boss Tasks Section */}
      {bossTasks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span>⚔️</span> {t('bossBattles')} ({bossTasks.length})
          </h3>
          <div className="space-y-2">
            {bossTasks.slice(0, 3).map((boss) => (
              <div
                key={boss.id}
                className="p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/50"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl animate-bounce">👹</div>
                  <div className="flex-1">
                    <div className="font-bold">{boss.text}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {t('reward')}: {XP_REWARDS.boss_defeat} XP 💎
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Gallery */}
      <div>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span>🏆</span> {t('achievementGallery')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = gameStats.unlockedAchievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl text-center transition-all duration-300 ${
                  unlocked
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white transform hover:scale-105'
                    : darkMode
                    ? 'bg-gray-700 opacity-50'
                    : 'bg-gray-100 opacity-50'
                }`}
                title={getAchievementDesc(achievement)}
              >
                <div className={`text-4xl mb-2 ${unlocked ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div className="text-xs font-bold">
                  {getAchievementName(achievement)}
                </div>
                {unlocked && (
                  <div className="text-xs opacity-90 mt-1">
                    +{achievement.xp} XP
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, darkMode, highlight }) {
  return (
    <div className={`p-4 rounded-xl text-center ${
      highlight
        ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white animate-pulse'
        : darkMode
        ? 'bg-gray-700'
        : 'bg-gray-50'
    }`}>
      <div className="text-3xl mb-1">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs opacity-75">{label}</div>
    </div>
  );
}

export default GamificationPanel;
export { XP_REWARDS };

// Helper function to award XP for task completion
export async function awardXPForTask(user, task, isStreak = false) {
  if (!user) return;

  const baseXP = XP_REWARDS[task.priority] || XP_REWARDS.medium;
  const streakBonus = isStreak ? XP_REWARDS.streak_bonus : 0;
  const bossBonus = task.priority === 'high' ? XP_REWARDS.boss_defeat - baseXP : 0;
  
  const totalXP = baseXP + streakBonus + bossBonus;

  // Update game stats
  const statsRef = doc(db, 'gameStats', user.uid);
  const statsDoc = await getDoc(statsRef);
  
  if (statsDoc.exists()) {
    const currentStats = statsDoc.data();
    const newXP = currentStats.xp + totalXP;
    const newLevel = calculateLevelFromXP(newXP);
    
    const updates = {
      xp: newXP,
      level: newLevel,
      totalCompleted: currentStats.totalCompleted + 1
    };

    if (task.priority === 'high') {
      updates.bossesDefeated = (currentStats.bossesDefeated || 0) + 1;
    }

    await updateDoc(statsRef, updates);
  }

  return totalXP;
}

function calculateLevelFromXP(xp) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}
