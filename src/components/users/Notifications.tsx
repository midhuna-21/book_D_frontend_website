import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/ReduxStore/store/store";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import Swal from "sweetalert2";
import { useSocket } from "../../utils/context/SocketProvider";
import ConfirmationRequest from "./ConfirmationRequest";
import photo from "../../assets/th.jpeg";
import { toast } from "sonner";
import notificationImage from "../../assets/notification.png";
import { motion } from "framer-motion";

interface User {
    _id: string;
}
interface Book {
    _id: string;
    bookTitle: string;
    lenderId: string;
}
interface Cart {
    _id: string;
}
interface Notification {
    _id: string;
    type: string;
    isAccepted: boolean;
    userId: User;
    receiverId: User;
    status: string;
    bookId: Book;
    cartId: Cart;
    content: string;
    createdAt: string;
    updatedAt: string;
}

const UserNotifications: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);

    const picture = photo;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenPayment, setIsModalOpenPayment] = useState(false);
    const [cartQuantity, setCartQuantity] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [selectedNotification, setSelectedNotification] =
        useState<Notification | null>(null);
    const { socket } = useSocket();

    const userInfo = useSelector(
        (state: RootState) => state?.user?.userInfo?.user
    );
    const userid = userInfo?._id;

    const fetchNotification = async () => {
        setLoading(true);
        try {
            await userAxiosInstance.put("/notifications/update-status");
            const response = await userAxiosInstance.get("/notifications");
            const fetchedNotifications = response.data.notifications;

            if (Array.isArray(fetchedNotifications)) {
                const formattedNotifications = fetchedNotifications
                    .map((notification: Notification) => ({
                        ...notification,
                        category: formatTimeCategory(notification.createdAt),
                        formattedTime: formatTime(notification.createdAt),
                    }))
                    .filter(
                        (notification: Notification) =>
                            !(
                                notification.userId._id === userid &&
                                notification.status === "requested"
                            )
                    );
                formattedNotifications.sort(
                    (a: Notification, b: Notification) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                );

                setNotifications(formattedNotifications);
            } else {
                console.error("Fetched notifications are not an array");
            }
        } catch (error: any) {
            console.log("Error fetching notifications", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchNotification();
        if (socket) {
            socket.on("notification", (newNotification) => {
                const formattedNewNotification = {
                    ...newNotification,
                    category: formatTimeCategory(newNotification.createdAt),
                    formattedTime: formatTime(newNotification.createdAt),
                };
                if (
                    !(
                        formattedNewNotification.userId._id === userid &&
                        formattedNewNotification.status === "requested"
                    )
                ) {
                    setNotifications((prevNotifications: any) => [
                        ...prevNotifications,
                        formattedNewNotification,
                    ]);
                }
            });
            return () => {
                socket.off("notification");
            };
        }
    }, [socket]);

    const handleAccept = async (
        notificationId: string,
        userId: string,
        bookId: string,
        cartId: string
    ) => {
        try {
            const notificationData = {
                notificationId: notificationId,
                userId: userid,
                receiverId: userId,
                bookId,
                cartId: cartId,
                status: "accepted",
            };

            const chatRoom = { senderId: userid, receiverId: userId };

            await userAxiosInstance.post("/chat-room/create", chatRoom);

            const response = await userAxiosInstance.post(
                "/notifications/send-notification",
                notificationData
            );

            if (response.status == 200) {
                const data = { types: "accepted" };

                await userAxiosInstance.put(
                    `/cart/update-item/${cartId}`,
                    data,
                    { headers: { "Content-Type": "application/json" } }
                );
                if (socket) {
                    socket.emit("send-notification", {
                        receiverId: userId,
                        notification: response?.data?.notification,
                    });
                }
                setIsModalOpen(false);
                fetchNotification();
            } else {
                console.error("Error at Internal server");
            }
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                toast.error(error.response.data.message);
            } else {
                toast.error(
                    "An error occurred while accepting the request, please try again later"
                );
                console.error("Error at Internal server", error);
            }
        }
    };

    const handleModalConfirm = () => {
        if (selectedNotification) {
            handleAccept(
                selectedNotification?._id,
                selectedNotification?.userId?._id,
                selectedNotification?.bookId?._id,
                selectedNotification?.cartId?._id
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
        userId: string,
        cartId: string
    ) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to do accept again!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, reject it!",
                cancelButtonText: "Cancel",
            });

            if (result.isConfirmed) {
                const notificationData = {
                    cartId,
                    notificationId: notificationId,
                    bookId: bookId,
                    receiverId: userId,
                    status: "rejected",
                    userId: userid,
                };

                const response = await userAxiosInstance.post(
                    "/notifications/send-notification",
                    notificationData
                );

                if (socket) {
                    socket.emit("send-notification", {
                        receiverId: userId,
                        notification: response?.data?.notification,
                    });
                }
                const data = { types: "rejected" };
                await userAxiosInstance.put(
                    `/cart/update-item/${cartId}`,
                    data,
                    { headers: { "Content-Type": "application/json" } }
                );

                fetchNotification();
            }
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred, please try again later");
                console.error("Error at Internal server", error);
            }
        }
    };

    const formatTimeCategory = (createdAt: string): string => {
        const now = new Date();
        const notificationDate = new Date(createdAt);
        const timeDiff = now.getTime() - notificationDate.getTime();

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor(timeDiff / 9000);

        if (minutes < 1) {
            return "Just now";
        } else if (hours < 24) {
            return "Today";
        } else if (days === 1) {
            return "Yesterday";
        } else if (days <= 7) {
            return "Last 7 days";
        } else if (days <= 30) {
            return "30 days";
        } else {
            return "Older";
        }
    };

    const formatTime = (createdAt: string): string => {
        const now = new Date();
        const notificationDate = new Date(createdAt);
        const timeDiff = now.getTime() - notificationDate.getTime();

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(days / 7);
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor(timeDiff / (1000 * 60));

        if (minutes < 1) {
            return "just now";
        } else if (hours < 24) {
            return "Today";
        } else if (hours < 48) {
            return "Yesterday";
        } else if (days < 7) {
            return `${days}d`;
        } else if (weeks < 4) {
            return `${weeks}w`;
        } else {
            return notificationDate.toLocaleDateString();
        }
    };

    const handlePayment = (cartQuantity: string) => {
        setCartQuantity(cartQuantity);
        setIsModalOpenPayment(true);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <motion.div
                    className="loader w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />
                <p className="mt-4 text-gray-600 text-md font-semibold">
                    Loading notifications...
                </p>
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <motion.img
                    src={notificationImage}
                    alt="Empty Notifications"
                    className="w-56 h-42 mb-4"
                    // animate={{
                    //     y: [0, -10, 0],
                    // }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop",
                    }}
                />
                <div className="text-center">
                    <p className="text-gray-600 text-md font-semibold">
                        You don't have any notifications yet.
                    </p>
                    <p className="text-gray-600 text-md font-semibold">
                        Stay tuned for updates!
                    </p>
                </div>
            </div>
        );
    }
    return (
        <>
            <div className="py-24 px-4 sm:px-6 lg:px-8 min-h-screen">
                <h2 className="text-center text-lg font-bold text-gray-600">
                    Here is your request and accept message
                </h2>
                <div className="py-12 flex flex-col items-center justify-center">
                    {[
                        "Just now",
                        "Today",
                        "Yesterday",
                        "Last 7 days",
                        "30 days",
                        "Older",
                    ].map((category) => {
                        const categoryNotifications = notifications.filter(
                            (notification) => notification.category === category
                        );

                        return categoryNotifications.length > 0 ? (
                            <div key={category} className="w-full max-w-4xl ">
                                <p className="text-xl font-bold text-zinc-800">
                                    Notifications
                                </p>
                                <p className="text-lg font-semibold text-gray-700 my-4 text-left">
                                    {category}
                                </p>
                                {categoryNotifications.map(
                                    (notification, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-l border-l-blue-500 mb-4 shadow-sm"
                                            style={{ width: "100%" }}>
                                            <div className="flex items-center w-full sm:w-auto">
                                                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                                    <img
                                                        src={
                                                            (notification.userId
                                                                ?._id === userid
                                                                ? notification
                                                                      ?.receiverId
                                                                      .image
                                                                : notification
                                                                      ?.userId
                                                                      ?.image) ||
                                                            picture
                                                        }
                                                        alt={
                                                            notification?.userName
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">
                                                        <strong>
                                                            {notification.userId
                                                                ?._id === userid
                                                                ? notification
                                                                      ?.receiverId
                                                                      .name
                                                                : notification
                                                                      ?.userId
                                                                      ?.name}
                                                        </strong>
                                                        {notification.status ===
                                                        "requested" ? (
                                                            notification
                                                                ?.receiverId
                                                                ?._id ===
                                                            userid ? (
                                                                <>
                                                                    requested to
                                                                    rent the
                                                                    book{" "}
                                                                    <strong>
                                                                        {notification
                                                                            ?.bookId
                                                                            ?.bookTitle ||
                                                                            notification?.bookTitle}
                                                                    </strong>
                                                                </>
                                                            ) : null
                                                        ) : notification?.status ===
                                                          "rejected" ? (
                                                            notification?.cartId
                                                                ?.ownerId ===
                                                            userid ? (
                                                                <>
                                                                    {" "}
                                                                    requested to
                                                                    rent the
                                                                    book{" "}
                                                                    <strong>
                                                                        {notification
                                                                            ?.bookId
                                                                            ?.bookTitle ||
                                                                            notification?.bookTitle}
                                                                    </strong>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {" "}
                                                                    Your request
                                                                    to rent the
                                                                    book{" "}
                                                                    <strong>
                                                                        {notification
                                                                            ?.bookId
                                                                            ?.bookTitle ||
                                                                            notification?.bookTitle}
                                                                    </strong>{" "}
                                                                    was{" "}
                                                                    <span className="text-red-600 font-bold">
                                                                        rejected
                                                                    </span>{" "}
                                                                    {/* by{" "}
                                                                    <strong>
                                                                        {
                                                                            notification
                                                                                ?.receiverId
                                                                                ?.name
                                                                        }
                                                                    </strong> */}
                                                                    .
                                                                </>
                                                            )
                                                        ) : notification?.status ===
                                                          "accepted" ? (
                                                            notification?.cartId
                                                                ?.ownerId ===
                                                            userid ? (
                                                                <>
                                                                    {" "}
                                                                    requested to
                                                                    rent the
                                                                    book{" "}
                                                                    <strong>
                                                                        {notification
                                                                            ?.bookId
                                                                            ?.bookTitle ||
                                                                            notification?.bookTitle}
                                                                    </strong>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <>
                                                                        {" "}
                                                                        has{" "}
                                                                        <span className="text-green-600 font-bold">
                                                                            accepted
                                                                        </span>{" "}
                                                                        to rent
                                                                        the book{" "}
                                                                        <strong>
                                                                            {notification
                                                                                ?.bookId
                                                                                ?.bookTitle ||
                                                                                notification?.bookTitle}
                                                                        </strong>
                                                                        .
                                                                    </>
                                                                    .
                                                                    <br />
                                                                    This is the
                                                                    details of
                                                                    payment. You
                                                                    can proceed
                                                                    to the{" "}
                                                                    {notification
                                                                        ?.cartId
                                                                        ?.isPaid ||
                                                                    !notification?.bookId ? (
                                                                        <a
                                                                            onClick={() =>
                                                                                handlePayment(
                                                                                    notification
                                                                                        ?.cartId
                                                                                        ?.quantity
                                                                                )
                                                                            }
                                                                            className="text-blue-600 hover:text-blue-800 underline">
                                                                            payment
                                                                        </a>
                                                                    ) : (
                                                                        <a
                                                                            href={`/payment/rental-details/${notification?.cartId?._id}`}
                                                                            className="text-blue-600 hover:text-blue-800 underline">
                                                                            payment
                                                                        </a>
                                                                    )}
                                                                    .
                                                                </>
                                                            )
                                                        ) : (
                                                            ""
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            {notification?.bookId ? (
                                                <div className="ml-auto flex items-center mt-4 sm:mt-0">
                                                    {notification?.status ===
                                                        "requested" && (
                                                        <>
                                                            {notification
                                                                ?.bookId
                                                                ?.quantity <
                                                            notification?.cartId
                                                                ?.quantity ? (
                                                                <span className="text-yellow-600 font-bold ml-4">
                                                                    Insufficient
                                                                    Quantity
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        className="bg-green-900 rounded-lg text-white p-2 px-4 font-semibold text-sm sm:text-base"
                                                                        onClick={() => {
                                                                            setSelectedNotification(
                                                                                notification
                                                                            );
                                                                            setIsModalOpen(
                                                                                true
                                                                            );
                                                                        }}>
                                                                        Accept
                                                                    </button>

                                                                    {isModalOpen &&
                                                                        selectedNotification ===
                                                                            notification && (
                                                                            <ConfirmationRequest
                                                                                isOpen={
                                                                                    isModalOpen
                                                                                }
                                                                                onClose={
                                                                                    handleModalClose
                                                                                }
                                                                                onConfirm={
                                                                                    handleModalConfirm
                                                                                }
                                                                                content={` <ul>
                                                                    <li><strong>Renter Name:</strong> ${notification?.userId?.name}</li>
                                                                    <li><strong>Book Name:</strong> ${notification?.bookId?.bookTitle}</li>
                                                                    <li><strong>Total Rental Price:</strong> ₹${notification?.cartId?.totalRentalPrice}</li>
                                                                    <li><strong>Total Amount:</strong> ₹${notification?.cartId?.totalAmount}</li>
                                                                    <li><strong>Total Deposit Amount:</strong> ₹${notification?.cartId?.total_deposit_amount}</li>
                                                                    <li><strong>Total Rental Period:</strong> ${notification?.cartId?.totalDays} days</li>
                                                                    <li><strong>Quantity:</strong> ${notification?.cartId?.quantity}</li>
                                                                  </ul>
                                                                      Are you sure you want to accept this request? Once you proceed, the action cannot be undone. By accepting, you agree that <strong>${notification?.userId?.name}</strong> will be required to make the payment to our platform. Both you and <strong>${notification?.userId?.name}</strong> have to provide confirmation after the book is handed over. Once both confirmations are received, you will receive the payment.`}
                                                                            />
                                                                        )}
                                                                    <button
                                                                        className="bg-red-800 rounded-lg text-white p-2 px-4 font-semibold ml-4 text-sm sm:text-base"
                                                                        onClick={() =>
                                                                            handleReject(
                                                                                notification?._id,
                                                                                notification
                                                                                    ?.bookId
                                                                                    ?._id,
                                                                                notification
                                                                                    ?.userId
                                                                                    ?._id,
                                                                                notification
                                                                                    ?.cartId
                                                                                    ?._id
                                                                            )
                                                                        }>
                                                                        Reject
                                                                    </button>
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                    {notification?.status ===
                                                        "accepted" &&
                                                        notification?.bookId
                                                            ?.lenderId ===
                                                            userid && (
                                                            <span className="text-green-600 font-bold ml-4">
                                                                Accepted
                                                            </span>
                                                        )}

                                                    {notification?.status ===
                                                        "rejected" &&
                                                        notification?.bookId
                                                            ?.lenderId ===
                                                            userid && (
                                                            <span className="text-red-600 font-bold ml-4">
                                                                Rejected
                                                            </span>
                                                        )}
                                                </div>
                                            ) : (
                                                <div className="ml-auto flex items-center mt-4 sm:mt-0">
                                                    <span className="text-yellow-500 font-bold ml-4">
                                                        Not available
                                                    </span>
                                                </div>
                                            )}

                                            {/* <span className="mt-12 ml-3 text-sm text-gray-500">
                                                {notification.formattedTime}
                                            </span> */}
                                        </div>
                                    )
                                )}
                            </div>
                        ) : null;
                    })}
                </div>
            </div>
            {isModalOpenPayment && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg ">
                        <h2 className="text-lg font-bold">Payment Status</h2>
                        {cartQuantity === "0" ? (
                            <p>The book is no longer available for rent.</p>
                        ) : (
                            <p>You have already paid the amount.</p>
                        )}

                        <div className="mt-4 flex justify-center">
                            <button
                                className="px-4 py-2 bg-green-600 text-white justify-center items-center rounded"
                                onClick={() => setIsModalOpenPayment(false)}>
                                ok
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserNotifications;
