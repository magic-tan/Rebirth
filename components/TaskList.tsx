'use client';

import { useStore } from '@/lib/store';
import { useState } from 'react';

export default function TaskList() {
  const { tasks, selectedDate, toggleTaskCompletion, updateTask, deleteTask, setTasks } = useStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [splittingId, setSplittingId] = useState<number | null>(null);
  const [editingTimeId, setEditingTimeId] = useState<number | null>(null);
  const [timeValue, setTimeValue] = useState('');

  const filteredTasks = tasks
    .filter((t) => t.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const completedCount = filteredTasks.filter((t) => t.completed).length;

  const handleToggle = (id: number) => {
    toggleTaskCompletion(id);
  };

  const startEdit = (id: number, title: string) => {
    setEditingId(id);
    setEditValue(title);
  };

  const saveEdit = (id: number) => {
    if (editValue.trim()) {
      updateTask(id, { title: editValue.trim() });
    }
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  // 时间编辑
  const startTimeEdit = (id: number, time: string) => {
    setEditingTimeId(id);
    setTimeValue(time);
  };

  const saveTimeEdit = (id: number) => {
    if (timeValue) {
      updateTask(id, { time: timeValue });
    }
    setEditingTimeId(null);
    setTimeValue('');
  };

  const cancelTimeEdit = () => {
    setEditingTimeId(null);
    setTimeValue('');
  };

  // AI 拆分任务
  const handleSplitTask = async (task: any) => {
    setSplittingId(task.id);
    try {
      const response = await fetch('/api/split-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle: task.title }),
      });
      const data = await response.json();

      if (data.subtasks && data.subtasks.length > 0) {
        // 删除原任务
        const newTasks = tasks.filter((t) => t.id !== task.id);
        // 添加子任务
        const subtasks = data.subtasks.map((st: any, index: number) => ({
          id: Date.now() + index,
          title: st.title,
          time: task.time,
          completed: false,
          date: task.date,
          milestoneId: task.milestoneId,
          milestoneTaskId: task.milestoneTaskId,
          milestoneTitle: task.milestoneTitle,
        }));
        setTasks([...subtasks, ...newTasks]);
      }
    } catch (error) {
      console.error('AI 拆分失败:', error);
    } finally {
      setSplittingId(null);
    }
  };

  if (filteredTasks.length === 0) {
    return (
      <section className="px-5 py-10 text-center">
        <div className="text-6xl mb-4 opacity-20">📋</div>
        <p className="text-sm text-text-light">今天没有任务，点击右下角添加</p>
      </section>
    );
  }

  return (
    <section className="px-5 pb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-title flex items-center gap-2">
          <span className="text-2xl">📝</span>
          今日任务
        </h3>
        <span className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
          {completedCount}/{filteredTasks.length} 完成
        </span>
      </div>

      {filteredTasks.map((task, index) => {
        const isEditing = editingId === task.id;

        return (
          <div
            key={task.id}
            className={`bg-card-bg rounded-3xl p-4 mb-3 flex items-center gap-3 shadow-sm border-2 transition-all ${
              task.completed ? 'opacity-50 border-success/30' : 'border-transparent hover:border-primary/20'
            }`}
          >
            {/* 时间显示 - 可点击编辑 */}
            <div className="flex-shrink-0">
              {editingTimeId === task.id ? (
                <div className="flex items-center gap-1">
                  <input
                    type="time"
                    value={timeValue}
                    onChange={(e) => setTimeValue(e.target.value)}
                    onBlur={() => saveTimeEdit(task.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveTimeEdit(task.id);
                      if (e.key === 'Escape') cancelTimeEdit();
                    }}
                    className="w-20 h-14 px-2 bg-white border-2 border-primary rounded-2xl text-sm font-bold text-title focus:outline-none"
                    autoFocus
                  />
                </div>
              ) : (
                <button
                  onClick={() => startTimeEdit(task.id, task.time)}
                  className="w-14 h-14 bg-gray-100 hover:bg-gray-200 flex items-center justify-center rounded-2xl transition-colors"
                >
                  <span className="text-sm font-bold text-title">
                    {task.time}
                  </span>
                </button>
              )}
            </div>

            {/* 任务内容 */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(task.id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    className="flex-1 px-3 py-2 bg-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(task.id)}
                    className="w-10 h-10 flex items-center justify-center bg-success text-white rounded-xl flex-shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-600 rounded-xl flex-shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <h4
                    className={`text-base font-semibold text-title mb-1 ${
                      task.completed ? 'line-through text-text-light' : ''
                    }`}
                  >
                    {task.title}
                  </h4>
                  {task.milestoneTitle && (
                    <p className="text-xs text-primary flex items-center gap-1 font-medium">
                      🎯 {task.milestoneTitle}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* 操作按钮组 - 编辑时隐藏 */}
            {!isEditing && (
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* AI 拆分按钮 - 只在未完成时显示 */}
                {!task.completed && (
                  <button
                    onClick={() => handleSplitTask(task)}
                    disabled={splittingId === task.id}
                    className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-primary to-purple hover:opacity-90 rounded-xl transition-colors"
                  >
                    {splittingId === task.id ? (
                      <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                  </button>
                )}

                {/* 编辑按钮 - 只在未完成时显示 */}
                {!task.completed && (
                  <button
                    onClick={() => startEdit(task.id, task.title)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                )}

                {/* 删除按钮 */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="w-10 h-10 flex items-center justify-center bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                {/* 完成按钮 - 统一 40px */}
                <button
                  onClick={() => handleToggle(task.id)}
                  className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center flex-shrink-0 ${
                    task.completed
                      ? 'bg-success shadow-lg shadow-success/30'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {task.completed ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="8" strokeWidth={2} />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
