import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Drawer } from "@mui/material";
import { handleSessionExpire } from "../utils/functions";
import { useAppDispatch } from "../store/store";
import { removeUser, resetTokens } from "../store/reducers/authReducer";

function SidebarContent({ handleLogout }: { handleLogout: () => void }) {
  const navItems = [
        { label: "Dashboard", path: "/", icon: <DashboardIcon fontSize="small" htmlColor="currentColor" /> },
        { label: "Invitations", path: "/invitations", icon: <PeopleIcon fontSize="small" htmlColor="currentColor" /> },
        { label: "Connections", path: "/connections", icon: <PeopleIcon fontSize="small" htmlColor="currentColor" /> },
        { label: "Transactions", path: "/transactions", icon: <AccountBalanceIcon fontSize="small" htmlColor="currentColor" /> },
        { label: "Income", path: "/income", icon: <AttachMoneyIcon fontSize="small" htmlColor="currentColor" /> },
        { label: "Profile", path: "/profile", icon: <AccountCircleIcon fontSize="small" htmlColor="currentColor" /> },
    ]

  return (
    <div className="h-full w-60 bg-white p-6 flex flex-col gap-4">
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-2 text-sm px-3 py-2 rounded-md transition ${isActive && "bg-blue-500"}`
          }
          style={({ isActive }) => ({
            color: isActive ? "white" : "black"
          })}
        >
          {item.icon}
          <span className="text-inherit">{item.label}</span>
        </NavLink>
      ))}

      <div
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm px-3 py-2 rounded-md text-black hover:bg-gray-100 cursor-pointer transition"
      >
        <LogoutIcon fontSize="small" />
        <span className="text-inherit">Logout</span>
      </div>
    </div>
  );
}

function UserLayout() {
  const dispatch = useAppDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    handleSessionExpire();
    dispatch(resetTokens());
    dispatch(removeUser());
    window.location.replace('/login');
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-[#f6f6f6]">
      {/* Top bar with menu on mobile */}
      <div className="md:hidden flex items-center justify-start px-4 py-3 bg-white shadow">
        <IconButton onClick={() => setMobileOpen(true)}>
          <MenuIcon />
        </IconButton>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <SidebarContent handleLogout={handleLogout} />
      </div>

      {/* Drawer for mobile */}
      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <div className="w-60">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">Menu</h2>
            <IconButton onClick={() => setMobileOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <SidebarContent handleLogout={handleLogout} />
        </div>
      </Drawer>

      {/* Page Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default UserLayout;
