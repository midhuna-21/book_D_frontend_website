import React, { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import { adminAxiosInstance } from "../../utils/api/axiosInstance";

interface Book {
    _id: string;
    bookTitle: string;
}
interface Lender {
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
    cartId:Cart;
    bookId: Book;
    name: string;
    bookStatus: string;
    rentalDate: string;
    returnDate: string;
    statusUpdateRenterDate: string;
}

const RentalOrdersList: React.FC = () => {
    const [orders, setOrders] = useState<RentalOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<string>("all");
    const [searchKey, setSearchKey] = useState<string>("");


    const navigate = useNavigate()

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await adminAxiosInstance.get(
                    "/get-rental-orders"
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
                    (order) => order.bookStatus === "not_returned"
                );
                break;
            case "completed":
                filtered = filtered.filter(
                    (order) => order.bookStatus === "completed"
                );
                break;
            case "not_reached":
                filtered = filtered.filter(
                    (order) => order.bookStatus === "not_reached"
                );
                break;

            case "overdue":
                filtered = filtered.filter(
                    (order) => order.bookStatus === "overdue"
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
                        .includes(searchKey.toLowerCase())
            );
        }

        //   if (sortByDate) {
        //       filtered = filtered.sort(
        //           (a, b) =>
        //               new Date(b.rentalDate).getTime() -
        //               new Date(a.rentalDate).getTime()
        //       );
        //   }

        return filtered;
    };

  const handleViewDetails = (orderId: string) => {
    navigate(`/admin/order-detail/${orderId}`);
};
  

if (loading) {
    return <div className="text-gray-500 text-center">Loading...</div>;
}
    return (
        <div className="bg-stone-800 shadow-md rounded p-4 h-full">
            <h2 className="text-xl font-bold mb-4 text-zinc-300">
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
                        onClick={() => handleViewModeChange("reached_at_user")}
                        className={`px-4 py-2 rounded ${
                            viewMode === "reached_at_user"
                                ? "bg-yellow-600 text-white"
                                : "bg-gray-200"
                        } mr-2`}>
                        Reached_at_user
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
                    <button
                        onClick={() => handleViewModeChange("not_reached")}
                        className={`px-4 py-2 rounded ${
                            viewMode === "not_reached"
                                ? "bg-yellow-800 text-white"
                                : "bg-gray-200"
                        } mr-2`}>
                        Pending Orders
                    </button>
                    {/* <button
                        onClick={() => handleViewModeChange("overdue")}
                        className={`px-4 py-2 rounded ${
                            viewMode === "overdue"
                                ? "bg-red-800 text-white"
                                : "bg-gray-200"
                        }`}>
                        Overdue Orders
                    </button> */}
                </div>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Search by book title or renter name"
                        value={searchKey}
                        onChange={handleSearchChange}
                        className="px-4 py-2 border rounded"
                    />
                    {/* <button
                        onClick={handleSortByDate}
                        className={`px-4 py-2 rounded ${
                            sortByDate
                                ? "bg-lime-800 text-white"
                                : "bg-gray-200"
                        }`}>
                        Sort by Date
                    </button> */}
                </div>
            </div>
            <div className="h-96 overflow-y-auto">
                {filteredOrders().length === 0 ? (
                    <div className="text-gray-500 mb-4 flex items-center justify-center h-full">
                        {viewMode === "completed" && "No orders"}
                        {viewMode === "not_reached" && "No orders"}

                        {/* {viewMode === "pending" && "No pending orders found"} */}
                        {/* {viewMode === "overdue" && "No overdue orders found"} */}
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="min-w-full bg-stone-800">
                            <thead className="sticky top-0 bg-gray-200 shadow">
                                <tr>
                                    <th className="py-2 px-4 border-b text-center">
                                        Book Title
                                    </th>
                                    <th className="py-2 px-4 border-b text-center">
                                        Renter Name
                                    </th>
                                    <th className="py-2 px-4 border-b text-center">
                                        Status
                                    </th>
                                    <th className="py-2 px-4 border-b text-center">
                                        Rental Date
                                    </th>
                                    <th className="py-2 px-4 border-b text-center">
                                        Return Date
                                    </th>
                                    {/* <th className="py-2 px-4 border-b text-center">
                                        Actions
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders().map((order) => (
                                    <tr key={order._id}>
                                        <td className="py-2 px-4 border-b text-slate-300 text-center">
                                            {order?.bookId?.bookTitle}
                                        </td>
                                        <td className="py-2 px-4 border-b text-slate-300 text-center">
                                            {order?.lenderId?.name}
                                        </td>
                                        <td className="py-2 px-4 border-b text-slate-300 text-center">
                                            {order.bookStatus}
                                        </td>
                                        <td className="py-2 px-4 border-b text-slate-300 text-center">
                                            {order.statusUpdateRenterDate
                                                ? new Date(
                                                      order.statusUpdateRenterDate
                                                  ).toLocaleDateString()
                                                : "N/A"}
                                        </td>
                                        <td className="py-2 px-4 border-b text-slate-300 text-center">
                                            {order.statusUpdateRenterDate &&
                                            order?.cartId?.totalDays
                                                ? new Date(
                                                      new Date(
                                                          order.statusUpdateRenterDate
                                                      ).getTime() +
                                                          order?.cartId
                                                              ?.totalDays *
                                                              24 *
                                                              60 *
                                                              60 *
                                                              1000
                                                  ).toLocaleDateString()
                                                : "N/A"}
                                        </td>

                                        <td className="py-2 px-4 border-b text-slate-300 text-center">
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
