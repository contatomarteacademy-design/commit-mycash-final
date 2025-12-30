'use client';

import { CardsStack } from '@/components/CardsStack';
import { useFinance } from '@/contexts/FinanceContext';

export default function CardsPage() {
  const { cards } = useFinance();

  return (
    <div className="w-full max-w-full px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Cartões</h1>
        <p className="text-gray-500 mt-2">Gerencie seus cartões de crédito</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">{card.name}</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Limite</p>
              <p className="text-2xl font-bold text-foreground">R$ {card.limit.toLocaleString('pt-BR')}</p>
              <p className="text-sm text-gray-500">Fatura atual</p>
              <p className="text-xl font-bold text-foreground">R$ {card.balance.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

