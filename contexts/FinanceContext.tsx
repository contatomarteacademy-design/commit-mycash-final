'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode, useEffect } from 'react';
import { Transaction, Goal, Card, Member, Account, Bill, Filters, FinanceStats } from '@/types';
import { getFirstDayOfMonth, getLastDayOfMonth } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import {
  calculateTotalBalance,
  calculatePeriodIncome,
  calculatePeriodExpense,
  calculateSavingsRate,
  calculateCategoryBreakdown,
} from '@/lib/calculations';

interface FinanceContextType {
  transactions: Transaction[];
  goals: Goal[];
  cards: Card[];
  members: Member[];
  accounts: Account[];
  bills: Bill[];
  filters: Filters;
  stats: FinanceStats;
  loading: boolean;
  setFilters: (filters: Partial<Filters>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  addMember: (member: Omit<Member, 'id'>) => Promise<void>;
  addCard: (card: Omit<Card, 'id'>) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  updateBillStatus: (billId: string, status: 'paid' | 'pending') => Promise<void>;
  filteredTransactions: Transaction[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  
  const today = new Date();
  const [filters, setFiltersState] = useState<Filters>({
    search: '',
    type: 'all',
    dateRange: {
      from: getFirstDayOfMonth(today),
      to: getLastDayOfMonth(today),
    },
  });

  // Carregar dados do Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Carregar Members
        const { data: membersData } = await supabase
          .from('members')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (membersData) {
          setMembers(membersData.map(m => ({
            id: m.id,
            name: m.name,
            role: m.role,
            avatar: m.avatar || undefined,
            monthlyIncome: parseFloat(m.monthly_income) || 0,
          })));
        }

        // Carregar Accounts
        const { data: accountsData } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (accountsData) {
          setAccounts(accountsData.map(a => ({
            id: a.id,
            name: a.name,
            type: a.type as 'checking' | 'savings' | 'card',
            balance: parseFloat(a.balance) || 0,
          })));
        }

        // Carregar Cards
        const { data: cardsData } = await supabase
          .from('cards')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (cardsData) {
          setCards(cardsData.map(c => ({
            id: c.id,
            name: c.name,
            closingDay: c.closing_day,
            dueDay: c.due_day,
            limit: parseFloat(c.limit_amount) || 0,
            balance: parseFloat(c.balance) || 0,
            theme: c.theme as 'black' | 'lime' | 'white',
            logo: c.logo || undefined,
            lastDigits: c.last_digits,
          })));
        }

        // Carregar Transactions
        const { data: transactionsData } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        if (transactionsData) {
          setTransactions(transactionsData.map(t => ({
            id: t.id,
            type: t.type as 'income' | 'expense',
            value: parseFloat(t.value) || 0,
            description: t.description,
            category: t.category,
            date: new Date(t.date),
            accountId: t.account_id || '',
            memberId: t.member_id || '',
            installments: t.installments_current && t.installments_total
              ? { current: t.installments_current, total: t.installments_total }
              : undefined,
            status: t.status as 'paid' | 'pending',
          })));
        }

        // Carregar Goals
        const { data: goalsData } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (goalsData) {
          setGoals(goalsData.map(g => ({
            id: g.id,
            name: g.name,
            target: parseFloat(g.target) || 0,
            current: parseFloat(g.current) || 0,
            category: g.category,
            image: g.image || undefined,
          })));
        }

        // Carregar Bills
        const { data: billsData } = await supabase
          .from('bills')
          .select('*')
          .eq('user_id', user.id)
          .order('due_date', { ascending: true });
        if (billsData) {
          setBills(billsData.map(b => ({
            id: b.id,
            description: b.description,
            value: parseFloat(b.value) || 0,
            dueDate: new Date(b.due_date),
            status: b.status as 'paid' | 'pending',
            accountId: b.account_id || undefined,
          })));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Configurar subscriptions em tempo real
    const channels = [
      supabase.channel('transactions_changes'),
      supabase.channel('members_changes'),
      supabase.channel('cards_changes'),
      supabase.channel('accounts_changes'),
      supabase.channel('goals_changes'),
      supabase.channel('bills_changes'),
    ];

    channels[0].on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
      loadData();
    }).subscribe();

    channels[1].on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => {
      loadData();
    }).subscribe();

    channels[2].on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, () => {
      loadData();
    }).subscribe();

    channels[3].on('postgres_changes', { event: '*', schema: 'public', table: 'accounts' }, () => {
      loadData();
    }).subscribe();

    channels[4].on('postgres_changes', { event: '*', schema: 'public', table: 'goals' }, () => {
      loadData();
    }).subscribe();

    channels[5].on('postgres_changes', { event: '*', schema: 'public', table: 'bills' }, () => {
      loadData();
    }).subscribe();

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, []);

  const setFilters = useCallback((newFilters: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filters.search && !t.description.toLowerCase().includes(filters.search.toLowerCase()) && 
          !t.category.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.type !== 'all' && t.type !== filters.type) {
        return false;
      }
      if (filters.memberId && t.memberId !== filters.memberId) {
        return false;
      }
      if (filters.dateRange) {
        const date = new Date(t.date);
        if (date < filters.dateRange.from || date > filters.dateRange.to) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, filters]);

  const stats = useMemo((): FinanceStats => {
    const income = calculatePeriodIncome(transactions, filters);
    const expense = calculatePeriodExpense(transactions, filters);
    const totalBalance = calculateTotalBalance(accounts, cards);
    const savingsRate = calculateSavingsRate(income, expense);
    const categoryBreakdown = calculateCategoryBreakdown(transactions, income, filters);
    const balanceGrowth = 0; // TODO: Calcular crescimento real

    return {
      totalBalance,
      monthlyIncome: income,
      monthlyExpense: expense,
      savingsRate,
      categoryBreakdown,
      balanceGrowth,
    };
  }, [transactions, accounts, cards, filters]);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        type: transaction.type,
        value: transaction.value,
        description: transaction.description,
        category: transaction.category,
        date: transaction.date.toISOString().split('T')[0],
        account_id: transaction.accountId || null,
        member_id: transaction.memberId || null,
        installments_current: transaction.installments?.current || null,
        installments_total: transaction.installments?.total || null,
        status: transaction.status,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setTransactions((prev) => [{
        id: data.id,
        type: data.type as 'income' | 'expense',
        value: parseFloat(data.value) || 0,
        description: data.description,
        category: data.category,
        date: new Date(data.date),
        accountId: data.account_id || '',
        memberId: data.member_id || '',
        installments: data.installments_current && data.installments_total
          ? { current: data.installments_current, total: data.installments_total }
          : undefined,
        status: data.status as 'paid' | 'pending',
      }, ...prev]);
    }
  }, []);

  const addMember = useCallback(async (member: Omit<Member, 'id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('members')
      .insert({
        name: member.name,
        role: member.role,
        avatar: member.avatar || null,
        monthly_income: member.monthlyIncome,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setMembers((prev) => [...prev, {
        id: data.id,
        name: data.name,
        role: data.role,
        avatar: data.avatar || undefined,
        monthlyIncome: parseFloat(data.monthly_income) || 0,
      }]);
    }
  }, []);

  const addCard = useCallback(async (card: Omit<Card, 'id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('cards')
      .insert({
        name: card.name,
        closing_day: card.closingDay,
        due_day: card.dueDay,
        limit_amount: card.limit,
        balance: card.balance,
        theme: card.theme,
        logo: card.logo || null,
        last_digits: card.lastDigits,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setCards((prev) => [...prev, {
        id: data.id,
        name: data.name,
        closingDay: data.closing_day,
        dueDay: data.due_day,
        limit: parseFloat(data.limit_amount) || 0,
        balance: parseFloat(data.balance) || 0,
        theme: data.theme as 'black' | 'lime' | 'white',
        logo: data.logo || undefined,
        lastDigits: data.last_digits,
      }]);
    }
  }, []);

  const addGoal = useCallback(async (goal: Omit<Goal, 'id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('goals')
      .insert({
        name: goal.name,
        target: goal.target,
        current: goal.current,
        category: goal.category,
        image: goal.image || null,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setGoals((prev) => [...prev, {
        id: data.id,
        name: data.name,
        target: parseFloat(data.target) || 0,
        current: parseFloat(data.current) || 0,
        category: data.category,
        image: data.image || undefined,
      }]);
    }
  }, []);

  const updateBillStatus = useCallback(async (billId: string, status: 'paid' | 'pending') => {
    const { error } = await supabase
      .from('bills')
      .update({ status })
      .eq('id', billId);

    if (error) throw error;
    setBills((prev) =>
      prev.map((bill) => (bill.id === billId ? { ...bill, status } : bill))
    );
  }, []);

  const value = useMemo(
    () => ({
      transactions,
      goals,
      cards,
      members,
      accounts,
      bills,
      filters,
      stats,
      loading,
      setFilters,
      addTransaction,
      addMember,
      addCard,
      addGoal,
      updateBillStatus,
      filteredTransactions,
    }),
    [
      transactions,
      goals,
      cards,
      members,
      accounts,
      bills,
      filters,
      stats,
      loading,
      setFilters,
      addTransaction,
      addMember,
      addCard,
      addGoal,
      updateBillStatus,
      filteredTransactions,
    ]
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
}
