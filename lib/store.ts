import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 目标模板
export const goalTemplates = {
  study: {
    title: '重生之我考研上岸',
    timeline: '12个月',
    milestones: [
      {
        id: 1,
        title: '基础阶段 - 打好基础',
        deadline: '第1-3月',
        tasks: [
          { id: 1, title: '每天背单词100个', completed: false },
          { id: 2, title: '完成数学基础知识点复习', completed: false },
          { id: 3, title: '英语阅读每天2篇', completed: false },
        ]
      },
      {
        id: 2,
        title: '强化阶段 - 专项突破',
        deadline: '第4-8月',
        tasks: [
          { id: 4, title: '完成数学真题刷题', completed: false },
          { id: 5, title: '专业课笔记整理', completed: false },
          { id: 6, title: '英语作文每周2篇', completed: false },
        ]
      },
      {
        id: 3,
        title: '冲刺阶段 - 模拟考试',
        deadline: '第9-12月',
        tasks: [
          { id: 7, title: '每周全真模拟考试', completed: false },
          { id: 8, title: '政治背诵冲刺', completed: false },
          { id: 9, title: '错题复盘总结', completed: false },
        ]
      }
    ]
  },
  fitness: {
    title: '重生之我练出完美身材',
    timeline: '6个月',
    milestones: [
      {
        id: 1,
        title: '适应期 - 建立运动习惯',
        deadline: '第1月',
        tasks: [
          { id: 1, title: '每周运动3次', completed: false },
          { id: 2, title: '戒掉夜宵', completed: false },
          { id: 3, title: '每天喝水2000ml', completed: false },
        ]
      },
      {
        id: 2,
        title: '进阶期 - 增加强度',
        deadline: '第2-4月',
        tasks: [
          { id: 4, title: '每周运动5次', completed: false },
          { id: 5, title: '力量训练+有氧结合', completed: false },
          { id: 6, title: '控制饮食热量', completed: false },
        ]
      },
      {
        id: 3,
        title: '塑形期 - 精雕细琢',
        deadline: '第5-6月',
        tasks: [
          { id: 7, title: '针对性肌肉训练', completed: false },
          { id: 8, title: '体脂率控制在15%以下', completed: false },
        ]
      }
    ]
  },
  english: {
    title: '重生之我英语流利说',
    timeline: '9个月',
    milestones: [
      {
        id: 1,
        title: '发音阶段 - 纠正发音',
        deadline: '第1-2月',
        tasks: [
          { id: 1, title: '学习音标课程', completed: false },
          { id: 2, title: '每天跟读30分钟', completed: false },
          { id: 3, title: '录音对比练习', completed: false },
        ]
      },
      {
        id: 2,
        title: '积累阶段 - 词汇语法',
        deadline: '第3-5月',
        tasks: [
          { id: 4, title: '每天背50个单词', completed: false },
          { id: 5, title: '语法系统学习', completed: false },
          { id: 6, title: '看美剧学表达', completed: false },
        ]
      },
      {
        id: 3,
        title: '输出阶段 - 口语表达',
        deadline: '第6-9月',
        tasks: [
          { id: 7, title: '每天英语自言自语', completed: false },
          { id: 8, title: '找语伴对话练习', completed: false },
          { id: 9, title: '参加英语角活动', completed: false },
        ]
      }
    ]
  },
  coding: {
    title: '重生之我成为全栈工程师',
    timeline: '12个月',
    milestones: [
      {
        id: 1,
        title: '前端入门 - HTML/CSS/JS',
        deadline: '第1-3月',
        tasks: [
          { id: 1, title: '完成HTML/CSS基础', completed: false },
          { id: 2, title: 'JavaScript核心概念', completed: false },
          { id: 3, title: '做一个个人网站', completed: false },
        ]
      },
      {
        id: 2,
        title: '框架深入 - Vue/React',
        deadline: '第4-7月',
        tasks: [
          { id: 4, title: '学习Vue框架', completed: false },
          { id: 5, title: '做3个实战项目', completed: false },
          { id: 6, title: '学习TypeScript', completed: false },
        ]
      },
      {
        id: 3,
        title: '后端学习 - Node.js/数据库',
        deadline: '第8-10月',
        tasks: [
          { id: 7, title: 'Node.js基础', completed: false },
          { id: 8, title: 'MySQL数据库学习', completed: false },
          { id: 9, title: '部署上线项目', completed: false },
        ]
      },
      {
        id: 4,
        title: '项目实战 - 全栈应用',
        deadline: '第11-12月',
        tasks: [
          { id: 10, title: '开发完整的Web应用', completed: false },
          { id: 11, title: '代码优化与测试', completed: false },
        ]
      }
    ]
  }
};

export type Milestone = {
  id: number;
  title: string;
  deadline: string;
  tasks: MilestoneTask[];
};

export type MilestoneTask = {
  id: number;
  title: string;
  completed: boolean;
};

export type Goal = {
  title: string;
  timeline: string;
  milestones: Milestone[];
};

export type Task = {
  id: number;
  title: string;
  time: string;
  completed: boolean;
  date: string;
  milestoneId?: number;
  milestoneTaskId?: number;
  milestoneTitle?: string;
};

interface AppState {
  // 用户目标
  userGoal: Goal | null;
  setUserGoal: (goal: Goal | null) => void;

  // 任务列表
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  toggleTaskCompletion: (id: number) => void;
  updateTaskAndSyncMilestone: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;

  // 界面状态
  currentPage: 'home' | 'profile';
  setCurrentPage: (page: 'home' | 'profile') => void;

  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // 模态框状态
  showAddTaskModal: boolean;
  setShowAddTaskModal: (show: boolean) => void;

  analyzing: boolean;
  setAnalyzing: (analyzing: boolean) => void;

  analyzingGoal: string;
  setAnalyzingGoal: (goal: string) => void;

  // 用户信息
  userName: string;
  setUserName: (name: string) => void;

  streakDays: number;
  setStreakDays: (days: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // 用户目标
      userGoal: null,
      setUserGoal: (goal) => set({ userGoal: goal }),

      // 任务列表
      tasks: [],
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
      })),
      // 只用于切换完成状态，会同步里程碑进度
      toggleTaskCompletion: (id) => set((state) => {
        const task = state.tasks.find((t) => t.id === id);
        if (!task) return state;

        const newCompleted = !task.completed;
        const updatedTasks = state.tasks.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t));

        // 同步到里程碑
        if (task.milestoneId !== undefined && task.milestoneTaskId !== undefined && state.userGoal) {
          const updatedMilestones = state.userGoal.milestones.map((milestone) => {
            if (milestone.id === task.milestoneId) {
              const updatedMilestoneTasks = milestone.tasks.map((mt) =>
                mt.id === task.milestoneTaskId ? { ...mt, completed: newCompleted } : mt
              );
              return { ...milestone, tasks: updatedMilestoneTasks };
            }
            return milestone;
          });
          return {
            tasks: updatedTasks,
            userGoal: { ...state.userGoal, milestones: updatedMilestones }
          };
        }

        return { tasks: updatedTasks };
      }),
      updateTaskAndSyncMilestone: (id, updates) => set((state) => {
        // 更新任务
        const updatedTasks = state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));

        // 同步到里程碑（只同步完成状态）
        const task = updatedTasks.find((t) => t.id === id);
        if (task && task.milestoneId !== undefined && task.milestoneTaskId !== undefined && state.userGoal) {
          const updatedMilestones = state.userGoal.milestones.map((milestone) => {
            if (milestone.id === task.milestoneId) {
              const updatedTasks = milestone.tasks.map((mt) =>
                mt.id === task.milestoneTaskId ? { ...mt, completed: task.completed } : mt
              );
              return { ...milestone, tasks: updatedTasks };
            }
            return milestone;
          });
          return {
            tasks: updatedTasks,
            userGoal: { ...state.userGoal, milestones: updatedMilestones }
          };
        }

        return { tasks: updatedTasks };
      }),
      deleteTask: (id) => set((state) => ({
        // 只删除每日任务，不影响里程碑中的原始任务
        tasks: state.tasks.filter((t) => t.id !== id)
      })),

      // 界面状态
      currentPage: 'home',
      setCurrentPage: (page) => set({ currentPage: page }),

      selectedDate: new Date().toDateString(),
      setSelectedDate: (date) => set({ selectedDate: date }),

      // 模态框状态
      showAddTaskModal: false,
      setShowAddTaskModal: (show) => set({ showAddTaskModal: show }),

      analyzing: false,
      setAnalyzing: (analyzing) => set({ analyzing }),

      analyzingGoal: '',
      setAnalyzingGoal: (goal) => set({ analyzingGoal: goal }),

      // 用户信息
      userName: '用户',
      setUserName: (name) => set({ userName: name }),

      streakDays: 7,
      setStreakDays: (days) => set({ streakDays: days }),
    }),
    {
      name: 'rebirth-storage',
    }
  )
);
