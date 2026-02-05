'use client';

import { useStore } from '@/lib/store';

export default function FabButton() {
  const { currentPage, setShowAddTaskModal } = useStore();

  if (currentPage !== 'home') return null;

  return (
    <button
      onClick={() => setShowAddTaskModal(true)}
      className="fixed bottom-[85px] right-5 w-14 h-14 bg-gradient-to-br from-primary to-purple rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30 z-30 active:scale-90 transition-all hover:scale-105 hover:shadow-purple-500/50 max-[430px]:right-5 group"
      style={{ right: 'calc(50% - 195px)' }}
    >
      {/* 脉冲效果 */}
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-purple animate-ping opacity-20" />

      {/* 加号图标 */}
      <svg
        className="w-7 h-7 text-white relative z-10 transition-transform group-hover:rotate-90"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
      </svg>

      {/* 小装饰圆点 */}
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white" />
    </button>
  );
}
