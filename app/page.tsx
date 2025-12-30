'use client';

import { DashboardHeader } from '@/components/DashboardHeader';
import { SummaryCards } from '@/components/SummaryCards';
import { CategoryCarousel } from '@/components/CategoryCarousel';
import { FinancialFlowChart } from '@/components/FinancialFlowChart';
import { CardsStack } from '@/components/CardsStack';
import { CalendarAgenda } from '@/components/CalendarAgenda';
import { GoalsSection } from '@/components/GoalsSection';
import { TransactionsTable } from '@/components/TransactionsTable';

export default function DashboardContent() {
  return (
    <main className="w-full max-w-full px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8" role="main" aria-label="Dashboard principal">
      <DashboardHeader />
      
      {/* Frame 45: Main Grid Layout (conforme Figma) */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-[35px] mb-8 lg:mb-[38px] w-full">
        {/* Frame 43: Left Column - Categorias + Cards + Gráfico */}
        <div className="flex flex-col gap-8 lg:gap-[41px] lg:w-auto lg:flex-1 min-w-0">
          <CategoryCarousel />
          <SummaryCards />
          <FinancialFlowChart />
        </div>

        {/* Frame 44: Right Column - Cartões + Agenda */}
        <div className="flex flex-col gap-4 lg:gap-[20px] lg:w-auto lg:min-w-[400px]">
          <CardsStack />
          <CalendarAgenda />
        </div>
      </div>

      {/* Objetivos: Row horizontal com scroll, largura completa */}
      <section aria-label="Seção de objetivos financeiros">
        <GoalsSection />
      </section>

      {/* Extrato Detalhado: Largura completa, fora do grid */}
      <section aria-label="Extrato detalhado de transações">
        <TransactionsTable />
      </section>
    </main>
  );
}

