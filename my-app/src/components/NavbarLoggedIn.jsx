import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import DevicesIcon from "@mui/icons-material/Devices";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useAuth } from "../context/AuthContext";

export default function NavbarLoggedIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, logoutAllDevices } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutAllDialogOpen, setLogoutAllDialogOpen] = useState(false);

  const isActive = (path) =>
    location.pathname === path ? "text-red-600 font-semibold" : "text-gray-600";

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  const handleLogoutAllClick = () => {
    handleMenuClose();
    setLogoutAllDialogOpen(true);
  };

  const handleLogoutAllConfirm = async () => {
    setLogoutAllDialogOpen(false);
    await logoutAllDevices();
  };

  const handleLogoutAllCancel = () => {
    setLogoutAllDialogOpen(false);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleSessionsClick = () => {
    handleMenuClose();
    navigate("/sessions"); // You'll need to create this page
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-100 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1
              className="text-xl font-bold text-gray-900 cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Task Flow
            </h1>

            <div className="hidden md:flex items-center gap-6">
              {["MyDones", "Calendar", "Reminders", "Reports"].map((item) => (
                <button
                  key={item}
                  onClick={() => navigate(`/${item.toLowerCase()}`)}
                  className={`text-sm font-medium transition-colors hover:text-red-500 ${isActive(
                    `/${item.toLowerCase()}`
                  )}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="text-gray-500 hover:text-gray-700 transition-colors">
              <NotificationsIcon />
            </button>

            <button
              onClick={handleMenuOpen}
              className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
            >
              <AccountCircleIcon className="text-3xl" />
            </button>
          </div>
        </div>
      </nav>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 220,
            mt: 1.5,
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">My Profile</Typography>
        </MenuItem>

        <MenuItem onClick={handleSessionsClick}>
          <ListItemIcon>
            <DevicesIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Active Sessions</Typography>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogoutAllClick}>
          <ListItemIcon>
            <DevicesIcon fontSize="small" color="warning" />
          </ListItemIcon>
          <Typography variant="inherit" color="warning.main">
            Logout from all devices
          </Typography>
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="inherit" color="error">
            Logout
          </Typography>
        </MenuItem>
      </Menu>

      {/* Logout All Devices Confirmation Dialog */}
      <Dialog
        open={logoutAllDialogOpen}
        onClose={handleLogoutAllCancel}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <DevicesIcon sx={{ color: "warning.main", mr: 1, verticalAlign: "middle" }} />
          Logout from all devices?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will log you out from all devices including this one. You'll need
            to log in again on every device.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={handleLogoutAllCancel} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleLogoutAllConfirm}
            variant="contained"
            color="warning"
            startIcon={<DevicesIcon />}
          >
            Logout All
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}