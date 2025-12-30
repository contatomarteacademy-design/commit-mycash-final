'use client';

import { useState } from 'react';
import { formatDate, getFirstDayOfMonth, getLastDayOfMonth } from '@/lib/utils';

interface DateRangePickerProps {
  dateRange?: { from: Date; to: Date };
  onDateRangeChange: (range: { from: Date; to: Date } | undefined) => void;
}

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(dateRange?.from || today);
  const [selectedStart, setSelectedStart] = useState<Date | null>(dateRange?.from || null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(dateRange?.to || null);

  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfWeek = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isInRange = (date: Date) => {
    if (!selectedStart || !selectedEnd) return false;
    return date >= selectedStart && date <= selectedEnd;
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(date);
      setSelectedEnd(null);
    } else if (selectedStart && !selectedEnd) {
      if (date < selectedStart) {
        setSelectedEnd(selectedStart);
        setSelectedStart(date);
      } else {
        setSelectedEnd(date);
      }
    }
  };

  const handleQuickSelect = (type: 'thisMonth' | 'lastMonth' | 'last3Months' | 'thisYear') => {
    const today = new Date();
    let from: Date;
    let to: Date;

    switch (type) {
      case 'thisMonth':
        from = getFirstDayOfMonth(today);
        to = getLastDayOfMonth(today);
        break;
      case 'lastMonth':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        from = getFirstDayOfMonth(lastMonth);
        to = getLastDayOfMonth(lastMonth);
        break;
      case 'last3Months':
        from = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        to = getLastDayOfMonth(today);
        break;
      case 'thisYear':
        from = new Date(today.getFullYear(), 0, 1);
        to = new Date(today.getFullYear(), 11, 31);
        break;
    }

    setSelectedStart(from);
    setSelectedEnd(to);
    onDateRangeChange({ from, to });
  };

  const handleApply = () => {
    if (selectedStart && selectedEnd) {
      onDateRangeChange({ from: selectedStart, to: selectedEnd });
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfWeek(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="w-full">
      {/* Quick Select Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => handleQuickSelect('thisMonth')}
          className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-gray-50"
        >
          Este mês
        </button>
        <button
          onClick={() => handleQuickSelect('lastMonth')}
          className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-gray-50"
        >
          Mês passado
        </button>
        <button
          onClick={() => handleQuickSelect('last3Months')}
          className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-gray-50"
        >
          Últimos 3 meses
        </button>
        <button
          onClick={() => handleQuickSelect('thisYear')}
          className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-gray-50"
        >
          Este ano
        </button>
      </div>

      {/* Calendar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
              setCurrentMonth(prevMonth);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ←
          </button>
          <h3 className="font-semibold">
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={() => {
              const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
              setCurrentMonth(nextMonth);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {days.map((day) => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isStart = selectedStart && isSameDay(date, selectedStart);
            const isEnd = selectedEnd && isSameDay(date, selectedEnd);
            const inRange = isInRange(date);
            const isToday = isSameDay(date, today);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`aspect-square text-sm rounded-lg transition-colors ${
                  isStart || isEnd
                    ? 'bg-foreground text-white font-semibold'
                    : inRange
                    ? 'bg-lime/20 text-foreground'
                    : isToday
                    ? 'border-2 border-lime text-foreground'
                    : 'hover:bg-gray-100 text-foreground'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApply}
        disabled={!selectedStart || !selectedEnd}
        className="w-full px-4 py-2 bg-foreground text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Aplicar
      </button>
    </div>
  );
}

