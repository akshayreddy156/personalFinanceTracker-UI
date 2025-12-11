import { useEffect, useState } from "react";
import type { Transaction } from "../types/transaction.types";
import { transactionService } from "../services/transaction.service";
import { AmountType } from "../types/enums";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import CategoryIcon from "@mui/icons-material/Category";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getAllTransactions();
      // Ensure data is an array
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
      setTransactions([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthTransactions = transactions.filter((transaction) => {
    const date = new Date(transaction.date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });

  const totalIncome = thisMonthTransactions
    .filter((t) => t.type === AmountType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = thisMonthTransactions
    .filter((t) => t.type === AmountType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

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
        Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#C8E6C9" }}>
            <Typography variant="h6">Total Income</Typography>
            <Typography variant="h4">₹ {totalIncome.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#FFCDD2" }}>
            <Typography variant="h6">Total Expenses</Typography>
            <Typography variant="h4">₹ {totalExpense.toFixed(2)}</Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#BBDEFB" }}>
            <Typography variant="h6">Net Balance</Typography>
            <Typography variant="h4">₹ {netBalance.toFixed(2)}</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          color="inherit"
          startIcon={<CategoryIcon />}
          component={Link}
          to="/transactions"
        >
          Manage Transactions
        </Button>
        <Button
          variant="outlined"
          startIcon={<QueryStatsIcon />}
          component={Link}
          to="/reports"
        >
          View Reports
        </Button>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Transactions
        </Typography>
        {thisMonthTransactions.slice(0, 5).map((transaction) => (
          <Box
            key={transaction.transactionId}
            sx={{
              py: 2,
              px: 2,
              mb: 1,
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography sx={{ fontSize: "1.5rem" }}>
                {transaction.type === AmountType.INCOME ? "💰" : "💸"}
              </Typography>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {transaction.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  📅 {new Date(transaction.date).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color:
                  transaction.type === AmountType.INCOME
                    ? "#2A9149"
                    : "#d32f2f",
              }}
            >
              {transaction.type === AmountType.INCOME ? "+" : "-"}₹{" "}
              {transaction.amount.toFixed(2)}
            </Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
