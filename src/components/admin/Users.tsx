import React, { useEffect, useState } from "react";
import { adminAxiosInstance } from "../../utils/api/adminAxiosInstance";
import { toast } from "sonner";
import userLogo from "../../assets/userLogo.png";
import { AiOutlineSearch } from "react-icons/ai";
import { FaGreaterThan, FaLessThan } from "react-icons/fa";

interface User {
    _id: string;
    name: string;
    email: string;
    phone: number;
    image: string;
    isBlocked: boolean;
    isReported: boolean;
    createdAt: string;
}

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [viewMode, setViewMode] = useState<string>("all");
    const [searchKey, setSearchKey] = useState<string>("");
    const [sortByDate, setSortByDate] = useState<boolean>(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await adminAxiosInstance.get("/get-users");

                setUsers(response.data);
            } catch (err: any) {
                console.log(err.message);
            }
        };

        fetchUsers();
    }, []);
    const handleViewModeChange = (mode: string) => {
        setViewMode(mode);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKey(event.target.value);
    };

    const handleSortByDate = () => {
        setSortByDate((prevSortByDate) => !prevSortByDate);
    };

    const filteredUsers = () => {
        let filtered = users;

        switch (viewMode) {
            case "blocked":
                filtered = filtered.filter((user) => user.isBlocked);
                break;
            case "reported":
                filtered = filtered.filter((user) => user.isReported);
                break;
            default:
                break;
        }

        if (searchKey) {
            filtered = filtered.filter((user) =>
                user.name.toLowerCase().includes(searchKey.toLowerCase())
            );
        }

        if (sortByDate) {
            filtered = filtered.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );
        }

        return filtered;
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [visiblePageStart, setVisiblePageStart] = useState(1);
    const usersPerPage = 7;
    const maxVisiblePages = 5;

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers().slice(
        indexOfFirstUser,
        indexOfLastUser
    );

    const totalPages = Math.ceil(filteredUsers().length / usersPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
            if (currentPage + 1 > visiblePageStart + maxVisiblePages - 1) {
                setVisiblePageStart((prev) => prev + 1);
            }
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
            if (currentPage - 1 < visiblePageStart) {
                setVisiblePageStart((prev) => prev - 1);
            }
        }
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
        if (page < visiblePageStart) {
            setVisiblePageStart(page);
        } else if (page > visiblePageStart + maxVisiblePages - 1) {
            setVisiblePageStart(page - maxVisiblePages + 1);
        }
    };
    const pageNumbers = Array.from(
        { length: Math.min(maxVisiblePages, totalPages) },
        (_, i) => visiblePageStart + i
    );

    const handleBlock = (userId: string) => {
        adminAxiosInstance
            .post("/block-user", { _id: userId })
            .then(() => {
                setUsers((prevUsers) => {
                    const newUsers = prevUsers.map((user) =>
                        user._id === userId
                            ? { ...user, isBlocked: true }
                            : user
                    );
                    return newUsers;
                });
            })
            .catch((error) => {
                if (error.response && error.response.status === 400) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occurred, try again later");
                }
            });
    };

    const handleUnblock = (userId: string) => {
        adminAxiosInstance
            .post("/unblock-user", { _id: userId })
            .then((response) => {
                const updatedUser = response.data;
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === userId
                            ? { ...user, isBlocked: updatedUser.isBlocked }
                            : user
                    )
                );
            })
            .catch((error: any) => {
                if (error.response && error.response.status === 400) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occurred, try again later");
                }
            });
    };

    if (users.length === 0) {
        return <div className="text-gray-500 text-center">Loading...</div>;
    }
    return (
        <div className="bg-white shadow-md rounded p-4 h-full w-4xl max-w-full mx-auto">
            <h1 className="font-serif text-2xl mb-4">Users</h1>
            <div className="flex items-center justify-between mb-10 mt-3">
                <div className="relative w-full sm:w-auto flex ">
                    <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchKey}
                        onChange={handleSearchChange}
                        className="pl-10 pr-4 py-2 border rounded w-full"
                    />
                </div>
                <div className="flex space-x-2 pr-12">
                    <button
                        onClick={() => handleViewModeChange("all")}
                        className={`px-4 py-2 rounded-md text-sm ${
                            viewMode === "all"
                                ? "bg-teal-800 text-white"
                                : "bg-gray-200"
                        }`}>
                        All
                    </button>
                    <button
                        onClick={() => handleViewModeChange("blocked")}
                        className={`px-4 py-2 rounded-md text-sm ${
                            viewMode === "blocked"
                                ? "bg-red-500 text-white"
                                : "bg-gray-200"
                        }`}>
                        Blocked
                    </button>
                    <button
                        onClick={() => handleViewModeChange("active")}
                        className={`px-4 py-2 rounded-md text-sm ${
                            viewMode === "active"
                                ? "bg-green-500 text-white"
                                : "bg-gray-200"
                        }`}>
                        Active
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentUsers.map((user) => (
                    <div
                        key={user._id}
                        className="bg-gray-100 hover:shadow-lg hover:rounded-lg hover:bg-white p-4 rounded flex items-start cursor-pointer min-h-[120px]">
                        <img
                            src={user.image || userLogo}
                            alt={user.name}
                            className="rounded-full w-16 h-16 mr-4 object-cover flex-shrink-0"
                        />
                        <div className="flex flex-col justify-center">
                            <h2 className="font-bold text-lg">{user.name}</h2>
                            <p className="text-sm text-gray-600 truncate max-w-[150px]">
                                {user.email}
                            </p>
                            <div>
                                <p
                                    className={`font-semibold text-sm mt-2 inline-block ${
                                        user.isBlocked
                                            ? "text-red-500 border border-red-400 rounded-md px-2 py-0.5"
                                            : "text-green-500 border border-green-400 rounded-md px-2 py-0.5"
                                    }`}>
                                    {user.isBlocked ? "Blocked" : "Active"}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div
                className="px-12 flex  items-center  justify-center"
                style={{ height: "200px" }}>
                <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-gray-700 rounded disabled:opacity-50">
                    <FaLessThan />
                </button>

                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 mx-1 rounded ${
                            currentPage === page
                                ? "bg-cyan-800 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}>
                        {page}
                    </button>
                ))}
                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-gray-700 rounded disabled:opacity-50">
                    <FaGreaterThan />
                </button>
            </div>
        </div>
    );
};

export default Users;
