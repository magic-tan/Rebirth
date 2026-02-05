'use client';

import { useStore, goalTemplates } from '@/lib/store';
import { useState } from 'react';
import { analyzeGoalWithGLM } from '@/lib/glm-api';

export default function Onboarding() {
  const { setAnalyzing, setAnalyzingGoal, setUserGoal, setTasks } = useStore();
  const [goalInput, setGoalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    if (!goalInput.trim()) return;

    // 自动拼接"重生之"前缀
    const fullGoal = `重生之${goalInput}`;

    setIsLoading(true);
    setAnalyzingGoal(fullGoal);
    setAnalyzing(true);

    // 检查是否匹配预设模板
    let matchedTemplate = null;
    for (const key in goalTemplates) {
      if (fullGoal.includes(goalTemplates[key as keyof typeof goalTemplates].title.slice(4))) {
        matchedTemplate = goalTemplates[key as keyof typeof goalTemplates];
        break;
      }
    }

    // 如果没有匹配的模板，使用 GLM AI 进行智能拆解
    if (!matchedTemplate) {
      try {
        const aiBreakdown = await analyzeGoalWithGLM(fullGoal);

        // 转换 AI 返回的格式为应用格式
        matchedTemplate = {
          title: aiBreakdown.title,
          timeline: aiBreakdown.timeline,
          milestones: aiBreakdown.milestones.map((m, idx) => ({
            id: idx + 1,
            title: m.title,
            deadline: m.deadline,
            tasks: m.tasks.map((t, tIdx) => ({
              id: idx * 10 + tIdx + 1,
              title: t.title,
              completed: false,
            })),
          })),
        };
      } catch (error) {
        console.error('AI 分析失败，使用默认模板:', error);
        // 使用默认模板作为降级方案
        matchedTemplate = {
          title: fullGoal,
          timeline: '1个月',
          milestones: [
            {
              id: 1,
              title: '第1周：启动与准备',
              deadline: '第1周',
              tasks: [
                { id: 1, title: '制定详细计划', completed: false },
                { id: 2, title: '收集学习资料', completed: false },
                { id: 3, title: '建立学习环境', completed: false },
              ]
            },
            {
              id: 2,
              title: '第2周：基础建立',
              deadline: '第2周',
              tasks: [
                { id: 4, title: '完成基础知识学习', completed: false },
                { id: 5, title: '开始第一次练习', completed: false },
                { id: 6, title: '记录学习笔记', completed: false },
              ]
            },
            {
              id: 3,
              title: '第3周：深化实践',
              deadline: '第3周',
              tasks: [
                { id: 7, title: '增加练习强度', completed: false },
                { id: 8, title: '解决遇到的问题', completed: false },
                { id: 9, title: '分享学习成果', completed: false },
              ]
            },
            {
              id: 4,
              title: '第4周：巩固与成果',
              deadline: '第4周',
              tasks: [
                { id: 10, title: '总结学习成果', completed: false },
                { id: 11, title: '制定后续计划', completed: false },
                { id: 12, title: '庆祝阶段性胜利', completed: false },
              ]
            }
          ]
        };
      }
    }

    setIsLoading(false);
    setUserGoal(matchedTemplate);

    // 生成今日任务
    const today = new Date().toDateString();
    const firstMilestone = matchedTemplate.milestones[0];
    const newTasks = firstMilestone?.tasks.map((mt: any, index: number) => ({
      id: Date.now() + index,
      title: mt.title,
      time: `${String(8 + index * 2).padStart(2, '0')}:00`,
      completed: mt.completed,
      date: today,
      milestoneId: firstMilestone.id,
      milestoneTaskId: mt.id,
      milestoneTitle: firstMilestone.title,
    })) || [];

    setTasks(newTasks);
    setAnalyzing(false);
  };

  const selectTemplate = (type: keyof typeof goalTemplates) => {
    // 提取"重生之"后面的部分
    const title = goalTemplates[type].title;
    const suffix = title.replace('重生之', '');
    setGoalInput(suffix);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary to-purple flex flex-col items-center justify-center p-10 text-white z-50">
      <div className="text-6xl mb-6">🔄</div>
      <h1 className="text-3xl font-bold text-center mb-3">开启你的重生之旅</h1>
      <p className="text-base opacity-90 text-center mb-10 max-w-[300px]">
        设定一个目标，AI将帮你拆解成可执行的小任务
      </p>

      {/* 输入框容器 */}
      <div className="w-full max-w-[320px] mb-4">
        <div className="flex items-center bg-white/20 backdrop-blur rounded-2xl overflow-hidden border-2 border-transparent focus-within:bg-white/25 focus-within:border-white/30 transition-all">
          {/* 固定前缀 */}
          <span className="px-4 py-4 text-white/90 font-medium whitespace-nowrap">
            重生之
          </span>
          {/* 输入框 */}
          <input
            type="text"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            placeholder="我考进清华"
            className="flex-1 bg-transparent text-white placeholder-white/50 border-none outline-none py-4 pr-4"
            maxLength={20}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={isLoading || !goalInput.trim()}
        className="w-full max-w-[320px] px-5 py-4 rounded-2xl bg-white text-primary font-semibold active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
      >
        {isLoading ? '正在分析...' : '开始重生'}
      </button>

      <div className="mt-8 text-center">
        <p className="text-sm opacity-80 mb-3">或者选择一个目标模板</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(goalTemplates).map(([key, template]) => (
            <button
              key={key}
              onClick={() => selectTemplate(key as keyof typeof goalTemplates)}
              className="px-4 py-2 bg-white/15 backdrop-blur rounded-full text-sm hover:bg-white/25 transition-colors"
            >
              {template.title.includes('考研') && '📚 考研上岸'}
              {template.title.includes('身材') && '💪 健身塑形'}
              {template.title.includes('英语') && '🌐 英语流利'}
              {template.title.includes('全栈') && '💻 学会编程'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
