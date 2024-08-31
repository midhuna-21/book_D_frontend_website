import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";

interface ProfileSideBarProps {
    onSectionChange: (section: string) => void;
    className?: string;
}
const ProfileSideBar: React.FC<ProfileSideBarProps> = ({ onSectionChange }) => {
    return (
        // <div className="flex flex-row ">
        <div className="contianer-sidebar bg-gray-50 flex flex-col items-center p-12 m rounded-lg shadow-md md:mt-12 mt-12">
            <div className="contianer-sidebar-section1 text-center flex flex-col gap-4 w-full">
                <button
                    onClick={() => onSectionChange("Profile")}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left rounded-md ml-2">
                    <i className="fas fa-edit mr-2"></i>
                    Profile
                </button>
                <button
                    // onClick={handleMyBooksClick}
                    onClick={() => onSectionChange("myBooks")}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left rounded-md ml-2">
                    <i className="fas fa-book mr-2"></i>
                    My Books
                </button>
                <button
                    // onClick={handleSecurityClick}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left rounded-md ml-2">
                    <i className="fas fa-shield-alt mr-2"></i>
                    Security
                </button>
                <Link to="/home/orders-list">
                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left rounded-md ml-2">
                        <i className="fas fa-wallet mr-2"></i>
                        Orders
                    </button>
                </Link>
                <button
                    // onClick={handleReviewsClick}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left rounded-md ml-2">
                    <i className="fas fa-star mr-2"></i>
                    Reviews
                </button>
            </div>
        </div>
        // </div>
    );
};
export default ProfileSideBar;
