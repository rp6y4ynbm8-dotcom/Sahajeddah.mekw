import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { JeddahEvent } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Tag } from 'lucide-react';
import { EventCard } from './EventCard';

export const CalendarView: React.FC = () => {
  const { language, t, filteredEvents, setSelectedEvent } = useApp();
  
  // Start with October 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed, 9 = October
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-22');

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNamesAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const daysOfWeekEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysOfWeekAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const daysOfWeek = language === 'ar' ? daysOfWeekAr : daysOfWeekEn;
  const monthName = language === 'ar' ? monthNamesAr[currentMonth] : monthNamesEn[currentMonth];

  // Calendar matrix calculation
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Find events for each date
  const getEventsForDate = (dateStr: string) => {
    return filteredEvents.filter(e => dateStr >= e.startDate && dateStr <= e.endDate);
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="space-y-6">
      
      {/* Calendar Header with month navigator */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEF08A] text-[#854D0E] flex items-center justify-center font-bold">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                {monthName} {currentYear}
              </h2>
              <p className="text-xs text-[#64748B]">
                {language === 'ar' ? 'توقيت مكة المكرمة (Asia/Riyadh)' : 'Asia/Riyadh Timezone'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#334155] cursor-pointer"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentYear(2026);
                setCurrentMonth(9);
                setSelectedDate('2026-10-21');
              }}
              className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold hover:bg-[#F8FAFC] cursor-pointer"
            >
              {language === 'ar' ? 'اليوم' : 'Today'}
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#334155] cursor-pointer"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-[#64748B] mb-2">
          {daysOfWeek.map((day, idx) => (
            <div key={idx} className="py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-16 sm:h-20 rounded-xl bg-[#F8FAFC]/50 border border-transparent" />
          ))}

          {/* Month Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const monthStr = String(currentMonth + 1).padStart(2, '0');
            const dayStr = String(dayNum).padStart(2, '0');
            const fullDate = `${currentYear}-${monthStr}-${dayStr}`;
            const isSelected = selectedDate === fullDate;
            const dateEvents = getEventsForDate(fullDate);
            const hasEvents = dateEvents.length > 0;

            return (
              <button
                key={fullDate}
                onClick={() => setSelectedDate(fullDate)}
                className={`h-16 sm:h-20 p-1.5 sm:p-2 rounded-xl text-start flex flex-col justify-between border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-[#0284C7] bg-[#F0F9FF] ring-2 ring-[#0284C7]/20 shadow-xs'
                    : hasEvents
                    ? 'border-[#E2E8F0] bg-white hover:border-[#BAE6FD] hover:bg-[#F8FAFC]'
                    : 'border-[#F1F5F9] bg-[#FAFAFA] text-[#94A3B8] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#0284C7]' : hasEvents ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>
                    {dayNum}
                  </span>
                  {hasEvents && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#FEF08A] text-[#854D0E]">
                      {dateEvents.length}
                    </span>
                  )}
                </div>

                {/* Event previews in cell on larger screens */}
                <div className="space-y-0.5 overflow-hidden w-full hidden sm:block">
                  {dateEvents.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className="text-[9px] truncate px-1 py-0.5 rounded bg-[#E0F2FE] text-[#0369A1] font-medium"
                    >
                      {language === 'ar' ? ev.titleAr : ev.title}
                    </div>
                  ))}
                  {dateEvents.length > 2 && (
                    <span className="text-[9px] text-[#64748B] pl-1 font-semibold">
                      +{dateEvents.length - 2} {language === 'ar' ? 'المزيد' : 'more'}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Header & Event List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
            <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">
              {language === 'ar' ? `فعاليات يوم: ${selectedDate}` : `Activities for ${selectedDate}`}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#E2E8F0] text-[#334155]">
              {selectedDateEvents.length} {language === 'ar' ? 'فعالية' : 'events'}
            </span>
          </div>
        </div>

        {selectedDateEvents.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[#CBD5E1]">
            <p className="text-sm font-medium text-[#64748B]">
              {language === 'ar' ? 'لا توجد فعاليات مجدولة في هذا التاريخ المحدد. جرب النقر على تاريخ آخر.' : 'No events scheduled on this specific date. Try selecting another date on the calendar.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {selectedDateEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
