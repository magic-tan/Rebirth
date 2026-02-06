'use client';

import { useStore } from '@/lib/store';
import { calculateMilestoneProgress, getMilestoneStatus } from '@/lib/utils';
import { useState } from 'react';

const weekThemes = [
  { bg: 'from-blue-500 to-blue-600', light: 'bg-blue-100', text: 'text-blue-600' },
  { bg: 'from-purple-500 to-purple-600', light: 'bg-purple-100', text: 'text-purple-600' },
  { bg: 'from-orange-500 to-orange-600', light: 'bg-orange-100', text: 'text-orange-600' },
  { bg: 'from-green-500 to-green-600', light: 'bg-green-100', text: 'text-green-600' },
];

const weekDays = [
  { id: 1, name: '今天', emoji: '📅' },
  { id: 2, name: '明天', emoji: '📖' },
  { id: 3, name: '后天', emoji: '📝' },
  { id: 4, name: '第4天', emoji: '💪' },
  { id: 5, name: '第5天', emoji: '🎯' },
  { id: 6, name: '第6天', emoji: '🌟' },
  { id: 7, name: '第7天', emoji: '😴' },
];

// 动态生成天数名称（根据今天是星期几）
const getDynamicDayNames = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=周日, 1=周一, ...
  const weekDaysFull = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  const days = [];
  for (let i = 0; i < 7; i++) {
    const targetDay = (dayOfWeek + i) % 7;
    if (i === 0) {
      days.push('今天');
    } else if (i === 1) {
      days.push('明天');
    } else {
      days.push(weekDaysFull[targetDay]);
    }
  }
  return days;
};

const getTasksByDay = (tasks: any[], dayNames: string[]) => {
  return dayNames.map((name, index) => {
    const task = tasks[index % tasks.length];
    return {
      id: index + 1,
      name: name,
      task: task ? { ...task, displayId: index + 1 } : null
    };
  });
};

export default function MilestoneList() {
  const { userGoal } = useStore();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(false);

  // 获取动态天数名称
  const dynamicDayNames = getDynamicDayNames();

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleSectionCollapse = () => {
    setIsSectionCollapsed(!isSectionCollapsed);
  };

  if (!userGoal?.milestones?.length) return null;

  return (
    <section className="px-5 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSectionCollapse}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <svg
              className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${isSectionCollapsed ? '-rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <h3 className="text-lg font-bold text-title flex items-center gap-2">
            <span className="text-2xl">📋</span>
            4周冲刺计划
          </h3>
        </div>
        <span className="text-xs bg-gradient-to-r from-primary to-purple text-white px-3 py-1 rounded-full font-medium">
          升级12个月计划
        </span>
      </div>

      {isSectionCollapsed && (
        <div className="text-center py-3 text-sm text-text-secondary bg-card-bg rounded-2xl">
          点击展开查看 4 周冲刺计划
        </div>
      )}

      {!isSectionCollapsed && (
        <>
          <div className="mb-4 p-3 bg-gray-50 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-text-secondary">整体进度</span>
              <span className="text-xs font-bold text-primary">
                {Math.round(userGoal.milestones.reduce((sum, m) => sum + calculateMilestoneProgress(m), 0) / userGoal.milestones.length)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-purple rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(userGoal.milestones.reduce((sum, m) => sum + calculateMilestoneProgress(m), 0) / userGoal.milestones.length)}%`
                }}
              />
            </div>
          </div>

          {userGoal.milestones.map((milestone, index) => {
            const progress = calculateMilestoneProgress(milestone);
            const status = getMilestoneStatus(milestone);
            const isExpanded = expandedId === null ? index === 0 : expandedId === milestone.id;
            const theme = weekThemes[index % weekThemes.length];

            return (
              <div
                key={milestone.id}
                className={`bg-card-bg rounded-3xl mb-3 border-2 transition-all overflow-hidden ${
                  isExpanded ? `border-${theme.bg.split('-')[1]}-30 shadow-md` : 'border-transparent'
                }`}
              >
                <button
                  onClick={() => toggleExpand(milestone.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white shadow-lg"
                      style={{
                        backgroundColor: index === 0 ? '#2563eb' :
                                       index === 1 ? '#9333ea' :
                                       index === 2 ? '#f97316' :
                                       '#16a34a'
                      }}
                    >
                      <span className="text-[9px] font-bold leading-tight">WEEK</span>
                      <span className="text-xl font-black leading-none">{index + 1}</span>
                    </div>

                    <div className="flex-1">
                      <h4 className={`text-sm font-bold text-title mb-1 ${isExpanded ? 'text-base' : ''}`}>
                        {milestone.title}
                      </h4>
                      <p className="text-xs text-text-secondary flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md ${status.className}`}>
                          {status.text}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right mr-3">
                    <span className={`text-2xl font-bold ${isExpanded ? theme.text : 'text-text-secondary'}`}>
                      {progress}%
                    </span>
                  </div>

                  <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4">
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
                      <div
                        className={`h-full bg-gradient-to-r ${theme.bg} rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="space-y-2">
                      {getTasksByDay(milestone.tasks, dynamicDayNames).map((dayTask) => (
                        <div
                          key={dayTask.id}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                            dayTask.task?.completed
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-gray-50 border border-gray-100'
                          }`}
                        >
                          <div className={`w-16 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            dayTask.task?.completed ? 'bg-success/20 text-success' : `${theme.light} ${theme.text}`
                          }`}>
                            <span className="text-xs font-bold">{dayTask.name}</span>
                          </div>

                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            dayTask.task?.completed ? 'bg-success text-white' : `bg-gradient-to-br ${theme.bg} text-white`
                          }`}>
                            {dayTask.task?.completed ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-xs font-bold">{dayTask.id}</span>
                            )}
                          </div>

                          <span className={`text-sm flex-1 font-medium ${
                            dayTask.task?.completed ? 'line-through text-text-light' : 'text-title'
                          }`}>
                            {dayTask.task?.title || '休息日'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </section>
  );
}
