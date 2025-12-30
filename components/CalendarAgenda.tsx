'use client';

import { useState } from 'react';
import { FiBarChart2, FiCheck } from 'react-icons/fi';
import { useFinance } from '@/contexts/FinanceContext';
import { formatDate, isSameDay, formatCurrency } from '@/lib/utils';

export function CalendarAgenda() {
  const { bills, updateBillStatus } = useFinance();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = new Date();

  const selectedBills = bills.filter((bill) => isSameDay(new Date(bill.dueDate), selectedDate));

  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const hasBillsOnDay = (day: number) => {
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    return bills.some((bill) => isSameDay(new Date(bill.dueDate), date) && bill.status === 'pending');
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <FiBarChart2 className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
        <h2 className="text-lg md:text-xl font-bold text-foreground">Agenda</h2>
      </div>

      {/* Calendar */}
      <div className="mb-4 md:mb-6">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-base md:text-lg font-semibold">
            {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-3 md:mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div key={idx} className="text-center text-xs md:text-sm font-medium text-gray-500 py-1 md:py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {emptyDays.map((_, idx) => (
            <div key={`empty-${idx}`} className="aspect-square" />
          ))}
          {days.map((day) => {
            const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
            const isToday = isSameDay(date, today);
            const isSelected = isSameDay(date, selectedDate);
            const hasBills = hasBillsOnDay(day);
            
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(date)}
                className={`aspect-square rounded-full flex items-center justify-center text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lime ${
                  isSelected
                    ? 'bg-lime text-foreground font-semibold'
                    : isToday
                    ? 'border-2 border-red text-foreground'
                    : 'hover:bg-gray-100'
                }`}
                aria-label={`${day} de ${selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}${hasBills ? ', tem contas pendentes' : ''}`}
                aria-pressed={isSelected}
              >
                <div className="relative">
                  {day}
                  {hasBills && (
                    <span 
                      className="absolute -top-1 -right-1 w-2 h-2 bg-red rounded-full"
                      aria-label="Contas pendentes"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bills List */}
      <div className="space-y-3">
        {selectedBills.length > 0 ? (
          selectedBills.map((bill) => (
            <div
              key={bill.id}
              className="flex items-center justify-between p-4 bg-background rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">{bill.description}</p>
                <p className="text-sm text-gray-500">{formatCurrency(bill.value)}</p>
              </div>
              <button
                onClick={() => updateBillStatus(bill.id, 'paid')}
                className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-lime ${
                  bill.status === 'paid'
                    ? 'bg-green text-white'
                    : 'bg-gray-200 hover:bg-green hover:text-white'
                }`}
                aria-label={`Marcar ${bill.description} como pago`}
                disabled={bill.status === 'paid'}
              >
                <FiCheck className="w-5 h-5" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">Nada hoje</p>
        )}
      </div>
    </div>
  );
}

