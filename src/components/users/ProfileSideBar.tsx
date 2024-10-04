import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";

const ProfileSideBar: React.FC = () => {
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
                {/* <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left rounded-md ml-2">
                    <i className="fas fa-shield-alt mr-2"></i>
                    Security
                </button> */}
                <Link to="/home/orders-list">
                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left rounded-md ml-2">
                        <i className="fas fa-wallet mr-2"></i>
                        Orders
                    </button>
                </Link>
                <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left rounded-md ml-2">
                    <i className="fas fa-star mr-2"></i>
                    Reviews
                </button>
            </div>
        </div>
    );
};

export default ProfileSideBar;
