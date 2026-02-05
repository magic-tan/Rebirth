'use client';

import { useStore } from '@/lib/store';

export default function Analyzing() {
  const { analyzingGoal } = useStore();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="w-full max-w-[430px] bg-transparent p-10 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-purple rounded-full flex items-center justify-center text-4xl pulse-animate">
          🧠
        </div>
        <p className="text-base font-medium text-gray-900 mb-2">GLM-4.7 正在拆解你的目标...</p>
        <p className="text-sm text-gray-500 mb-4">&ldquo;{analyzingGoal}&rdquo;</p>
        <p className="text-xs text-gray-400 mb-4">Powered by 智谱 AI</p>
        <div className="flex justify-center gap-1">
          <span className="w-2 h-2 bg-primary rounded-full bounce-animate"></span>
          <span className="w-2 h-2 bg-primary rounded-full bounce-animate" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-2 h-2 bg-primary rounded-full bounce-animate" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
    </div>
  );
}
