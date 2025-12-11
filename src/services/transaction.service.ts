import type {
  CreateTransactionRequest,
  Transaction,
  CreateTransactionRespnse,
} from "../types/transaction.types";
import type { ApiResponse } from "../types/api.types";
import api from "./api";

export const transactionService = {
  getAllTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get("/transactions");
    // Backend returns paginated response: { data: { content: [...] } }
    const transactions = response.data.data.content;

    // Transform backend response (Amount -> amount)
    return transactions;
  },

  createTransaction: async (
    transactionData: CreateTransactionRequest
  ): Promise<CreateTransactionRespnse> => {
    const response = await api.post(
      "/transactions",
      transactionData
    );
    return response.data;
  },

  updateTransaction: async (
    transactionId: number,
    transactionData: CreateTransactionRequest
  ): Promise<CreateTransactionRespnse> => {
    const response = await api.put(
      `/transactions/${transactionId}`,
      transactionData
    );
    return response.data;
  },

  deleteTransaction: async (transactionId: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/transactions/${transactionId}`);
    return response.data;
  },
};
