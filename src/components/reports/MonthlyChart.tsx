import { Box, Paper, Typography } from "@mui/material";
import type { MonthDataResponse } from "../../types/report.ypes";
import { BarChart } from "@mui/x-charts";

interface Props {
  data: MonthDataResponse[];
}
export default function MonthlyCharts({ data }: Props) {
  const months = data[0].data.months.map((month) => month.month);
  const incomeData = data[0].data.months.map((month) => month.income);
  const expenseData = data[0].data.months.map((month) => month.expense);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Monthly Income Vs Expenses
      </Typography>
      <Box sx={{ width: "100%", height: 400 }}>
        <BarChart
          xAxis={[{ scaleType: "band", data: months }]}
          series={[
            { data: incomeData, label: "Income", color: "#4caf50" },
            { data: expenseData, label: "Expense", color: "#f44336" },
          ]}
          height={350}
        />
      </Box>
    </Paper>
  );
}
