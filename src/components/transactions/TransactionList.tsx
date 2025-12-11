import { transactionService } from "../../services/transaction.service";
import type { Transaction } from "../../types/transaction.types";
import { useSnackbar } from "../../hooks/useSnackbar";
import { Box, Chip, IconButton } from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AmountType } from "../../types/enums";
import type { Category } from "../../types/category.types";

interface Props {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: number) => void;
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: Props) {
  const { showSnackbar } = useSnackbar();

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const response = await transactionService.deleteTransaction(id);
        showSnackbar(response.message || "Transaction deleted successfully", "success");
        onDelete(id);
      } catch (error: any) {
        console.error("Failed to delete transaction:", error);
        showSnackbar("Failed to delete transaction", "error");
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 130,
      valueFormatter: (value) => {
        return new Date(value).toLocaleDateString();
      },
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      valueGetter: (value: Category) => value?.categoryName || "",
    },
    {
      field: "type",
      headerName: "Type",
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={params.value === AmountType.INCOME ? "success" : "error"}
          size="small"
          icon={<span>{params.value === AmountType.INCOME ? "💰" : "💸"}</span>}
        />
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 130,
      align: "right",
      headerAlign: "right",
      valueFormatter: (value: number) => `₹ ${value.toFixed(2)}`,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => onEdit(params.row as Transaction)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.transactionId)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={transactions}
        columns={columns}
        getRowId={(row) => `${row.transactionId}-${row.date}-${row.amount}`}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      />
    </Box>
  );
}
