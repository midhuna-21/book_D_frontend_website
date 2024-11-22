import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import { toast } from "sonner";
import { RootState } from "../../utils/ReduxStore/store/store";
import { useSelector } from "react-redux";
import Spinner from "../users/Spinner";

interface OrderData {
    userId: {
        name: string;
    };
    bookTitle: string;
}

const PaymentSuccess = () => {
    const location = useLocation();
    const username = useSelector(
        (state: RootState) => state?.user?.userInfo?.user?.name
    );
    const searchParams = new URLSearchParams(location.search);
    const bookId = searchParams.get("book_id");
    const sessionId = searchParams.get("session_id");
    const userId = searchParams.get("user_id");
    const cartId = searchParams.get("cart_id");
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const navigate = useNavigate();
    const hasFetchedData = useRef(false);
    const { fromWallet, orderId } = location.state || {};

    const fetchOrderDataFromWallet = async () => {
        try {
            if (fromWallet) {
                const response = await userAxiosInstance.get(
                    `/order/${orderId}`
                );
                if (response.status === 200) {
                    setOrderData(response.data.order);
                } else {
                    console.error("Failed to retrieve wallet order data");
                    toast.error("Failed to retrieve wallet order data");
                }
            }
        } catch (error: any) {
            console.error(error.response, "response");
            if (
                error.response &&
                (error.response.status === 403 ||
                    error.response.status === 404 ||
                    error.response.status === 400)
            ) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred, please try again later");
            }
        }
    };

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                if (
                    sessionId &&
                    bookId &&
                    userId &&
                    cartId &&
                    !hasFetchedData.current &&
                    !fromWallet
                ) {
                    const response = await userAxiosInstance.post(
                        "/books/rent/create-order",
                        { bookId, userId, cartId, sessionId }
                    );
                    if (response.status == 200) {
                        setOrderData(response.data.order);
                        hasFetchedData.current = true;
                    } else {
                        console.error("Failed to retrieve session data");
                    }
                }
            } catch (error: any) {
                console.log(error.response, "resonse");
                if (
                    (error.response && error.response.status === 403) ||
                    error.response.status === 404 ||
                    error.response.status === 400
                ) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occurred, please try again later");
                    console.error("Error fetching session data:", error);
                }
            }
        };
        if (!hasFetchedData.current && fromWallet) {
            fetchOrderDataFromWallet();
        } else if (!hasFetchedData.current && !fromWallet) {
            fetchSessionData();
        }

        hasFetchedData.current = true;
    }, [hasFetchedData, fromWallet]);

    const handleOkClick = () => {
        navigate(`/profile/books/rent`);
    };

    if (!orderData) {
        return (
            <div>
                <Spinner />
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
                    <strong>{orderData?.bookTitle}</strong> has been
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
