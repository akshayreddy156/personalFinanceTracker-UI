import type { ApiResponse } from "./api.types";
import type { AmountType } from "./enums";

export interface Category {
  categoryId: number;
  categoryName: string;
  type: AmountType;
  user: number;
}
export interface CreateCategoryRequest {
  categoryName: string;
  type: AmountType;
}

export interface UpdateCategoryRequest {
  categoryId: number;
  categoryName?: string;
  type?: AmountType;
}

export interface DeleteCategoryRequest {
  categoryId: number;
}

export type CategoryResponse = ApiResponse<Category>;
