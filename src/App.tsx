import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import ErrorBoundary from './wrappers/ErrorBoundary';
import Loader from './components/common/Loader';
const Register = lazy(() => import('./pages/public/Register'));
import PublicRoutes from './routes/PublicRoutes';
import { UserRole } from './utils/enums';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import { useAppDispatch, useAppSelector } from './store/store';
import { useProfileQuery } from './services/api';
import { setUser } from './store/reducers/authReducer';

function App() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((root) => root.auth);
  const { data, isLoading } = useProfileQuery();

  useEffect(() => {
    if (!user && data) {
      const user = { ...data.data, userId: data.data?._id };
      dispatch(setUser({ user }));
    }
  }, [user, dispatch, data]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ErrorBoundary fallback={<div>Error loading component!</div>}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/register" element={<Register/>} />
          <Route path="/*" element={renderRoutes(user)} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

function renderRoutes(user?: UserProfileData | null) {
  if (!user) return <PublicRoutes />;

  switch (user.role) {
    case UserRole.USER:
      return <UserRoutes />;
    case UserRole.ADMIN:
      return <AdminRoutes />;
    default:
      return <Navigate to="/" replace />;
  }
}

export default App;
