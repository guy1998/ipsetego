import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminApi } from '@/api/api';

interface AdminSafeRouteProps {
  children: React.ReactNode;
}

function AdminSafeRoute({ children }: AdminSafeRouteProps) {
  const POLLING_INTERVAL = 60000;
  const navigate = useNavigate();
  const location = useLocation();
  const api = AdminApi.getInstance();

  const AUTH_ROUTES = ['/login', '/verify-otp'];
  const PROTECTED_ROUTES_PREFIX = '/admin/';

  const isAuthRoute = AUTH_ROUTES.some(route => location.pathname === route);
  const isProtectedRoute = location.pathname.startsWith(PROTECTED_ROUTES_PREFIX);

  const authorize = () => {
    api
      .get('/admin/authorize')
      .then((response) => {
        if (response.status === 200 && isAuthRoute) {
          navigate('/admin/users', { replace: true });
        }
      })
      .catch(() => {
        if (isProtectedRoute) {
          navigate('/login', { replace: true });
        }
      });
  };

  useEffect(() => {
    authorize();
    const intervalId = setInterval(authorize, POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [location.pathname]);

  return <>{children}</>;
}

export default AdminSafeRoute;
