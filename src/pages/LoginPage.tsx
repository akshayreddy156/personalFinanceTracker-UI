import {
  Box,
  Container,
  Paper,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import LoginForm from "../components/auth/LoginForm";
import loginSvg from "../assets/login.svg";

export default function Login() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 4,
        }}
      >
        <Box
          sx={{
            flex: { xs: "0 0 auto", md: "0 0 33.333%" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={loginSvg}
            alt="Login illustration"
            style={{ width: "100%", maxWidth: "500px", height: "auto" }}
          />
        </Box>
        <Box
          sx={{
            flex: { xs: "1", md: "0 0 66.667%" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: "600px" }}>
            <Typography variant="h4" gutterBottom align="center">
              Login
            </Typography>
            <LoginForm />
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2">
                Don't have an account?{" "}
                <MuiLink component={Link} to="/register">
                  Register here
                </MuiLink>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
