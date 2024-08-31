import React, { useEffect, useState } from "react";
import { adminAxiosInstance } from "../../utils/api/axiosInstance";
import { toast } from "sonner";

interface User {
    _id: string;
    name: string;
    email: string;
    phone: number;
    isBlocked: boolean;
    isReported: boolean;
    createdAt: string;
}

const UsersList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<string>("all"); 
    const [searchKey, setSearchKey] = useState<string>("");
    const [sortByDate, setSortByDate] = useState<boolean>(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await adminAxiosInstance.get("/get-users");
                // console.log(users,'userss')
                setUsers(response.data);
            } catch (err) {
                setError("Failed to fetch users");
            } finally {
                setLoading(false);
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

    const handleBlock = (userId: string) => {
        adminAxiosInstance
            .post("/block-user", { _id: userId })
            .then((response) => {
                const updatedUser = response.data;
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
            .catch((error:any) => {
                if (error.response && error.response.status === 400) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occurred, try again later");
                }
            });
    };

    return (
        <div className="bg-stone-800 shadow-md rounded p-4 h-full">
            <h2 className="text-xl font-bold mb-4 text-zinc-300">Users List</h2>
            <div className="mb-4 flex justify-between">
                <div>
                    <button
                        onClick={() => handleViewModeChange("all")}
                        className={`px-4 py-2 rounded ${
                            viewMode === "all"
                                ? "bg-teal-800 text-white"
                                : "bg-gray-200"
                        } mr-2`}>
                        Users
                    </button>
                    <button
                        onClick={() => handleViewModeChange("blocked")}
                        className={`px-4 py-2 rounded ${
                            viewMode === "blocked"
                                ? "bg-red-800 text-white"
                                : "bg-gray-200"
                        } mr-2`}>
                        Blocked Users
                    </button>
                    {/* <button
                        onClick={() => handleViewModeChange("reported")}
                        className={`px-4 py-2 rounded ${
                            viewMode === "reported"
                                ? "bg-yellow-700 text-white"
                                : "bg-gray-200"
                        }`}>
                        Reported Users
                    </button> */}
                </div>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchKey}
                        onChange={handleSearchChange}
                        className="px-4 py-2 border rounded"
                    />
                    <button
                        onClick={handleSortByDate}
                        className={`px-4 py-2 rounded ${
                            sortByDate
                                ? "bg-lime-800 text-white"
                                : "bg-gray-200"
                        }`}>
                        Sort by Date
                    </button>
                </div>
            </div>
            <div className="h-96 overflow-y-auto">
                {filteredUsers().length === 0 ? (
                    <div className="text-gray-500 mb-4 flex items-center justify-center h-full">
                        {viewMode === "blocked" && "No blocked users found"}
                        {viewMode === "reported" && "No reported users found"}
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="min-w-full bg-stone-800">
                            <thead className="sticky top-0 bg-gray-200 shadow">
                                <tr>
                                    {/* <th className="py-2 px-4 border-b text-center">
                                        User ID
                                    </th> */}
                                    <th className="py-2 px-4 border-b text-center">
                                        User Name
                                    </th>
                                    <th className="py-2 px-4 border-b text-center">
                                        Email
                                    </th>
                                    <th className="py-2 px-4 border-b text-center">
                                        Phone Number
                                    </th>
                                    <th className="py-2 px-4 border-b text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers().map((user) => (
                                    <tr key={user._id}>
                                        {/* <td className="py-2 px-4 border-b text-slate-300 text-center">
                                            {user._id}
                                        </td> */}
                                        <td className="py-2 px-4 border-b text-slate-300 text-center">
                                            {user.name}
                                        </td>
                                        <td className="py-2 px-4 border-b text-slate-300 text-center">
                                            {user.email}
                                        </td>
                                        <td className="py-2 px-4 border-b text-slate-300 text-center">
                                            {user.phone}
                                        </td>
                                        <td className="py-2 px-4 border-b text-slate-300 text-center">
                                            <button
                                                onClick={() =>
                                                    user.isBlocked
                                                        ? handleUnblock(
                                                              user._id
                                                          )
                                                        : handleBlock(user._id)
                                                }
                                                className={`px-2 py-1 w-24 h-10  rounded ${
                                                    user.isBlocked
                                                        ? "bg-red-500"
                                                        : "bg-emerald-600"
                                                } text-white`}>
                                                {user.isBlocked
                                                    ? "Unblock"
                                                    : "Block"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersList;