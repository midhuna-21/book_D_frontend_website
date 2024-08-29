import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../utils/ReduxStore/store/store';

interface AdminPrivateRouteProps {
  children: React.ReactNode;
}

export const AdminPrivateRoute: React.FC<AdminPrivateRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.admin?.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to='/admin/login' />;
};

interface AdminPublicRouteProps {
  children: React.ReactNode;
}

export const AdminPublicRoute: React.FC<AdminPublicRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.admin?.isAuthenticated);
  return isAuthenticated ? <Navigate to="/admin/dashboard" /> : <>{children}</>;
};