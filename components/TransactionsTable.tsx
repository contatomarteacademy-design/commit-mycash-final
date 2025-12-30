'use client';

import { useState } from 'react';
import { FiSearch, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useFinance } from '@/contexts/FinanceContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Transaction } from '@/types';

export function TransactionsTable() {
  const { filteredTransactions, members, accounts, cards } = useFinance();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getMember = (memberId: string) => {
    return members.find((m) => m.id === memberId);
  };

  const getAccountName = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    const card = cards.find((c) => c.id === accountId);
    if (account) return account.name;
    if (card) return `Cartão ${card.name}`;
    return '-';
  };

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-card border border-border rounded-xl p-8 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-foreground">Extrato detalhado</h2>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar lançamentos"
              className="pl-10 pr-4 py-2 bg-background border border-border rounded-full text-sm w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-lime transition-all"
              aria-label="Buscar transações"
            />
          </div>
          <select 
            className="px-4 py-2 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-lime transition-all"
            aria-label="Filtrar por tipo de transação"
          >
            <option>Todos</option>
            <option>Receitas</option>
            <option>Despesas</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" role="table" aria-label="Tabela de transações">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="text-left py-4 px-2 text-sm font-semibold text-foreground w-20">
                Membro
              </th>
              <th scope="col" className="text-left py-4 px-2 text-sm font-semibold text-foreground w-32">
                Data
              </th>
              <th scope="col" className="text-left py-4 px-2 text-sm font-semibold text-foreground">
                Descrição
              </th>
              <th scope="col" className="text-left py-4 px-2 text-sm font-semibold text-foreground w-32">
                Categoria
              </th>
              <th scope="col" className="text-left py-4 px-2 text-sm font-semibold text-foreground w-40">
                Conta/Cartão
              </th>
              <th scope="col" className="text-left py-4 px-2 text-sm font-semibold text-foreground w-24">
                Parcelas
              </th>
              <th scope="col" className="text-right py-4 px-2 text-sm font-semibold text-foreground w-32">
                Valor
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-500">
                  Nenhum lançamento encontrado.
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction) => {
                const member = getMember(transaction.memberId);
                const isIncome = transaction.type === 'income';
                
                return (
                  <tr 
                    key={transaction.id} 
                    className="border-b border-border hover:bg-gray-50 transition-colors duration-200 focus-within:bg-gray-50"
                    tabIndex={0}
                    role="row"
                  >
                    <td className="py-4 px-2">
                      <div 
                        className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold"
                        aria-label={member?.name || 'Membro desconhecido'}
                      >
                        {member?.name[0] || '?'}
                      </div>
                    </td>
                    <td className="py-4 px-2 text-sm text-foreground">
                      {formatDate(new Date(transaction.date))}
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        {isIncome ? (
                          <FiArrowDown className="w-4 h-4 text-green" aria-hidden="true" />
                        ) : (
                          <FiArrowUp className="w-4 h-4 text-foreground" aria-hidden="true" />
                        )}
                        <span className="text-sm text-foreground">{transaction.description}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-sm text-foreground">{transaction.category}</td>
                    <td className="py-4 px-2 text-sm text-foreground">
                      {getAccountName(transaction.accountId)}
                    </td>
                    <td className="py-4 px-2 text-sm text-foreground">
                      {transaction.installments
                        ? `${transaction.installments.current}/${transaction.installments.total}`
                        : '-'}
                    </td>
                    <td className={`py-4 px-2 text-sm font-semibold text-right ${
                      isIncome ? 'text-green' : 'text-foreground'
                    }`}>
                      {isIncome ? '+' : '-'} {formatCurrency(transaction.value)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-border">
        <p className="text-sm text-foreground">
          Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
          {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} de{' '}
          {filteredTransactions.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-background border border-border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-lime"
            aria-label="Página anterior"
          >
            ←
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-lime ${
                  currentPage === page
                    ? 'bg-foreground text-white'
                    : 'bg-background border border-border hover:bg-gray-50'
                }`}
                aria-label={`Ir para página ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-background border border-border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-lime"
            aria-label="Próxima página"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

