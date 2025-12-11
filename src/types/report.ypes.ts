import type { ApiResponse } from "./api.types";

export interface Month {
  month: number;
  income: number;
  expense: number;
}

export interface MonthData {
  userId: number;
  year: number;
  months: Month[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface Year {
  year: number;
  income: number;
  expense: number;
}

export interface YearData {
  userId: number;
  startYear: number;
  endYear: number;
  years: Year[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface BreakdownItem {
  categoryId: number;
  categoryName: string;
  total: number;
}

export interface CategoryData {
  userId: number;
  year: number;
  month: number;
  breakdown: BreakdownItem[];
}

export type MonthDataResponse = ApiResponse<MonthData>;
export type YearDataResponse = ApiResponse<YearData>;
export type CategoryDataResponse = ApiResponse<CategoryData>;
