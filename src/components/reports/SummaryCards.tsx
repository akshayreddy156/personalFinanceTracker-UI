import { Grid, Paper, Typography } from "@mui/material";
import type { MonthDataResponse } from "../../types/report.ypes";

interface Props {
  data: MonthDataResponse[];
}
export default function SummaryCards({ data }: Props) {
  const totalIncome = data.reduce(
    (sum, item) => sum + item.data.totalIncome,
    0
  );
  const totalExpense = data.reduce(
    (sum, item) => sum + item.data.totalExpense,
    0
  );
  const balance = totalIncome - totalExpense;

  const savingsRate =
    totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  return (
    <Grid container spacing={2} mb={2}>
      <Grid size={{ xs: 12, md: 3, sm: 3 }}>
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            bgcolor: "#e0f7fa",
            overflow: "hidden",
          }}
        >
          <Typography variant="h6">Total Income</Typography>
          <Typography variant="h4" color="green">
            ₹{totalIncome.toFixed(2)}
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 3, sm: 3 }}>
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            bgcolor: "#FFCDD2",
            overflow: "hidden",
          }}
        >
          <Typography variant="h6">Total Expenses</Typography>
          <Typography variant="h4">₹{totalExpense.toFixed(2)}</Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 3, sm: 3 }}>
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            bgcolor: "#BBDEFB",
            overflow: "hidden",
          }}
        >
          <Typography variant="h6">Net Balance</Typography>
          <Typography variant="h4">₹{balance.toFixed(2)}</Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 3, sm: 3 }}>
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            bgcolor: "#ecd576ff",
            overflow: "hidden",
          }}
        >
          <Typography variant="h6">Savings Rate</Typography>
          <Typography variant="h4">{savingsRate}%</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
