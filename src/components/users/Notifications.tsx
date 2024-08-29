import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/ReduxStore/store/store";
import { userAxiosInstance } from "../../utils/api/axiosInstance";
// import { io, Socket } from "socket.io-client";
import Swal from 'sweetalert2';
import { useSocket } from "../../utils/context/SocketProvider";
import ConfirmationRequest from './ConfirmationRequest';


interface User {
    _id: string;
  }
  interface Book {
    _id: string;
  }
  
interface Notification {
    _id: string;
    type: string;
    isAccepted: boolean;
    senderId: User; 
    bookId:Book;
    requestId:string
}
  

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [accepted, setAccepted] = useState<string[]>([]);
    const [bookId, setBookId] = useState("");
    // const [socket, setSocket] = useState<Socket | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const { socket } = useSocket();
    const userInfo = useSelector(
        (state: RootState) => state?.user?.userInfo?.user
    );
    const userId = userInfo?._id;

    useEffect(() => {
        if (socket) {
            socket.on("notification", (notification) => {
                setNotifications((prevNotifications) => [
                    notification,
                    ...prevNotifications,
                ]);
            });
            return () => {
                socket.off('notification');
            };
        }
    }, [socket]);

    useEffect(() => {
       const fetchNotification= async()=>{
        try{
            const response = await userAxiosInstance.get("/notifications");
        
                setNotifications(response?.data?.notifications);
        }catch(error:any){
            console.log("Error")
        }
       }
       fetchNotification()
    });

    const handleAccept = async (notificationId:string,receiverId:string,bookId:string,requestId:string) => {
        try {
       
            const content = `accepted your request. Now you can proceed with the procedures. Click here to view the lender's details.`;

            const notificationData = {
                senderId:userId,
                bookId,
                receiverId,
                notificationId,
                type: "accepted",
                content,
                requestId
            };

            const accpetData = {
                senderId:userId,
                bookId,
                receiverId,
                types: "accepted",
                requestId
            };

            const acceptResponse = await userAxiosInstance.put(
                "/request-accept",
                accpetData
            );
            const chatRoom= { senderId:receiverId,receiverId:userId };

            const chatRoomResponse = await userAxiosInstance.post(
                "/create-chatRoom",
                chatRoom
            );

            const response = await userAxiosInstance.post(
                "/notification",
                notificationData
            );
          
            if (socket) {
                socket.emit( "send-notification", {
                    receiverId,
                    notification: response?.data?.notification,
                });
              
            }
            setAccepted((prev) => [...prev, notificationId]);
            Swal.fire(
                'Accepted!',
                'You have accepted the request.',
                'success'
            );
       
    } catch (error) {
        console.error("Error at Internal server", error);
        Swal.fire(
            'Error',
            'There was an error processing your request.',
            'error'
        );
    }
    };

    // console.log(notifications,'n')
    const handleModalConfirm = () => {
        if (selectedNotification) {
            handleAccept(selectedNotification?._id, selectedNotification?.senderId._id,selectedNotification?.bookId._id,selectedNotification?.requestId);
            setIsModalOpen(false);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedNotification(null);
    };
 

    const handleReject = async (notificationId: string, receiverId: string) => {
        try {
            const content = "Your request was rejected";
            const notificationData = {
                senderId:userId,
                receiverId,
                notificationId,
                type: "Rejected",
                content,
            };
            const response = await userAxiosInstance.post(
                "/notification",
                notificationData
            );

            // if (socket) {
            //     socket.emit("send-notification", {
            //         receiverId,
            //         notification: response?.data?.notification,
            //     });
            // }
        } catch (error) {
            console.error("Error at Internal server", error);
        }
    };



    if (notifications.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600 text-lg">No notifications</p>
            </div>
        );
    }

    return (
        <div className="mt-12">
            <h2 className="text-center text-lg font-bold text-gray-600">
                Here is your request and accept message
            </h2>
            <div className="ml-20 py-12">
                {notifications.map((notification, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-4 border-b shadow-md">
                        <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                <img
                                    src={
                                        notification?.userImage ||
                                        notification?.senderId?.image
                                    }
                                    alt={notification.userName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">
                                    {notification.userName ||
                                        notification?.senderId?.name}
                                </p>
                                <p className="text-gray-600">
                                    <strong>
                                        {notification.userName ||
                                            notification?.senderId?.name}
                                    </strong>{" "}
                                    {notification.content}{" "}
                                    <strong>
                                        {notification.bookTitle ||
                                            notification?.bookId?.bookTitle}
                                    </strong>
                                    {notification.type === "accepted" && (
                                        <a
                                        href={notification?.requestId?.isPaid ? "#" : `/home/payment-details/${notification.requestId}`}
                                       
                                        onClick={(e) => {
                                          if (notification.isPaid) {
                                            e.preventDefault();
                                          }
                                        }}
                                        className={`text-blue-600 hover:text-blue-800 underline ml-2 font-semibold transition duration-300 ease-in-out transform ${notification.isPaid ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'}`}
                                      >
                                        {notification.userName || notification?.senderId?.name}
                                      </a>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="ml-auto flex items-center">
                            {notification.type === "Request"  &&
                                (notification.isAccepted? (
                                    <p className=   "text-green-800 font-semibold">
                                        Accepted
                                    </p>
                                ) : (
                                    <>
                                        <button
                                            className="bg-green-900 rounded-lg text-white p-2 px-4 font-semibold"
                                            onClick={() => {
                                                setSelectedNotification(notification);
                                                setIsModalOpen(true);
                                            }}>
                                            Accept
                                        </button>
                                        <ConfirmationRequest
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onConfirm={handleModalConfirm}
                content={`Are you sure you want to accept this request? Once you proceed, the action cannot be undone. By accepting, you agree that <strong>${notification?.senderId?.name} </strong>will be required to make the payment to our platform. To complete the transaction, you must confirm the handover of the book to the user by sending a One-Time Password (OTP) to their registered mobile number. Upon successful delivery and confirmation, the payment will be released to your account. Please note that if any damages are reported upon the return of the book, you will be eligible to receive compensation equivalent to the security deposit.

                    Before proceeding, make sure that the book is in good condition before handing it over. This will help avoid disputes regarding damages.`}
                          />
                                        <button
                                            className="bg-red-800 rounded-lg text-white p-2 px-4 font-semibold ml-4"
                                            onClick={() =>
                                                handleReject(
                                                    notification._id,
                                                    notification?.senderId?._id
                                                )
                                            }>
                                            Reject
                                        </button>
                                    </>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
