import {
  Container,
  Paper,
  Typography,
  Box,
  Link as MuiLink,
} from "@mui/material";
import { Navigate, Link } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import { useAuth } from "../context/AuthProvider";
import registerSvg from "../assets/register.svg";

export default function Register() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            flex: { xs: "1", md: "1 1 60%" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 5 },
              width: "100%",
              maxWidth: "550px",
            }}
          >
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
              Register
            </Typography>
            <RegisterForm />
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2">
                Already have an account?{" "}
                <MuiLink component={Link} to="/login">
                  Login here
                </MuiLink>
              </Typography>
            </Box>
          </Paper>
        </Box>
        <Box
          sx={{
            flex: { xs: "0 0 auto", md: "1 1 40%" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={registerSvg}
            alt="Register illustration"
            style={{ width: "100%", maxWidth: "600px", height: "auto" }}
          />
        </Box>
      </Box>
    </Container>
  );
}
