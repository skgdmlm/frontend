import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getItemLocalStorage } from '../../utils/functions';
import { TokenType } from '../../utils/enums';

// Define a type for the slice state
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user?: UserProfileData | null;
}

// Define the initial state using that type
const initialState: AuthState = {
  accessToken: getItemLocalStorage(TokenType.ACCESS_TOKEN),
  refreshToken: getItemLocalStorage(TokenType.REFRESH_TOKEN),
  isAuthenticated: false,
  loading: true,
  user: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.loading = action.payload.loading;
    },
    removeUser: (state) => {
      state.user = undefined;
    },
    setUser: (state, action: PayloadAction<{ user: UserProfileData }>) => {
      state.user = action.payload.user;
    },
    updateUser: (state, action: PayloadAction<UserProfileData>) => {
      if (state.user) {
        state.user = action.payload;
      }
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    resetTokens: (state) => {
      state.accessToken = '';
      state.refreshToken = '';
      state.isAuthenticated = false;
    },
  },
});

export const { setLoading, setTokens, resetTokens, setUser, removeUser, updateUser } = authSlice.actions;

export default authSlice.reducer;
