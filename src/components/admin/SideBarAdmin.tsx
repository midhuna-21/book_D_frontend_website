import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/whiteLogo.png";
import { useDispatch } from "react-redux";
import { clearAdmin } from "../../utils/ReduxStore/slice/adminSlice";
import { Link } from "react-router-dom";
import {
    FaHome,
    FaUser,
    FaPaypal,
    FaBook,
    FaPlus,
    FaSignOutAlt,
    FaBars,
} from "react-icons/fa";

const AdminSideBar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = async () => {
        localStorage.removeItem("adminaccessToken");
        localStorage.removeItem("adminrefreshToken");
        dispatch(clearAdmin());
        navigate("/admin/login");
    };

    

    return (
        <div
            className={`flex flex-col min-h-screen bg-gray-700 text-white ${
                isCollapsed ? "w-15" : "w-50"
            } transition-all duration-300`}>
            <div className="h-screen  text-white flex flex-col">
                <div className="flex items-center justify-between h-19 bg-stone- py-3">
                    <div
                        className={`flex ${
                            isCollapsed
                                ? "flex-col "
                                : "flex-row  items-center "
                        }`}>
                        <img src={logo} alt="Logo" className="h-12 " />
                        {!isCollapsed && (
                            <span className="font-serif">Book.D</span>
                        )}
                        <button
                            onClick={toggleSidebar}
                            className="text-white focus:outline-none ml-2 hidden sm:block">
                            <FaBars className="h-5 w-9" />
                        </button>
                    </div>
                </div>
                <div className="flex-grow mt-10">
                    <ul className="flex flex-col py-4 space-y-2">
                        <Link to="/admin/dashboard">
                            <li className="px-4 py-2 hover:bg-gray-700 flex items-center">
                                <FaHome />
                                {!isCollapsed && (
                                    <span className="ml-3">Home</span>
                                )}
                            </li>
                        </Link>
                        <Link to="/admin/users">
                            <li className="px-4 py-2 hover:bg-gray-700 flex items-center">
                                <FaUser />
                                {!isCollapsed && (
                                    <span className="ml-3">Users</span>
                                )}
                            </li>
                        </Link>
                        <Link to="/admin/add-genre">
                            <li className="px-4 py-2 hover:bg-gray-700 flex items-center">
                                <FaPlus />
                                {!isCollapsed && (
                                    <span className="ml-3">Add Genre</span>
                                )}
                            </li>
                        </Link>
                        <Link to="/admin/rental-orders">
                            <li className="px-4 py-2 hover:bg-gray-700 flex items-center">
                                <FaBook />
                                {!isCollapsed && (
                                    <span className="ml-3">Rental Orders</span>
                                )}
                            </li>
                        </Link>
                        <Link to="/admin/wallet">
                            <li className="px-4 py-2 hover:bg-gray-700 flex items-center">
                                <i className="fas fa-wallet mr-2"></i>
                                {!isCollapsed && (
                                    <span className="ml-3">Wallet</span>
                                )}
                            </li>
                        </Link>

                        <li
                            className="px-4 py-2 hover:bg-gray-700 flex items-center"
                            onClick={handleLogout}>
                            <FaSignOutAlt />
                            {!isCollapsed && (
                                <span className="ml-3">Sign out</span>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminSideBar;
