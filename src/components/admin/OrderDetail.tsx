import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { adminAxiosInstance } from "../../utils/api/adminAxiosInstance";
import {
    FaBook,
    FaUser,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaRupeeSign,
    FaRegCalendarTimes,
    FaInfoCircle,
} from "react-icons/fa";

interface Cart {
    _id: string;
    totalDays: number;
    totalPrice: number;
    totalRentalPrice: number;
}

interface Book {
    _id: string;
    bookTitle: string;
    address: Address;
}

interface Address {
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
}

interface User {
    _id: string;
    name: string;
    address?: Address;
}

interface Order {
    _id: string;
    bookId: Book;
    lenderId: User;
    userId: User;
    cartId: Cart;
    statusUpdateRenterDate: string;
    bookStatus: string;
    totalPrice: number;
}

const OrderDetail = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await adminAxiosInstance.get(
                    `/books/rental-order/${orderId}`
                );
                setOrder(response?.data);
            } catch (error) {
                console.error("Error fetching order details:", error);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    if (!order) {
        return <div>No order details available.</div>;
    }

    const rentalStartDate = order.statusUpdateRenterDate
        ? new Date(order?.statusUpdateRenterDate).toLocaleDateString()
        : " ";

    const rentalEndDate =
        order?.statusUpdateRenterDate && order?.cartId?.totalDays
            ? new Date(
                  new Date(order?.statusUpdateRenterDate).getTime() +
                      order?.cartId?.totalDays * 24 * 60 * 60 * 1000
              ).toLocaleDateString()
            : " ";

    return (
        <div className="bg-white shadow-md rounded p-4 h-full">
            <h1 className="text-xl font-serif mb-6 text-center text-black mt-12">
                Order Details
            </h1>

            <div className="bg-white  rounded-lg p-8 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <div className="flex items-center mb-6">
                            <FaBook className="text-2xl text-gray-700 mr-4" />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Book Title:
                                </h2>
                                <p className="text-gray-600">
                                    {order?.bookId?.bookTitle}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center mb-6">
                            <FaUser className="text-2xl text-gray-700 mr-4" />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Renter Name:
                                </h2>
                                <p className="text-gray-600">
                                    {order?.userId?.name}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center mb-6">
                            <FaUser className="text-2xl text-gray-700 mr-4" />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Lender Name:
                                </h2>
                                <p className="text-gray-600">
                                    {order?.lenderId?.name}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center mb-6">
                            <FaMapMarkerAlt className="text-2xl text-gray-700 mr-4" />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Lender Address:
                                </h2>
                                {order?.bookId?.address ? (
                                    <p className="text-gray-600">
                                        {order?.bookId?.address?.street},{" "}
                                        {order?.bookId?.address?.city},
                                        {order?.bookId?.address?.district},{" "}
                                        {order?.bookId?.address?.state},
                                        {order?.bookId?.address?.pincode}
                                    </p>
                                ) : (
                                    <p className="text-gray-600"> </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center mb-6">
                            <FaCalendarAlt className="text-2xl text-gray-700 mr-4" />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Rental Start Date:
                                </h2>
                                <p className="text-gray-600">
                                    {rentalStartDate}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center mb-6">
                            <FaRegCalendarTimes className="text-2xl text-gray-700 mr-4" />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Rental End Date:
                                </h2>
                                <p className="text-gray-600">{rentalEndDate}</p>
                            </div>
                        </div>
                        <div className="flex items-center mb-6">
                            <FaCalendarAlt className="text-2xl text-gray-700 mr-4" />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Total Days:
                                </h2>
                                <p className="text-gray-600">
                                    {order?.cartId?.totalDays}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center mb-6">
                            <FaRupeeSign className="text-2xl text-gray-700 mr-4" />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Total Price:
                                </h2>
                                <p className="text-gray-600">
                                    {order?.totalPrice} ₹
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center mb-6">
                            <FaRupeeSign className="text-2xl text-gray-700 mr-4" />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Total Rental Price:
                                </h2>
                                <p className="text-gray-600">
                                    {order?.cartId?.totalRentalPrice} ₹
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center mb-6">
                            <FaInfoCircle className="text-2xl text-gray-700 mr-4" />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Order Status:
                                </h2>
                                <p className="text-gray-600">
                                    {order?.bookStatus}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
