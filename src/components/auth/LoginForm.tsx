import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useSnackbar } from "../../hooks/useSnackbar";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useValidation } from "../../hooks/useValidation";
import { CommonValidations } from "../../utils/validation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { validateFields, validateField, getError, hasError } = useValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const isValid = validateFields({
      email: {
        value: email,
        rules: CommonValidations.email,
        displayName: "Email",
      },
      password: {
        value: password,
        rules: CommonValidations.simplePassword,
        displayName: "Password",
      },
    });

    if (!isValid) {
      return;
    }
    setLoading(true);
    try {
      const Credentials = { email, password };
      const message = await login(Credentials);
      showSnackbar(message, "success");
      navigate("/dashboard");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errors?.exception || "Failed to log in";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          validateField(
            "email",
            e.target.value,
            CommonValidations.email,
            "Email"
          );
        }}
        error={hasError("email")}
        helperText={getError("email")}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Password"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          validateField(
            "password",
            e.target.value,
            CommonValidations.password,
            "Password"
          );
        }}
        error={hasError("password")}
        helperText={getError("password")}
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
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? "Logging in..." : "Log In"}
      </Button>
    </Box>
  );
}
