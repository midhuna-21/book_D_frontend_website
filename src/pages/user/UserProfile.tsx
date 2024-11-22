import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ProfileHeader from "../../components/users/ProfileHeader";
import ProfileSideBar from "../../components/users/ProfileSideBar";
import ProfileUpdate from "../../components/users/ProfileUpdate";

const UserAccountProfile: React.FC = () => {
    return (
        <>
            <ProfileHeader />
            <div className="flex flex-col md:flex-row">
                <ProfileSideBar />
                <div className="flex-1">
                    <Routes>
                        <Route path="/" element={<ProfileUpdate />} />
                        <Route path="/profile/*" element={<NestedRoutes />} />
                    </Routes>
                </div>
            </div>
        </>
    );
};

const NestedRoutes: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/*" element={<Navigate to="/profile" replace />} />
            </Routes>
        </>
    );
};

export default UserAccountProfile;
