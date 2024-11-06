import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/whiteLogo.png";
import { useDispatch } from "react-redux";
import { clearUser } from "../../utils/ReduxStore/slice/userSlice";
import { Link } from "react-router-dom";
import {
    FaHome,
    FaUser,
    FaEnvelope,
    FaBell,
    FaCompass,
    FaBook,
    FaSignOutAlt,
    FaBars,
} from "react-icons/fa";

const SideBar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = async () => {
        localStorage.removeItem("useraccessToken");
        localStorage.removeItem("userrefreshToken");

        dispatch(clearUser());
        navigate("/login");
    };

    return (
        <div className="sidebar flex transition-all duration-300 ">
            <div className="h-screen bg-white shadow-2xl text-white flex flex-col rounded-r-3xl">
                <div
                    className={`flex ${
                        isCollapsed ? "flex-col " : "flex-row  items-center "
                    }`}>
                    <img src={logo} alt="Logo" className="h-12 " />
                    {!isCollapsed && <span className="font-serif">Book.D</span>}
                    <button
                        onClick={toggleSidebar}
                        className="text-white focus:outline-none ml-2">
                        <FaBars className="h-6 w-9   " />
                    </button>
                </div>

                <div className="flex-grow mt-4">
                    <ul className="flex flex-col py-4 space-y-2">
                        <Link to="/home">
                            <li className="px-4 py-2 hover:bg-gray-700 flex items-center">
                                <FaHome />
                                {!isCollapsed && (
                                    <span className="ml-3">Home</span>
                                )}
                            </li>
                        </Link>
                        <Link to="/profile">
                            <li className="px-4 py-2 hover:bg-gray-700 flex items-center">
                                <FaUser />
                                {!isCollapsed && (
                                    <span className="ml-3">Profile</span>
                                )}
                            </li>
                        </Link>
                        <li className="px-4 py-2 hover:bg-gray-700 flex items-center">
                            <FaCompass />
                            {!isCollapsed && (
                                <span className="ml-3">Explore</span>
                            )}
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-700 flex items-center">
                            <FaEnvelope />
                            {!isCollapsed && (
                                <span className="ml-3">Messages</span>
                            )}
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-700 flex items-center">
                            <FaBell />
                            {!isCollapsed && (
                                <span className="ml-3">Notifications</span>
                            )}
                        </li>
                        <Link to="/lend-book">
                            <li className="px-4 py-2 hover:bg-gray-700 flex items-center">
                                <FaBook />
                                {!isCollapsed && (
                                    <span className="ml-3">Book Manage</span>
                                )}
                            </li>
                        </Link>
                        <li
                            className="px-4 py-2 hover:bg-gray-700 flex items-center  cursor-pointer"
                            onClick={handleLogout}>
                            <FaSignOutAlt />
                            {!isCollapsed && (
                                <span className="ml-3">Logout</span>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
