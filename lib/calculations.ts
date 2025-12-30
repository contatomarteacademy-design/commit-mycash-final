import { Account, Card, Transaction, Filters } from '@/types';

/**
 * Calcula o saldo total considerando contas bancárias e faturas de cartões
 */
export function calculateTotalBalance(accounts: Account[], cards: Card[]): number {
  const totalAccounts = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalCardBills = cards.reduce((sum, card) => sum + card.balance, 0);
  return totalAccounts - totalCardBills;
}

/**
 * Calcula receitas do período aplicando filtros
 */
export function calculatePeriodIncome(
  transactions: Transaction[],
  filters: Filters
): number {
  let filtered = transactions.filter((t) => t.type === 'income');

  if (filters.dateRange) {
    filtered = filtered.filter((t) => {
      const date = new Date(t.date);
      return date >= filters.dateRange!.from && date <= filters.dateRange!.to;
    });
  }

  if (filters.memberId) {
    filtered = filtered.filter((t) => t.memberId === filters.memberId);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.description.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower)
    );
  }

  return filtered.reduce((sum, t) => sum + t.value, 0);
}

/**
 * Calcula despesas do período aplicando filtros
 */
export function calculatePeriodExpense(
  transactions: Transaction[],
  filters: Filters
): number {
  let filtered = transactions.filter((t) => t.type === 'expense');

  if (filters.dateRange) {
    filtered = filtered.filter((t) => {
      const date = new Date(t.date);
      return date >= filters.dateRange!.from && date <= filters.dateRange!.to;
    });
  }

  if (filters.memberId) {
    filtered = filtered.filter((t) => t.memberId === filters.memberId);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.description.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower)
    );
  }

  return filtered.reduce((sum, t) => sum + t.value, 0);
}

/**
 * Calcula taxa de economia: (Receitas - Despesas) / Receitas × 100
 */
export function calculateSavingsRate(income: number, expense: number): number {
  if (income === 0) return 0;
  return ((income - expense) / income) * 100;
}

/**
 * Calcula breakdown por categoria de despesas
 */
export function calculateCategoryBreakdown(
  transactions: Transaction[],
  income: number,
  filters: Filters
): Array<{ category: string; value: number; percentage: number }> {
  let filtered = transactions.filter((t) => t.type === 'expense');

  if (filters.dateRange) {
    filtered = filtered.filter((t) => {
      const date = new Date(t.date);
      return date >= filters.dateRange!.from && date <= filters.dateRange!.to;
    });
  }

  if (filters.memberId) {
    filtered = filtered.filter((t) => t.memberId === filters.memberId);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.description.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower)
    );
  }

  const categoryMap = new Map<string, number>();
  filtered.forEach((t) => {
    categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.value);
  });

  const breakdown = Array.from(categoryMap.entries()).map(([category, value]) => ({
    category,
    value,
    percentage: income > 0 ? (value / income) * 100 : 0,
  }));

  return breakdown.sort((a, b) => b.value - a.value);
}

/**
 * Calcula crescimento percentual do saldo comparando com período anterior
 */
export function calculateBalanceGrowth(
  currentBalance: number,
  previousBalance: number
): number {
  if (previousBalance === 0) return currentBalance > 0 ? 100 : 0;
  return ((currentBalance - previousBalance) / Math.abs(previousBalance)) * 100;
}

