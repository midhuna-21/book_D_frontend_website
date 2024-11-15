import React, { useState, useEffect } from "react";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/ReduxStore/store/store";
import { FaGreaterThan, FaLessThan, FaCheck } from "react-icons/fa";
import { toast } from "sonner";

interface Address {
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
}
interface Cart {
    quantity: number;
    totalRentalPrice: number;
    totalAmount: number;
    total_deposit_amount: number;
    totalDays: number;
}
interface Order {
    _id: string;
    bookTitle:string;
    bookId: {
        bookTitle: string;
        rentalFee: number;
        extraFee: number;
        address: Address;
    };
    lenderId: {
        name: string;
    };
    cartId: Cart;
    rentalStartDate: string;
    rentalEndDate: string;
    isMoneyTransactionStatus:
        | "sent_to_website"
        | "sent_to_lender"
        | "completed";
    isReached?: boolean;
    totalPrice: number;
    quantity: number;
    bookStatusFromRenter: string;
    bookStatusFromLender: string;
    createdAt: Date;
    statusUpdateRenterDate: Date;
    bookAddress:string;
}

const RentedBooks: React.FC = () => {
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

    const userInfo = useSelector(
        (state: RootState) => state.user.userInfo?.user
    );
    const userId = userInfo?._id || "";
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isBookHandover, setIsBookHandover] = useState<string | null>(null);
    const [currentOrderStatus, setCurrentOrderStatus] = useState<string | null>(
        null
    );

    const filteredOrders = () => {
        let filtered = orders;

        switch (viewMode) {
            case "not_picked_up":
                filtered = filtered.filter(
                    (orders) => orders?.bookStatusFromRenter == "not_picked_up"
                );

                break;
            case "not_returned":
                filtered = filtered.filter(
                    (orders) => orders?.bookStatusFromRenter == "not_returned"
                );
                break;
            case "completed":
                filtered = filtered.filter(
                    (orders) => orders?.bookStatusFromRenter == "completed"
                );

                break;
            case "cancelled":
                filtered = filtered.filter(
                    (orders) => orders?.bookStatusFromRenter == "cancelled"
                );
                break;
            case "overdue":
                filtered = filtered.filter(
                    (orders) => orders?.bookStatusFromRenter == "overdue"
                );

                break;

            default:
                break;
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
        try {
            const response = await userAxiosInstance.get(
                `/books/rental-orders/${userId}`
            );
            setOrders(response.data.orders);
            setLoading(false);
        } catch (error:any) {
            if (error.response && error.response.status === 403) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred, please try again later");
                console.error("Error fetching orders:", error);
            }
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, [userId]);

    const handleStatusUpdate = (
        orderId: string,
        bookStatusFromLender: string,
        bookStatusFromRenter: string,
        lenderName: string,
        orderDate: Date,
        statusUpdateRenterDate: Date,
        totalDays: number
    ) => {
        if (bookStatusFromRenter === "not_picked_up") {
            const currentDate = new Date();
            const orderCreationDate = new Date(orderDate);
            const timeDifference =
                currentDate.getTime() - orderCreationDate.getTime();
            const dayDifference = Math.floor(
                timeDifference / (1000 * 3600 * 24)
            );

            if (dayDifference < 5) {
                setSelectedOrderId(orderId);
                setCurrentOrderStatus(bookStatusFromRenter);
                setShowModal(true);
            } else {
                toast.info(
                    "Your order has been cancelled. You can no longer receive this product. If not already credited, the amount will be refunded to your wallet within 7 days."
                );
            }
        } else {
            const currentDate = new Date();
            const isReached = new Date(statusUpdateRenterDate);
            const timeDifference = currentDate.getTime() - isReached.getTime();
            const daysPassed = Math.floor(timeDifference / (1000 * 3600 * 24));
            if (daysPassed < totalDays) {
                const remainingDays = totalDays - daysPassed;
                toast.info(
                    `you canot return the book right now.You can return it after ${remainingDays} remaining days.`
                );
            } else if (daysPassed > totalDays + 10) {
                toast.info(
                    `You can't return the book anymore. The deposit amount has been credited to the ownership.`
                );
            } else if (bookStatusFromRenter === "not_returned") {
                if (bookStatusFromLender === "not_returned") {
                    toast.info(
                        `The book has not been handed over to ${lenderName}. After the confirmation update, you will be able to update the status.`
                    );
                    return;
                } else if (bookStatusFromLender === "not_picked_up") {
                    toast.info("you already updated");
                    return;
                } else {
                    setSelectedOrderId(orderId);
                    setCurrentOrderStatus(bookStatusFromRenter);
                    setShowModal(true);
                }
            } else {
                setSelectedOrderId(orderId);
                setCurrentOrderStatus(bookStatusFromRenter);
                setShowModal(true);
            }
        }
    };

    const confirmStatusUpdate = async () => {
        if (selectedOrderId === null || isBookHandover === null) return;
        try {
            await userAxiosInstance.put(
                `/books/rental-orders/status/update/${selectedOrderId}`,
                {
                    isBookHandover: isBookHandover,
                }
            );
            fetchOrders();
            setShowModal(false);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-4 bg-gray-100">
            <div className="bg-blue-950 text-white w-full">
                <h1 className="text-3xl font-serif text-center">Rent list</h1>
            </div>
            <div className="bg-white rounded-lg w-full">
                <div className="">
                    <div className=" bg-gray-200 p-2">
                        <div className="flex ml-5">
                            {options.map((option) => (
                                <button
                                    key={option}
                                    className={`${
                                        selectedOption === option
                                            ? "bg-gray-800 text-white"
                                            : "bg-white text-gray-600"
                                    } px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200`}
                                    onClick={() => handleSelection(option)}>
                                    {option.replace("_", " ")}
                                </button>
                            ))}
                        </div>
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
                        <div className="overflow-x-auto p-3 ">
                            <table
                                className="min-w-full bg-white shadow-xl rounded-2xl"
                                style={{ height: "300px" }}>
                                <thead>
                                    <tr>
                                        <th className="text-center text-gray-600 font-bold text-sm p-4 border-b-2 border-t-2 border-black ">
                                            Book Title
                                        </th>
                                        <th className="text-center text-gray-600 font-bold text-sm p-4 border-b-2 border-l-2 border-t-2 border-black">
                                            Lender
                                        </th>
                                        <th className="text-center text-gray-600 font-bold text-sm p-4 border-b-2 border-l-2 border-t-2 border-black">
                                            Quantity
                                        </th>
                                        <th className="text-center text-gray-600 font-bold text-sm p-4 border-b-2 border-l-2 border-t-2 border-black">
                                            Rental Price
                                        </th>
                                        <th className="text-center text-gray-600 font-bold text-sm p-4 border-b-2 border-l-2 border-t-2 border-black">
                                            Deposit Amount
                                        </th>
                                        <th className="text-center text-gray-600 font-bold text-sm p-4 border-b-2 border-l-2 border-t-2 border-black">
                                            Total Amount
                                        </th>
                                        <th className="text-center text-gray-600 font-bold text-sm p-4 border-b-2 border-l-2 border-t-2 border-black">
                                            Address
                                        </th>
                                        <th className="text-center text-gray-600 font-bold text-sm p-4 border-b-2 border-l-2 border-t-2 border-black">
                                            Date
                                        </th>
                                        <th className="text-center text-gray-600 font-bold text-sm p-4 border-b-2 border-l-2 border-t-2 border-black">
                                            Status
                                        </th>
                                        <th className="text-center text-gray-600 font-bold text-sm p-4 border-b-2 border-l-2 border-t-2 border-black">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentOrders.map((order) => (
                                        <tr
                                            key={order._id}
                                            className="odd:bg-white even:bg-gray-50 border-b">
                                            <td className="px-6 py-4 font-medium text-gray-700 text-sm  max-w-[150px] truncate text-center">
                                                {order?.bookTitle}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm max-w-[150px] truncate text-center">
                                                {order.lenderId.name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm max-w-[150px] truncate text-center">
                                                {order.cartId?.quantity}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm max-w-[150px] truncate text-center">
                                                {order.cartId?.totalRentalPrice}{" "}
                                                ₹
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm max-w-[150px] truncate text-center">
                                                {
                                                    order.cartId
                                                        ?.total_deposit_amount
                                                }{" "}
                                                ₹
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm max-w-[150px] truncate text-center">
                                                {order.cartId?.totalAmount} ₹
                                            </td>
                                            {/* <td className="px-6 py-4 text-gray-600">{order.bookId?.address?.street},{order.bookId?.address?.city},{order.bookId?.address?.district},{order.bookId?.address?.state},{order.bookId?.address?.pincode}</td> */}
                                            <td className="px-6 py-4 text-gray-600 text-sm max-w-[150px] truncate text-center">
                                               <a
                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                                        `${order?.bookAddress}`
                                                    )}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline hover:text-blue-800">
                                                    {order?.bookAddress}
                                                </a>
                                               
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm max-w-[150px] truncate text-center">
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 max-w-[150px] truncate text-center">
                                                {order.bookStatusFromLender ===
                                                "completed" ? (
                                                    <span className=" font-semibold text-sm bg-green-200 text-green-800 rounded-md p-1">
                                                        Returned
                                                    </span>
                                                ) : order.bookStatusFromRenter ===
                                                  "not_returned" ? (
                                                    <span className="font-semibold text-sm bg-red-200 text-red-800 rounded-md p-1">
                                                        Not Returned
                                                    </span>
                                                ) : order.bookStatusFromRenter ===
                                                  "cancelled" ? (
                                                    <span className="bg-red-300 text-red-900  font-semibold text-sm rounded-md p-1">
                                                        Cancelled
                                                    </span>
                                                ) : order.bookStatusFromRenter ===
                                                  "overdue" ? (
                                                    <span className="bg-yellow-200 text-yellow-800 font-semibold text-sm rounded-md p-1">
                                                        Overdue
                                                    </span>
                                                ) : (
                                                    <span className="bg-orange-200 text-orange-800 font-semibold text-sm rounded-md p-1">
                                                        pending
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <td className="px-6 py-4">
                                                    {order.bookStatusFromLender ===
                                                    "completed" ? (
                                                        <div className="flex items-center justify-center">
                                                            <span className="text-green-600 font-semibold text-sm">
                                                                Completed
                                                            </span>
                                                            <FaCheck className="text-green-600 text-lg ml-2" />
                                                        </div>
                                                    ) : order.bookStatusFromRenter ===
                                                      "cancelled" ? (
                                                        <div className="flex items-center justify-center">
                                                            <span className="text-red-600 font-semibold text-sm">
                                                                Order Cancelled
                                                            </span>
                                                        </div>
                                                    ) : order.bookStatusFromRenter ===
                                                      "overdue" ? (
                                                        <div className="flex items-center justify-center">
                                                            <span className="text-red-600 font-semibold text-sm">
                                                                Order Incomplete
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-center">
                                                            <button
                                                                className="px-4 py-2 font-semibold text-white bg-green-800 rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm"
                                                                onClick={() =>
                                                                    handleStatusUpdate(
                                                                        order._id,
                                                                        order.bookStatusFromLender,
                                                                        order.bookStatusFromRenter,
                                                                        order
                                                                            .lenderId
                                                                            ?.name,
                                                                        order.createdAt,
                                                                        order.statusUpdateRenterDate,
                                                                        order
                                                                            ?.cartId
                                                                            ?.totalDays
                                                                    )
                                                                }>
                                                                Update Status
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                    </>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
                        <h2 className="text-xl font-semibold mb-4">
                            {currentOrderStatus === "not_returned"
                                ? "Return to Ownership"
                                : "Confirm Book Handover"}
                        </h2>
                        <p className="mb-6">
                            {currentOrderStatus === "not_returned"
                                ? "Please confirm whether the book has been returned to the lender's ownership."
                                : "Please confirm whether the book has been handed over to you at the owner's location."}
                        </p>
                        <div className="flex flex-col space-y-4 mb-6">
                            {currentOrderStatus === "not_returned" ? (
                                <>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="handoverStatus"
                                            value="completed"
                                            checked={
                                                isBookHandover === "completed"
                                            }
                                            onChange={() =>
                                                setIsBookHandover("completed")
                                            }
                                            className="form-radio text-green-500"
                                        />
                                        <span className="ml-2 text-gray-700">
                                            Yes, the book has been returned
                                        </span>
                                    </label>
                                </>
                            ) : (
                                <>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="handoverStatus"
                                            value="not_returned"
                                            checked={
                                                isBookHandover ===
                                                "not_returned"
                                            }
                                            onChange={() =>
                                                setIsBookHandover(
                                                    "not_returned"
                                                )
                                            }
                                            className="form-radio text-green-500"
                                        />
                                        <span className="ml-2 text-gray-700">
                                            Has this book been handed over?
                                        </span>
                                    </label>
                                </>
                            )}
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={confirmStatusUpdate}
                                disabled={isBookHandover === null}
                                className={`px-4 py-2 bg-blue-600 text-white rounded-lg mr-2 ${
                                    isBookHandover === null
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

export default RentedBooks;
