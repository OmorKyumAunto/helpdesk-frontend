export interface IUser {
  id: number;
  profile_id: number;
  name: string;
  employee_id: string;
  email: string;
  contact_no: string;
  department: string;
  designation: string;
  joining_date: string;
  unit_name: string;
  role_id: number;
  status: number;
  created_by: null | string;
  created_at: string;
  total_assign_asset: number;
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
