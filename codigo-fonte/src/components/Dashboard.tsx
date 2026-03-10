import React, { useMemo } from 'react';
import { useFinance } from '../hooks/useFinance';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';
import { ExpenseChart } from './ExpenseChart';
import { ComparativeChart } from './ComparativeChart';
import { formatCurrency } from '../utils';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export function Dashboard() {
  const { transactions, addTransaction, deleteTransaction } = useFinance();

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.totalIncome += transaction.amount;
          acc.balance += transaction.amount;
        } else {
          acc.totalExpense += transaction.amount;
          acc.balance -= transaction.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, balance: 0 }
    );
  }, [transactions]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Finanças</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total de Receitas</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total de Despesas</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
              balance >= 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-600'
            }`}>
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Saldo Atual</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <TransactionForm onAdd={addTransaction} />
            {transactions.some(t => t.type === 'expense') && <ExpenseChart transactions={transactions} />}
          </div>
          <div className="lg:col-span-2 space-y-8">
            {transactions.length > 0 && <ComparativeChart transactions={transactions} />}
            <TransactionList transactions={transactions} onDelete={deleteTransaction} />
          </div>
        </div>
      </main>
    </div>
  );
}

