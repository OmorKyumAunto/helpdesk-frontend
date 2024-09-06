export interface IUser {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  role_id: number;
  status: number;
  created_by: null | string;
  created_at: string;
  role: {
    role_id: number;
    role_name: string;
  };
  image: string;
  token: string;
}

export interface ILoginResponse<T> {
  success: boolean;
  data?: T;
  token?: string;
  message?: string;
  type?: string;
  status?: number;
}
