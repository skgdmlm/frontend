import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
const NotFound = lazy(() => import('../pages/public/NotFound'));
const UserLayout = lazy(() => import('../layouts/UserLayout'));
const Dashboard = lazy(() => import('../pages/private/Dashboard'));
const Connections = lazy(() => import('../pages/private/Connections'));
const Income = lazy(() => import('../pages/private/Income'));
const Profile = lazy(() => import('../pages/private/Profile'));
const Transactions = lazy(() => import('../pages/private/Transactions'));

function UserRoutes() {
    return (
        <Routes>
            <Route element={<UserLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="/income" element={<Income />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/transactions" element={<Transactions />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default UserRoutes;
