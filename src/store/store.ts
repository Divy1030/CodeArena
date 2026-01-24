import { configureStore } from "@reduxjs/toolkit";
import socialReducer from "./socialSlice";
import editorReducer from "./slices/editorSlice";
import problemReducer from "./slices/problemSlice";
import executionReducer from "./slices/executionSlice";

export const store = configureStore({
  reducer: {
    social: socialReducer,
    editor: editorReducer,
    problem: problemReducer,
    execution: executionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;