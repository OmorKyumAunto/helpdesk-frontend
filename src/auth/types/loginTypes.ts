export interface IUser {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  role_id: number;
  status: boolean;
  created_by: null | string;
  created_at: string;
  role: string;
  image: string;
}

export interface ILoginResponse<T> {
  success: boolean;
  data?: T;
  token?: string;
  message?: string;
  type?: string;
  status?: number;
}
