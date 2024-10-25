import React from "react";

const AdminHeader: React.FC = () => {
    return (
        <div className="w-full flex items-center justify-between p-4 bg-stone-900 text-white">
            <div className="flex items-center space-x-4">
                <input
                    type="text"
                    placeholder="Search.."
                    className="bg-gray-700 placeholder-gray-400 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <button className="focus:outline-none">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                    </button>
                    <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></div>
                </div>
                <div className="flex items-center space-x-2 border rounded-xl p-2">
                    <span></span>
                </div>
            </div>
        </div>
    );
};

export default AdminHeader;
