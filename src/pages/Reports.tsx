import { useEffect, useState } from "react";
import type {
  MonthDataResponse,
  YearDataResponse,
  CategoryDataResponse,
} from "../types/report.ypes";
import { reportService } from "../services/report.service";
import { Box, CircularProgress, Typography, Grid } from "@mui/material";
import SummaryCards from "../components/reports/SummaryCards";
import MonthlyCharts from "../components/reports/MonthlyChart";
import YearlyChart from "../components/reports/YearlyChart";
import CategoryBreakdownChart from "../components/reports/CategoryBreakdownChart";

export default function Reports() {
  const [monthlyData, setMonthlyData] = useState<MonthDataResponse[]>([]);
  const [yearlyData, setYearlyData] = useState<YearDataResponse | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryDataResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const currentDate = new Date();
      const [monthlyReport, yearlyReport, categoryBreakdown] =
        await Promise.all([
          reportService.getMonthlyReport(currentDate.getFullYear()),
          reportService.getYearlyReport(2020, currentDate.getFullYear()),
          reportService.getCategoryBreakdown(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1
          ),
        ]);
      setMonthlyData([monthlyReport]);
      setYearlyData(yearlyReport);
      setCategoryData(categoryBreakdown);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      {monthlyData.length > 0 && (
        <>
          <SummaryCards data={monthlyData} />
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, lg: 4 }}>
              <MonthlyCharts data={monthlyData} />
            </Grid>
            {yearlyData && (
              <Grid size={{ xs: 12, lg: 4 }}>
                <YearlyChart data={yearlyData} />
              </Grid>
            )}
            {categoryData && (
              <Grid size={{ xs: 12, lg: 4 }}>
                <CategoryBreakdownChart data={categoryData} />
              </Grid>
            )}
          </Grid>
        </>
      )}
      {monthlyData.length === 0 && (
        <Typography variant="body1" color="text.secondary">
          No data available yet. Add some transactions to see reports!
        </Typography>
      )}
    </Box>
  );
}
