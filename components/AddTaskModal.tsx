'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';

export default function AddTaskModal() {
  const { showAddTaskModal, setShowAddTaskModal, selectedDate, addTask, userGoal } = useStore();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [milestoneId, setMilestoneId] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;

    const taskData: any = {
      id: Date.now(),
      title: title.trim(),
      time,
      completed: false,
      date: selectedDate,
    };

    // 如果关联了里程碑
    if (milestoneId && userGoal) {
      const milestone = userGoal.milestones.find((m) => m.id === Number(milestoneId));
      if (milestone) {
        const milestoneTask = {
          id: Date.now(),
          title: title.trim(),
          completed: false,
        };
        milestone.tasks.push(milestoneTask);
        taskData.milestoneId = milestone.id;
        taskData.milestoneTaskId = milestoneTask.id;
        taskData.milestoneTitle = milestone.title;
      }
    }

    addTask(taskData);
    setTitle('');
    setTime('09:00');
    setMilestoneId('');
    setShowAddTaskModal(false);
  };

  if (!showAddTaskModal) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center"
      onClick={() => setShowAddTaskModal(false)}
    >
      <div
        className="w-full max-w-[430px] bg-card-bg rounded-t-3xl p-6 modal-animate"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-title">添加新任务</h2>
          <button
            onClick={() => setShowAddTaskModal(false)}
            className="w-8 h-8 flex items-center justify-center bg-bg rounded-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-text-secondary mb-2">任务标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入任务标题..."
            className="w-full px-4 py-3.5 border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
            maxLength={50}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-text-secondary mb-2">关联里程碑</label>
          <select
            value={milestoneId}
            onChange={(e) => setMilestoneId(e.target.value)}
            className="w-full px-4 py-3.5 border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-card-bg"
          >
            <option value="">不关联</option>
            {userGoal?.milestones.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-text-secondary mb-2">执行时间</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-3.5 border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl active:bg-primary-dark transition-colors"
        >
          添加任务
        </button>
      </div>
    </div>
  );
}
