import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';
import { formatCurrency } from '../utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ComparativeChartProps {
  transactions: Transaction[];
}

export function ComparativeChart({ transactions }: ComparativeChartProps) {
  const data = useMemo(() => {
    // Group by month-year
    const grouped = transactions.reduce((acc, transaction) => {
      const date = parseISO(transaction.date);
      const monthYear = format(date, 'MMM/yyyy', { locale: ptBR });
      
      if (!acc[monthYear]) {
        acc[monthYear] = { name: monthYear, Receitas: 0, Despesas: 0, sortKey: date.getTime() };
      }
      
      if (transaction.type === 'income') {
        acc[monthYear].Receitas += transaction.amount;
      } else {
        acc[monthYear].Despesas += transaction.amount;
      }
      
      return acc;
    }, {} as Record<string, { name: string; Receitas: number; Despesas: number; sortKey: number }>);

    return Object.values(grouped)
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ name, Receitas, Despesas }) => ({ name, Receitas, Despesas }));
  }, [transactions]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-lg font-semibold text-slate-800 mb-6">Receitas vs Despesas (Mensal)</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="Receitas" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
            <Bar dataKey="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
