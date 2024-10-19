import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";

interface WalletData {
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
    const sessionId = searchParams.get("session_id");
    const userId = searchParams.get("user_id");
    const walletId = searchParams.get("wallet_id");
    const amount = searchParams.get("amount")
    const navigate = useNavigate();
    const hasFetchedData = useRef(false);

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                if (
                    sessionId &&
                    userId &&
                    walletId &&
                    !hasFetchedData.current
                ) {
                    const response = await userAxiosInstance.post(
                        "/update-wallet",
                        { userId, walletId, sessionId,amount }
                    );
           
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
