import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";

interface OrderData {
    userId: {
        name: string;
    };
    bookId: {
        bookTitle: string;
    };
}

const PaymentSuccess = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const bookId = searchParams.get("book_id");
    const sessionId = searchParams.get("session_id");
    const userId = searchParams.get("user_id");
    const cartId = searchParams.get("cart_id");
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [isOrderCreated, setIsOrderCreated] = useState(false);
    const navigate = useNavigate();
    const hasFetchedData = useRef(false);

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                if (
                    sessionId &&
                    bookId &&
                    userId &&
                    cartId &&
                    !hasFetchedData.current
                ) {
                    const response = await userAxiosInstance.post(
                        "/create-order",
                        { bookId, userId, cartId, sessionId }
                    );
                    if (response.status == 200) {
                        setOrderData(response.data.order);
                        hasFetchedData.current = true;
                    } else {
                        console.error("Failed to retrieve session data");
                    }
                }
            } catch (error) {
                console.error("Error fetching session data:", error);
            }
        };
        if (!hasFetchedData.current) {
            fetchSessionData();
            hasFetchedData.current = true;
        }
    }, [hasFetchedData]);

    const handleOkClick = () => {
        navigate("/home/rent-list");
    };

    if (!orderData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
                <div className="flex justify-center items-center mb-4">
                    <AiOutlineCheckCircle className="text-green-500 text-6xl" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Payment Successful!
                </h1>
                <p className="text-gray-600 mb-6">
                    {orderData?.userId?.name}, your rental for the book{" "}
                    <strong>{orderData?.bookId?.bookTitle}</strong> has been
                    successfull.
                </p>
                <div className="text-center mt-6">
                    <button
                        onClick={handleOkClick}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
