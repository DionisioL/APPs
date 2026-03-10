import React from 'react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, Home, Dumbbell, Droplets, Zap, Wifi, CreditCard, Receipt, Briefcase, TrendingUp, DollarSign, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const CategoryIcon = ({ category, type, className }: { category: string; type: 'income' | 'expense'; className?: string }) => {
  if (type === 'income') {
    switch (category) {
      case 'Salário': return <Briefcase className={className} />;
      case 'Investimentos': return <TrendingUp className={className} />;
      case 'Freelance': return <DollarSign className={className} />;
      default: return <ArrowUpCircle className={className} />;
    }
  }

  switch (category) {
    case 'Casa': return <Home className={className} />;
    case 'Academia': return <Dumbbell className={className} />;
    case 'Água': return <Droplets className={className} />;
    case 'Luz': return <Zap className={className} />;
    case 'Internet': return <Wifi className={className} />;
    case 'Cartão de Crédito': return <CreditCard className={className} />;
    default: return <Receipt className={className} />;
  }
};

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
        <Receipt className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <h3 className="text-lg font-medium text-slate-800">Nenhum registro</h3>
        <p className="text-slate-500 mt-1">Adicione suas receitas e despesas para começar a acompanhar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800">Histórico de Transações</h2>
      </div>
      <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                transaction.type === 'income' 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'bg-red-50 text-red-600'
              }`}>
                <CategoryIcon category={transaction.category} type={transaction.type} className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium text-slate-800">{transaction.description || transaction.category}</p>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                    {transaction.category}
                  </span>
                  <span>•</span>
                  <span>{format(parseISO(transaction.date), "dd 'de' MMM, yyyy", { locale: ptBR })}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`font-semibold ${
                transaction.type === 'income' ? 'text-emerald-600' : 'text-slate-800'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </span>
              <button
                onClick={() => onDelete(transaction.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Excluir registro"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
