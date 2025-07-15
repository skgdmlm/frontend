import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
const NotFound = lazy(() => import('../pages/public/NotFound'));
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const Dashboard = lazy(() => import('../pages/private/Dashboard'));
const Connections = lazy(() => import('../pages/private/Connections'));
const Income = lazy(() => import('../pages/private/Income'));
const Profile = lazy(() => import('../pages/private/Profile'));
const Transactions = lazy(() => import('../pages/private/Transactions'));
const Users = lazy(() => import('../pages/private/Users'));
const User = lazy(() => import('../pages/private/User'));

function AdminRoutes() {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="/income" element={<Income />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<User />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AdminRoutes;
