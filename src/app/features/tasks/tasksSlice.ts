import { RootState } from "@/app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTasks = createAsyncThunk("tasks/getAllTasks", async () => {
  const URI = "/api/getTasks";
  const response = await axios.get(URI);
  return response.data;
});

const initialState: any = [];

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchTasks.fulfilled, (_, action) => {
      const { tasks } = action.payload;
      return tasks;
    });
  },
});

export const selectAllTasks = (state: RootState) => state.tasks;

export default tasksSlice.reducer;
