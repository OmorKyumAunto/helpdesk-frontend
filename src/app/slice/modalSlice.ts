/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { ReactNode } from "react";

interface IError {
  message: string;
  type: string;
}

interface ICommonModalState {
  title?: any;
  content?: ReactNode;
  show?: boolean;
  width?: number | string;
}
interface IState {
  error: IError | null;
  isModal: boolean;
  modalLoading: boolean;
  defaultLoading: boolean;
  title: any;
  content: ReactNode;
  show: boolean;
  width: number | string;
}

const initialState: IState = {
  error: null,
  isModal: false,
  modalLoading: false,
  defaultLoading: false,
  title: {} || "",
  content: null,
  show: false,
  width: "",
};

const modalSlice = createSlice({
  name: "modal_slice",
  initialState,
  reducers: {
    setError(state, action: PayloadAction<IError>) {
      state.error = action.payload;
    },

    setModal(state, action: PayloadAction<boolean>) {
      state.isModal = action.payload;
    },

    setCommonModal(
      state,
      action: PayloadAction<ICommonModalState | undefined>
    ) {
      const { title, content, show, width } =
        action.payload || ({} as ICommonModalState);
      state.title = title;
      state.content = content || null;
      state.show = show || false;
      state.width = width || 678;
    },

    setModalSub(state, action: PayloadAction<boolean>) {
      state.isModal = action.payload;
    },

    setModalLoading(state, action: PayloadAction<boolean>) {
      state.modalLoading = action.payload;
    },

    setDefaultLoading(state, action: PayloadAction<boolean>) {
      state.defaultLoading = action.payload;
    },
  },
});

export const {
  setError,
  setCommonModal,
  setModalLoading,
  setDefaultLoading,
  setModal,
} = modalSlice.actions;

export const modalCommon = (state: RootState) => state.modalSlice;

export default modalSlice.reducer;
