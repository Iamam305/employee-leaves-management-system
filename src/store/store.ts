import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./authSlice";
import membershipSlice from "./membershipSlice";
import organisationSlice from "./orgSlice";

const persistConfig = {
  key: "root",
  storage: storage,
};

interface RootState {
  auth: any;
  membership: any;
  organization:any
}

const rootReducer = combineReducers<RootState>({
  auth: authSlice,
  membership: membershipSlice,
  organization:organisationSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
persistStore(store);
export default store;
