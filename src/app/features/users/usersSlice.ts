import { RootState } from "@/app/store";
import { defaultReqConfig } from "@/pages/api/preflight";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsers = createAsyncThunk("users/getAllUsers", async () => {
  const URI = "/api/getUsers";
  const response = await axios.get(URI, defaultReqConfig);
  return response.data;
});

const initialState: any = [];

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (_, action) => {
      const { users } = action.payload;
      return users;
    });
  },
});

export const selectAllUsers = (state: RootState) => state.users;

export default usersSlice.reducer;
