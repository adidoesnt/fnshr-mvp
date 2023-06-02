import { RootState } from "@/app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { Notification } from "@/components/Notifications";

const initialState: Notification[] = [];

export const fetchNotifications = createAsyncThunk(
  "notifications/getAllNotifications",
  async () => {
    const URI = "/api/getNotifications";
    const response = await axios.get(URI);
    return response.data;
  }
);

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (_, action) => {
      const { notifications } = action.payload;
      return notifications;
    });
  },
});

export const selectAllNotifications = (state: RootState) => state.notifications;

export default notificationsSlice.reducer;
