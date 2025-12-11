import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useSnackbar } from "../../hooks/useSnackbar";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    try {
      const message = await logout();
      showSnackbar(message, "success");
      navigate("/");
      handleMenuClose();
    } catch (error: any) {
      showSnackbar("Failed to logout", "error");
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar position="sticky" sx={{ top: 0, width: "100%" }}>
      <Toolbar sx={{ px: 3 }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            color: "white",
            textDecoration: "none",
            "&:hover": {
              color: "white",
            },
          }}
        >
          Personal Finance Tracker
        </Typography>
        {user ? (
          <>
            {isMobile ? (
              <>
                <IconButton color="inherit" onClick={handleMenuOpen} edge="end">
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    component={Link}
                    to="/dashboard"
                    onClick={handleMenuClose}
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/transactions"
                    onClick={handleMenuClose}
                  >
                    Transactions
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/categories"
                    onClick={handleMenuClose}
                  >
                    Categories
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/reports"
                    onClick={handleMenuClose}
                  >
                    Reports
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button color="inherit" component={Link} to="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/transactions">
                  Transactions
                </Button>
                <Button color="inherit" component={Link} to="/categories">
                  Categories
                </Button>
                <Button color="inherit" component={Link} to="/reports">
                  Reports
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
