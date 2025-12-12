import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { Box, Button, Container, Typography, Grid } from "@mui/material";
import homePageSvg from "../assets/home.svg";
import { Typewriter } from "react-simple-typewriter";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        maxHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        py: 0,
      }}
    >
      <Container maxWidth="lg" sx={{ height: "100%", py: 0 }}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ height: "100%", m: 0 }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ py: 2 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: "1.5rem", md: "2.7rem" },
                }}
              >
                Track your
                <Box
                  component="span"
                  sx={{
                    color: "#FFD700",
                    display: "block",
                    fontSize: { xs: "3rem", md: "3.7rem" },
                  }}
                >
                  <Typewriter
                    words={["Transactions", "Expenses", "Income", "Savings"]}
                    loop={0}
                    cursor
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={2000}
                  />
                </Box>
              </Typography>
              {!user ? (
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    size="medium"
                    component={Link}
                    to="/register"
                    sx={{
                      px: 2,
                      py: 1,
                      fontSize: "0.7rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    variant="outlined"
                    size="medium"
                    component={Link}
                    to="/login"
                    sx={{
                      fontWeight: 400,
                      px: 2,
                      py: 1,
                      fontSize: "0.7rem",
                      "&:hover": {
                        transform: "translateY(-4px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Sign in
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    size="medium"
                    component={Link}
                    to="/dashboard"
                    sx={{
                      px: 2,
                      py: 1,
                      fontSize: "0.7rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    DashBoard
                  </Button>
                  <Button
                    variant="outlined"
                    size="medium"
                    component={Link}
                    to="/Transactions"
                    sx={{
                      fontWeight: 400,
                      px: 2,
                      py: 1,
                      fontSize: "0.7rem",
                      "&:hover": {
                        transform: "translateY(-4px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    View Transactions
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Right Side - Image */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <img
                src={homePageSvg}
                alt="Personal Finance Illustration"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "calc(100vh - 80px)",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
