import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const ProfileSideBar: React.FC = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };
    return (
        <div className="container-sidebar bg-gray-50 flex flex-col items-center p-12 rounded-lg shadow-md ">
            <div className="container-sidebar-section1 text-center flex flex-col gap-4 w-full">
                <Link to="/home/profile/my-profile">
                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left rounded-md ml-2">
                        <i className="fas fa-edit mr-2"></i>
                        Profile
                    </button>
                </Link>
                <Link to="/home/my-books">
                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left rounded-md ml-2">
                        <i className="fas fa-book mr-2"></i>
                        Books
                    </button>
                </Link>
            
                <Link to="/home/wallet">
                <button 
                     onClick={toggleDropdown}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left rounded-md ml-2">
                        <i className="fas fa-wallet mr-2"></i>
                        Wallet
                    </button>
                </Link>
                <button
                    onClick={toggleDropdown}
                    className="flex px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left rounded-md">
                    <FaShoppingCart className="mr-2 text-xl" />
                    <span>Order</span>
                    <i
                        className={`fas fa-chevron-down px-2 transform ${
                            isDropdownOpen ? "rotate-180" : ""
                        }`}></i>
                </button>
                {isDropdownOpen && (
                    <div className="ml-6  flex flex-col gap-2">
                        <Link to="/home/rent-list">
                            <button className="flex items-center text-sm p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-b-2 hover:border-gray-400 w-full text-left rounded-md">
                                <i className="fas fa-bars mr-2"></i>
                                Rent List
                            </button>
                        </Link>
                        <Link to="/home/lend-list">
                            <button className="flex items-center text-sm p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-b-2 hover:border-gray-400 w-full text-left rounded-md">
                                <i className="fas fa-bars mr-2"></i>
                                Lend List
                            </button>
                        </Link>
                    </div>
                )}

               
            </div>
        </div>
    );
};

export default ProfileSideBar;
