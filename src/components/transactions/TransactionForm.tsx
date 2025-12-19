import { useState, useEffect, useMemo } from "react";
import type { Category } from "../../types/category.types";
import { AmountType } from "../../types/enums";
import type {
  Transaction,
  CreateTransactionRequest,
} from "../../types/transaction.types";
import { categoryService } from "../../services/category.service";
import { transactionService } from "../../services/transaction.service";
import { useSnackbar } from "../../hooks/useSnackbar";
import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useValidation } from "../../hooks/useValidation";
import { ValidationRules } from "../../utils/validation";

interface props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction?: Transaction;
}

export default function TransactionForm({
  open,
  onClose,
  onSuccess,
  transaction,
}: props) {
  const [transactionData, setTransactionData] =
    useState<CreateTransactionRequest>({
      type: AmountType.EXPENSE,
      amount: 0,
      categoryId: 0,
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
  const [initialData, setInitialData] = useState<CreateTransactionRequest>({
    type: AmountType.EXPENSE,
    amount: 0,
    categoryId: 0,
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const { showSnackbar } = useSnackbar();
  const { validateFields, validateField, getError, hasError, clearAllErrors } =
    useValidation();

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      showSnackbar("Failed to fetch categories", "error");
      setCategories([]);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCategories();
      clearAllErrors();
      setError("");

      if (transaction) {
        // Format date from ISO 8601 to YYYY-MM-DD for date input
        const formattedDate = transaction.date.split("T")[0];

        const data = {
          type: transaction.type,
          amount: transaction.amount,
          categoryId: transaction.category.categoryId,
          date: formattedDate,
          description: transaction.description || "",
        };
        setTransactionData(data);
        setInitialData(data);
      } else {
        // Reset form data for new transaction
        const data = {
          type: AmountType.EXPENSE,
          amount: 0,
          categoryId: 0,
          date: new Date().toISOString().split("T")[0],
          description: "",
        };
        setTransactionData(data);
        setInitialData(data);
      }
    }
  }, [open, transaction, clearAllErrors]);

  // Check if form has been modified
  const isDirty = useMemo(
    () => JSON.stringify(transactionData) !== JSON.stringify(initialData),
    [transactionData, initialData]
  );
  const filteredCategories = useMemo(
    () => categories.filter((cat) => cat.type === transactionData.type),
    [categories, transactionData.type]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const isValid = validateFields({
      type: {
        value: transactionData.type,
        rules: [ValidationRules.required()],
        displayName: "Transaction Type",
      },
      amount: {
        value: transactionData.amount,
        rules: [ValidationRules.required(), ValidationRules.positive()],
        displayName: "Amount",
      },
      categoryId: {
        value: transactionData.categoryId,
        rules: [ValidationRules.required()],
        displayName: "Category",
      },
      date: {
        value: transactionData.date,
        rules: [ValidationRules.required()],
        displayName: "Date",
      },
    });
    if (!isValid) {
      return;
    }
    setLoading(true);
    try {
      // Convert date from YYYY-MM-DD to LocalDateTime format (YYYY-MM-DDTHH:mm:ss)
      const dateTimeString = `${transactionData.date}T00:00:00`;

      const requestData = {
        ...transactionData,
        date: dateTimeString,
      };

      if (transaction) {
        // Update existing transaction logic here
        const response = await transactionService.updateTransaction(
          transaction.transactionId,
          requestData
        );
        showSnackbar(
          response.message || "Transaction updated successfully",
          "success"
        );
      } else {
        const response = await transactionService.createTransaction(
          requestData
        );
        showSnackbar(
          response.message || "Transaction created successfully",
          "success"
        );
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to submit transaction", error);
      const errorMessage =
        error.response?.data?.error ||
        "Failed to submit transaction. Please try again.";
      setError(errorMessage);
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {transaction ? "Edit Transaction" : "Add Transaction"}
      </DialogTitle>
      <form onSubmit={handleSubmit} noValidate>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">Type</FormLabel>
            <RadioGroup
              row
              value={transactionData.type}
              onChange={(e) => {
                const newType = e.target.value as AmountType;
                setTransactionData({
                  ...transactionData,
                  type: newType,
                  categoryId: 0,
                });
                clearAllErrors();
              }}
            >
              <FormControlLabel
                value={AmountType.INCOME}
                control={<Radio />}
                label="Income 💰"
              />
              <FormControlLabel
                value={AmountType.EXPENSE}
                control={<Radio />}
                label="Expense 💸"
              />
            </RadioGroup>
          </FormControl>
          <Autocomplete
            options={filteredCategories}
            getOptionLabel={(option) => `${option.categoryName}`}
            value={
              filteredCategories.find(
                (cat) => cat.categoryId === transactionData.categoryId
              ) || null
            }
            onChange={(_, newValue) => {
              const categoryId = newValue?.categoryId || 0;
              setTransactionData({
                ...transactionData,
                categoryId,
              });
              // Validate immediately after change
              validateField(
                "categoryId",
                categoryId,
                [ValidationRules.required()],
                "Category"
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Category"
                required
                margin="normal"
                error={hasError("categoryId")}
                helperText={getError("categoryId")}
              />
            )}
          />
          <TextField
            label="Amount (₹)"
            type="number"
            fullWidth
            required
            margin="normal"
            value={transactionData.amount || ""}
            onChange={(e) => {
              setTransactionData({
                ...transactionData,
                amount: e.target.value === "" ? 0 : Number(e.target.value),
              });
              validateField(
                "amount",
                e.target.value === "" ? 0 : Number(e.target.value),
                [ValidationRules.required(), ValidationRules.positive()],
                "Amount"
              );
            }}
            error={hasError("amount")}
            helperText={getError("amount")}
            slotProps={{
              htmlInput: { min: 0, step: "any" },
              inputLabel: { shrink: true },
            }}
          />
          <TextField
            label="Date"
            type="date"
            fullWidth
            required
            margin="normal"
            value={transactionData.date}
            onChange={(e) =>
              setTransactionData({
                ...transactionData,
                date: e.target.value,
              })
            }
            onBlur={() =>
              validateField(
                "date",
                transactionData.date,
                [ValidationRules.required()],
                "Date"
              )
            }
            error={hasError("date")}
            helperText={getError("date")}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={transactionData.description || ""}
            onChange={(e) =>
              setTransactionData({
                ...transactionData,
                description: e.target.value,
              })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || (transaction && !isDirty)}
          >
            {loading ? "Saving..." : transaction ? "Update" : "Add Transaction"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
