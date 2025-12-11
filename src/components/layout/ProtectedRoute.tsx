import { Box, CircularProgress } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
