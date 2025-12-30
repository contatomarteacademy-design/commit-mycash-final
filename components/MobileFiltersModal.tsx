'use client';

import { useState } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import { useFinance } from '@/contexts/FinanceContext';
import * as Dialog from '@radix-ui/react-dialog';
import { DateRangePicker } from './DateRangePicker';
import Image from 'next/image';

export function MobileFiltersModal() {
  const { filters, setFilters, members } = useFinance();
  const [open, setOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const handleApply = () => {
    setFilters(tempFilters);
    setOpen(false);
  };

  const handleTypeChange = (type: 'all' | 'income' | 'expense') => {
    setTempFilters({ ...tempFilters, type });
  };

  const handleMemberToggle = (memberId: string) => {
    setTempFilters({
      ...tempFilters,
      memberId: tempFilters.memberId === memberId ? undefined : memberId,
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="lg:hidden p-4 bg-card border border-border rounded-full hover:bg-gray-50 transition-colors">
          <span className="text-sm font-semibold">Filtros</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 max-h-[90vh] flex flex-col animate-slide-up">
          {/* Header Fixo */}
          <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
            <Dialog.Title className="text-xl font-bold text-foreground">Filtros</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Fechar">
                <FiX className="w-6 h-6 text-foreground" />
              </button>
            </Dialog.Close>
          </div>

          {/* Conteúdo Scrollável */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Tipo de Transação */}
            <div>
              <label className="block text-sm font-semibold mb-3">Tipo de Transação</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleTypeChange('all')}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    tempFilters.type === 'all'
                      ? 'border-foreground bg-foreground text-white'
                      : 'border-border hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold">Todos</span>
                </button>
                <button
                  onClick={() => handleTypeChange('income')}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    tempFilters.type === 'income'
                      ? 'border-foreground bg-foreground text-white'
                      : 'border-border hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold">Receitas</span>
                </button>
                <button
                  onClick={() => handleTypeChange('expense')}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    tempFilters.type === 'expense'
                      ? 'border-foreground bg-foreground text-white'
                      : 'border-border hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold">Despesas</span>
                </button>
              </div>
            </div>

            {/* Membros da Família */}
            <div>
              <label className="block text-sm font-semibold mb-3">Membro da Família</label>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleMemberToggle('')}
                  className={`px-4 py-3 rounded-full border-2 transition-colors flex items-center gap-2 ${
                    !tempFilters.memberId
                      ? 'border-foreground bg-foreground text-white'
                      : 'border-border hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold">Todos</span>
                </button>
                {members.map((member) => {
                  const isSelected = tempFilters.memberId === member.id;
                  return (
                    <button
                      key={member.id}
                      onClick={() => handleMemberToggle(member.id)}
                      className={`px-4 py-3 rounded-full border-2 transition-colors flex items-center gap-2 ${
                        isSelected
                          ? 'border-foreground bg-foreground text-white'
                          : 'border-border hover:bg-gray-50'
                      }`}
                    >
                      {member.avatar ? (
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={32}
                          height={32}
                          className="rounded-full object-cover border-2 border-white"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
                          {member.name[0]}
                        </div>
                      )}
                      <span className="font-semibold">{member.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Período */}
            <div>
              <label className="block text-sm font-semibold mb-3">Período</label>
              <DateRangePicker
                dateRange={tempFilters.dateRange}
                onDateRangeChange={(range) => setTempFilters({ ...tempFilters, dateRange: range })}
              />
            </div>
          </div>

          {/* Footer Fixo */}
          <div className="p-4 border-t border-border flex-shrink-0">
            <button
              onClick={handleApply}
              className="w-full px-6 py-4 bg-foreground text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-lg"
            >
              Aplicar Filtros
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

