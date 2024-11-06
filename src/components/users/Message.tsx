import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaEnvelope } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/ReduxStore/store/store";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import { useSocket } from "../../utils/context/SocketProvider";
import {toast} from 'sonner';

interface Receiver {
    chatRoomId: string;
    userId: string;
    userName: string;
    userImage: string;
    lastMessage: string;
    lastTimestamp: string;
    isOnline?: boolean;
    isRead: boolean;
}

interface MessageProps {
    selectedUser: Receiver | null;
}

const Message: React.FC<MessageProps> = ({ selectedUser }) => {
    const userInfo = useSelector(
        (state: RootState) => state?.user?.userInfo?.user
    );
    const userId = userInfo?._id;

    const [messages, setMessages] = useState<any[]>([]);
    const [messageText, setMessageText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { socket } = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on("receive-message", (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            return () => {
                socket.off("receive-message");
            };
        }
    }, [socket]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!messageText.trim() || !selectedUser) return;

        try {
            const data = {
                senderId: userId,
                receiverId: selectedUser.userId,
                content: messageText,
                chatRoomId: selectedUser.chatRoomId,
            };

            const response = await userAxiosInstance.post(
                "/send-message",
                data
            );

            if (response.status === 200) {
                socket?.emit("send-message", data);
                setMessages((prevMessages) => [...prevMessages, data]);
                setMessageText("");
            } else {
                console.error("Failed to send message");
            }
        } catch (error:any) {
            if (error.response && error.response.status === 403) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred while sending messages, please try again later");
                console.error("Error sending message:", error);
            }
        }
    };

    const fetchMessages = async (chatRoomId: string) => {
        try {
            const response = await userAxiosInstance.get(
                `/messages/${chatRoomId}`
            );
            setMessages(response.data.messages || []);
        } catch (error:any) {
            if (error.response && error.response.status === 403) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred while fetching messages, please try again later");
                console.log("Error fetching messages:", error);
            }
        }
    };

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.chatRoomId);
        }
    }, [selectedUser]);

    const formatTimestamp = (timestamp: string) => {
        const now = new Date();
        const messageDate = new Date(timestamp);
        const diff = now.getTime() - messageDate.getTime();
        const diffMinutes = Math.floor(diff / (1000 * 60));

        if (diffMinutes < 1) return "Just now";
        else if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
        else if (diffMinutes < 1440)
            return `${Math.floor(diffMinutes / 60)} hours ago`;
        else
            return `${
                messageDate.getMonth() + 1
            }/${messageDate.getDate()}/${messageDate.getFullYear()}`;
    };

    return (
        <div className="flex flex-row gap-6">
            <div className="w-full md:w-1/2 h-[500px] mt-4 md:mt-0">
                <div className="md:mt-6 border border-gray-200 rounded-lg shadow-md p-4 h-full flex flex-col">
                    {selectedUser ? (
                        <div className="flex flex-col h-full">
                            <div className="flex items-center mb-4 p-2">
                                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                                    <img
                                        src={selectedUser.userImage}
                                        alt={selectedUser.userName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-xl font-bold">
                                        {selectedUser.userName}
                                    </p>
                                </div>
                            </div>
                            <div
                                className="flex flex-col space-y-4 overflow-y-auto flex-grow"
                                ref={messagesEndRef}>
                                {messages.length > 0 ? (
                                    messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`flex flex-col mb-4 ${
                                                msg.senderId === userId
                                                    ? "items-end"
                                                    : "items-start"
                                            }`}>
                                            <p className="text-xs text-gray-500 mb-1">
                                                {formatTimestamp(msg.createdAt)}
                                            </p>
                                            <div
                                                className={`max-w-xs ${
                                                    msg.senderId === userId
                                                        ? "bg-blue-200 text-right"
                                                        : "bg-gray-200 text-left"
                                                } p-3 rounded-lg shadow`}>
                                                <p className="text-sm">
                                                    {msg.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500">
                                        Empty
                                    </p>
                                )}
                                <div ref={messagesEndRef} />{" "}
                                {/* Ensure this is at the bottom */}
                            </div>
                            <div className="pt-4 flex items-center space-x-4 border-t border-gray-200 w-full">
                                <input
                                    type="text"
                                    className="flex-grow p-2 border border-gray-300 rounded-lg"
                                    placeholder="Type a message..."
                                    value={messageText}
                                    onChange={(e) =>
                                        setMessageText(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter")
                                            handleSendMessage();
                                    }}
                                />
                                <button
                                    className="text-black rounded-lg"
                                    onClick={handleSendMessage}>
                                    <FaPaperPlane className="text-2xl" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <p className="text-lg">Your messages</p>
                            <FaEnvelope className="text-4xl mt-2" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;
