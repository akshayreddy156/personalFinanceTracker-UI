import { useEffect, useState } from "react";
import type { Transaction } from "../types/transaction.types";
import { transactionService } from "../services/transaction.service";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";

export default function Transaction() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editTransaction, setEditTransaction] = useState<
    Transaction | undefined
  >(undefined);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getAllTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditTransaction(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const handleFormSuccess = () => {
    fetchTransactions();
    setIsFormOpen(false);
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Transactions</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Transaction
        </Button>
      </Box>

      <TransactionList
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={fetchTransactions}
      />

      <TransactionForm
        key={editTransaction?.transactionId || "new"}
        open={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        transaction={editTransaction}
      />
    </Box>
  );
}
