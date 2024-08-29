import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../utils/ReduxStore/store/store'

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.user?.isAuthenticated);

  return isAuthenticated ? <Navigate to="/home" /> :<>{children}</>  ;
 
};

export default PublicRoute;
