'use client';

import { useStore } from '@/lib/store';
import { calculateMilestoneProgress, getMilestoneStatus } from '@/lib/utils';
import { useState } from 'react';

// 周数的颜色主题
const weekThemes = [
  { bg: 'from-blue-500 to-blue-600', light: 'bg-blue-100', text: 'text-blue-600' },
  { bg: 'from-purple-500 to-purple-600', light: 'bg-purple-100', text: 'text-purple-600' },
  { bg: 'from-orange-500 to-orange-600', light: 'bg-orange-100', text: 'text-orange-600' },
  { bg: 'from-green-500 to-green-600', light: 'bg-green-100', text: 'text-green-600' },
];

export default function MilestoneList() {
  const { userGoal } = useStore();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (!userGoal?.milestones?.length) return null;

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="px-5 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-title flex items-center gap-2">
          <span className="text-2xl">📋</span>
          4周冲刺计划
        </h3>
        <span className="text-xs bg-gradient-to-r from-primary to-purple text-white px-3 py-1 rounded-full font-medium">
          升级12个月计划
        </span>
      </div>

      {/* 周进度条 */}
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
            {/* 可点击的头部 */}
            <button
              onClick={() => toggleExpand(milestone.id)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3 flex-1">
                {/* 周数标识 */}
                <div className={`w-12 h-12 bg-gradient-to-br ${theme.bg} rounded-xl flex flex-col items-center justify-center text-white shadow-lg`}>
                  <span className="text-xs font-medium opacity-90">WEEK</span>
                  <span className="text-lg font-bold leading-none">{index + 1}</span>
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

              {/* 进度百分比 */}
              <div className="text-right mr-3">
                <span className={`text-2xl font-bold ${isExpanded ? theme.text : 'text-text-secondary'}`}>
                  {progress}%
                </span>
              </div>

              {/* 展开/收起箭头 */}
              <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* 展开内容 */}
            {isExpanded && (
              <div className="px-4 pb-4">
                {/* 进度条 */}
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full bg-gradient-to-r ${theme.bg} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* 任务列表 */}
                <div className="space-y-2">
                  {milestone.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        task.completed
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-100'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        task.completed ? 'bg-success text-white' : `bg-gradient-to-br ${theme.bg} text-white`
                      }`}>
                        {task.completed ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-xs font-bold">{task.id}</span>
                        )}
                      </div>
                      <span className={`text-sm flex-1 font-medium ${task.completed ? 'line-through text-text-light' : 'text-title'}`}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
