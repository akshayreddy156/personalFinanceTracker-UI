export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  path?: string;
  errors?: Record<string, string>;
}

export type ApiStatus = "success" | "error" | "loading";

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}
