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

export default function Home() {
  const {
    userGoal,
    analyzing,
    currentPage,
    selectedDate,
  } = useStore();

  // 如果没有目标，显示引导页
  const shouldShowOnboarding = !userGoal;

  return (
    <>
      {shouldShowOnboarding && <Onboarding />}
      {analyzing && <Analyzing />}

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
    </>
  );
}
