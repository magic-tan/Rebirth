// GLM-4.7 API 服务
// 使用智谱 AI 的 GLM-4 模型进行目标智能拆解

const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

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
 * 调用 GLM-4.7 API 拆解目标
 * @param goal 用户输入的目标
 * @returns 拆解后的里程碑和任务
 */
export async function analyzeGoalWithGLM(goal: string): Promise<GLMGoalBreakdown> {
  const API_KEY = process.env.NEXT_PUBLIC_GLM_API_KEY || '';

  // 调试信息
  console.log('=== GLM API Debug ===');
  console.log('API_KEY configured:', !!API_KEY);
  console.log('API_KEY length:', API_KEY.length);
  console.log('API_KEY prefix:', API_KEY ? API_KEY.substring(0, 10) + '...' : 'N/A');

  if (!API_KEY) {
    console.warn('GLM API Key 未配置，使用默认模板');
    return getDefaultFallback(goal);
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [
          {
            role: 'system',
            content: `你是一个专业的目标规划助手。用户会输入一个"重生之xxx"类型的目标，你需要将其拆解为具体的里程碑和可执行的小任务。

规则：
1. 时间线固定为1个月（4周），快速见效
2. 拆解为4个里程碑，每周一个里程碑：
   - 第1周：启动与准备
   - 第2周：基础建立
   - 第3周：深化实践
   - 第4周：巩固与成果
3. 每个里程碑包含3个具体可执行的任务
4. 任务要具体、可量化、每天可执行

返回格式（纯 JSON，不要其他内容）：
{
  "title": "目标标题",
  "timeline": "1个月",
  "milestones": [
    {
      "title": "第1周：启动与准备",
      "deadline": "第1周",
      "tasks": [
        {"title": "任务1"},
        {"title": "任务2"},
        {"title": "任务3"}
      ]
    },
    {
      "title": "第2周：基础建立",
      "deadline": "第2周",
      "tasks": [
        {"title": "任务1"},
        {"title": "任务2"},
        {"title": "任务3"}
      ]
    },
    {
      "title": "第3周：深化实践",
      "deadline": "第3周",
      "tasks": [
        {"title": "任务1"},
        {"title": "任务2"},
        {"title": "任务3"}
      ]
    },
    {
      "title": "第4周：巩固与成果",
      "deadline": "第4周",
      "tasks": [
        {"title": "任务1"},
        {"title": "任务2"},
        {"title": "任务3"}
      ]
    }
  ]
}`
          },
          {
            role: 'user',
            content: `请帮我拆解这个目标：${goal}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('GLM API Error:', errorData);
      throw new Error(`GLM API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('GLM API 返回内容为空');
    }

    // 解析 JSON 响应
    let parsedContent = content.trim();

    // 尝试提取 JSON 部分（处理可能的前后缀）
    const jsonMatch = parsedContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsedContent = jsonMatch[0];
    }

    const result: GLMGoalBreakdown = JSON.parse(parsedContent);
    return result;

  } catch (error) {
    console.error('GLM API 调用失败:', error);

    // 返回默认模板作为降级方案
    return getDefaultFallback(goal);
  }
}

/**
 * 降级方案：当 API 调用失败时返回默认模板（按周规划）
 */
function getDefaultFallback(goal: string): GLMGoalBreakdown {
  return {
    title: goal,
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
