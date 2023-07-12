import { useStore, AppState } from '../lib/store';
import { Navigate } from 'react-router-dom';
import { ReactNode, FC } from 'react';
type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const user = useStore((state: AppState) => state.user);

  if (user !== null) {
    return children;
  } else {
    return <Navigate to='/login' replace />;
  }
};

export default ProtectedRoute;
