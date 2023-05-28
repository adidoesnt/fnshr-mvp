import { RootState } from "@/app/store";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  points: 0,
  friends: [] as string[],
  admin: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setGlobalUser: (
      state,
      action: PayloadAction<{
        username: string;
        points: number;
        friends: string[];
        admin: boolean;
      }>
    ) => {
      const { username, points, friends, admin } = action.payload;
      state.username = username;
      state.points = points;
      state.friends = friends;
      state.admin = admin;
    },
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    clearGlobalUser: (state, action) => {
      state = initialState;
    },
    setPoints: (state, action) => {
      state.points = action.payload;
    },
  },
});

export const { setGlobalUser, setFriends, clearGlobalUser, setPoints } =
  userSlice.actions;

export const selectGlobalUser = (state: RootState) => state.user;

export default userSlice.reducer;
