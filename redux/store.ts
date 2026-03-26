import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // Defaults to localStorage
import userReducer from "./features/userSlice";
import subDataReducer from "./features/useSubData"
import payDataReducer from "./features/usePayData"
import promptSliceReducer from "./features/promptSlice"
import subscriptionsReducer from "./features/subSlice"
import newSubscriptionReducer from "./features/getSubSlice"

import storage from "@/lib/storage";

// ✅ Combine Reducers
const rootReducer = combineReducers({
  user: userReducer,
  subData: subDataReducer,
  payData: payDataReducer,
  promptSlice: promptSliceReducer,
  subscriptions: subscriptionsReducer,
  newSubscription: newSubscriptionReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "subData", "payData", "subscriptions"], // promptSlice removed to ensure fresh fetch
};

// ✅ Apply `persistReducer` to the full `rootReducer`
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // ✅ Using the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/PURGE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;