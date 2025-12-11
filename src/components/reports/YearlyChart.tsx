import { Box, Paper, Typography } from "@mui/material";
import type { YearDataResponse } from "../../types/report.ypes";
import { LineChart } from "@mui/x-charts";

interface Props {
  data: YearDataResponse;
}

export default function YearlyChart({ data }: Props) {
  const months = data.data.years.map((year) => year.year);
  const incomeData = data.data.years.map((year) => year.income);
  const expenseData = data.data.years.map((year) => year.expense);
  const netData = data.data.years.map((year) => year.income - year.expense);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Yearly Tredns {data.data.years[0].year}
      </Typography>
      <Box sx={{ width: "100%", height: 400 }}>
        <LineChart
          xAxis={[{ scaleType: "band", data: months }]}
          series={[
            { data: incomeData, label: "Income", color: "#4caf50" },
            { data: expenseData, label: "Expenses", color: "#f44336" },
            { data: netData, label: "Net Balance", color: "#2196f3" },
          ]}
          height={350}
        />
      </Box>
    </Paper>
  );
}
