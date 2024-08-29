import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Genre {
   id: string;
   name: string;
   imageUrl: string;
}

interface User {
   _id: string;
   isBlocked: boolean;
}

interface AdminState {
  adminInfo: any;
  isAuthenticated: boolean;
  resetToken: string | null;
  genres: Genre[];
  users: User[];
}

const adminInfoString = localStorage.getItem('adminInfo');
const adminInfo = adminInfoString ? JSON.parse(adminInfoString) : null;

const initialState: AdminState = {
  adminInfo: adminInfo,
  isAuthenticated: !!adminInfo,
  resetToken: null,
  genres: [],
  users: [],
};

const updateLocalStorage = (state: AdminState) => {
  localStorage.setItem('adminInfo', JSON.stringify(state));
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    addAdmin: (state, action: PayloadAction<any>) => {
      state.adminInfo = { ...state.adminInfo, ...action.payload };
      state.isAuthenticated = true;
      updateLocalStorage(state);
    },
    clearAdmin: (state) => {
      state.adminInfo = {};
      state.isAuthenticated = false;
      state.resetToken = null;
      state.users = [];
      updateLocalStorage(state);
    },
    addGenre: (state, action: PayloadAction<Genre>) => {
      state.genres.push(action.payload);
      updateLocalStorage(state);
    },
    blockUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.map((user) =>
          user._id === action.payload ? { ...user, isBlocked: true } : user
      );
      updateLocalStorage(state);
    },
    unblockUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.map((user) =>
          user._id === action.payload ? { ...user, isBlocked: false } : user
      );
      updateLocalStorage(state);
    },
  }
});

export const { addAdmin, clearAdmin, addGenre, blockUser, unblockUser } = adminSlice.actions;

export const adminName = adminSlice.name;
export default adminSlice.reducer;
