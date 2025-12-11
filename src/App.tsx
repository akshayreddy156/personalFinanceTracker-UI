import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import { SnackbarProvider } from "./context/SnackbarContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transaction from "./pages/Transactions";
import Categories from "./pages/Categories";
import Reports from "./pages/Reports";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2E7D32",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...((ownerState.variant === "contained" ||
            ownerState.variant === "text" ||
            !ownerState.variant) && {
            "&:hover": {
              backgroundColor: "#ffffff",
              color: "#2E7D32",
              border: "1px solid #2E7D32",
            },
          }),
          ...(ownerState.variant === "outlined" && {
            "&:hover": {
              backgroundColor: "#2E7D32",
              color: "#ffffff",
              borderColor: "#2E7D32",
            },
          }),
        }),
      },
    },
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/transactions" element={<Transaction />} />
                  <Route path="/Categories" element={<Categories />} />
                  <Route path="/reports" element={<Reports />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
