import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const API_KEY = process.env.GLM_API_KEY || '';

// 系统提示词
const SYSTEM_PROMPT = `你是一个专业的目标规划助手。用户会输入一个"重生之xxx"类型的目标，你需要将其拆解为具体的里程碑和可执行的小任务。

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
      "tasks": [{"title": "任务1"}, {"title": "任务2"}, {"title": "任务3"}]
    },
    {
      "title": "第2周：基础建立",
      "deadline": "第2周",
      "tasks": [{"title": "任务1"}, {"title": "任务2"}, {"title": "任务3"}]
    },
    {
      "title": "第3周：深化实践",
      "deadline": "第3周",
      "tasks": [{"title": "任务1"}, {"title": "任务2"}, {"title": "任务3"}]
    },
    {
      "title": "第4周：巩固与成果",
      "deadline": "第4周",
      "tasks": [{"title": "任务1"}, {"title": "任务2"}, {"title": "任务3"}]
    }
  ]
}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goal } = body;

    if (!goal || !goal.trim()) {
      return NextResponse.json(
        { error: '目标内容不能为空' },
        { status: 400 }
      );
    }

    // 检查 API Key
    if (!API_KEY) {
      console.warn('GLM API Key 未配置');
      return NextResponse.json(getDefaultFallback(goal));
    }

    // 超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `请帮我拆解这个目标：${goal.trim()}` }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('GLM API Error:', response.status, errorData);
      // API 失败时返回默认模板
      return NextResponse.json(getDefaultFallback(goal));
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('GLM API 返回内容为空:', data);
      return NextResponse.json(getDefaultFallback(goal));
    }

    // 解析 JSON 响应
    let parsedContent = content.trim();

    // 提取 JSON 部分
    const jsonMatch = parsedContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsedContent = jsonMatch[0];
    }

    // 修复中文标点和全角引号
    parsedContent = parsedContent
      .replace(/，/g, ',')
      .replace(/：/g, ':')
      .replace(/"/g, '"')
      .replace(/"/g, '"')
      .replace(/'/g, "'")
      .replace(/'/g, "'");

    const result = JSON.parse(parsedContent);
    console.log('GLM AI 分析成功:', result.title);
    return NextResponse.json(result);

  } catch (error) {
    console.error('GLM API 调用失败:', error instanceof Error ? error.message : error);

    // 解析失败时返回默认模板
    const body = await request.json().catch(() => ({ goal: '' }));
    return NextResponse.json(getDefaultFallback(body.goal || ''));
  }
}

// 默认降级模板
function getDefaultFallback(goal: string) {
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
