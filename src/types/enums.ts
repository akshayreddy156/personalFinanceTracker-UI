// String literal types
export type AmountType = 'INCOME' | 'EXPENSE';

export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export type CategoryType =
  | 'FOOD'
  | 'TRANSPORT'
  | 'ENTERTAINMENT'
  | 'UTILITIES'
  | 'HEALTHCARE'
  | 'SHOPPING'
  | 'OTHER';

// Const objects for runtime values (if needed)
export const AmountType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

export const TransactionStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export const CategoryType = {
  FOOD: 'FOOD',
  TRANSPORT: 'TRANSPORT',
  ENTERTAINMENT: 'ENTERTAINMENT',
  UTILITIES: 'UTILITIES',
  HEALTHCARE: 'HEALTHCARE',
  SHOPPING: 'SHOPPING',
  OTHER: 'OTHER',
} as const;