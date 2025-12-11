import type { ApiResponse, PaginatedResponse } from "./api.types";
import type { Category } from "./category.types";
import type { AmountType } from "./enums";

export interface Transaction {
  transactionId: number;
  type: AmountType;
  description?: string;
  date: string;
  category: Category;
  userId: number;
  amount: number;
}

export interface CreateTransactionRequest {
  type: AmountType;
  description?: string;
  date: string;
  categoryId: number;
  amount: number;
}

export interface deleteTransactionRequest {
  transactionId: number;
}

export type CreateTransactionRespnse = ApiResponse<Transaction>;
export type getAllTransactions = PaginatedResponse<Transaction>;
