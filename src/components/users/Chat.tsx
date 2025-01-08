import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaEnvelope } from "react-icons/fa";
import photo from "../../assets/th.jpeg";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/ReduxStore/store/store";
import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
import { useSocket } from "../../utils/context/SocketProvider";
import InputEmoji from "react-input-emoji";
import { toast } from "sonner";
import chatImage from "../../assets/chat.png";
import { motion } from "framer-motion";

interface Receivers {
    chatRoomId: string;
    userId: string;
    userName: string;
    userImage: string;
    lastMessage: string;
    lastTimestamp: string;
    isOnline?: boolean;
    isRead: boolean;
}

const UserChat: React.FC = () => {
    const userInfo = useSelector(
        (state: RootState) => state?.user?.userInfo?.user
    );
    const userId = userInfo._id;

    const [chatRooms, setChatRooms] = useState<Receivers[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [messageText, setMessageText] = useState("");
    const [currentChatRoomId, setCurrentChatRoomId] = useState<string>("");
    const [typingUsers, setTypingUsers] = useState(new Set());
    const [selectedUserDetails, setSelectedUserDetails] = useState<{
        userId: string;
        userName: string;
        userImage: string;
    } | null>(null);

    const { socket } = useSocket();
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop =
                messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchReceivers = async () => {
        try {
            const response = await userAxiosInstance.get(`/chats/${userId}`);
            const conversations = response.data.conversations;
            if (Array.isArray(conversations)) {
                const chatRooms = conversations.map((chatRoom: any) => {
                    const isSender = chatRoom.senderId._id === userId;

                    const userDetails = isSender
                        ? chatRoom.receiverId
                        : chatRoom.senderId;

                    return {
                        chatRoomId: chatRoom._id,
                        userId: userDetails._id,
                        userName: userDetails.name,
                        userImage: userDetails.image,
                        lastMessage:
                            chatRoom.messageId.length > 0
                                ? chatRoom.messageId[
                                      chatRoom.messageId.length - 1
                                  ].content
                                : "start messaging",
                        lastTimestamp:
                            chatRoom.messageId.length > 0
                                ? chatRoom.messageId[
                                      chatRoom.messageId.length - 1
                                  ].createdAt
                                : "",
                        isRead: false,
                    };
                });

                setChatRooms(chatRooms);
            } else {
                console.error(
                    "Expected conversations to be an array, got",
                    typeof conversations
                );
            }
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                toast.error(error.response.data.message);
            } else {
                toast.error(
                    "An error occurred while fetching messages, try again later"
                );
            }
        }
    };
    useEffect(() => {
        fetchReceivers();
    }, [userId]);

    const handleUserClick = async (chatRoomId: string) => {
        try {
            const response = await userAxiosInstance.get(
                `/chat-room/${chatRoomId}`
            );
            const res = response?.data?.chat[0];

            if (res) {
                const { senderId, receiverId } = res;

                const isSender = senderId._id === userId;

                const userDetails = isSender ? receiverId : senderId;

                setSelectedUserDetails({
                    userId: userDetails._id,
                    userName: userDetails.name,
                    userImage: userDetails.image || photo,
                });
                setCurrentChatRoomId(chatRoomId);
                fetchMessages(chatRoomId);

                await userAxiosInstance.put(
                    `/chatrooms/read-status/${chatRoomId}`
                );
            } else {
                console.error("Chat data is not available");
            }
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                toast.error(error.response.data.message);
            } else {
                toast.error(
                    "An error occurred while fetching chatroom, try again later"
                );
            }
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on("receive-message", (message) => {
                setChatRooms((prevChatRooms) => {
                    return prevChatRooms.map((chatRoom) => {
                        if (
                            chatRoom.chatRoomId === message.chatRoomId ||
                            chatRoom.userId === message.receiverId ||
                            chatRoom.userId === message.senderId
                        ) {
                            return {
                                ...chatRoom,
                                lastMessage: message.content,
                                lastMessageTime: message.timestamp,
                                isRead:
                                    currentChatRoomId === chatRoom.chatRoomId,
                            };
                        }
                        return chatRoom;
                    });
                });
                if (message.chatRoomId === currentChatRoomId) {
                    setMessages((prevMessages) => [...prevMessages, message]);
                }
            });

            socket.on("typing", ({ userId, chatId }) => {
                const matchingRoom = chatRooms.find(
                    (chatRoom) => chatRoom.chatRoomId === chatId
                );
                if (matchingRoom?.chatRoomId === chatId) {
                    setTypingUsers(
                        (prevTypingUsers) =>
                            new Set([...prevTypingUsers, userId])
                    );
                }
            });

            socket.on("stop-typing", ({ userId, chatId }) => {
                const matchingRoom = chatRooms.find(
                    (chatRoom) => chatRoom.chatRoomId === chatId
                );
                if (matchingRoom?.chatRoomId === chatId) {
                    setTypingUsers((prevTypingUsers) => {
                        const updatedTypingUsers = new Set(prevTypingUsers);
                        updatedTypingUsers.delete(userId);
                        return updatedTypingUsers;
                    });
                }
            });

            socket.on("userOnline", (userId) => {
                setOnlineUsers((prev) => new Set(prev).add(userId));
            });

            socket.on("userOffline", (userId) => {
                setOnlineUsers((prev) => {
                    const updatedUsers = new Set(prev);
                    updatedUsers.delete(userId);
                    return updatedUsers;
                });
            });

            if (userId) {
                socket.emit("userConnected", userId);
            }
            return () => {
                socket.off("userOnline");
                socket.off("userOffline");
                socket.off("typing");
                socket.off("stop-typing");
                socket.off("receive-message");
            };
        }
    }, [socket, currentChatRoomId, chatRooms, userId]);

    const handleSendMessage = async (
        messageText: string,
        chatRoomId: string
    ) => {
        if (!messageText.trim() || !selectedUserDetails) return;

        try {
            const data = {
                senderId: userId,
                receiverId: selectedUserDetails.userId,
                content: messageText,
                chatRoomId: chatRoomId,
            };

            const response = await userAxiosInstance.post(
                "/messages/send-message",
                data
            );
            fetchReceivers();
            const chat = response?.data?.message;

            if (response.status === 200 && chat) {
                if (socket) {
                    socket.emit("send-message", {
                        senderId: userId,
                        receiverId: selectedUserDetails.userId,
                        content: messageText,
                        chatRoomId: chatRoomId,
                    });
                }

                setMessageText("");
            } else {
                console.error("Failed to send message");
            }
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                toast.error(error.response.data.message);
            } else {
                toast.error(
                    "An error occurred while sending message, try again later"
                );
            }
        }
    };

    const fetchMessages = async (chatRoomId: string) => {
        try {
            const response = await userAxiosInstance.get(
                `/messages/${chatRoomId}`
            );
            const fetchedMessages = response?.data?.messages?.messageId || [];

            setMessages(fetchedMessages);
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                toast.error(error.response.data.message);
            } else {
                toast.error(
                    "An error occurred while fetching messages, try again later"
                );
            }
        }
    };
    useEffect(() => {
        if (currentChatRoomId) {
            fetchMessages(currentChatRoomId);
        }
    }, [currentChatRoomId]);

    const formatTimestamp = (timestamp: string) => {
        const now = new Date();
        const messageDate = new Date(timestamp);
        const diff = now.getTime() - messageDate.getTime();
        const diffMinutes = Math.floor(diff / (1000 * 60));

        if (diffMinutes < 1) {
            return "Just now";
        } else if (diffMinutes < 60) {
            return `${diffMinutes} minutes ago`;
        } else if (diffMinutes < 1440) {
            return `${Math.floor(diffMinutes / 60)} hours ago`;
        } else {
            const month = messageDate.getMonth() + 1;
            const day = messageDate.getDate();
            const year = messageDate.getFullYear();
            return `${month}/${day}/${year}`;
        }
    };
    const handleOnEnter = (text: string) => {
        handleSendMessage(text, currentChatRoomId);
        setMessageText("");
    };

    const handleTyping = (chat_id: string, user_id: string) => {
        if (socket) {
            if (chat_id) {
                socket.emit("typing", { chatId: chat_id, userId: user_id });
            }
        }
    };

    const handleStopTyping = (chat_id: string, user_id: string) => {
        if (socket) {
            if (chat_id) {
                socket.emit("stop-typing", {
                    chatId: chat_id,
                    userId: user_id,
                });
            }
        }
    };

    if (!chatRooms.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <motion.div
                    className="loader w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />
                <p className="mt-4 text-gray-600 text-md font-semibold">
                    Loading messages...
                </p>
            </div>
        );
    }

    if (chatRooms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <motion.img
                    src={chatImage}
                    alt="Empty Chats"
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
                        No chats yet.
                    </p>
                    <p className="text-gray-600 text-md font-semibold">
                        Lend, rent, and start connecting with fellow book
                        lovers!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className=" mx-auto w-full max-w-6xl flex flex-col md:flex-col space-y-8 md:space-y-0 md:space-x-8 mb-20 py-24 min-h-screen">
            <div className="text-center md:mb-12">
                <h1 className="text-2xl font-bold text-gray-800 sm:text-2xl">
                    Chat with Your Readers
                </h1>
                <p className="text-base text-gray-600 mt-2 md:p-1 p-3">
                    Engage with lenders directly to discuss book rentals and
                    more.
                </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2 h-[525px] mt-4 md:mt-0 flex flex-col">
                    <p className="px-2 text-lg font-bold text-zinc-800">
                        Messages
                    </p>
                    <div className="border border-gray-200 rounded-lg shadow-md p-4 h-full">
                        <div className="flex flex-col space-y-3 h-full overflow-y-scroll scrollbar-hide">
                            {chatRooms.length > 0 ? (
                                chatRooms.map((chatRoom) => (
                                    <div
                                        key={chatRoom.userId}
                                        className="flex items-center shadow-md border p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                                        onClick={() =>
                                            handleUserClick(chatRoom.chatRoomId)
                                        }>
                                        <div className="w-16 h-16 rounded-full overflow-hidden mr-4 relative">
                                            <img
                                                src={
                                                    chatRoom.userImage || photo
                                                }
                                                alt={chatRoom.userName}
                                                className="w-full h-full object-cover"
                                            />

                                            {onlineUsers.has(
                                                chatRoom.userId
                                            ) && (
                                                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>

                                        <div className="ml-2 flex-1 ">
                                            <div className="font-medium text-gray-900">
                                                {chatRoom.userName}
                                            </div>
                                            <div
                                                className={`${
                                                    chatRoom.isRead
                                                        ? "font-bold"
                                                        : "font-normal"
                                                } cursor-pointer`}
                                                style={{
                                                    maxWidth: "200px",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}>
                                                {typingUsers.has(
                                                    chatRoom.userId
                                                ) ? (
                                                    <div className="text-xs text-green-500">
                                                        typing...
                                                    </div>
                                                ) : (
                                                    <div>
                                                        {chatRoom.lastMessage}
                                                    </div>
                                                )}
                                            </div>

                                            {chatRoom.isOnline && (
                                                <div className="text-xs text-green-500 flex justify-end ">
                                                    Online
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 justify-center">
                                    Empty
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 h-[500px] mt-4 md:mt-0">
                    <div className="md:mt-6 border border-gray-200 rounded-lg shadow-md p-4 h-full flex flex-col">
                        {selectedUserDetails ? (
                            <div className="flex flex-col h-full">
                                <div className="flex items-center mb-4 p-2 border rounded-md border-violet-200">
                                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                                        <img
                                            src={
                                                selectedUserDetails.userImage ||
                                                photo
                                            }
                                            alt={selectedUserDetails.userName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold">
                                            {selectedUserDetails.userName}
                                        </p>

                                        {typingUsers.has(
                                            selectedUserDetails.userId
                                        ) ? (
                                            <p className="text-xs text-green-500">
                                                Typing...
                                            </p>
                                        ) : onlineUsers.has(
                                              selectedUserDetails.userId
                                          ) ? (
                                            <p className="text-xs text-green-500">
                                                Online
                                            </p>
                                        ) : null}
                                    </div>
                                </div>

                                <div
                                    className="flex flex-col space-y-4  overflow-y-scroll flex-grow scrollbar-hide"
                                    ref={messagesEndRef}>
                                    {messages && messages.length > 0 ? (
                                        messages.map((msg, msgIndex) => (
                                            <div
                                                key={msgIndex}
                                                className={`flex flex-col mb-4 ${
                                                    msg.senderId._id ===
                                                        userId ||
                                                    msg.senderId === userId
                                                        ? "items-end"
                                                        : "items-start"
                                                }`}>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    {formatTimestamp(
                                                        msg.createdAt
                                                    )}
                                                </p>
                                                <div
                                                    className={`max-w-xs ${
                                                        msg.senderId._id ===
                                                            userId ||
                                                        msg.senderId === userId
                                                            ? "bg-blue-200 text-right"
                                                            : "bg-gray-200 text-left"
                                                    } p-3 rounded-lg shadow`}
                                                    style={{
                                                        maxWidth: "200px",
                                                        wordBreak: "break-word",
                                                        overflowWrap:
                                                            "break-word",
                                                    }}>
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
                                </div>
                                <div className="pt-4 flex items-center space-x-4 border-t border-gray-200 w-full">
                                    <InputEmoji
                                        value={messageText}
                                        onChange={() =>
                                            handleTyping(
                                                currentChatRoomId,
                                                userId
                                            )
                                        }
                                        onEnter={handleOnEnter}
                                        placeholder="Type a message..."
                                        onBlur={() =>
                                            handleStopTyping(
                                                currentChatRoomId,
                                                userId
                                            )
                                        }
                                        cleanOnEnter
                                        shouldReturn
                                        shouldConvertEmojiToImage={false}
                                    />
                                    <button
                                        className="text-black rounded-lg"
                                        onClick={() =>
                                            handleSendMessage(
                                                messageText,
                                                currentChatRoomId
                                            )
                                        }>
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
        </div>
    );
};

export default UserChat;
