import {
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { categoryService } from "../../services/category.service";
import { useSnackbar } from "../../hooks/useSnackbar";
import type { Category } from "../../types/category.types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
interface Props {
  categories: Category[];
  onEdit: (Category: Category) => void;
  onDelete: () => void;
}
export default function CategoryList({ categories, onEdit, onDelete }: Props) {
  const { showSnackbar } = useSnackbar();

  const handleDelete = async (id: number) => {
    if (
      window.confirm("Are you sure? This may affect existing transactions.")
    ) {
      try {
        const response = await categoryService.deleteCategory(id);
        showSnackbar(
          response.message || "Category deleted successfully",
          "success"
        );
        onDelete();
      } catch (error: any) {
        console.error("Failed to delete category:", error);
        const errorMessage =
          error.response?.data?.error ||
          "Cannot delete category. It may be in use by transactions.";
        showSnackbar(errorMessage, "error");
      }
    }
  };

  const incomeCategories = categories.filter((c) => c.type === "INCOME");
  const expenseCategories = categories.filter((c) => c.type === "EXPENSE");

  return (
    <Box>
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2, bgcolor: "success.light" }}>
          <Typography variant="h6">Income Categories</Typography>
        </Box>
        <List>
          {expenseCategories.length === 0 ? (
            <ListItem>
              <ListItemText>No Income Category</ListItemText>
            </ListItem>
          ) : (
            incomeCategories.map((category) => (
              <ListItem
                key={category.categoryId}
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      onClick={() => onEdit(category)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(category.categoryId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={category.categoryName}
                  secondary={
                    <Chip label="INCOME" size="small" color="success" />
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
      <Paper>
        <Box sx={{ p: 2, bgcolor: "error.light" }}>
          <Typography variant="h6">Expense Categories</Typography>
        </Box>
        <List>
          {expenseCategories.length === 0 ? (
            <ListItem>
              <ListItemText primary="No expense categories yet" />
            </ListItem>
          ) : (
            expenseCategories.map((category) => (
              <ListItem
                key={category.categoryId}
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      onClick={() => onEdit(category)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(category.categoryId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={category.categoryName}
                  secondary={
                    <Chip label="EXPENSE" size="small" color="error" />
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
}
