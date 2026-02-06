'use client';

import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import Onboarding from '@/components/Onboarding';
import Analyzing from '@/components/Analyzing';
import GoalCard from '@/components/GoalCard';
import MilestoneList from '@/components/MilestoneList';
import WeekCalendar from '@/components/WeekCalendar';
import TaskList from '@/components/TaskList';
import BottomNav from '@/components/BottomNav';
import FabButton from '@/components/FabButton';
import AddTaskModal from '@/components/AddTaskModal';
import ProfilePage from '@/components/ProfilePage';
import { SignInButton, SignedIn, SignedOut, UserButton, SignUpButton } from '@clerk/nextjs';

// 登录页面组件
function LoginPage() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary to-purple flex flex-col items-center justify-center p-10 text-white z-50">
      <div className="text-6xl mb-6">🔄</div>
      <h1 className="text-3xl font-bold text-center mb-3">重生</h1>
      <p className="text-base opacity-90 text-center mb-10 max-w-[300px]">
        设定目标，AI帮你拆解成可执行的小任务
      </p>

      <div className="w-full max-w-[320px] flex flex-col gap-3">
        <SignInButton mode="modal">
          <button className="w-full px-5 py-4 rounded-2xl bg-white text-primary font-semibold hover:bg-gray-100 transition-colors">
            登录
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="w-full px-5 py-4 rounded-2xl bg-white/20 backdrop-blur text-white font-semibold hover:bg-white/30 transition-colors">
            注册账号
          </button>
        </SignUpButton>
      </div>

      <p className="text-sm opacity-60 text-center mt-8">
        登录后开始你的重生之旅
      </p>
    </div>
  );
}

export default function Home() {
  const {
    userGoal,
    analyzing,
    currentPage,
    selectedDate,
  } = useStore();

  return (
    <>
      {/* 未登录：显示登录页面 */}
      <SignedOut>
        <LoginPage />
      </SignedOut>

      {/* 已登录 */}
      <SignedIn>
        {/* 未设置目标：显示引导页 */}
        {!userGoal && <Onboarding />}
        {analyzing && <Analyzing />}

        {/* 已设置目标：显示主应用 */}
        {userGoal && !analyzing && (
          <div className="max-w-[430px] mx-auto min-h-screen relative pb-[70px]">
            {currentPage === 'home' && (
              <>
                <header className="px-5 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl font-bold text-title">今天</h1>
                      <p className="text-sm text-text-secondary">{formatDate(selectedDate)}</p>
                    </div>
                    {/* 用户头像 */}
                    <div>
                      <UserButton afterSignOutUrl="/"/>
                    </div>
                  </div>
                </header>

                <GoalCard />
                <MilestoneList />
                <WeekCalendar />
                <TaskList />
              </>
            )}

            {currentPage === 'profile' && <ProfilePage />}

            <FabButton />
            <BottomNav />
            <AddTaskModal />
          </div>
        )}
      </SignedIn>
    </>
  );
}
