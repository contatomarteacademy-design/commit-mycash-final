'use client';

import { useRef, useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { formatCurrency } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { NewCategoryModal } from './NewCategoryModal';

const COLORS = ['#DFFE35', '#15BE78', '#EB4B5B', '#080B12', '#9CA3AF'];

export function CategoryCarousel() {
  const { stats } = useFinance();
  const categories = stats.categoryBreakdown.slice(0, 6);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-foreground">Categorias</h2>
        </div>
        <div className="flex items-center">
          <NewCategoryModal />
        </div>
      </div>
      {/* Container com máscara gradiente */}
      <div 
        className="relative"
        onMouseEnter={() => setShowArrows(true)}
        onMouseLeave={() => setShowArrows(false)}
      >
        {/* Left Arrow */}
        {showArrows && (
          <button
            onClick={() => scroll('left')}
            className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card border border-border rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Rolar para esquerda"
          >
            <FiChevronLeft className="w-5 h-5 text-foreground" />
          </button>
        )}
        
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-0 -mx-4 md:mx-0 pl-4 md:pl-0"
        >
          {categories.map((category, idx) => {
          const data = [
            { name: category.category, value: category.percentage },
            { name: 'Resto', value: 100 - category.percentage },
          ];
          return (
            <div
              key={category.category}
              className="flex-shrink-0 w-[200px] bg-card border border-border rounded-xl p-8 flex flex-col items-center gap-3 transition-all duration-300 hover:border-lime hover:shadow-lg cursor-pointer focus-within:ring-2 focus-within:ring-lime focus-within:outline-none"
              tabIndex={0}
              role="article"
              aria-label={`Categoria ${category.category}: ${formatCurrency(category.value)} (${Math.round(category.percentage)}%)`}
            >
              <div className="relative w-16 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={32}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? COLORS[idx % COLORS.length] : '#E5E7EB'}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-foreground">
                    {Math.round(category.percentage)}%
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-base font-medium text-foreground">{category.category}</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(category.value)}</p>
              </div>
            </div>
          );
        })}
        </div>
        
        {/* Right Arrow */}
        {showArrows && (
          <button
            onClick={() => scroll('right')}
            className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card border border-border rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Rolar para direita"
          >
            <FiChevronRight className="w-5 h-5 text-foreground" />
          </button>
        )}
        
        {/* Máscara gradiente nas bordas */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-background to-transparent" />
      </div>
    </div>
  );
}

