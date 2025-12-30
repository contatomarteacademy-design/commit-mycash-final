'use client';

import { useState } from 'react';
import { FiSearch, FiFilter, FiCalendar, FiPlus, FiCheck } from 'react-icons/fi';
import { useFinance } from '@/contexts/FinanceContext';
import { formatDate } from '@/lib/utils';
import * as Popover from '@radix-ui/react-popover';
import * as Tooltip from '@radix-ui/react-tooltip';
import { NewTransactionModal } from './NewTransactionModal';
import { AddMemberModal } from './AddMemberModal';
import { DateRangePicker } from './DateRangePicker';
import { MobileFiltersModal } from './MobileFiltersModal';
import Image from 'next/image';

export function DashboardHeader() {
  const { filters, setFilters, members } = useFinance();
  const [searchValue, setSearchValue] = useState(filters.search);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setFilters({ search: value });
  };

  const selectedDateRange = filters.dateRange
    ? `${formatDate(filters.dateRange.from)} - ${formatDate(filters.dateRange.to)}`
    : 'Selecione o período';

  return (
    <header className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8">
      {/* Left: Search, Filters, Date */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1">
        {/* Search */}
        <div className="relative flex-1 w-full md:max-w-[346px]">
          <FiSearch className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-11 md:pl-14 pr-4 md:pr-6 py-3 md:py-4 bg-card border border-border rounded-full text-base md:text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lime"
          />
        </div>

        {/* Filters Button */}
        <div className="hidden lg:block">
          <Popover.Root>
            <Popover.Trigger asChild>
              <button 
                className="p-4 bg-card border border-border rounded-full hover:bg-gray-50 transition-colors"
                aria-label="Abrir filtros"
              >
                <FiFilter className="w-6 h-6 text-foreground" />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className="bg-card border border-border rounded-2xl p-6 shadow-lg z-50 min-w-[300px]">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-4">Filtros</h3>
                  {/* Type Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tipo</label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ type: e.target.value as any })}
                      className="w-full px-4 py-2 border border-border rounded-lg"
                    >
                      <option value="all">Todos</option>
                      <option value="income">Receitas</option>
                      <option value="expense">Despesas</option>
                    </select>
                  </div>
                  {/* Member Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Membro</label>
                    <select
                      value={filters.memberId || ''}
                      onChange={(e) => setFilters({ memberId: e.target.value || undefined })}
                      className="w-full px-4 py-2 border border-border rounded-lg"
                    >
                      <option value="">Todos</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
        
        {/* Mobile Filters Button */}
        <MobileFiltersModal />

        {/* Date Range */}
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="flex items-center gap-2 md:gap-4 px-4 md:px-6 py-3 md:py-4 bg-card border border-border rounded-full hover:bg-gray-50 transition-colors">
              <FiCalendar className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
              <span className="text-sm md:text-lg whitespace-nowrap">{selectedDateRange}</span>
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="bg-card border border-border rounded-2xl p-6 shadow-lg z-50" align="start">
              <DateRangePicker
                dateRange={filters.dateRange}
                onDateRangeChange={(range) => setFilters({ dateRange: range })}
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Family Avatars */}
        <Tooltip.Provider>
          <div className="hidden md:flex items-center -space-x-4">
            {members.slice(0, 3).map((member, idx) => {
              const isSelected = filters.memberId === member.id;
              return (
                <Tooltip.Root key={member.id}>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={() => {
                        setFilters({ memberId: isSelected ? undefined : member.id });
                      }}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all hover:scale-110 relative ${
                        isSelected
                          ? 'border-foreground scale-110 bg-foreground text-white'
                          : 'border-white bg-gray-300 hover:border-gray-400'
                      }`}
                      style={{ zIndex: isSelected ? 20 : 10 - idx }}
                      aria-label={`Filtrar por ${member.name}`}
                    >
                      {member.avatar ? (
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <span>{member.name[0]}</span>
                      )}
                      {isSelected && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-lime rounded-full flex items-center justify-center border-2 border-white">
                          <FiCheck className="w-3 h-3 text-foreground" />
                        </div>
                      )}
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-foreground text-white px-3 py-2 rounded-lg text-sm z-50"
                      side="bottom"
                      sideOffset={8}
                    >
                      {member.name} - {member.role}
                      <Tooltip.Arrow className="fill-foreground" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              );
            })}
            <AddMemberModal />
          </div>
        </Tooltip.Provider>
      </div>

      {/* Right: New Transaction Button */}
      <div className="w-full md:w-auto">
        <NewTransactionModal />
      </div>
    </header>
  );
}

