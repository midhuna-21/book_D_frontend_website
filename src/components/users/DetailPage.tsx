import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { adminAxiosInstance } from "../../utils/api/adminAxiosInstance";
import { Box, Flex, Icon } from "@chakra-ui/react";
import {
    FaBook,
    FaUser,
    FaBookReader,
    FaCalendarAlt,
    FaRupeeSign,
    FaRegCalendarTimes,
    FaInfoCircle,
    FaUserEdit
} from "react-icons/fa";

interface Cart {
    _id: string;
    totalDays: number;
    totalPrice: number;
    totalRentalPrice: number;
    totalAmount:number;
}

interface User {
    _id: string;
    name: string;
}
interface Book {
   _id:string;
   images:string;
   author:string;
   description:string;
}

interface Order {
    _id: string;
    bookTitle:string;
    lenderId: User;
    bookId:Book;
    userId: User;
    cartId: Cart;
    statusUpdateRenterDate: string;
    bookStatus: string;
    totalPrice: number;
    bookAddress:string;
    rentedOn:Date;
    dueDate:Date;
}

const LendDetailPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleReadMore = () => {
      setIsExpanded(!isExpanded);
  };


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


    return (
        <div className="bg-white shadow-md rounded py-20 h-full">
            <h1 className="text-xl font-serif  text-center text-black mt-12">
                Order Details
            </h1>

            <div className="flex justify-center items-center md:mb-8">
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
            <div className="bg-white rounded-lg p-8 max-w-5xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
            <div className="mb-6 flex flex-col items-center lg:items-center">
                <img
                    src={order?.bookId?.images[0]}
                    alt={order?.bookTitle}
                    className="w-40 h-60 object-cover rounded shadow-lg mb-4"
                />
            </div>
            <div className="flex items-start mb-6">
                {/* <FaInfoCircle className="text-2xl text-gray-700 mr-4" /> */}
                <div>
                    <h2 className="text-xl font-semibold">Description:</h2>
                    <span
                            className={`${
                                isExpanded ? "" : "line-clamp-2"
                            } transition-all duration-300 ease-in-out text-gray-600`}>
                            {order?.bookId.description}
                        </span>
                        {order?.bookId?.description.length > 100 && (
                            <button
                                onClick={toggleReadMore}
                                className="text-blue-600 cursor-pointer hover:underline px-2">
                                {isExpanded ? "Read less" : "Read more"}
                            </button>
                        )}
                </div>
            </div>
            <div className="flex items-center mb-6">
                <FaBook className="text-2xl text-gray-700 mr-4" />
                <div>
                    <h2 className="text-xl font-semibold">Book Title:</h2>
                    <p className="text-gray-600">{order?.bookTitle}</p>
                </div>
            </div>
            <div className="flex items-center mb-6">
                <FaUserEdit className="text-2xl text-gray-700 mr-4" />
                <div>
                    <h2 className="text-xl font-semibold">Author Name:</h2>
                    <p className="text-gray-600">{order?.bookId?.author}</p>
                </div>
            </div>
        </div>
        <div >
            <div className="flex items-center mb-6">
                <FaUser className="text-2xl text-gray-700 mr-4" />
                <div>
                    <h2 className="text-xl font-semibold">Customer Name:</h2>
                    <p className="text-gray-600">{order?.userId?.name}</p>
                </div>
            </div>
            <div className="flex items-center mb-6">
                <FaCalendarAlt className="text-2xl text-gray-700 mr-4" />
                <div>
                    <h2 className="text-xl font-semibold">Rental Start Date:</h2>
                    <p className="text-gray-600">
                        {new Date(order?.rentedOn).toLocaleDateString()}
                    </p>
                </div>
            </div>
            <div className="flex items-center mb-6">
                <FaRegCalendarTimes className="text-2xl text-gray-700 mr-4" />
                <div>
                    <h2 className="text-xl font-semibold">Rental End Date:</h2>
                    <p className="text-gray-600">
                        {new Date(order?.dueDate).toLocaleDateString()}
                    </p>
                </div>
            </div>
            <div className="flex items-center mb-6">
                <FaCalendarAlt className="text-2xl text-gray-700 mr-4" />
                <div>
                    <h2 className="text-xl font-semibold">Total Days:</h2>
                    <p className="text-gray-600">{order?.cartId?.totalDays}</p>
                </div>
            </div>
            <div className="flex items-center mb-6">
                <FaRupeeSign className="text-2xl text-gray-700 mr-4" />
                <div>
                    <h2 className="text-xl font-semibold">Total Price:</h2>
                    <p className="text-gray-600">{order?.cartId?.totalAmount} ₹</p>
                </div>
            </div>
            <div className="flex items-center mb-6">
                <FaRupeeSign className="text-2xl text-gray-700 mr-4" />
                <div>
                    <h2 className="text-xl font-semibold">Total Rental Price:</h2>
                    <p className="text-gray-600">{order?.cartId?.totalRentalPrice} ₹</p>
                </div>
            </div>
            <div className="flex items-center mb-6">
                {/* <FaInfoCircle className="text-2xl text-gray-700 mr-4" /> */}
                <div>
                    <h2 className="text-xl font-semibold">Order Status:</h2>
                    <p className="text-gray-600">{order?.bookStatus}</p>
                </div>
            </div>
        </div>
    </div>
</div>

        </div>
    );
};

export default LendDetailPage;
