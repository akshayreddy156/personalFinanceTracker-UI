import { useEffect, useState, type FormEvent } from "react";
import type {
  CreateCategoryRequest,
  Category,
} from "../../types/category.types";
import { AmountType } from "../../types/enums";
import { categoryService } from "../../services/category.service";
import { useSnackbar } from "../../hooks/useSnackbar";
import {
  Alert,
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

interface props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: Category;
}

export default function CategoryForm({
  open,
  onClose,
  onSuccess,
  category,
}: props) {
  const [categoryData, setCategoryData] = useState<CreateCategoryRequest>({
    categoryName: "",
    type: AmountType.EXPENSE,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (category) {
      setCategoryData({
        categoryName: category.categoryName,
        type: category.type,
      });
    }
  }, [category]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (category) {
        const response = await categoryService.updateCategory({
          categoryId: category.categoryId,
          ...categoryData,
        });
        showSnackbar(response.message || "Category updated successfully", "success");
      } else {
        const response = await categoryService.createCategory(categoryData);
        showSnackbar(response.message || "Category created successfully", "success");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to submit category", error);
      const errorMessage =
        error.response?.data?.errors?.exception ||
        "Failed to submit category. Please try again.";
      setError(errorMessage);
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Category Name"
            fullWidth
            required
            margin="normal"
            value={categoryData.categoryName || ""}
            onChange={(e) =>
              setCategoryData({
                ...categoryData,
                categoryName: e.target.value,
              })
            }
          />
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">Type</FormLabel>
            <RadioGroup
              row
              value={categoryData.type}
              onChange={(e) =>
                setCategoryData({
                  ...categoryData,
                  type: e.target.value as AmountType,
                })
              }
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
