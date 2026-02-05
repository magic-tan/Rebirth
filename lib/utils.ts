import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 格式化日期
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'M月d日 EEEE', { locale: zhCN });
}

// 生成周历
export function generateWeekDays(tasks: any[]) {
  const days = [];
  const today = new Date();

  for (let i = -3; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toDateString();
    const hasTask = tasks.some((t: any) => t.date === dateStr);

    days.push({
      date: dateStr,
      name: i === 0 ? '今天' : format(date, 'E', { locale: zhCN }),
      number: date.getDate(),
      isToday: i === 0,
      hasTask
    });
  }
  return days;
}

// 计算目标进度
export function calculateGoalProgress(goal: any): number {
  if (!goal?.milestones?.length) return 0;
  const totalTasks = goal.milestones.reduce((sum: number, m: any) => sum + m.tasks.length, 0);
  const completedTasks = goal.milestones.reduce(
    (sum: number, m: any) => sum + m.tasks.filter((t: any) => t.completed).length,
    0
  );
  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
}

// 计算已完成里程碑数
export function calculateCompletedMilestones(goal: any): number {
  if (!goal?.milestones) return 0;
  return goal.milestones.filter((m: any) => {
    const completed = m.tasks.filter((t: any) => t.completed).length;
    return completed === m.tasks.length && m.tasks.length > 0;
  }).length;
}

// 计算里程碑进度
export function calculateMilestoneProgress(milestone: any): number {
  if (!milestone?.tasks?.length) return 0;
  const completed = milestone.tasks.filter((t: any) => t.completed).length;
  return Math.round((completed / milestone.tasks.length) * 100);
}

// 获取里程碑状态
export function getMilestoneStatus(milestone: any): { text: string; className: string } {
  const progress = calculateMilestoneProgress(milestone);
  if (progress === 100) {
    return { text: '已完成', className: 'bg-green-100 text-green-600' };
  }
  if (progress > 0) {
    return { text: '进行中', className: 'bg-blue-100 text-blue-600' };
  }
  return { text: '未开始', className: 'bg-gray-100 text-gray-600' };
}

// 获取默认模板（当用户自定义目标时）
export function getDefaultTemplate(goalTitle: string): any {
  return {
    title: goalTitle,
    timeline: '12个月',
    milestones: [
      {
        id: 1,
        title: '起步阶段 - 建立基础',
        deadline: '第1-3月',
        tasks: [
          { id: 1, title: '制定详细计划', completed: false },
          { id: 2, title: '收集学习资料', completed: false },
          { id: 3, title: '每天投入1小时', completed: false },
        ]
      },
      {
        id: 2,
        title: '进阶阶段 - 持续精进',
        deadline: '第4-8月',
        tasks: [
          { id: 4, title: '每周复盘总结', completed: false },
          { id: 5, title: '寻求他人指导', completed: false },
          { id: 6, title: '挑战更高难度', completed: false },
        ]
      },
      {
        id: 3,
        title: '冲刺阶段 - 达成目标',
        deadline: '第9-12月',
        tasks: [
          { id: 7, title: '查漏补缺', completed: false },
          { id: 8, title: '最终冲刺', completed: false },
        ]
      }
    ]
  };
}
