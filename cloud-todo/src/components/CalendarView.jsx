import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isSameDay } from 'date-fns';
import { useLanguage } from '../LanguageContext';
import './CalendarView.css';

function CalendarView({ todos, darkMode, toggleComplete, startEdit, removeTodo }) {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get todos for selected date
  const todosForDate = todos.filter(todo => {
    if (!todo.dueDate) return false;
    return isSameDay(new Date(todo.dueDate), selectedDate);
  });

  // Get dates that have todos
  const datesWithTodos = todos
    .filter(todo => todo.dueDate)
    .map(todo => new Date(todo.dueDate).toDateString());

  const tileClassName = ({ date }) => {
    const dateStr = date.toDateString();
    if (datesWithTodos.includes(dateStr)) {
      const dateTodos = todos.filter(todo => 
        todo.dueDate && isSameDay(new Date(todo.dueDate), date)
      );
      const hasOverdue = dateTodos.some(t => !t.completed && new Date(t.dueDate) < new Date());
      const allCompleted = dateTodos.every(t => t.completed);
      
      if (hasOverdue) return 'has-overdue-tasks';
      if (allCompleted) return 'has-completed-tasks';
      return 'has-tasks';
    }
    return null;
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high": return "🔴";
      case "medium": return "🟡";
      case "low": return "🟢";
      default: return "";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "personal": return "👤";
      case "work": return "💼";
      case "shopping": return "🛒";
      case "health": return "💪";
      default: return "📋";
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        📅 {t('calendarView')}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className={darkMode ? 'calendar-dark' : ''}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
            className={darkMode ? 'dark-calendar' : ''}
          />
          
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-200 rounded"></span>
              <span>{t('completed')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-200 rounded"></span>
              <span>{t('hasTasks')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-red-200 rounded"></span>
              <span>{t('overdue')}</span>
            </div>
          </div>
        </div>

        {/* Tasks for Selected Date */}
        <div>
          <h3 className="font-semibold text-lg mb-4">
            {t('tasksOn')} {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          
          {todosForDate.length === 0 ? (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p className="text-4xl mb-2">📭</p>
              <p>{t('noTasksForDate')}</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {todosForDate.map(todo => (
                <div
                  key={todo.id}
                  className={`border-2 rounded-xl p-4 ${
                    todo.completed
                      ? darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                      : darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id, todo.completed)}
                      className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{getPriorityBadge(todo.priority)}</span>
                        <span>{getCategoryIcon(todo.category)}</span>
                        <p className={`font-medium ${
                          todo.completed
                            ? darkMode ? 'line-through text-gray-500' : 'line-through text-gray-400'
                            : ''
                        }`}>
                          {todo.text}
                        </p>
                      </div>
                      {new Date(todo.dueDate) < new Date() && !todo.completed && (
                        <span className="text-xs text-red-500 font-semibold">{t('overdue')}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(todo)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title={t('edit')}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => removeTodo(todo.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title={t('delete')}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
