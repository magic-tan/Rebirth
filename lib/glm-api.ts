// GLM-4.7 API 客户端
// 通过 Next.js API Route 安全地调用智谱 AI

export interface GLMMilestone {
  title: string;
  deadline: string;
  tasks: Array<{
    title: string;
  }>;
}

export interface GLMGoalBreakdown {
  title: string;
  timeline: string;
  milestones: GLMMilestone[];
}

/**
 * 调用 GLM-4.7 API 拆解目标（通过服务端 API Route）
 * @param goal 用户输入的目标
 * @returns 拆解后的里程碑和任务
 */
export async function analyzeGoalWithGLM(goal: string): Promise<GLMGoalBreakdown> {
  if (!goal.trim()) {
    console.warn('目标内容为空，使用默认模板');
    return getDefaultFallback(goal);
  }

  try {
    const response = await fetch('/api/analyze-goal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ goal }),
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const result: GLMGoalBreakdown & { _debug?: any } = await response.json();

    // 显示调试信息
    if (result._debug) {
      console.warn('=== AI 调试信息 ===');
      console.warn('错误类型:', result._debug.error);
      console.warn('错误信息:', result._debug.message);
      console.warn('==================');
    }

    console.log('目标分析成功:', result.title);
    return result;

  } catch (error) {
    console.error('=== API 调用异常 ===');
    console.error('错误:', error instanceof Error ? error.message : error);
    console.log('使用默认模板代替');
    return getDefaultFallback(goal);
  }
}

/**
 * 降级方案：当 API 调用失败时返回默认模板（按周规划）
 */
function getDefaultFallback(goal: string): GLMGoalBreakdown {
  return {
    title: goal || '默认目标规划',
    timeline: '1个月',
    milestones: [
      {
        title: '第1周：启动与准备',
        deadline: '第1周',
        tasks: [
          { title: '制定详细计划' },
          { title: '收集学习资料' },
          { title: '建立学习环境' },
        ]
      },
      {
        title: '第2周：基础建立',
        deadline: '第2周',
        tasks: [
          { title: '完成基础知识学习' },
          { title: '开始第一次练习' },
          { title: '记录学习笔记' },
        ]
      },
      {
        title: '第3周：深化实践',
        deadline: '第3周',
        tasks: [
          { title: '增加练习强度' },
          { title: '解决遇到的问题' },
          { title: '分享学习成果' },
        ]
      },
      {
        title: '第4周：巩固与成果',
        deadline: '第4周',
        tasks: [
          { title: '总结学习成果' },
          { title: '制定后续计划' },
          { title: '庆祝阶段性胜利' },
        ]
      }
    ]
  };
}
