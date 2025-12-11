import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse,
} from "../types/category.types";
import type { ApiResponse } from "../types/api.types";
import api from "./api";

export const categoryService = {
  createCategory: async (
    categoryData: CreateCategoryRequest
  ): Promise<CategoryResponse> => {
    const response = await api.post("/categories", categoryData);
    return response.data;
  },

  updateCategory: async (
    updateCategoryData: UpdateCategoryRequest
  ): Promise<CategoryResponse> => {
    const response = await api.put(
      `/categories/${updateCategoryData.categoryId}`,
      updateCategoryData
    );
    return response.data;
  },

  deleteCategory: async (categoryId: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await api.get("/categories");
    // Backend returns wrapped response: { data: [...], message: null, status: "success" }
    return response.data.data;
  },
};
