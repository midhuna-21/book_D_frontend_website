import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ProfileHeader from "../../components/users/ProfileHeader";
import ProfileSideBar from "../../components/users/ProfileSideBar";
import Profile from "../../components/users/Profile";

const UserProfile: React.FC = () => {
    return (
        <>
            <ProfileHeader />
            <div className="flex flex-col md:flex-row">
                <ProfileSideBar />
                <div className="flex-1">
                    <Routes>
                        <Route path="/my-profile" element={<Profile />} />
                        <Route path="/*" element={<NestedRoutes />} />
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
                {/* <Route path="/my-books" element={<PrivateRoute><MyBooks /></PrivateRoute>} /> */}
                {/* <Route path="/edit-my-book" element={<PrivateRoute><MyBooks /></PrivateRoute>} /> */}
                <Route
                    path="*"
                    element={<Navigate to="/home/profile/my-profile" replace />}
                />
            </Routes>
        </>
    );
};

export default UserProfile;
