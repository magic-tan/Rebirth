'use client';

import { useStore } from '@/lib/store';

export default function ProfilePage() {
  const {
    userName,
    streakDays,
    tasks,
    userGoal,
    setUserGoal,
    setTasks,
  } = useStore();

  const totalCompleted = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const overallRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  const handleResetGoal = () => {
    if (confirm('确定要重新设定目标吗？当前进度将被清空。')) {
      setUserGoal(null);
      setTasks([]);
    }
  };

  const menuItems = [
    { id: 1, icon: '🎯', label: '重新设定目标', action: handleResetGoal },
    { id: 2, icon: '📊', label: '数据统计' },
    { id: 3, icon: '🔔', label: '提醒设置' },
    { id: 4, icon: '❓', label: '帮助中心' },
  ];

  return (
    <div>
      <header className="px-5 py-4">
        <h1 className="text-2xl font-bold text-title">我的</h1>
      </header>

      <div className="mx-5 mb-4 bg-card-bg rounded-2xl p-5 flex items-center gap-4">
        <div className="w-15 h-15 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-white text-2xl font-bold">
          {userName.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-title">{userName}</h3>
          <p className="text-sm text-text-secondary">坚持打卡 {streakDays} 天</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mx-5 mb-4">
        <div className="bg-card-bg rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">{totalCompleted}</div>
          <div className="text-xs text-text-secondary">已完成</div>
        </div>
        <div className="bg-card-bg rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">{totalTasks}</div>
          <div className="text-xs text-text-secondary">总任务</div>
        </div>
        <div className="bg-card-bg rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">{overallRate}%</div>
          <div className="text-xs text-text-secondary">完成率</div>
        </div>
      </div>

      <div className="mx-5 bg-card-bg rounded-2xl overflow-hidden">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className="w-full flex items-center justify-between px-5 py-4 border-b border-divider last:border-0 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm text-title">{item.label}</span>
            </div>
            <svg className="w-4 h-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
