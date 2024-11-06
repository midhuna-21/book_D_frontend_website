import React from "react";
import { Route, Routes, Navigate, useParams } from "react-router-dom";
import ProfileHeader from "../../components/users/ProfileHeader";
import ProfileSideBar from "../../components/users/ProfileSideBar";
import ProfileUpdate from "../../components/users/ProfileUpdate";
import {useSelector} from 'react-redux';
import {RootState} from '../../utils/ReduxStore/store/store'

const UserAccountProfile: React.FC = () => {
    const username = useSelector((state:RootState)=>state?.user?.userInfo?.user?.name)

    return (
        <>
            <ProfileHeader />
            <div className="flex flex-col md:flex-row">
                <ProfileSideBar />
                <div className="flex-1">
                    <Routes>
                        <Route path='/' element={<ProfileUpdate />} />
                        <Route path={`/${username}/*`} element={<NestedRoutes />} />
                    </Routes>
                </div>
            </div>
        </>
    );
};

const NestedRoutes: React.FC = () => {
    const username = useSelector((state:RootState)=>state?.user?.userInfo?.user?.name)
    return (
        <>
            <Routes>
                <Route
                    path="/*"
                    element={<Navigate to={`/${username}`} replace />}
                />
            </Routes>
        </>
    );
};

export default UserAccountProfile;
