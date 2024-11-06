import { Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import UserSignUp from "../pages/user/UserRegister";
import UserLogin from "../pages/user/UserLogin";
import Home from "../pages/user/Home";
import ForgotPassword from "../components/users/ForgotPassword";
import NewPassword from "../components/users/NewPassword";
import Otp from "../components/users/Otp";
import ResetPassword from "../components/users/ResetPassword";
import Error from "../components/users/Error";
import LinkGoogleAccount from "../components/users/LinkGooleEmail";

const UserRouter = () => {
    
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PublicRoute>
                        <UserSignUp />
                    </PublicRoute>
                }
            />
            <Route
                path="/verify-otp"
                element={
                    <PublicRoute>
                        <Otp />
                    </PublicRoute>
                }
            />
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <UserLogin />
                    </PublicRoute>
                }
            />
            <Route
                path="/forgot-password"
                element={
                    <PublicRoute>
                        <ForgotPassword />
                    </PublicRoute>
                }
            />
            <Route
                path="/password/update"
                element={
                    <PublicRoute>
                        <NewPassword />
                    </PublicRoute>
                }
            />
            <Route
                path="/google-link-password"
                element={
                    <PublicRoute>
                        <LinkGoogleAccount />
                    </PublicRoute>
                }
            />

            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/error" element={<Error />} />

            <Route
                path="/*"
                element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default UserRouter;
