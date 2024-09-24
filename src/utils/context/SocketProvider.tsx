import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';

interface SocketContextType {
    socket: Socket | null;
    onlineUsers: Set<string>;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    onlineUsers: new Set(),
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const userId = useSelector((state: any) => state.user.userInfo?.user?._id || "");
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

    useEffect(() => {
        const newSocket = io('http://localhost:8000');
        
        if (userId) {
            newSocket.emit('register', userId);
            console.log(`User ${userId} registered with socket ID ${newSocket.id}`);
            
            newSocket.on('user-status', (data: { userId: string; isOnline: boolean }) => {
                console.log(`Received user-status update: ${data.userId} is ${data.isOnline ? 'online' : 'offline'}`);
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedOnlineUsers = new Set(prevOnlineUsers);
                    if (data.isOnline) {
                        updatedOnlineUsers.add(data.userId);
                    } else {
                        updatedOnlineUsers.delete(data.userId);
                    }
                    return updatedOnlineUsers;
                });
            });
            
        }

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
            newSocket.off('user-status');
        };
    }, [userId]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
