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
const Invitations = lazy(() => import('../pages/private/Invitations'));
const ResetPassword = lazy(() => import('../pages/private/ResetPassword'));

function AdminRoutes() {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/invitations" element={<Invitations />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="/income" element={<Income />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<User />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AdminRoutes;
