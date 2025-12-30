'use client';

import { useFinance } from '@/contexts/FinanceContext';
import { formatCurrency } from '@/lib/utils';
import { FiTarget } from 'react-icons/fi';
import { NewGoalModal } from './NewGoalModal';
import Image from 'next/image';

const goalImages: Record<string, string> = {
  'Viagem Europa': '/images/goals/goal-viagem-europa-669d2f.png',
  'Carro novo': '/images/goals/goal-carro-novo-4b57c4.png',
  'Reserva de emergência': '/images/goals/goal-reserva-emergencia-2f2099.png',
  'Casa própria': '/images/goals/goal-viagem-europa-669d2f.png', // fallback
};

export function GoalsSection() {
  const { goals } = useFinance();
  const displayedGoals = goals.slice(0, 4);

  return (
    <div className="mb-8 lg:mb-[38px] w-full">
      <div className="flex items-center justify-between mb-6 px-0">
        <div className="flex items-center gap-3">
          <FiTarget className="w-6 h-6 text-foreground" />
          <h2 className="text-xl font-bold text-foreground">Objetivos</h2>
        </div>
        <div className="flex items-center gap-3">
          {goals.length > 4 && (
            <button className="text-sm font-semibold text-foreground hover:underline">
              Ver mais
            </button>
          )}
          <NewGoalModal />
        </div>
      </div>
      {/* Row horizontal com scroll e máscara gradiente */}
      <div className="relative w-full">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-0">
          {displayedGoals.map((goal) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            const remaining = goal.target - goal.current;
            const imagePath = goalImages[goal.name] || goal.image;
            
            return (
              <div
                key={goal.id}
                className="flex-shrink-0 w-[320px] bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-400 hover:shadow-lg cursor-pointer group"
              >
                <div className="h-[220px] relative overflow-hidden">
                  {imagePath ? (
                    <Image
                      src={imagePath}
                      alt={goal.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="320px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-semibold text-foreground">
                      {goal.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{goal.name}</h3>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(goal.current)}
                      </p>
                      <p className="text-sm text-gray-500">
                        De {formatCurrency(goal.target)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">{Math.round(progress)}%</span>
                      <span className="text-gray-500">Faltam {formatCurrency(remaining)}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-lime rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Máscara gradiente nas bordas */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-background to-transparent" />
      </div>
    </div>
  );
}

