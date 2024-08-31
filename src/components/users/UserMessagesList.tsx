import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/ReduxStore/store/store";
import { userAxiosInstance } from "../../utils/api/axiosInstance";
import { Link } from "react-router-dom";
import photo from "../../assets/th.jpeg";

interface Message {
  receiver: string;
  content: string;
  timestamp: string;
}

interface UserMessage {
  userId: string;
  userName: string;
  userImage: string;
  lastMessage: string;
  lastTimestamp: string;
  onlineStatus?: boolean;
}

const UserMessagesList: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo.user);
  const userId = userInfo._id!;
  const [userMessages, setUserMessages] = useState<UserMessage[]>([]);

  // useEffect(() => {
  //   const fetchUserMessages = async () => {
  //     try {
  //       const response = await userAxiosInstance.get(`/user-messages/${userId}`);
  //       if (response.status === 200) {
  //         console.log(response.data,'response')
  //         setUserMessages(response?.data?.message);
  //       } else {
  //         console.log("Internal Server error");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchUserMessages();
  // }, [userId]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-12 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
      <h2 className="text-center text-lg font-bold text-gray-600">
        Your Conversations
      </h2>
      <div className="mt-6 border border-gray-200 rounded-lg shadow-md p-4">
        <div className="flex flex-col space-y-4 max-h-96 overflow-y-auto">
          {userMessages.map((userMessage) => (
            <Link to={`/chat/${userMessage.userId}`} key={userMessage.userId}>
              <div className="flex flex-col sm:flex-row items-center mb-4 p-2 hover:bg-gray-100 rounded-lg">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 mb-2 sm:mb-0 sm:mr-4">
                  <img
                    src={userMessage.userImage || photo}
                    alt={userMessage.userName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xl font-bold">{userMessage.userName}</p>
                  <p className="text-sm text-gray-500">{userMessage.lastMessage}</p>
                  <p className="text-xs text-gray-400">
                    {formatDate(userMessage.lastTimestamp)} {formatTime(userMessage.lastTimestamp)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserMessagesList;
