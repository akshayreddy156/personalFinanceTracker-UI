import type {
  CategoryDataResponse,
  MonthDataResponse,
  YearDataResponse,
} from "../types/report.ypes";
import api from "./api";

export const reportService = {
  getYearlyReport: async (
    startYear: number,
    endYear: number
  ): Promise<YearDataResponse> => {
    const response = await api.get<YearDataResponse>("/reports/yearly", {
      params: {
        startYear,
        endYear,
      },
    });

    return response.data;
  },

  getMonthlyReport: async (year: number): Promise<MonthDataResponse> => {
    const response = await api.get<MonthDataResponse>("/reports/monthly", {
      params: {
        year,
      },
    });
    return response.data;
  },

  getCategoryBreakdown: async (
    year: number,
    month: number
  ): Promise<CategoryDataResponse> => {
    const response = await api.get<CategoryDataResponse>(
      "/reports/monthly-by-category",
      {
        params: {
          year,
          month,
        },
      }
    );
    return response.data;
  },
};
