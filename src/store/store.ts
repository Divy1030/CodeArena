import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";
import authReducer from "@/features/auth/slices/authSlice";
import duelReducer from "@/features/duel/slices/duelSlice";
import socialReducer from "./socialSlice";
import editorReducer from "./slices/editorSlice";
import problemReducer from "./slices/problemSlice";
import executionReducer from "./slices/executionSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"],
};

const duelPersistConfig = {
  key: "duel",
  storage,
  whitelist: ["roomId", "problemId", "roomStatus"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedDuelReducer = persistReducer(duelPersistConfig, duelReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    duel: persistedDuelReducer,
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