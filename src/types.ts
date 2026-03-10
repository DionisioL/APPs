export type ExpenseCategory = 
  | 'Casa'
  | 'Academia'
  | 'Água'
  | 'Luz'
  | 'Internet'
  | 'Cartão de Crédito'
  | 'Outros';

export type IncomeCategory = 
  | 'Salário'
  | 'Investimentos'
  | 'Freelance'
  | 'Outros';

export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  description: string;
}
