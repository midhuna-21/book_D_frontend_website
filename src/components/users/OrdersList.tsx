import React, { useState, useEffect } from "react";
import { userAxiosInstance } from "../../utils/api/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/ReduxStore/store/store";
import { FaGreaterThan, FaLessThan,FaCheck } from "react-icons/fa";
import {toast} from 'sonner';

interface Address {
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
}
interface Cart{
    quantity:number;
    totalRentalPrice:number;
    totalAmount:number;
    total_deposit_amount:number;
    totalDays:number
}
interface Order {
    _id: string;
    bookId: {
        bookTitle: string;
        rentalFee: number;
        extraFee: number;
        address: Address;
    };
    lenderId: {
        name: string;
    };
    cartId:Cart;
    rentalStartDate: string;
    rentalEndDate: string;
    isMoneyTransactionStatus:
        | "sent_to_website"
        | "sent_to_lender"
        | "completed";
    isReached?: boolean;
    totalPrice: number;
    quantity: number;
    bookStatus: string;
    createdAt:Date;
    reachedAtUserDate:Date;
}

const OrderList: React.FC = () => {
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

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 4;

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await userAxiosInstance.get(
                    `/orders/${userId}`
                );
                setOrders(response.data.orders);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    const handleStatusUpdate = (orderId: string, bookStatus: string, orderDate: Date,reachedAtUserDate:Date,totalDays:number) => {

    if(bookStatus === 'not_reached'){
        const currentDate = new Date();
        const orderCreationDate = new Date(orderDate);
        const timeDifference = currentDate.getTime() - orderCreationDate.getTime();
        const dayDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
        console.log(timeDifference,'timeDifference')
        console.log(dayDifference,'dayDifference')

        if(dayDifference < 5){

            setSelectedOrderId(orderId);
            setCurrentOrderStatus(bookStatus);
            setShowModal(true);
        }else{
            toast.info("Your order has been cancelled. You can no longer receive this product. If not already credited, the amount will be refunded to your wallet within 7 days.");

        }
    }else {
     const currentDate = new Date();
     const isReached = new Date(reachedAtUserDate)
     const timeDifference = currentDate.getTime() - isReached.getTime();
     const daysPassed = Math.floor(timeDifference / (1000 * 3600 * 24)); 
     if(daysPassed < totalDays){
        const remainingDays = totalDays - daysPassed 
        toast.info(`you canot return the book right now.You can return it after ${remainingDays} remaining days.`)
     }else if(daysPassed>totalDays+10){
        toast.info(`You can't return the book anymore. The deposit amount has been credited to the ownership.`)
     }else{
        setSelectedOrderId(orderId);
        setCurrentOrderStatus(bookStatus);
        setShowModal(true);
     }
    }
    };

    const confirmStatusUpdate = async () => {
        if (selectedOrderId === null || isBookHandover === null) return;
        try {
            const response = await userAxiosInstance.put(
                `/update-order-status/${selectedOrderId}`,
                {
                    isBookHandover: isBookHandover,
                }
            );
         
            setShowModal(false);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };


    console.log(orders,'ordess')
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-7xl w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Rent List
                </h1>
                {orders.length === 0 ? (
                    <p className="text-gray-600 text-lg">No rental orders.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded-lg">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                                            Book Title
                                        </th>
                                        <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                                            Lender
                                        </th>
                                        <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                                            Rental Price
                                        </th>
                                        <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                                            Deposit Amount
                                        </th>
                                        <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                                            Total Amount
                                        </th>
                                        <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                                            Address
                                        </th>
                                        <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentOrders.map((order) => (
                                        <tr
                                            key={order._id}
                                            className="bg-gray-50 border-b">
                                            <td className="px-6 py-4 font-medium text-gray-700">
                                                {order.bookId.bookTitle}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {order.lenderId.name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {order.cartId?.quantity}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {order.cartId?.totalRentalPrice} ₹
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {order.cartId?.total_deposit_amount} ₹
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {order.cartId?.totalAmount} ₹
                                            </td>
                                            {/* <td className="px-6 py-4 text-gray-600">{order.bookId?.address?.street},{order.bookId?.address?.city},{order.bookId?.address?.district},{order.bookId?.address?.state},{order.bookId?.address?.pincode}</td> */}
                                            <td className="px-6 py-4 text-gray-600">
                                                <a
                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                                        `${order.bookId?.address?.street} ${order.bookId?.address?.city} ${order.bookId?.address?.district} ${order.bookId?.address?.state} ${order.bookId?.address?.pincode}`
                                                    )}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline hover:text-blue-800">
                                                    {
                                                        order.bookId?.address
                                                            ?.street
                                                    }{" "}
                                                    {
                                                        order.bookId?.address
                                                            ?.city
                                                    }
                                                    ,{" "}
                                                    {
                                                        order.bookId?.address
                                                            ?.district
                                                    }
                                                    ,{" "}
                                                    {
                                                        order.bookId?.address
                                                            ?.state
                                                    }
                                                    ,{" "}
                                                    {
                                                        order.bookId?.address
                                                            ?.pincode
                                                    }
                                                </a>
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.bookStatus ===
                                                "completed" ? (
                                                    <span className="text-green-600 font-semibold">
                                                        Returned
                                                    </span>
                                                ) : order.bookStatus ===
                                                  "not_returned" ? (
                                                    <span className="text-red-400 font-semibold">
                                                        Not Returned
                                                    </span>
                                                ): order.bookStatus === "cancelled" ? (
                                                    <span className="text-red-700 font-semibold">Cancelled</span>
                                                ) : order.bookStatus === "overdue" ? (
                                                    <span className="text-red-700 font-semibold">Overdue</span>
                                                ) : (
                                                    <span className="text-red-500 font-semibold">
                                                        Not Reached
                                                    </span>
                                                )
                                                }
                                                
                                            </td>

                                            {/* <td className="px-6 py-4">
                                                {order.bookStatus ===
                                                "not_returned" ? (
                                                    <span className="text-red-400 font-semibold">
                                                        Not Returned
                                                    </span>
                                                ) : (
                                                    <span className="text-red-600 font-semibold">
                                                        Not Reached
                                                    </span>
                                                )}
                                            </td> */}
                                         <td>
                                                        <td className="px-6 py-4">
                                         {order.bookStatus==="completed"? (
                                            <div className="flex items-center justify-center">
                                          
                                          <span className="text-green-600 font-semibold">
                                            
                                                        Completed 
                                                    </span>
                                                     <FaCheck className="text-green-600 text-lg ml-2" /> 
                                                    </div>
                                                    ): order.bookStatus === "cancelled" ? (
                                                        <div className="flex items-center justify-center">
                                                            <span className="text-red-600 font-semibold">
                                                                Order Cancelled
                                                            </span>
                                                        </div>
                                                    ) : order.bookStatus === "overdue" ? (
                                                        <div className="flex items-center justify-center">
                                                          <span className="text-red-600 font-semibold">Order Incomplete</span>
                                                        </div>
                                                      ) : (
                                                      <div className="flex justify-center">
                                                <button
                                                    className="px-4 py-2 text-sm font-semibold text-white bg-green-800 rounded-lg hover:bg-green-600 transition-colors duration-200"
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            order._id,
                                                            order.bookStatus,
                                                            order.createdAt,
                                                            order.reachedAtUserDate,
                                                            order?.cartId?.totalDays
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

                        <div className="flex justify-center mt-8">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50">
                                <FaLessThan />
                            </button>
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50">
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
                                    {/* <label className="flex items-center">
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
                                            className="form-radio text-red-500"
                                        />
                                        <span className="ml-2 text-gray-700">
                                            No, the book has not been returned
                                        </span>
                                    </label> */}
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
                                            Yes, the book has been handed over
                                        </span>
                                    </label>
                                    {/* <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="handoverStatus"
                                            value="no"
                                            checked={isBookHandover === "no"}
                                            onChange={() =>
                                                setIsBookHandover("no")
                                            }
                                            className="form-radio text-red-500"
                                        />
                                        <span className="ml-2 text-gray-700">
                                            No, the book has not been handed
                                            over
                                        </span>
                                    </label> */}
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

export default OrderList;
