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
   
  }
});

export const { addAdmin, clearAdmin } = adminSlice.actions;

export const adminName = adminSlice.name;
export default adminSlice.reducer;
