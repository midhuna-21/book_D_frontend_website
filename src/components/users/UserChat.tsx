
// import React, { useState, useEffect, useRef } from "react";
// import { FaPaperPlane, FaEnvelope } from "react-icons/fa";
// import photo from "../../assets/th.jpeg";
// import { useSelector } from "react-redux";
// import { RootState } from "../../utils/ReduxStore/store/store";
// import { userAxiosInstance } from "../../utils/api/userAxiosInstance";
// import { useSocket } from "../../utils/context/SocketProvider";
// import InputEmoji from "react-input-emoji";

// interface Receivers {
//     chatRoomId: string;
//     userId: string;
//     userName: string;
//     userImage: string;
//     lastMessage: string;
//     lastTimestamp: string;
//     isOnline?: boolean;
//     isRead: boolean;
// }

// const UserChat: React.FC = () => {
//     const userInfo = useSelector(
//         (state: RootState) => state?.user?.userInfo?.user
//     );
//     const userId = userInfo._id;
//     const [messages, setMessages] = useState<any[]>([]);

//     const [messageText, setMessageText] = useState("");
//     const [currentChatRoomId, setCurrentChatRoomId] = useState<string>("");

//     const [selectedUserDetails, setSelectedUserDetails] = useState<{
//         userId: string;
//         userName: string;
//         userImage: string;
//     } | null>(null);

//     const { socket } = useSocket();
//     const messagesEndRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         if (messagesEndRef.current) {
            
//             messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//         }
//     }, [messages]);

//     useEffect(() => {
//         if (socket) {
//             socket.on("receive-message", (message) => {
//                 setMessages((prevMessages) => [...prevMessages, message]);
//             });

//             socket.on("user-status", ({ userId, isOnline }) => {
//                 setChatRooms((prevChatRooms) => {
//                     const updatedChatRooms = prevChatRooms.map((chatRoom) => {
//                         if (chatRoom.userId === userId) {
//                             return { ...chatRoom, isOnline };
//                         }
//                         return chatRoom;
//                     });

//                     return updatedChatRooms;
//                 });
//             });

//             socket.on("user-offline", (userId: string) => {
//                 setChatRooms((prevChatRooms) =>
//                     prevChatRooms.map((chatRoom) =>
//                         chatRoom.userId === userId
//                             ? { ...chatRoom, isOnline: false }
//                             : chatRoom
//                     )
//                 );
//             });

//             return () => {
//                 socket.off("receive-message");
//                 socket.off("user-online");
//                 socket.off("user-offline");
//             };
//         }
//     }, [socket]);

//     const handleSendMessage = async (
//         messageText: string,
//         chatRoomId: string
//     ) => {
//         if (!messageText.trim() || !selectedUserDetails) return;

//         try {
//             const data = {
//                 senderId: userId,
//                 receiverId: selectedUserDetails.userId,
//                 content: messageText,
//                 chatRoomId: chatRoomId,
//             };

//             const response = await userAxiosInstance.post(
//                 "/send-message",
//                 data
//             );
//             const chat = response?.data?.message;

//             if (response.status === 200 && chat) {
//                 if (socket) {
//                     socket.emit("send-message", {
//                         senderId: userId,
//                         receiverId: selectedUserDetails.userId,
//                         content: messageText,
//                         chatRoomId: chatRoomId,
//                     });
//                 }

//                 setMessageText("");
//             } else {
//                 console.error("Failed to send message");
//             }
//         } catch (error) {
//             console.error("Error sending message:", error);
//         }
//     };

//     const fetchMessages = async (chatRoomId: string) => {
//         try {
//             const response = await userAxiosInstance.get(
//                 `/messages/${chatRoomId}`
//             );
//             const fetchedMessages = response?.data?.messages?.messageId || [];

//             setMessages(fetchedMessages);
//         } catch (error: any) {
//             console.log("Error fetching messages:", error);
//         }
//     };
//     useEffect(() => {
//         if (currentChatRoomId) {
//             fetchMessages(currentChatRoomId);
//         }
//     }, [currentChatRoomId]);

//     const formatTimestamp = (timestamp: string) => {
//         const now = new Date();
//         const messageDate = new Date(timestamp);
//         const diff = now.getTime() - messageDate.getTime();
//         const diffMinutes = Math.floor(diff / (1000 * 60));

//         if (diffMinutes < 1) {
//             return "Just now";
//         } else if (diffMinutes < 60) {
//             return `${diffMinutes} minutes ago`;
//         } else if (diffMinutes < 1440) {
//             return `${Math.floor(diffMinutes / 60)} hours ago`;
//         } else {
//             const month = messageDate.getMonth() + 1;
//             const day = messageDate.getDate();
//             const year = messageDate.getFullYear();
//             return `${month}/${day}/${year}`;
//         }
//     };
//     const handleOnEnter = (text: string) => {
//         handleSendMessage(text, currentChatRoomId);
//         setMessageText("");
//     };

//     return (
//         <div className="mt-12 mx-auto w-full max-w-6xl flex flex-col md:flex-col space-y-8 md:space-y-0 md:space-x-8 mb-20">  
//             <div className="flex flex-col md:flex-row gap-6">
//                 <div className="w-full md:w-1/2 h-[500px] mt-4 md:mt-0">
//                     <div className="md:mt-6 border border-gray-200 rounded-lg shadow-md p-4 h-full flex flex-col">
//                         {selectedUserDetails ? (
//                             <div className="flex flex-col h-full">
//                                 <div className="flex items-center mb-4 p-2">
//                                     <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
//                                         <img
//                                             src={
//                                                 selectedUserDetails.userImage ||
//                                                 photo
//                                             }
//                                             alt={selectedUserDetails.userName}
//                                             className="w-full h-full object-cover"
//                                         />
//                                     </div>
//                                     <div>
//                                         <p className="text-xl font-bold">
//                                             {selectedUserDetails.userName}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div
//                                     className="flex flex-col space-y-4  overflow-y-scroll flex-grow scrollbar-hide"
                                    
//                                 >
//                                     {messages && messages.length > 0 ? (
//                                         messages.map((msg, msgIndex) => (
//                                             <div
//                                                 key={msgIndex}
//                                                 className={`flex flex-col mb-4 ${
//                                                     msg.senderId._id ===
//                                                         userId ||
//                                                     msg.senderId === userId
//                                                         ? "items-end"
//                                                         : "items-start"
//                                                 }`}>
//                                                 <p className="text-xs text-gray-500 mb-1">
//                                                     {formatTimestamp(
//                                                         msg.createdAt
//                                                     )}
//                                                 </p>
//                                                 <div
//                                                     className={`max-w-xs ${
//                                                         msg.senderId._id ===
//                                                             userId ||
//                                                         msg.senderId === userId
//                                                             ? "bg-blue-200 text-right"
//                                                             : "bg-gray-200 text-left"
//                                                     } p-3 rounded-lg shadow`}
//                                                     style={{
//                                                         maxWidth: "200px",
//                                                         wordBreak: "break-word",
//                                                         overflowWrap:
//                                                             "break-word",
//                                                     }}>
//                                                     <p className="text-sm">
//                                                         {msg.content}
//                                                     </p>
//                                                 </div>
//                                                 <div ref={messagesEndRef} />     
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <p className="text-center text-gray-500">
//                                             Empty
//                                         </p>
//                                     )}
//                                 </div>
//                                 <div className="pt-4 flex items-center space-x-4 border-t border-gray-200 w-full">
//                                     <InputEmoji
//                                         value={messageText}
//                                         onChange={setMessageText}
//                                         onEnter={handleOnEnter}
//                                         placeholder="Type a message..."
//                                         cleanOnEnter
//                                         shouldReturn
//                                         shouldConvertEmojiToImage={false}
//                                     />
//                                     <button
//                                         className="text-black rounded-lg"
//                                         onClick={() =>
//                                             handleSendMessage(
//                                                 messageText,
//                                                 currentChatRoomId
//                                             )
//                                         }>
//                                         <FaPaperPlane className="text-2xl" />
//                                     </button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="flex flex-col items-center justify-center h-full text-gray-400">
//                                 <p className="text-lg">Your messages</p>
//                                 <FaEnvelope className="text-4xl mt-2" />
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserChat;
