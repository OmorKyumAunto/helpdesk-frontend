import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../auth/types/loginTypes";
import { RootState } from "../store/store";
import { TOKEN } from "../../helper/constant";

const storedUser = localStorage.getItem(TOKEN);
interface IUserState {
  user: IUser | null;
  token: string | null;
}

const initialState: IUserState = {
  user: null,
  token: storedUser ? storedUser : null,
};

export const userSlice = createSlice({
  initialState,
  name: "userSlice",
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      localStorage.setItem(TOKEN, action.payload);
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    setLogout: (state) => {
      // console.log('logout called');
      localStorage.removeItem(TOKEN);
      state.user = null;
      state.token = null;
    },
  },
});

export default userSlice.reducer;

export const { setUser, setToken, setLogout } = userSlice.actions;

export const selectUser = (state: RootState) => state.userSlice;
