'use client';

import { useStore } from '@/lib/store';

export default function BottomNav() {
  const { currentPage, setCurrentPage } = useStore();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-[60px] bg-card-bg border-t border-border flex justify-around items-center z-40">
      <button
        onClick={() => setCurrentPage('home')}
        className={`flex flex-col items-center gap-1 px-6 py-2 ${
          currentPage === 'home' ? 'text-primary' : 'text-text-secondary'
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span className="text-xs">首页</span>
      </button>

      <button
        onClick={() => setCurrentPage('profile')}
        className={`flex flex-col items-center gap-1 px-6 py-2 ${
          currentPage === 'profile' ? 'text-primary' : 'text-text-secondary'
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span className="text-xs">我的</span>
      </button>
    </nav>
  );
}
