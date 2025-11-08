import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useLanguage } from '../LanguageContext';

function StatisticsPanel({ todos, darkMode }) {
  const { t } = useLanguage();

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;
    
    const byPriority = {
      high: todos.filter(t => t.priority === 'high').length,
      medium: todos.filter(t => t.priority === 'medium').length,
      low: todos.filter(t => t.priority === 'low').length,
    };

    const byCategory = {
      personal: todos.filter(t => t.category === 'personal').length,
      work: todos.filter(t => t.category === 'work').length,
      shopping: todos.filter(t => t.category === 'shopping').length,
      health: todos.filter(t => t.category === 'health').length,
    };

    // Completion rate over last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayTodos = todos.filter(todo => {
        if (!todo.createdAt) return false;
        const todoDate = new Date(todo.createdAt.toDate());
        todoDate.setHours(0, 0, 0, 0);
        return todoDate.getTime() === date.getTime();
      });

      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed: dayTodos.filter(t => t.completed).length,
        active: dayTodos.filter(t => !t.completed).length,
      });
    }

    return { total, completed, active, byPriority, byCategory, last7Days };
  }, [todos]);

  const priorityData = [
    { name: t('priorityHigh'), value: stats.byPriority.high, color: '#ef4444' },
    { name: t('priorityMedium'), value: stats.byPriority.medium, color: '#f59e0b' },
    { name: t('priorityLow'), value: stats.byPriority.low, color: '#10b981' },
  ];

  const categoryData = [
    { name: t('categoryPersonal'), value: stats.byCategory.personal },
    { name: t('categoryWork'), value: stats.byCategory.work },
    { name: t('categoryShopping'), value: stats.byCategory.shopping },
    { name: t('categoryHealth'), value: stats.byCategory.health },
  ];

  const statusData = [
    { name: t('completed'), value: stats.completed },
    { name: t('active'), value: stats.active },
  ];

  const textColor = darkMode ? '#e5e7eb' : '#1f2937';
  const gridColor = darkMode ? '#374151' : '#e5e7eb';

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        📊 {t('statistics')}
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} p-4 rounded-xl text-center`}>
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm mt-1">{t('total')} {t('tasks')}</div>
        </div>
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} p-4 rounded-xl text-center`}>
          <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm mt-1">{t('completed')}</div>
        </div>
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-orange-50'} p-4 rounded-xl text-center`}>
          <div className="text-3xl font-bold text-orange-600">{stats.active}</div>
          <div className="text-sm mt-1">{t('active')}</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Pie Chart */}
        <div>
          <h3 className="font-semibold mb-3">{t('taskStatus')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill="#f59e0b" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Bar Chart */}
        <div>
          <h3 className="font-semibold mb-3">{t('tasksByPriority')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Bar Chart */}
        <div>
          <h3 className="font-semibold mb-3">{t('tasksByCategory')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 7-Day Trend Line Chart */}
        <div>
          <h3 className="font-semibold mb-3">{t('last7DaysTrend')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="active" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPanel;
