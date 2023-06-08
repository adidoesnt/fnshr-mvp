import { RootState, store } from "@/app/store";
import { defaultReqConfig } from "@/pages/api/preflight";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  username: "",
  points: 0,
  friends: [] as string[],
  admin: false,
  customerID: ""
};

export const fetchGlobalUser = createAsyncThunk(
  "user/getUser",
  async (username: string) => {
    const URI = `/api/getUser?username=${username}`;
    const response = await axios.get(URI, defaultReqConfig);
    console.log(response.data);
    return response.data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
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
  extraReducers(builder) {
    builder.addCase(fetchGlobalUser.fulfilled, (state, action) => {
      console.log(action.payload.user);
      const { username, points, friends, admin, customerID } = action.payload.user;
      state.username = username;
      state.points = points;
      state.friends = friends;
      state.admin = admin;
      state.customerID = customerID;
    });
  },
});

export const { setFriends, clearGlobalUser, setPoints } = userSlice.actions;

export const selectGlobalUser = (state: RootState) => state.user;

export default userSlice.reducer;
