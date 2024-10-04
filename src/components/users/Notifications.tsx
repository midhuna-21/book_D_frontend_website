import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/ReduxStore/store/store";
import { userAxiosInstance } from "../../utils/api/axiosInstance";
import Swal from "sweetalert2";
import { useSocket } from "../../utils/context/SocketProvider";
import ConfirmationRequest from "./ConfirmationRequest";
import userLogo from "../../assets/userLogo.png";

interface User {
    _id: string;
}
interface Book {
    _id: string;
    bookTitle: string;
}
interface Cart {
    _id: string;
}
interface Notification {
    _id: string;
    type: string;
    isAccepted: boolean;
    userId: User;
    ownerId: User;
    status: string;
    bookId: Book;
    cartId: Cart;
    content: string;
    createdAt: string;
    updatedAt: string;
}

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [status, setStatus] = useState(false);
    const picture = userLogo;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenPayment, setIsModalOpenPayment] = useState(false);
    const [selectedNotification, setSelectedNotification] =
        useState<Notification | null>(null);
    const { socket } = useSocket();

    const userInfo = useSelector(
        (state: RootState) => state?.user?.userInfo?.user
    );
    const userid = userInfo?._id;

    useEffect(() => {
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
                userId: userId,
                ownerId: userid,
                bookId,
                status: "accepted",
            };

            const chatRoom = { senderId: userid, receiverId: userId };

             await userAxiosInstance.post(
                "/create-chatRoom",
                chatRoom
            );

            const response = await userAxiosInstance.post(
                "/notification",
                notificationData
            );

            if (response.status == 200) {
                const data = { types: "rejected" };

                await userAxiosInstance.put(
                    `/cart-item-update/${cartId}`,
                    data,
                    { headers: { "Content-Type": "application/json" } }
                );

                if (socket) {
                    socket.emit("send-notification", {
                        receiverId: userId,
                        notification: response?.data?.notification,
                    });
                }
            } else {
                console.error("Error at Internal server");
            }

            // setAccepted((prev) => [...prev, notificationId]);
            Swal.fire("Accepted!", "You have accepted the request.", "success");
            setStatus(true);
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
                    ownerId: userid,
                    status: "rejected",
                    userId,
                };

                const response = await userAxiosInstance.post(
                    "/notification",
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
                    `/cart-item-update/${cartId}`,
                    data,
                    { headers: { "Content-Type": "application/json" } }
                );
                Swal.fire({
                    title: "Rejected!",
                    text: "The request has been rejected.",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                });
                setStatus(true);
            }
        } catch (error) {
            console.error("Error at Internal server", error);
        }
    };

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const response = await userAxiosInstance.get("/notifications");
                const fetchedNotifications = response.data.notifications;

                if (Array.isArray(fetchedNotifications)) {
                    const formattedNotifications = fetchedNotifications
                        .map((notification: Notification) => ({
                            ...notification,
                            category: formatTimeCategory(
                                notification.createdAt
                            ),
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
            }
        };

        fetchNotification();
    }, []);

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

    const handlePayment = () => {
        setIsModalOpenPayment(true);
    };

    console.log(notifications, "notification ");
    if (notifications.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600 text-lg">No notifications</p>
            </div>
        );
    }
    return (
        <>
            <div className="mt-12 px-4 sm:px-6 lg:px-8 bg-white  ">
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
                            
                            <div key={category} className="w-full max-w-4xl">
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
                                            className="flex flex-col sm:flex-row py-7 items-center justify-between p-4 border-b shadow-md mb-4 bg-white rounded-lg"
                                            style={{ width: "100%" }}>
                                            <div className="flex items-center w-full sm:w-auto">
                                                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                                    <img
                                                        src={
                                                            (notification.userId
                                                                ._id === userid
                                                                ? notification
                                                                      ?.ownerId
                                                                      .image
                                                                : notification
                                                                      ?.userId
                                                                      ?.image) ||
                                                            picture
                                                        }
                                                        alt={
                                                            notification.userName
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <strong>
                                                        {notification.userId
                                                            ._id === userid
                                                            ? notification
                                                                  ?.ownerId.name
                                                            : notification
                                                                  ?.userId
                                                                  ?.name}
                                                    </strong>

                                                    <p className="text-gray-600 mt-4">
                                                        {notification.status ===
                                                        "requested" ? (
                                                            notification.ownerId
                                                                ._id ===
                                                            userid ? (
                                                                <>
                                                                    requested to
                                                                    rent the
                                                                    book{" "}
                                                                    <strong>
                                                                        {
                                                                            notification
                                                                                ?.bookId
                                                                                ?.bookTitle
                                                                        }
                                                                    </strong>
                                                                </>
                                                            ) : null
                                                        ) : notification.status ===
                                                          "rejected" ? (
                                                            notification.ownerId
                                                                ._id ===
                                                            userid ? (
                                                                <>
                                                                    You{" "}
                                                                    <span className="text-red-600 font-bold">
                                                                        rejected
                                                                    </span>{" "}
                                                                    <strong>
                                                                        {
                                                                            notification
                                                                                ?.userId
                                                                                ?.name
                                                                        }
                                                                        's
                                                                    </strong>{" "}
                                                                    request to
                                                                    rent this
                                                                    book{" "}
                                                                    <strong>
                                                                        {
                                                                            notification
                                                                                ?.bookId
                                                                                ?.bookTitle
                                                                        }
                                                                    </strong>
                                                                    .
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Your request
                                                                    to rent the
                                                                    book{" "}
                                                                    <strong>
                                                                        {
                                                                            notification
                                                                                ?.bookId
                                                                                ?.bookTitle
                                                                        }
                                                                    </strong>{" "}
                                                                    was{" "}
                                                                    <span className="text-red-600 font-bold">
                                                                        rejected
                                                                    </span>{" "}
                                                                    by{" "}
                                                                    <strong>
                                                                        {
                                                                            notification
                                                                                ?.ownerId
                                                                                ?.name
                                                                        }
                                                                    </strong>
                                                                    .
                                                                </>
                                                            )
                                                        ) : notification.status ===
                                                          "accepted" ? (
                                                            notification.ownerId
                                                                ._id ===
                                                            userid ? (
                                                                <>
                                                                    You have{" "}
                                                                    <span className="text-green-600 font-bold">
                                                                        accepted
                                                                    </span>{" "}
                                                                    the request
                                                                    from{" "}
                                                                    <strong>
                                                                        {
                                                                            notification
                                                                                ?.userId
                                                                                ?.name
                                                                        }
                                                                    </strong>{" "}
                                                                    to rent your
                                                                    book{" "}
                                                                    <strong>
                                                                        "
                                                                        {
                                                                            notification
                                                                                ?.bookId
                                                                                ?.bookTitle
                                                                        }
                                                                        "
                                                                    </strong>
                                                                    .
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Your request
                                                                    to rent the
                                                                    book{" "}
                                                                    <strong>
                                                                        {
                                                                            notification
                                                                                ?.bookId
                                                                                ?.bookTitle
                                                                        }
                                                                    </strong>{" "}
                                                                    has been{" "}
                                                                    <span className="text-green-600 font-bold">
                                                                        accepted
                                                                    </span>{" "}
                                                                    by{" "}
                                                                    <strong>
                                                                        {
                                                                            notification
                                                                                ?.ownerId
                                                                                ?.name
                                                                        }
                                                                    </strong>
                                                                    .
                                                                    <br />
                                                                    This is the
                                                                    details of
                                                                    payment. You
                                                                    can proceed
                                                                    to the{" "}
                                                                    {notification
                                                                        ?.cartId
                                                                        ?.isPaid ? (
                                                                        <a
                                                                            onClick={
                                                                                handlePayment
                                                                            }
                                                                            className="text-blue-600 hover:text-blue-800 underline">
                                                                            payment
                                                                        </a>
                                                                    ) : (
                                                                        <a
                                                                            href={`/home/payment-details/${notification?.cartId?._id}`}
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
                                            <div className="ml-auto flex items-center mt-4 sm:mt-0">
                                                {notification.status ===
                                                    "requested" &&
                                                    !status && (
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
                                                                        content={`Are you sure you want to accept this request? Once you proceed, the action cannot be undone. By accepting, you agree that <strong>${notification?.userId?.name}</strong> will be required to make the payment to our platform. Both you and <strong>${notification?.userId?.name}</strong> have to provide confirmation after the book is handed over. Once both confirmations are received, you will receive the payment.`}
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
                                            </div>

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
                        <p>You have already paid the amount.</p>
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

export default Notifications;
