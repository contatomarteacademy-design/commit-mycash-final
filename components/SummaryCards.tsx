'use client';

import { FiDollarSign, FiArrowDown, FiArrowUp, FiTrendingUp } from 'react-icons/fi';
import { useFinance } from '@/contexts/FinanceContext';
import { formatCurrency } from '@/lib/utils';
import { SummaryCardsSkeleton } from './SummaryCardsSkeleton';

export function SummaryCards() {
  const { stats, loading } = useFinance();

  if (loading) {
    return <SummaryCardsSkeleton />;
  }

  const cards = [
    {
      id: 'balance',
      title: 'Saldo total',
      value: stats.totalBalance,
      icon: FiDollarSign,
      bgColor: 'bg-foreground',
      textColor: 'text-white',
      iconColor: 'text-white',
      growth: stats.balanceGrowth,
    },
    {
      id: 'income',
      title: 'Receitas',
      value: stats.monthlyIncome,
      icon: FiArrowDown,
      bgColor: 'bg-card',
      textColor: 'text-foreground',
      iconColor: 'text-foreground',
    },
    {
      id: 'expense',
      title: 'Despesas',
      value: stats.monthlyExpense,
      icon: FiArrowUp,
      bgColor: 'bg-card',
      textColor: 'text-foreground',
      iconColor: 'text-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`${card.bgColor} ${card.textColor} rounded-xl p-6 md:p-10 flex flex-col gap-6 md:gap-8 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus-within:ring-2 focus-within:ring-lime focus-within:outline-none`}
            tabIndex={0}
            role="article"
            aria-label={`${card.title}: ${formatCurrency(card.value)}`}
          >
            {/* Blob decorativo para card de saldo */}
            {card.id === 'balance' && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-opacity duration-300 group-hover:opacity-30" />
            )}
            
            <div className="flex items-start justify-between relative z-10">
              <Icon className={`w-5 h-5 md:w-6 md:h-6 ${card.iconColor} flex-shrink-0`} />
              {card.id === 'balance' && card.growth && (
                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full flex items-center gap-1">
                  <FiTrendingUp className="w-3 h-3 text-white" />
                  <span className="text-xs font-semibold text-white">+{card.growth}%</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-1 relative z-10">
              <p className={`text-sm md:text-base ${card.textColor} ${card.id === 'balance' ? '' : 'opacity-80'}`}>
                {card.title}
              </p>
              <p className={`text-2xl md:text-3xl font-bold ${card.textColor}`}>
                {formatCurrency(card.value)}
              </p>
              {card.id === 'balance' && card.growth && (
                <p className="text-xs text-white/80 mt-1">esse mês</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

