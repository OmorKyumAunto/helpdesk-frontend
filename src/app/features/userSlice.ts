import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../auth/types/loginTypes";
import { RootState } from "../store/store";
import { TOKEN } from "../../helper/constant";

const storedUser = localStorage.getItem(TOKEN);
const id = localStorage.getItem("roleID");
interface IUserState {
  user: IUser | null;
  token: string | null;
  roleId: number | null;
}

const initialState: IUserState = {
  user: null,
  token: storedUser ? storedUser : null,
  roleId: id ? Number(id) : null,
};

export const userSlice = createSlice({
  initialState,
  name: "userSlice",
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      localStorage.setItem(TOKEN, action.payload);
      state.token = action.payload;
    },
    setRoleId: (state, action: PayloadAction<number>) => {
      localStorage.setItem("roleID", String(action.payload));
      state.roleId = action.payload;
    },
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    setLogout: (state) => {
      // console.log("logout called");
      localStorage.removeItem(TOKEN);
      localStorage.removeItem("roleID");
      state.user = null;
      state.token = null;
      state.roleId = null;
    },
  },
});

export default userSlice.reducer;

export const { setUser, setToken, setLogout, setRoleId } = userSlice.actions;

export const selectUser = (state: RootState) => state.userSlice;
