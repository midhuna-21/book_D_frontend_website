import React,{ useEffect,useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../utils/ReduxStore/store/store";

interface ProfileProtectRouteName {
    children: React.FC;
}

export const ProfileProtectRoute: React.FC<ProfileProtectRouteName> = ({
    children: Children,
}) => {
 
    const { username } = useParams<{ username: string }>();
    const loggedUserName = useSelector(
        (state: RootState) => state?.user?.userInfo?.user?.name
    );

    if (username !== loggedUserName ) {
        return <Navigate to="/error" replace />;
    }

    return <Children />;
};
