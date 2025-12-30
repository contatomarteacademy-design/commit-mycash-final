'use client';

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiBarChart2 } from 'react-icons/fi';
import { formatCurrency } from '@/lib/utils';
import { useFinance } from '@/contexts/FinanceContext';
import { startOfMonth, endOfMonth, subMonths, eachMonthOfInterval } from 'date-fns';

const monthAbbr = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-semibold mb-2">{payload[0].payload.month}</p>
        {payload.map((entry: any, idx: number) => (
          <p key={idx} className="text-sm" style={{ color: entry.color }}>
            {entry.name === 'income' ? 'Receitas' : 'Despesas'}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function FinancialFlowChart() {
  const { transactions } = useFinance();

  // Calcular dados dos últimos 7 meses
  const chartData = useMemo(() => {
    const today = new Date();
    const months = eachMonthOfInterval({
      start: subMonths(today, 6),
      end: today,
    });

    return months.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthIndex = month.getMonth();

      const monthTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });

      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.value, 0);

      const expense = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.value, 0);

      return {
        month: monthAbbr[monthIndex],
        income: Math.round(income),
        expense: Math.round(expense),
      };
    });
  }, [transactions]);

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-8" role="region" aria-label="Gráfico de fluxo financeiro">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <FiBarChart2 className="w-5 h-5 md:w-6 md:h-6 text-foreground" aria-hidden="true" />
          <h2 className="text-lg md:text-xl font-bold text-foreground">Fluxo financeiro</h2>
        </div>
        <div className="flex items-center gap-4 md:gap-6" role="list">
          <div className="flex items-center gap-2" role="listitem">
            <div className="w-2 h-2 rounded-full bg-foreground" aria-hidden="true" />
            <span className="text-xs md:text-sm text-foreground">Receitas</span>
          </div>
          <div className="flex items-center gap-2" role="listitem">
            <div className="w-2 h-2 rounded-full bg-lime" aria-hidden="true" />
            <span className="text-xs md:text-sm text-foreground">Despesas</span>
          </div>
        </div>
      </div>
      <div className="h-[250px] md:h-[300px]" role="img" aria-label="Gráfico de área mostrando receitas e despesas ao longo dos meses">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} aria-label="Gráfico de fluxo financeiro">
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#080B12" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#080B12" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DFFE35" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#DFFE35" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#080B12', fontSize: 14 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              tick={{ fill: '#080B12', fontSize: 14 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(value) => `R$ ${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#080B12"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorIncome)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#DFFE35"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorExpense)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

