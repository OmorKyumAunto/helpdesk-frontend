import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { api } from "../api/api";
import modalSlice from "../slice/modalSlice";
import themeSlice from "../slice/themeSlice";
import { userApi } from "../api/userApi";
import userSlice from "../features/userSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [userApi.reducerPath]: userApi.reducer,
    themeSlice: themeSlice,
    modalSlice: modalSlice,
    userSlice: userSlice,
  },

  middleware: (defaultMiddleware) =>
    defaultMiddleware({ serializableCheck: false }).concat([
      api.middleware,
      userApi.middleware,
    ]),
  // preloadedState: { user: user() },
});
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
