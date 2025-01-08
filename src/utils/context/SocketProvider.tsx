import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import config from "../../config/config";

interface SocketContextType {
    socket: Socket | null;
    onlineUsers: Set<string>;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    onlineUsers: new Set(),
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const userId = useSelector(
        (state: any) => state.user.userInfo?.user?._id || ""
    );
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!userId) {
            return;  
        }
        const newSocket = io(config.API_BACKEND);

        if (userId) {
            newSocket.emit("register", userId);
        }

        newSocket.on(
            "user-status",
            (data: { userId: string; status: "online" | "offline" }) => {
                setOnlineUsers((prev) => {
                    const updatedUsers = new Set(prev);
                    if (data.status === "online") {
                        updatedUsers.add(data.userId);
                    } else {
                        updatedUsers.delete(data.userId);
                    }
                    return updatedUsers;
                });
            }
        );

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
            newSocket.off("user-status");
        };
    }, [userId]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
