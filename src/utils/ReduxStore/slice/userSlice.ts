import { createSlice } from "@reduxjs/toolkit";

const userInfoString = localStorage.getItem("userInfo");
const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

const userSlice = createSlice({
    name: "user",
    initialState: {
        userInfo: userInfo,
        isAuthenticated: !!userInfo,
        resetToken: null,
        isBlocked: false,
        onlineUsers: new Set<string>(),
    },

    reducers: {
        addUser: (state, action) => {
            state.userInfo = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
        },
        clearUser: (state) => {
            state.userInfo = {};
            state.isAuthenticated = false;
            localStorage.removeItem("userInfo");
        },
        setResetToken: (state, action) => {
            state.resetToken = action.payload;
        },
        clearResetToken: (state) => {
            state.resetToken = null;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = new Set(action.payload); 
        },
        updateOnlineUserStatus: (state, action) => {
            const { userId, isOnline } = action.payload;
            if (isOnline) {
                state.onlineUsers.add(userId);
            } else {
                state.onlineUsers.delete(userId);
            }
        },
    },
});

export const { addUser, clearUser, setResetToken, clearResetToken, setOnlineUsers, updateOnlineUserStatus  } = userSlice.actions;
export const userName = userSlice.name;
export default userSlice.reducer;
