import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSideBar from "../../components/admin/SideBarAdmin";
import AdminDashboard from "../../components/admin/DashboardAdmin";
import AddGenre from '../../components/admin/AddGenres';
import UsersList from '../../components/admin/UsersList'
import {AdminPrivateRoute} from '../../routes/AdminPrivateRoute'
import RentalOrdersList from '../../components/admin/RentalOrders'
import OrderDetail from '../../components/admin/OrderDetail';
import WalletTransactionsList from '../../components/admin/Wallet'

const AdminHome: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-stone-950">
             <AdminSideBar/>
            <div className="flex flex-col flex-1">
                <AdminHeader />
                <div className="flex-1 p-4">
                    <Routes>
                        <Route path="dashboard" element={<AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute>} />
                        <Route path="user-list" element={<AdminPrivateRoute><UsersList /></AdminPrivateRoute>} />
                        <Route path="add-genre" element={<AdminPrivateRoute><AddGenre /></AdminPrivateRoute>} />
                        <Route path="rental-orders" element={<AdminPrivateRoute><RentalOrdersList /></AdminPrivateRoute>} />
                        <Route path="order-detail/:orderId" element={<AdminPrivateRoute><OrderDetail /></AdminPrivateRoute>} />
                        <Route path="wallet" element={<AdminPrivateRoute><WalletTransactionsList /></AdminPrivateRoute>} />

                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
