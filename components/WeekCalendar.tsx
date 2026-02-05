'use client';

import { useStore } from '@/lib/store';
import { generateWeekDays } from '@/lib/utils';

export default function WeekCalendar() {
  const { selectedDate, setSelectedDate, tasks } = useStore();
  const weekDays = generateWeekDays(tasks);

  return (
    <div className="flex gap-2 px-5 pb-4 overflow-x-auto scrollbar-hide">
      {weekDays.map((day) => (
        <button
          key={day.date}
          onClick={() => setSelectedDate(day.date)}
          className={`flex-shrink-0 w-12 h-16 rounded-xl flex flex-col items-center justify-center transition-all ${
            selectedDate === day.date
              ? 'bg-primary text-white shadow-lg'
              : 'bg-card-bg border-2 border-transparent'
          }`}
        >
          <span className={`text-xs mb-0.5 ${selectedDate === day.date ? 'text-white/80' : 'text-text-secondary'}`}>
            {day.name}
          </span>
          <span className={`text-lg font-semibold ${selectedDate === day.date ? 'text-white' : 'text-title'}`}>
            {day.number}
          </span>
          {day.hasTask && (
            <span
              className={`w-1 h-1 rounded-full mt-1 ${
                selectedDate === day.date ? 'bg-white' : 'bg-primary'
              }`}
            ></span>
          )}
        </button>
      ))}
    </div>
  );
}
