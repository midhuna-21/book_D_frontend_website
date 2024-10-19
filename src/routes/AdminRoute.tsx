import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/admin/LoginAdmin";
import AdminHome from "../pages/admin/HomeAdmin";
import { AdminPrivateRoute, AdminPublicRoute } from "./AdminPrivateRoute";

const AdminRouter = () => {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <AdminPublicRoute>
                        <AdminLogin />
                    </AdminPublicRoute>
                }
            />
            <Route
                path="/*"
                element={
                    <AdminPrivateRoute>
                        <AdminHome />
                    </AdminPrivateRoute>
                }
            />
        </Routes>
    );
};

export default AdminRouter;
