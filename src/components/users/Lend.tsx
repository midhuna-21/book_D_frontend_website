import React, { useState, useEffect } from "react";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/ReduxStore/store/store";
import {
    FaGreaterThan,
    FaBookReader,
    FaLessThan,
    FaCheck,
} from "react-icons/fa";
import { toast } from "sonner";
import { Box, Flex, Icon } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Cart {
    quantity: number;
    totalRentalPrice: number;
    totalAmount: number;
    total_deposit_amount: number;
    totalDays: number;
}
interface Order {
    _id: string;
    bookTitle: string;
    bookAddress: string;
    lenderId: {
        name: string;
    };
    userId: {
        name: string;
    };
    cartId: Cart;
    rentalStartDate: string;
    rentalEndDate: string;
    returnCode: string;
    createdAt: Date;
    bookStatus: string;
    isPickupConfirmed: boolean;
    isReturnConfirmed: boolean;
    rentedOn: Date;
    dueDate: Date;
    checkoutDate: Date;
    pickupCode: string;
    //  statusUpdateRenterDate: Date;
}

const Lend: React.FC = () => {
    const [pickupCode, setPickupCode] = useState<string>("");

    const [searchQuery, setSearchQuery] = useState("");

    const [selectedOption, setSelectedOption] = useState("all");
    const options = [
        "all",
        "not_picked_up",
        "not_returned",
        "completed",
        "cancelled",
        "overdue",
    ];

    const handleSelection = (option: any) => {
        setSelectedOption(option);
        if (option === "all") {
            handleViewModeChange("all");
        } else if (option === "not_picked_up") {
            handleViewModeChange("not_picked_up");
        } else if (option === "not_returned") {
            handleViewModeChange("not_returned");
        } else if (option == "completed") {
            handleViewModeChange("completed");
        } else if (option === "cancelled") {
            handleViewModeChange("cancelled");
        } else if (option === "overdue") {
            handleViewModeChange("overdue");
        }

        setCurrentPage(1);
        setVisiblePageStart(1);
    };
    const [viewMode, setViewMode] = useState<string>("all");

    const handleViewModeChange = (mode: string) => {
        setViewMode(mode);
    };
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const userInfo = useSelector(
        (state: RootState) => state.user.userInfo?.user
    );
    const userId = userInfo?._id || "";
    const username = userInfo?.name;
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string>(" ");
    //  const [currentOrderStatus, setCurrentOrderStatus] = useState<string | null>(
    //      null
    //  );

    const filteredOrders = () => {
        let filtered = orders;
        switch (viewMode) {
            case "not_picked_up":
                filtered = filtered.filter(
                    (orders) => orders?.bookStatus == "not_picked_up"
                );

                break;
            case "not_returned":
                filtered = filtered.filter(
                    (orders) => orders?.bookStatus == "not_returned"
                );
                break;
            case "completed":
                filtered = filtered.filter(
                    (orders) => orders?.bookStatus == "completed"
                );
                break;
            case "cancelled":
                filtered = filtered.filter(
                    (orders) => orders?.bookStatus == "cancelled"
                );

                break;
            case "overdue":
                filtered = filtered.filter(
                    (orders) => orders?.bookStatus == "overdue"
                );
                break;
            default:
                break;
        }
        if (searchQuery) {
            filtered = filtered.filter((order) => {
                return (
                    order.bookTitle.toLowerCase().includes(searchQuery) ||
                    order.userId.name.toLowerCase().includes(searchQuery)
                );
            });
        }

        return filtered;
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [visiblePageStart, setVisiblePageStart] = useState(1);
    const ordersPerPage = 7;
    const maxVisiblePages = 5;

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders().slice(
        indexOfFirstOrder,
        indexOfLastOrder
    );

    const totalPages = Math.ceil(filteredOrders().length / ordersPerPage);

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

    const fetchOrders = async () => {
        setLoading(true);

        try {
            const response = await userAxiosInstance.get(
                `/books/lent/${userId}`
            );
            setOrders(response.data.orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, [userId]);

    const handleStatusUpdate = (orderId: string) => {
        setSelectedOrderId(orderId);
        //   setCurrentOrderStatus(bookStatus);
        setShowModal(true);
    };

    const confirmStatusUpdate = async (orderId: string, pickupCode: string) => {
        if (selectedOrderId === null || pickupCode === null) return;
        try {
            const response = await userAxiosInstance.put(
                `/books/lend-orders/lender/confirm/pickup/${orderId}`,
                {
                    pickupCode,
                }
            );

            if (response.data.success == false) {
                toast.error(response.data.message);
            } else {
                fetchOrders();
                setShowModal(false);
            }
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred, please try again later");
                console.error("Error updating status:", error);
            }
        }
    };
    const navigate = useNavigate();
    const handleDetailPage = (orderId: string) => {
        navigate(`/profile/books/lend/order-detail/${orderId}`);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <motion.div
                    className="loader w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />
                <p className="mt-4 text-gray-600 text-md font-semibold">
                    Loading notifications...
                </p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex justify-center h-screen items-center">
                <p className="text-gray-600 text-lg font-semibold">
                    No Lend Orders
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col mt-8 min-h-screen w-auto py-24">
            <h1 className="text-3xl font-serif text-center">Lend list</h1>
            <div className="flex justify-center items-center mb-8 ">
                <Flex align="center" width="10%" mt="2">
                    <Box h="1px" bg="grey" flex="1" />
                    <Icon
                        as={FaBookReader}
                        mx="2"
                        bg="gray.200"
                        p="2"
                        borderRadius="50%"
                        boxSize="1.5em"
                    />
                    <Box h="1px" bg="grey" flex="1" />
                </Flex>
            </div>
            <div className="bg-white rounded-lg min-h-screen px-4 md:px-10 space-y-4 ">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex gap-2 flex-wrap">
                        {options.map((option) => (
                            <button
                                key={option}
                                className={`${
                                    selectedOption === option
                                        ? "bg-gray-700 text-white"
                                        : "border-gray-400 border-2 text-gray-600"
                                } px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200`}
                                onClick={() => handleSelection(option)}>
                                {option.replace("_", " ")}
                            </button>
                        ))}
                    </div>
                    <div className="w-full md:w-auto">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search..."
                            className="w-full md:w-[250px] px-4 py-2 text-sm border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
                        />
                    </div>
                </div>
                {currentOrders.length === 0 ? (
                    <div
                        className="flex items-center justify-center"
                        style={{ height: "300px" }}>
                        <p className="text-gray-600 text-lg">
                            No rental orders.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto  min-h-[60vh]">
                            <table className=" hidden md:table min-w-full bg-white border rounded-lg shadow-lg">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal  ">
                                        {[
                                            "Book Title",
                                            "Customer",
                                            "Total Amount",
                                            "Return Code",
                                            "Rented On",
                                            "Due Date",
                                            "Status",
                                            "Updations",
                                        ].map((header) => (
                                            <th
                                                key={header}
                                                className="py-3 px-6 text-center">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 text-sm font-light">
                                    {currentOrders.map((order) => (
                                        <tr
                                            key={order._id}
                                            // onClick={() => handleDetailPage(order._id)}
                                            className="border-b border-gray-200 hover:shadow-lg">
                                            <td className="py-3 px-6 text-left whitespace-nowrap">
                                                {order.bookTitle}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                {order.userId.name}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                {order.cartId?.totalAmount}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                {order?.returnCode}
                                            </td>
                                            {order?.rentedOn ? (
                                                <td className="py-3 px-6 text-center whitespace-nowrap">
                                                    {new Date(
                                                        order?.rentedOn
                                                    ).toLocaleDateString()}
                                                </td>
                                            ) : (
                                                <td className="py-3 px-6 text-center whitespace-nowrap">
                                                    Not set
                                                </td>
                                            )}
                                            {order?.dueDate ? (
                                                <td className="py-3 px-6 text-center whitespace-nowrap">
                                                    {new Date(
                                                        order?.dueDate
                                                    ).toLocaleDateString()}
                                                </td>
                                            ) : (
                                                <td className="py-3 px-6 text-center whitespace-nowrap">
                                                    Not set
                                                </td>
                                            )}
                                            <td className="py-3 px-6 text-center">
                                                <span
                                                    className={`font-semibold text-xs md:text-sm rounded-md p-1 ${
                                                        order.bookStatus ===
                                                        "completed"
                                                            ? "bg-green-200 text-green-800"
                                                            : order.bookStatus ===
                                                              "overdue"
                                                            ? "bg-yellow-200 text-yellow-800"
                                                            : "bg-orange-200 text-orange-800"
                                                    }`}>
                                                    {order.bookStatus.replace(
                                                        "_",
                                                        " "
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {order.bookStatus ===
                                                "completed" ? (
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-green-600 font-semibold text-xs md:text-sm">
                                                            Completed
                                                        </span>
                                                        <FaCheck className="text-green-600 ml-2" />
                                                    </div>
                                                ) : 
                                                order.bookStatus ===
                                                "cancelled" ? (
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-red-600 font-semibold text-xs md:text-sm">
                                                            cancelled
                                                        </span>
                                                    </div>
                                                ) : 
                                                order.bookStatus ===
                                                  "not_returned" ? (
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-blue-600 font-semibold text-xs md:text-sm">
                                                            Active Rental
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                order?._id
                                                            )
                                                        }
                                                        className="px-2 py-2 text-white bg-green-800 rounded-lg hover:bg-green-600 text-xs md:text-sm transition-colors duration-200">
                                                        Confirm Pickup
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() =>
                                                        handleDetailPage(
                                                            order._id
                                                        )
                                                    }
                                                    className="px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-400 text-xs md:text-sm transition-colors duration-200">
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="md:hidden">
                                {currentOrders.map((order) => (
                                    <div
                                        key={order._id}
                                        // onClick={() => handleDetailPage(order._id)}
                                        className="bg-white shadow-md rounded-lg p-4 mb-6">
                                        <div className="flex justify-between items-center mb-3">
                                            <strong className="text-gray-700">
                                                Book Title:
                                            </strong>
                                            <span className="text-gray-600">
                                                {order.bookTitle}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mb-3">
                                            <strong className="text-gray-700">
                                                Customer:
                                            </strong>
                                            <span className="text-gray-600">
                                                {order.userId.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mb-3">
                                            <strong className="text-gray-700">
                                                Total Amount:
                                            </strong>
                                            <span className="text-gray-600">
                                                {order.cartId?.totalAmount} ₹
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mb-3">
                                            <strong className="text-gray-700">
                                                Return Code:
                                            </strong>
                                            <span className="text-gray-600">
                                                {order?.returnCode}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mb-3">
                                            <strong className="text-gray-700">
                                                Rented On:
                                            </strong>
                                            <span className="text-gray-600">
                                            {order?.rentedOn ? new Date(order.rentedOn).toLocaleDateString() : "Not set"}
                                            </span>
                                            
                                        </div>
                                        <div className="flex justify-between items-center mb-3">
                                            <strong className="text-gray-700">
                                                Due Date:
                                            </strong>
                                            <span className="text-gray-600">
                                            {order?.dueDate ? new Date(order.dueDate).toLocaleDateString() : "Not set"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mb-3">
                                            <strong className="text-gray-700">
                                                Status:
                                            </strong>
                                            <span
                                                className={`font-semibold rounded-md px-2 py-1 text-sm ${
                                                    order.bookStatus ===
                                                    "completed"
                                                        ? "bg-green-200 text-green-800"
                                                        : order.bookStatus ===
                                                          "overdue"
                                                        ? "bg-yellow-200 text-yellow-800"
                                                        : "bg-orange-200 text-orange-800"
                                                }`}>
                                                {order.bookStatus.replace(
                                                    "_",
                                                    " "
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-center mt-4">
                                            {order.bookStatus ===
                                            "completed" ? (
                                                <div className="flex items-center">
                                                    <span className="text-green-600 font-semibold">
                                                        Completed
                                                    </span>
                                                    <FaCheck className="text-red-600 ml-2" />
                                                </div>
                                            ) : order.bookStatus ===
                                                "cancelled" ? (
                                                    <div className="flex items-center">
                                                        <span className="text-red-600 font-semibold">
                                                            cancelled
                                                        </span>
                                                    </div>
                                                ) : 
                                                order.bookStatus ===
                                                "cancelled" ? (
                                                    <div className="flex items-center">
                                                        <span className="text-red-600 font-semibold">
                                                            cancelled
                                                        </span>
                                                    </div>
                                                ) : (
                                                <button
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            order?._id
                                                        )
                                                    }
                                                    className="w-full py-2 text-white bg-green-800 rounded-lg hover:bg-green-600 text-sm transition-colors duration-200">
                                                    Confirm Pickup
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    handleDetailPage(order._id)
                                                }
                                                className="px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-400 text-xs md:text-sm transition-colors duration-200">
                                                View
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

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

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
                        <h2 className="text-xl font-semibold mb-4">
                            Confirm Book Handover
                        </h2>
                        <p className="mb-6">
                            Please enter the pickup code provided by the renter
                            to confirm the handover of the book
                        </p>

                        <div className="flex flex-col space-y-4 mb-6">
                            {/* <label className="text-gray-700">
                                Enter Pickup Code
                            </label> */}
                            <input
                                type="text"
                                value={pickupCode}
                                onChange={(e) => setPickupCode(e.target.value)}
                                placeholder="Enter the pickup code"
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() =>
                                    confirmStatusUpdate(
                                        selectedOrderId,
                                        pickupCode
                                    )
                                }
                                disabled={
                                    !pickupCode || pickupCode.trim() === ""
                                }
                                className={`px-4 py-2 bg-blue-600 text-white rounded-lg mr-2 ${
                                    !pickupCode || pickupCode.trim() === ""
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}>
                                Confirm
                            </button>

                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Lend;
