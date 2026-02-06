import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const API_KEY = process.env.GLM_API_KEY || '';

// 系统提示词 - 更清晰的格式说明
const SYSTEM_PROMPT = `你是一个专业的目标规划助手。将用户输入的"重生之xxx"目标拆解为里程碑和任务。

规则：
1. 时间线固定为1个月（4周）
2. 拆解为4个里程碑，每周一个里程碑：
   - 第1周：启动与准备
   - 第2周：基础建立
   - 第3周：深化实践
   - 第4周：巩固与成果
3. **重要：每个里程碑必须包含7个具体可执行的任务，分别对应周一到周日**

严格按照以下JSON格式返回，不要有任何改动：
{
  "title": "目标标题",
  "timeline": "1个月",
  "milestones": [
    {
      "title": "第1周：启动与准备",
      "deadline": "第1周",
      "tasks": [
        {"title": "周一要做的具体任务"},
        {"title": "周二要做的具体任务"},
        {"title": "周三要做的具体任务"},
        {"title": "周四要做的具体任务"},
        {"title": "周五要做的具体任务"},
        {"title": "周六要做的具体任务"},
        {"title": "周日要做的具体任务"}
      ]
    },
    {
      "title": "第2周：基础建立",
      "deadline": "第2周",
      "tasks": [
        {"title": "周一要做的具体任务"},
        {"title": "周二要做的具体任务"},
        {"title": "周三要做的具体任务"},
        {"title": "周四要做的具体任务"},
        {"title": "周五要做的具体任务"},
        {"title": "周六要做的具体任务"},
        {"title": "周日要做的具体任务"}
      ]
    },
    {
      "title": "第3周：深化实践",
      "deadline": "第3周",
      "tasks": [
        {"title": "周一要做的具体任务"},
        {"title": "周二要做的具体任务"},
        {"title": "周三要做的具体任务"},
        {"title": "周四要做的具体任务"},
        {"title": "周五要做的具体任务"},
        {"title": "周六要做的具体任务"},
        {"title": "周日要做的具体任务"}
      ]
    },
    {
      "title": "第4周：巩固与成果",
      "deadline": "第4周",
      "tasks": [
        {"title": "周一要做的具体任务"},
        {"title": "周二要做的具体任务"},
        {"title": "周三要做的具体任务"},
        {"title": "周四要做的具体任务"},
        {"title": "周五要做的具体任务"},
        {"title": "周六要做的具体任务"},
        {"title": "周日要做的具体任务"}
      ]
    }
  ]
}

注意：
1. 每个任务必须对应具体的一天（周一到周日），每天的任务要有所不同
2. 每个task对象的格式必须是 {"title": "任务描述"}，不要添加"任务1"、"任务2"这样的前缀
3. 7个任务要按周一到周日的顺序排列，内容要与当天相关`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goal } = body;

    console.log('=== API Route 被调用 ===');
    console.log('收到目标:', goal);

    if (!goal || !goal.trim()) {
      return NextResponse.json(
        { error: '目标内容不能为空' },
        { status: 400 }
      );
    }

    const apiKeyExists = !!API_KEY;
    const apiKeyPrefix = API_KEY ? API_KEY.substring(0, 10) + '...' : 'none';
    console.log('API Key 存在:', apiKeyExists, '前缀:', apiKeyPrefix);

    if (!API_KEY) {
      console.warn('GLM API Key 未配置');
      return NextResponse.json({
        ...getDefaultFallback(goal),
        _debug: { error: 'API_KEY_MISSING', message: '服务端 API Key 未配置' }
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

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
      console.error('=== GLM API 错误 ===');
      console.error('状态码:', response.status);
      console.error('错误数据:', errorData);
      return NextResponse.json({
        ...getDefaultFallback(goal),
        _debug: {
          error: 'GLM_API_ERROR',
          status: response.status,
          message: errorData.error?.message || 'API 请求失败'
        }
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log('=== GLM API 原始响应 ===');
    console.log('完整响应:', JSON.stringify(data, null, 2));

    if (!content) {
      console.error('GLM API 返回内容为空:', data);
      return NextResponse.json({
        ...getDefaultFallback(goal),
        _debug: { error: 'EMPTY_CONTENT', message: 'API 返回内容为空' }
      });
    }

    // 解析 JSON 响应
    let parsedContent = content.trim();

    // 提取 JSON 部分
    const jsonMatch = parsedContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsedContent = jsonMatch[0];
    }

    console.log('=== 清理后的 JSON (解析前) ===');
    console.log(parsedContent.substring(0, 500) + '...');

    // 修复常见的 JSON 格式问题
    parsedContent = fixJsonFormat(parsedContent);

    console.log('=== 清理后的 JSON (解析后) ===');
    console.log(parsedContent.substring(0, 500) + '...');

    const result = JSON.parse(parsedContent);
    console.log('GLM AI 分析成功:', result.title);
    return NextResponse.json(result);

  } catch (error) {
    console.error('=== API Route 异常 ===');
    console.error('错误类型:', error instanceof Error ? error.name : typeof error);
    console.error('错误信息:', error instanceof Error ? error.message : error);

    // 获取 goal 用于降级方案
    let goal = '';
    try {
      const body = await request.json();
      goal = body.goal || '';
    } catch (e) {
      // ignore
    }

    return NextResponse.json({
      ...getDefaultFallback(goal),
      _debug: {
        error: 'API_ROUTE_ERROR',
        message: error instanceof Error ? error.message : '未知错误'
      }
    });
  }
}

/**
 * 修复 AI 返回的 JSON 格式问题
 */
function fixJsonFormat(jsonStr: string): string {
  let result = jsonStr;

  // 1. 修复中文标点
  result = result
    .replace(/，/g, ',')
    .replace(/：/g, ':')
    .replace(/"/g, '"')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/'/g, "'");

  // 2. 修复任务格式：{"title": "任务1": "描述"} → {"title": "描述"}
  // 匹配 {"title": "任务数字/序号": "内容"} 或 {"title": "任务X": "内容"}
  result = result.replace(
    /\{\s*"title"\s*:\s*"[任务\d一二三四五六七八九\w:]+"\s*:\s*"([^"]+)"\s*\}/g,
    '{"title": "$1"}'
  );

  // 3. 修复 {"title": "任务1":"描述"} (没有空格的版本)
  result = result.replace(
    /\{\s*"title"\s*:\s*"[\w:]+"\s*:\s*"([^"]+)"\s*\}/g,
    '{"title": "$1"}'
  );

  // 4. 修复更复杂的格式：{"title": "任务1：描述"}
  result = result.replace(
    /\{\s*"title"\s*:\s*"[\u4e00-\u9fa5\w:：\d]+\s*[:：]\s*([^"]+)"\s*\}/g,
    '{"title": "$1"}'
  );

  // 5. 清理多余的逗号（如 "a": 1, } → "a": 1 }）
  result = result.replace(/,\s*([}\]])/g, '$1');

  // 6. 清理控制字符
  result = result.replace(/[\x00-\x1F\x7F]/g, '');

  return result;
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
          { title: '周一：制定详细计划' },
          { title: '周二：收集学习资料' },
          { title: '周三：建立学习环境' },
          { title: '周四：了解基础概念' },
          { title: '周五：制定周计划' },
          { title: '周六：准备学习工具' },
          { title: '周日：休息调整' },
        ]
      },
      {
        title: '第2周：基础建立',
        deadline: '第2周',
        tasks: [
          { title: '周一：学习基础知识第一部分' },
          { title: '周二：学习基础知识第二部分' },
          { title: '周三：完成基础练习题' },
          { title: '周四：复习总结' },
          { title: '周五：小测验自检' },
          { title: '周六：查漏补缺' },
          { title: '周日：休息放松' },
        ]
      },
      {
        title: '第3周：深化实践',
        deadline: '第3周',
        tasks: [
          { title: '周一：进阶内容学习' },
          { title: '周二：实践练习第一部分' },
          { title: '周三：实践练习第二部分' },
          { title: '周四：解决疑难问题' },
          { title: '周五：综合练习' },
          { title: '周六：成果展示' },
          { title: '周日：复盘总结' },
        ]
      },
      {
        title: '第4周：巩固与成果',
        deadline: '第4周',
        tasks: [
          { title: '周一：全面复习' },
          { title: '周二：查漏补缺' },
          { title: '周三：模拟测试' },
          { title: '周四：总结经验' },
          { title: '周五：制定下一步计划' },
          { title: '周六：整理笔记资料' },
          { title: '周日：庆祝阶段性胜利' },
        ]
      }
    ]
  };
}
