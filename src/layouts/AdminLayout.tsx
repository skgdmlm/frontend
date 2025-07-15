import { NavLink, Outlet } from "react-router-dom"
import DashboardIcon from "@mui/icons-material/Dashboard"
import PeopleIcon from "@mui/icons-material/People"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import LogoutIcon from "@mui/icons-material/Logout"
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { handleSessionExpire } from "../utils/functions"
import { useAppDispatch } from "../store/store"
import { removeUser, resetTokens } from "../store/reducers/authReducer"

function Sidebar() {
    const dispatch = useAppDispatch()
    const handleLogout = () => {
        handleSessionExpire();
        dispatch(resetTokens())
        dispatch(removeUser())
        window.location.replace('/login')
    }

    const navItems = [
        { label: "Dashboard", path: "/", icon: <DashboardIcon fontSize="small" htmlColor="currentColor" /> },
        { label: "Users", path: "/users", icon: <AccountCircleIcon fontSize="small" htmlColor="currentColor" /> },
        { label: "Transactions", path: "/transactions", icon: <AccountBalanceIcon fontSize="small" htmlColor="currentColor" /> },
        { label: "Income", path: "/income", icon: <AttachMoneyIcon fontSize="small" htmlColor="currentColor" /> },
        { label: "Connections", path: "/connections", icon: <PeopleIcon fontSize="small" htmlColor="currentColor" /> },
    ]

    return (
        <div className="h-full w-60 bg-white shadow-md p-6 flex flex-col gap-4">
            {navItems.map((item) => (
                <NavLink
                    key={item.label}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex items-center gap-2 text-sm px-3 py-2 rounded-md transition ${isActive && "bg-blue-500"}`
                    }
                    style={({ isActive }) => {
                        return {
                            color: isActive ? "white" : "black"
                        }
                    }}
                >
                    {item.icon}
                    <span className="text-inherit">{item.label}</span>
                </NavLink>
            ))
            }

            <div
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm px-3 py-2 rounded-md text-black hover:bg-gray-100 cursor-pointer transition"
            >
                <LogoutIcon fontSize="small" htmlColor="currentColor" />
                <span className="text-inherit">Logout</span>
            </div>
        </div >
    )
}

export default function AdminLayout() {
    return (
        <div className="h-screen w-full flex m-0 p-0 bg-[#f6f6f6]">
            <Sidebar />
            <div className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    )
}