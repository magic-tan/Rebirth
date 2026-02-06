import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const API_KEY = process.env.GLM_API_KEY || '';

const SYSTEM_PROMPT = `你是一个专业的任务拆解助手。将用户输入的任务拆解为 3-5 个具体可执行的子任务。

规则：
1. 子任务要具体、可执行
2. 每个子任务应该有明确的目标
3. 子任务之间要有逻辑顺序

严格按照以下 JSON 格式返回：
{
  "subtasks": [
    {"title": "子任务1描述"},
    {"title": "子任务2描述"},
    {"title": "子任务3描述"}
  ]
}

注意：每个 subtask 对象的格式必须是 {"title": "任务描述"}，不要添加序号前缀。`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskTitle } = body;

    if (!taskTitle || !taskTitle.trim()) {
      return NextResponse.json(
        { error: '任务内容不能为空' },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      return NextResponse.json({
        subtasks: [
          { title: '拆解任务目标' },
          { title: '收集必要资源' },
          { title: '执行具体行动' },
        ]
      });
    }

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
          { role: 'user', content: `请帮我拆解这个任务：${taskTitle.trim()}` }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json({
        subtasks: [
          { title: '拆解任务目标' },
          { title: '收集必要资源' },
          { title: '执行具体行动' },
        ]
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({
        subtasks: [
          { title: '拆解任务目标' },
          { title: '收集必要资源' },
          { title: '执行具体行动' },
        ]
      });
    }

    let parsedContent = content.trim();
    const jsonMatch = parsedContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsedContent = jsonMatch[0];
    }

    const result = JSON.parse(parsedContent);
    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json({
      subtasks: [
        { title: '拆解任务目标' },
        { title: '收集必要资源' },
        { title: '执行具体行动' },
      ]
    });
  }
}
