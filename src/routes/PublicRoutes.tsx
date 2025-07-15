import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const PublicLayout = lazy(() => import('../layouts/PublicLayout'));
const Login = lazy(() => import('../pages/public/Login'));
const Register = lazy(() => import('../pages/public/Register'));
const ForgotPassword = lazy(() => import('../pages/public/ForgotPassword'))
const Otp = lazy(() => import('../pages/public/Otp'));
const ResetPassword = lazy(() => import('../pages/public/ResetPassword'))

function PublicRoutes() {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/otp" element={<Otp />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to={'/login  '} />} />
            </Route>
        </Routes>
    );
}

export default PublicRoutes;
