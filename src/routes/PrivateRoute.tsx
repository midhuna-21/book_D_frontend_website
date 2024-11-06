import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../utils/ReduxStore/store/store";
import {useDispatch} from 'react-redux';
import {clearUser} from '../utils/ReduxStore/slice/userSlice';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(
        (state: RootState) => state.user?.isAuthenticated
    );
    const isBlocked = useSelector((state:RootState)=>state.user?.userInfo?.user?.isBlocked)
    if(isBlocked === true){
        dispatch(clearUser())
    }
    return (isBlocked === false && isAuthenticated) ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;    