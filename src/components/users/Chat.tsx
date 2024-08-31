import React, { useState, useEffect,useRef } from "react";
import { FaPaperPlane, FaEnvelope } from "react-icons/fa";
import { useParams } from "react-router-dom";
import photo from "../../assets/th.jpeg";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/ReduxStore/store/store";
import { userAxiosInstance } from "../../utils/api/axiosInstance";
import { useSocket } from "../../utils/context/SocketProvider";

interface Message {
    senderId: string;
    userId: string;
    receiver: string;
    content: string;
    timestamp: string;
    createdAt: string;
    _id: String;
    messageId: string;
}

interface Receivers {
    chatRoomId: string;
    userId: string;
    userName: string;
    userImage: string;
    lastMessage: string;
    lastTimestamp: string;
    isOnline?: boolean;
}

const Chat: React.FC = () => {
    const { receiverId: paramUserId } = useParams<{ receiverId: string }>();
    const userInfo = useSelector(
        (state: RootState) => state?.user?.userInfo?.user
    );
    const userId = userInfo._id;
    const receiverId = paramUserId || "";

    const [chatRooms, setChatRooms] = useState<Receivers[]>([]);
    const [messages, setMessages] = useState<any[]>([]);

    const [messageText, setMessageText] = useState("");
    const [currentChatRoomId, setCurrentChatRoomId] = useState<string>("");
    const [selectedUserDetails, setSelectedUserDetails] = useState<{
        userId: string;
        userName: string;
        userImage: string;
    } | null>(null);

    const { socket, onlineUsers } = useSocket();
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (messagesEndRef.current) {
            console.log(messagesEndRef,'messagesEndRef')
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    

    useEffect(() => {
        const fetchReceivers = async () => {
            try {
                const response = await userAxiosInstance.get(
                    `/users-messages-list/${userId}`
                );

                console.log(response.data, "response data");
                const conversations = response.data.conversations;

                if (Array.isArray(conversations)) {
                    const chatRooms = conversations.map((chatRoom: any) => {
                        const isSender = chatRoom.senderId._id === userId;

                        const userDetails = isSender
                            ? chatRoom.receiverId
                            : chatRoom.senderId;

                            console.log(chatRoom,'cajt')
                        return {
                            chatRoomId: chatRoom._id,
                            userId: userDetails._id,
                            userName: userDetails.name,
                            userImage: userDetails.image,
                             lastMessage:chatRoom.messageId.length > 0
                        ? chatRoom.messageId[chatRoom.messageId.length - 1].content
                        : "No messages",
                          lastTimestamp: chatRoom.messageId.length > 0
                        ? chatRoom.messageId[chatRoom.messageId.length - 1].createdAt
                        : "",
                        };
                    });

                    setChatRooms(chatRooms);
                } else {
                    console.error(
                        "Expected conversations to be an array, got",
                        typeof conversations
                    );
                }
            } catch (error) {
                console.error("Error fetching conversations", error);
            }
        };

        fetchReceivers();
    }, [userId]);

    const handleUserClick = async (chatRoomId: string) => {
        try {
            const response = await userAxiosInstance.get(
                `/chat-room/${chatRoomId}`
            );

            const chat = response?.data?.chat;

            if (chat) {
                const { messages, senderId, receiverId } = chat;

                const isSender = senderId._id === userId;

                const userDetails = isSender ? receiverId : senderId;

                setMessages(messages);
                setSelectedUserDetails({
                    userId: userDetails._id,
                    userName: userDetails.name,
                    userImage: userDetails.image || photo,
                });
                setCurrentChatRoomId(chatRoomId);
            } else {
                console.error("Chat data is not available");
            }
        } catch (error) {
            console.error("Error fetching chat room:", error);
        }
    };
    useEffect(() => {
        if (socket) {
            console.log("Socket initialized");

            socket.on("receive-message", (message) => {
                console.log("Received message:", message);
                setMessages((prevMessages) => [...prevMessages, message]);
            });
           
            socket.on("user-status", ({ userId, isOnline }) => {
                setChatRooms((prevChatRooms) => {
                  const updatedChatRooms = prevChatRooms.map((chatRoom) => {
                    if (chatRoom.userId === userId) {
                      return { ...chatRoom, isOnline }; 
                    }
                    return chatRoom;
                  });
              
                  return updatedChatRooms;
                });
              });

            socket.on("user-offline", (userId: string) => {
                console.log(`User ${userId} is offline`);
                setChatRooms((prevChatRooms) =>
                    prevChatRooms.map((chatRoom) =>
                        chatRoom.userId === userId
                            ? { ...chatRoom, isOnline: false }
                            : chatRoom
                    )
                );
            });

            return () => {
                console.log("Cleaning up socket listeners");
                socket.off("receive-message");
                socket.off("user-online");
                socket.off("user-offline");
            };
        }
    }, [socket]);

    // useEffect(() => {
    //     if (socket) {
    //         console.log(socket, "sicet");
    //         socket.on("receive-message", (message) => {
    //             setMessages((prevMessages) => [...prevMessages, message]);
    //         });

    //         return () => {
    //             socket.off("receive-message");
    //         };
    //     }
    // }, [socket]);

    const handleSendMessage = async (
        messageText: string,
        chatRoomId: string
    ) => {
        if (!messageText.trim() || !selectedUserDetails) return;

        try {
            // console.log(userId,'userIdkkjk')
            // console.log(selectedUserDetails.userId,'receiverId')
            const data = {
                senderId: userId,
                receiverId: selectedUserDetails.userId,
                content: messageText,
                chatRoomId: chatRoomId,
            };

            const response = await userAxiosInstance.post(
                "/send-message",
                data
            );

            const chat = response?.data?.message;

            if (response.status === 200 && chat) {
                const newMessage = chat;
                if (socket) {
                    socket.emit("send-message", {
                        senderId: userId,
                        receiverId: selectedUserDetails.userId,
                        content: messageText,
                        chatRoomId: chatRoomId,
                    });
                }
                setMessages((prevMessages) => [...prevMessages, newMessage]);

                setMessageText("");
            } else {
                console.error("Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
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
            console.log("Error fetching messages:", error);
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
    
    

    return (
        <div className="mt-12 mx-auto w-full max-w-6xl flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
    {/* Chat Rooms List */}
    <div className="w-full md:w-1/2 h-[500px]">
        <h2 className="text-center text-lg font-bold text-gray-600">
            Your Conversations
        </h2>
        <div className="mt-6 border border-gray-200 rounded-lg shadow-md p-4 h-full">
            <div className="flex flex-col space-y-4 h-full overflow-y-auto">
                {chatRooms.length > 0 ? (
                    chatRooms.map((chatRoom) => (
                        <div
                            key={chatRoom.userId}
                            className="flex items-center mb-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                            onClick={() => handleUserClick(chatRoom.chatRoomId)}
                        >
                            <div className="w-16 h-16 rounded-full overflow-hidden mr-4 relative">
                                <img
                                    src={chatRoom.userImage || photo}
                                    alt={chatRoom.userName}
                                    className="w-full h-full object-cover"
                                />
                                {chatRoom.isOnline && (
                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                            </div>
                            <div>
                                <p className="text-xl font-bold">
                                    {chatRoom.userName}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {chatRoom.lastMessage}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">Empty</p>
                )}
            </div>
        </div>
    </div>

    {/* Chat Interface */}
    <div className="w-full md:w-1/2 h-[500px] mt-4 md:mt-0">
        <h2 className="text-center text-lg font-bold text-gray-600">
            You can chat and enquire about your books
        </h2>
        <div className="mt-6 border border-gray-200 rounded-lg shadow-md p-4 h-full flex flex-col">
            {selectedUserDetails ? (
                <div className="flex flex-col h-full">
                    <div className="flex items-center mb-4 p-2">
                        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                            <img
                                src={selectedUserDetails.userImage}
                                alt={selectedUserDetails.userName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-xl font-bold">
                                {selectedUserDetails.userName}
                            </p>
                        </div>
                    </div>

                    <div
                        className="flex flex-col space-y-4 overflow-y-auto flex-grow"
                        ref={messagesEndRef}
                    >
                        {messages && messages.length > 0 ? (
                            messages.map((msg, msgIndex) => (
                                <div
                                    key={msgIndex}
                                    className={`flex flex-col mb-4 ${
                                        msg.senderId._id === userId ||
                                        msg.senderId === userId
                                            ? "items-end"
                                            : "items-start"
                                    }`}
                                >
                                    <p className="text-xs text-gray-500 mb-1">
                                        {formatTimestamp(msg.createdAt)}
                                    </p>
                                    <div
                                        className={`max-w-xs ${
                                            msg.senderId._id === userId ||
                                            msg.senderId === userId
                                                ? "bg-blue-200 text-right"
                                                : "bg-gray-200 text-left"
                                        } p-3 rounded-lg shadow`}
                                    >
                                        <p className="text-sm">
                                            {msg.content}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Empty</p>
                        )}
                        <div ref={messagesEndRef} /> {/* Scroll to this element */}
                    </div>
                    <div className="pt-4 flex items-center space-x-4 border-t border-gray-200 w-full">
                        <input
                            type="text"
                            className="flex-grow p-2 border border-gray-300 rounded-lg"
                            placeholder="Type a message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSendMessage(messageText, currentChatRoomId);
                                }
                            }}
                        />
                        <button
                            className="text-black rounded-lg"
                            onClick={() => handleSendMessage(messageText, currentChatRoomId)}
                        >
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

//         <div className="mt-12 mx-auto w-full max-w-6xl flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
//             <div className="w-full md:w-1/2 h-[500px]">
//                 <h2 className="text-center text-lg font-bold text-gray-600">
//                     Your Conversations
//                 </h2>
//                 <div className="mt-6 border border-gray-200 rounded-lg shadow-md p-4 h-full">
//                     <div className="flex flex-col space-y-4 max-h-full overflow-y-auto">
//                         {chatRooms.length > 0 ? (
//                             chatRooms.map((chatRoom) => (
//                                 <div
//                                     key={chatRoom.userId}
//                                     className="flex items-center mb-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
//                                     onClick={() =>
//                                         handleUserClick(chatRoom.chatRoomId)
//                                     }>
//                                     <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
//                                         <img
//                                             src={chatRoom.userImage || photo}
//                                             alt={chatRoom.userName}
//                                             className="w-full h-full object-cover"
//                                         />
//                                         {chatRoom.isOnline && (
//                                             <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//                                         )}
//                                     </div>
//                                     <div>
//                                         <p className="text-xl font-bold">
//                                             {chatRoom.userName}
//                                         </p>
//                                         <p className="text-sm text-gray-500">
//                                             {chatRoom.lastMessage}
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))
//                         ) : (
//                             <p className="text-center text-gray-500">Empty</p>
//                         )}
//                     </div>
//                 </div>
//             </div>
//             <div className="w-full md:w-1/2 h-[500px] mt-4 md:mt-0">
//     <h2 className="text-center text-lg font-bold text-gray-600">
//         You can chat and enquire about your books
//     </h2>
//     <div className="mt-6 border border-gray-200 rounded-lg shadow-md p-4 h-full flex flex-col">
//         {selectedUserDetails ? (
//             <div className="flex flex-col justify-between h-full w-full">
//                 <div className="flex items-center mb-4 p-2">
//                     <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
//                         <img
//                             src={selectedUserDetails.userImage}
//                             alt={selectedUserDetails.userName}
//                             className="w-full h-full object-cover"
//                         />
//                     </div>
//                     <div>
//                         <p className="text-xl font-bold">
//                             {selectedUserDetails.userName}
//                         </p>
//                     </div>
//                 </div>

//                 <div
//                     className="flex flex-col space-y-4 overflow-y-auto w-full flex-grow"
//                     ref={messagesEndRef}
//                 >
//                     {messages && messages.length > 0 ? (
//                         messages.map((msg, msgIndex) => (
//                             <div
//                                 key={msgIndex}
//                                 className={`flex flex-col mb-4 ${
//                                     msg.senderId._id === userId ||
//                                     msg.senderId === userId
//                                         ? "items-end"
//                                         : "items-start"
//                                 }`}
//                             >
//                                 <p className="text-xs text-gray-500 mb-1">
//                                     {formatTimestamp(msg.createdAt)}
//                                 </p>
//                                 <div
//                                     className={`max-w-xs ${
//                                         msg.senderId._id === userId ||
//                                         msg.senderId === userId
//                                             ? "bg-blue-200 text-right"
//                                             : "bg-gray-200 text-left"
//                                     } p-3 rounded-lg shadow`}
//                                 >
//                                     <p className="text-sm">
//                                         {msg.content}
//                                     </p>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <p>Empty</p>
//                     )}
//                 </div>
//                 <div className="pt-4 flex items-center space-x-4 border-t border-gray-200 w-full">
//                     <input
//                         type="text"
//                         className="flex-grow p-2 border border-gray-300 rounded-lg"
//                         placeholder="Type a message..."
//                         value={messageText}
//                         onChange={(e) => setMessageText(e.target.value)}
//                         onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                                 handleSendMessage(messageText, currentChatRoomId);
//                             }
//                         }}
//                     />
//                     <button
//                         className="text-black rounded-lg"
//                         onClick={() =>
//                             handleSendMessage(messageText, currentChatRoomId)
//                         }
//                     >
//                         <FaPaperPlane className="text-2xl" />
//                     </button>
//                 </div>
//             </div>
//         ) : (
//             <div className="flex flex-col items-center justify-center h-full text-gray-400">
//                 <p className="text-lg">Your messages</p>
//                 <FaEnvelope className="text-4xl mt-2" />
//             </div>
//         )}
//     </div>
// </div>

//         </div>
    );
};

export default Chat;
