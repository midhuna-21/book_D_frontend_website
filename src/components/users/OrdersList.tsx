import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { userAxiosInstance } from "../../utils/api/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/ReduxStore/store/store";

interface Order {
  _id: string;
  bookId: {
    bookTitle: string;
    rentalFee:number;
    extraFee:number;
 
  };
  lenderId: {
    name: string;
  };
  rentalStartDate: string;
  rentalEndDate: string;
  isMoneyTransactionStatus: "sent_to_website" | "sent_to_lender" | "completed";
  isReached?: boolean;
  totalPrice:number;
  quantity:number;
  bookStatus:string
}

const OrderList: React.FC = () => {
   const userInfo = useSelector((state: RootState) => state.user.userInfo?.user);
   const userId = userInfo?._id || "";
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
    
        const response = await userAxiosInstance.get(`/orders/${userId}`);
        
        setOrders(response.data.orders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string) => {
    try {
      await userAxiosInstance.post(`/update-order/${orderId}`);
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order } : order
      ));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  console.log(orders,'ord')
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Rent List</h1>
        {orders.length === 0 ? (
          <p className="text-gray-600">No rent books.</p>
        ) : (
          <div>
            {orders.map(order => (
              <div key={order._id} className="bg-gray-50 p-4 mb-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">{order?.bookId?.bookTitle}</h2>
                <p className="text-gray-600 mb-2">Lender: {order?.lenderId?.name}</p>
                <p className="text-gray-600 mb-2">Quantity: {order?.quantity}</p>
                <p className="text-gray-600 mb-2">Rental Price: {order?.bookId?.rentalFee}</p>
                <p className="text-gray-600 mb-2">Deposit Amount: {order?.bookId?.extraFee}</p>
                <p className="text-gray-600 mb-2">Total Amount: {order?.totalPrice}</p>

                <p className="text-gray-600 mb-4">
                  Status: {order?.bookStatus === "reached_at_user" ? (
                    <span className="text-green-500">Book Reached</span>
                  ) : (
                    <span className="text-red-500">Not Reached</span>
                  )}
                </p>

                <button
                  className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-200"
                  onClick={() => handleStatusUpdate(order._id)}
                >
                  Mark as Reached 
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
