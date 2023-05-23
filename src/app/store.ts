import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/app/features/user/userSlice";
import tasksReducer from "@/app/features/tasks/tasksSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: tasksReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
