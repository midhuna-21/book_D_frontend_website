import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/ReduxStore/store/store";
import { userAxiosInstance } from "../../utils/api/axiosInstance";
// import { io, Socket } from "socket.io-client";
import Swal from "sweetalert2";
import { useSocket } from "../../utils/context/SocketProvider";
import ConfirmationRequest from "./ConfirmationRequest";
import { formatDistanceToNow, isToday, isYesterday, isWithinInterval, subDays, subMonths } from "date-fns";

interface User {
    _id: string;
}
interface Book {
    _id: string;
    bookTitle:string;
}

interface Notification {
    _id: string;
    type: string;
    isAccepted: boolean;
    senderId: User;
    bookId: Book;
    requestId: string;
    content: string;
    createdAt: string; 
}

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [accepted, setAccepted] = useState<string[]>([]);
    const [bookId, setBookId] = useState("");
    // const [socket, setSocket] = useState<Socket | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] =
        useState<Notification | null>(null);
    const [requests, setRequests] = useState<any[]>([]);
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
                socket.off("notification");
            };
        }
    }, [socket]);

    const formatTimeCategory = (createdAt: string): string => {
        const now = new Date();
        const notificationDate = new Date(createdAt);
        const timeDiff = now.getTime() - notificationDate.getTime();
    
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
        if (days < 1) {
            return "Just now";
        } else if (isYesterday(notificationDate)) {
            return "Yesterday";
        } else if (days <= 7) {
            return "Last 7 days";
        } else if (days <= 30) {
            return "30 days";
        } else {
            return "Older";
        }
    };
    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const response = await userAxiosInstance.get("/notifications");
                const fetchedNotifications = response.data.notifications;
    
                if (Array.isArray(fetchedNotifications)) {
                    const formattedNotifications = fetchedNotifications.map(
                        (notification: Notification) => ({
                            ...notification,
                            category: formatTimeCategory(notification.createdAt), 
                            formattedTime: formatTime(notification.createdAt),
                        })
                    );
    
                    setNotifications(formattedNotifications);
                } else {
                    console.error("Fetched notifications are not an array");
                }
            } catch (error: any) {
                console.log("Error fetching notifications", error);
            }
        };
    
        fetchNotification();
    }, []);
    
    
    // useEffect(() => {
    //     const fetchNotification = async () => {
    //         try {
    //             const response = await userAxiosInstance.get("/notifications");
    //             const fetchedNotifications = response.data.notifications;

    //             if (Array.isArray(fetchedNotifications)) {
    //                 const formattedNotifications = fetchedNotifications.map(
    //                     (notification: Notification) => ({
    //                         ...notification,
    //                         formattedTime: formatTime(notification.createdAt),
    //                     })
    //                 );
    //                 setNotifications(formattedNotifications);
    //             } else {
    //                 console.error("Fetched notifications are not an array");
    //             }
    //         } catch (error: any) {
    //             console.log("Error");
    //         }
    //     };
    //     fetchNotification();
    // });

    const formatTime = (createdAt: string): string => {
        const now = new Date();
        const notificationDate = new Date(createdAt);
        const timeDiff = now.getTime() - notificationDate.getTime();
    
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(days / 7);
    
        if (days < 1) {
            return "just now";
        } else if (days === 1) {
            return "1d";
        } else if (days < 7) {
            return `${days}d`;
        } else if (weeks === 1) {
            return "1w";
        } else if (weeks < 7) {
            return `${weeks}w`;
        } else {
            return notificationDate.toLocaleDateString();
        }
    };
    


    const handleAccept = async (
        notificationId: string,
        receiverId: string,
        bookId: string,
        bookTitle:string,
        requestId: string
    ) => {
        try {
            const content = `Your request is Accepted to rent this book ${bookTitle}. Now you can proceed with the procedures. Click here to view the lender's details.`;

            const notificationData = {
                senderId: userId,
                bookId,
                receiverId,
                notificationId,
                type: "accepted",
                content,
                requestId,
            };

            const accpetData = {
                senderId: userId,
                bookId,
                receiverId,
                types: "accepted",
                requestId,
            };

            const acceptResponse = await userAxiosInstance.put(
                "/update-request",
                accpetData
            );
            const chatRoom = { senderId: receiverId, receiverId: userId };

            const chatRoomResponse = await userAxiosInstance.post(
                "/create-chatRoom",
                chatRoom
            );

            const response = await userAxiosInstance.post(
                "/notification",
                notificationData
            );

            if (socket) {
                socket.emit("send-notification", {
                    receiverId,
                    notification: response?.data?.notification,
                });
            }
            setAccepted((prev) => [...prev, notificationId]);
            Swal.fire("Accepted!", "You have accepted the request.", "success");
        } catch (error) {
            console.error("Error at Internal server", error);
            Swal.fire(
                "Error",
                "There was an error processing your request.",
                "error"
            );
        }
    };

    const handleModalConfirm = () => {
        if (selectedNotification) {
            handleAccept(
                selectedNotification?._id,
                selectedNotification?.senderId._id,
                selectedNotification?.bookId._id,
                selectedNotification?.bookId?.bookTitle,
                selectedNotification?.requestId
            );
            setIsModalOpen(false);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedNotification(null);
    };

    const handleReject = async (
        notificationId: string,
        bookId: string,
        bookTitle:string,
        receiverId: string,
        requestId: string
    ) => {
        try {
            const content = `Your request to rent the book "${bookTitle}" has been rejected.`;
            const notificationData = {
                senderId: userId,
                receiverId,
                notificationId,
                type: "rejected",
                content,
            };
            const response = await userAxiosInstance.post(
                "/notification",
                notificationData
            );

            const rejectedData = {
                senderId: userId,
                bookId,
                receiverId,
                types: "rejected",
                requestId,
            };

            const rejectResponse = await userAxiosInstance.put(
                "/update-request",
                rejectedData
            );
            console.log(rejectResponse?.data);
            setRequests(rejectResponse?.data);
            if (socket) {
                socket.emit("send-notification", {
                    receiverId,
                    notification: response?.data?.notification,
                });
            }
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

    console.log(notifications, "nofitic");

    return (
        <div className="mt-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-lg font-bold text-gray-600">
                Here is your request and accept message
            </h2>
            <div className="py-12 flex  justify-center items-center">
            {["Just now", "Yesterday", "Last 7 days", "30 days", "Older"].map((category) => {
                const categoryNotifications = notifications.filter(
                    (notification) => notification.category === category
                );
                return categoryNotifications.length > 0 ? (
                    <div key={category} >
                    <h3 className="text-lg font-semibold text-gray-700 my-4">
                        {category}
                    </h3>
                    {categoryNotifications.map((notification, index) => (
                    <div
                        key={index}
                        className="flex flex-col sm:flex-row py-7 items-center justify-between p-4 border-b shadow-md mb-4"
                        style={{ width: '900px' }}>
                        <div className="flex items-center w-full sm:w-auto">
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
                                {/* <p className="font-bold text-gray-800">
                                    {notification.userName ||
                                        notification?.senderId?.name}
                                </p> */}
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
                                    <span className="ml-2 text-sm text-gray-500">
                                        {notification.formattedTime}
                                    </span> 
                                    {notification.type === "accepted" && (
                                        <a
                                            href={
                                                notification?.requestId?.isPaid
                                                    ? "#"
                                                    : `/home/payment-details/${notification?.requestId?._id}`
                                            }
                                            onClick={(e) => {
                                                if (notification.isPaid) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className={`text-blue-600 hover:text-blue-800 underline ml-2 font-semibold transition duration-300 ease-in-out transform ${
                                                notification.isPaid
                                                    ? "cursor-not-allowed opacity-50"
                                                    : "hover:scale-105"
                                            }`}>
                                            {notification.userName ||
                                                notification?.senderId?.name}
                                        </a>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="ml-auto flex items-center mt-4 sm:mt-0">
                            {notification.type === "Request" &&
                                (notification.isReject ? (
                                    <p className="text-red-800 font-semibold">
                                        Rejected
                                    </p>
                                ) : notification.isAccepted ? (
                                    <p className="text-green-800 font-semibold">
                                        Accepted
                                    </p>
                                ) : (
                                    <>
                                        <button
                                            className="bg-green-900 rounded-lg text-white p-2 px-4 font-semibold text-sm sm:text-base"
                                            onClick={() => {
                                                setSelectedNotification(
                                                    notification
                                                );
                                                setIsModalOpen(true);
                                            }}>
                                            Accept
                                        </button>
                                        <ConfirmationRequest
                                            isOpen={isModalOpen}
                                            onClose={handleModalClose}
                                            onConfirm={handleModalConfirm}
                                            content={`Are you sure you want to accept this request? Once you proceed, the action cannot be undone. By accepting, you agree that <strong>${notification?.senderId?.name} </strong> will be required to make the payment to our platform. To complete the transaction, you must confirm the handover of the book to the user by sending a One-Time Password (OTP) to their registered mobile number. Upon successful delivery and confirmation, the payment will be released to your account. Please note that if any damages are reported upon the return of the book, you will be eligible to receive compensation equivalent to the security deposit.

                    Before proceeding, make sure that the book is in good condition before handing it over. This will help avoid disputes regarding damages.`}
                                        />
                                        <button
                                            className="bg-red-800 rounded-lg text-white p-2 px-4 font-semibold ml-4 text-sm sm:text-base"
                                            onClick={() =>
                                                handleReject(
                                                    notification._id,
                                                    notification.bookId?._id,
                                                     notification.bookId?.bookTitle,
                                                    notification?.senderId?._id,
                                                    notification?.requestId
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
                ) : null;
                 
})}
            </div>
        </div>
    );
};

export default Notifications;
