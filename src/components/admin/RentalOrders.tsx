import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAxiosInstance } from "../../utils/api/adminAxiosInstance";
import Spinner from "../users/Spinner";

interface Book {
    _id: string;
    bookTitle: string;
}
interface Lender {
    _id: string;
    name: string;
}
interface User {
    _id: string;
    name: string;
}
interface Cart {
    _id: string;
    totalDays: number;
}
interface RentalOrder {
    _id: string;
    lenderId: Lender;
    userId: User;
    cartId: Cart;
    bookId: Book;
    name: string;
    bookStatus: string;
    checkoutDate: string;
}

const RentalOrdersList: React.FC = () => {
    const [orders, setOrders] = useState<RentalOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<string>("all");
    const [searchKey, setSearchKey] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await adminAxiosInstance.get(
                    "/books/rental-orders"
                );
                if (response.status == 200) {
                    setOrders(response?.data);
                } else {
                    console.error("Error where fetching rental orders");
                }
            } catch (err) {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleViewModeChange = (mode: string) => {
        setViewMode(mode);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKey(event.target.value);
    };

    const filteredOrders = () => {
        let filtered = orders;

        switch (viewMode) {
            case "not_returned":
                filtered = filtered.filter(
                    (order) =>
                        order.bookStatus && order.bookStatus === "not_returned"
                );
                break;
            case "completed":
                filtered = filtered.filter(
                    (order) =>
                        order.bookStatus && order.bookStatus === "completed"
                );
                break;
            case "not_picked_up":
                filtered = filtered.filter(
                    (order) =>
                        order.bookStatus === "not_picked_up" ||
                        order.bookStatus === "not_picked_up"
                );
                break;

            case "overdue":
                filtered = filtered.filter(
                    (order) =>
                        order.bookStatus && order.bookStatus === "overdue"
                );
                break;
            default:
                break;
        }

        if (searchKey) {
            filtered = filtered.filter(
                (order) =>
                    order?.bookId?.bookTitle
                        .toLowerCase()
                        .includes(searchKey.toLowerCase()) ||
                    order?.lenderId?.name
                        .toLowerCase()
                        .includes(searchKey.toLowerCase()) ||
                    order?.userId?.name
                        .toLowerCase()
                        .includes(searchKey.toLowerCase())
            );
        }

        return filtered;
    };

    const handleViewDetails = (orderId: string) => {
        navigate(`/admin/order-detail/${orderId}`);
    };

    if (orders.length === 0) {
        return (
            <div>
                <Spinner />
            </div>
        );
    }
    return (
        <div className="bg-white shadow-md rounded p-4 h-full">
            <h2 className="text-xl font-serif mb-4 text-black">
                Rental Orders List
            </h2>
            <div className="mb-4 flex justify-between">
                <div>
                    <button
                        onClick={() => handleViewModeChange("all")}
                        className={`px-4 py-2 rounded ${
                            viewMode === "all"
                                ? "bg-teal-800 text-white"
                                : "bg-gray-200"
                        } mr-2`}>
                        All Orders
                    </button>
                    <button
                        onClick={() => handleViewModeChange("not_picked_up")}
                        className={`px-4 py-2 rounded ${
                            viewMode === "not_picked_up"
                                ? "bg-yellow-600 text-white"
                                : "bg-gray-200"
                        } mr-2`}>
                        Not Picked Yet
                    </button>
                    <button
                        onClick={() => handleViewModeChange("not_returned")}
                        className={`px-4 py-2 rounded ${
                            viewMode === "not_returned"
                                ? "bg-yellow-600 text-white"
                                : "bg-gray-200"
                        } mr-2`}>
                        Not Returned
                    </button>
                    <button
                        onClick={() => handleViewModeChange("completed")}
                        className={`px-4 py-2 rounded ${
                            viewMode === "completed"
                                ? "bg-green-800 text-white"
                                : "bg-gray-200"
                        } mr-2`}>
                        Completed Orders
                    </button>
                    {/* <button
                        onClick={() => handleViewModeChange("overdue")}
                        className={`px-4 py-2 rounded ${
                            viewMode === "overdue"
                                ? "bg-yellow-800 text-white"
                                : "bg-gray-200"
                        } mr-2`}>
                        Overdue
                    </button> */}
                </div>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchKey}
                        onChange={handleSearchChange}
                        className="px-4 py-2 border rounded"
                    />
                </div>
            </div>
            <div className="h-[540px] overflow-y-auto mt-6">
                {filteredOrders().length === 0 ? (
                    <div className="text-gray-500 mb-4 flex items-center justify-center h-full">
                        {viewMode === "completed" && "No orders"}
                        {viewMode === "not_picked_up" && "No orders"}
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="min-w-full bg-stone-300">
                            <thead className="sticky top-0 bg-gray-300 shadow ">
                                <tr>
                                    <th className="py-2 px-4 border-b text-center ">
                                        Book Title
                                    </th>
                                    <th className="py-2 px-4 border-b text-center">
                                        Renter
                                    </th>

                                    <th className="py-2 px-4 border-b text-center">
                                        Lender
                                    </th>
                                    <th className="py-2 px-4 border-b text-center">
                                        Status
                                    </th>
                                    <th className="py-2 px-4 border-b text-center">
                                        Checkout Date
                                    </th>
                                    {/* <th className="py-2 px-4 border-b text-center">
                                        Actions
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders().map((order) => (
                                    <tr key={order._id}>
                                        <td className="py-2 px-4 border-b text-black text-center truncate max-w-[150px]">
                                            {order?.bookId?.bookTitle}
                                        </td>
                                        <td className="py-2 px-4 border-b text-black text-center truncate max-w-[150px]">
                                            {order?.userId?.name}
                                        </td>

                                        <td className="py-2 px-4 border-b text-black text-center truncate max-w-[150px]">
                                            {order?.lenderId?.name}
                                        </td>

                                        <td
                                            className={`py-2 px-4 border-b text-black text-center truncate max-w-[150px] ${
                                                order.bookStatus === "completed"
                                                    ? "bg-green-600"
                                                    : order.bookStatus ===
                                                      "overdue"
                                                    ? "bg-yellow-600"
                                                    : order.bookStatus ===
                                                      "not_returned"
                                                    ? "bg-red-600"
                                                    : order.bookStatus ===
                                                      "not_picked_up"
                                                    ? "bg-blue-600"
                                                    : order.bookStatus ===
                                                      "cancelled"
                                                    ? "bg-red-900"
                                                    : ""
                                            }`}>
                                            {order.bookStatus}
                                        </td>
                                        <td className="py-2 px-4 border-b text-black text-center truncate max-w-[150px]">
                                            {order.checkoutDate
                                                ? new Date(
                                                      order.checkoutDate
                                                  ).toLocaleDateString()
                                                : "Not yet"}
                                        </td>

                                        <td className="py-2 px-4 border-b text-black text-center">
                                            <button
                                                className="bg-green-700 text-white py-1 px-3 rounded hover:bg-green-600"
                                                onClick={() =>
                                                    handleViewDetails(order._id)
                                                }>
                                                View Details
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

export default RentalOrdersList;
