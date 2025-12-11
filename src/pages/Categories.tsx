import { useEffect, useState } from "react";
import { type Category } from "../types/category.types";
import { categoryService } from "../services/category.service";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryList from "../components/categories/CategoryList";
import AddIcon from "@mui/icons-material/Add";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | undefined>();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAdd = () => {
    setEditCategory(undefined);
    setFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditCategory(undefined);
  };

  const handleSuccess = () => {
    fetchCategories();
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
        <Typography variant="h4">Categories</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Category
        </Button>
      </Box>

      <CategoryList
        categories={categories}
        onEdit={handleEdit}
        onDelete={fetchCategories}
      />

      <CategoryForm
        open={formOpen}
        onClose={handleFormClose}
        onSuccess={handleSuccess}
        category={editCategory}
        key={editCategory?.categoryId || "new"}
      />
    </Box>
  );
}
