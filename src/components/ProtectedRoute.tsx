import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AccessDenied from '../pages/AccessDenied';

type Props = {
  children: React.ReactNode;
  permission?: string;
};

export default function ProtectedRoute({ children, permission }: Props) {
  const { isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!hasPermission(permission)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
