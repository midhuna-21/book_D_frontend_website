import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../utils/ReduxStore/store/store";

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const isAuthenticated = useSelector(
        (state: RootState) => state.user?.isAuthenticated
    );

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
