import {
  Box,
  Alert,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useSnackbar } from "../../hooks/useSnackbar";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const registerData = { email, password, name, monthlyIncome };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const message = await register(registerData);
      showSnackbar(message, "success");
      navigate("/dashboard");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to register";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Monthly Income"
        type="number"
        value={monthlyIncome}
        onChange={(e) => setMonthlyIncome(Number(e.target.value))}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? "Creating Account..." : "Register"}
      </Button>
    </Box>
  );
}
