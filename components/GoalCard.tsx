'use client';

import { useStore } from '@/lib/store';
import { calculateGoalProgress, calculateCompletedMilestones } from '@/lib/utils';

export default function GoalCard() {
  const { userGoal } = useStore();

  if (!userGoal) return null;

  const progress = calculateGoalProgress(userGoal);
  const completedMilestones = calculateCompletedMilestones(userGoal);

  return (
    <div className="mx-5 mb-4 bg-gradient-to-br from-primary to-primary-light rounded-2xl p-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)]"></div>

      <div className="relative z-10">
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-xl text-xs mb-3">
          <span>🎯</span>
          <span>当前目标</span>
        </div>

        <h2 className="text-xl font-bold mb-2 leading-tight">{userGoal.title}</h2>
        <p className="text-sm opacity-90 mb-5">
          1个月 · {userGoal.milestones.length}个里程碑
        </p>

        <div className="h-2 bg-white/30 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-xs opacity-90">
          <span>完成度 {progress}%</span>
          <span>{completedMilestones}/{userGoal.milestones.length} 里程碑</span>
        </div>
      </div>
    </div>
  );
}
