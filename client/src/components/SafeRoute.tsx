import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Api } from '@/api/api';

interface SafeRouteProps {
  children: React.ReactNode;
}

function SafeRoute({ children }: SafeRouteProps) {
  const POLLING_INTERVAL = 60000;
  const navigate = useNavigate();
  const location = useLocation();
  const api = Api.getInstance();

  // Routes that don't require authentication
  const PUBLIC_ROUTES = ['/', '/preview'];
  const PUBLIC_ROUTES_PREFIX = '/preview/';
  const AUTH_ROUTES = ['/login', '/forgot-password', '/reset-password', '/sign-up'];
  const PROTECTED_ROUTES_PREFIX = '/app/';

  const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname === route) || location.pathname.startsWith(PUBLIC_ROUTES_PREFIX);
  const isAuthRoute = AUTH_ROUTES.some(route => location.pathname.includes(route));
  const isProtectedRoute = location.pathname.startsWith(PROTECTED_ROUTES_PREFIX);

  const authorize = () => {
    api
      .get('/auth/authorize')
      .then((response) => {
        if (response.status === 401) {
          // User is not authorized
          if (isProtectedRoute) {
            // Redirect to login only if trying to access protected routes
            navigate('/login', { replace: true });
          }
          // Allow access to public routes and auth pages when not authenticated
        } else if (response.status === 200) {
          // User is authorized
          if (isAuthRoute) {
            // Redirect to dashboard if trying to access auth pages while authenticated
            navigate('/app/dashboard', { replace: true });
          }
          // Allow access to public routes, protected routes, and preview when authenticated
        }
      })
      .catch((error) => {
        // Error occurred, treat as unauthorized
        if (isProtectedRoute) {
          // Only redirect if trying to access protected routes
          navigate('/login', { replace: true });
        }
      });
  };

  useEffect(() => {
    authorize();
    const intervalId = setInterval(() => {
      authorize();
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [location.pathname]);

  return <>{children}</>;
}

export default SafeRoute;
