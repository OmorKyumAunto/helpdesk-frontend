import { Dispatch, SetStateAction } from "react";
export interface HTTPResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
}

export type ISetState<T> = Dispatch<SetStateAction<T>>;

// export type TSetNull =
//   | ISetState<ICategoryDataType | null>
//   | ISetState<any | null>
//   | ISetState<any | null>;

export type TSetNull = ISetState<any | null> | ISetState<any | null>;
