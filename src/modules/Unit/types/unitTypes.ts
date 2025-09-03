export interface IUnit {
  building: any;
  id: number;
  title: string;
  status: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
}
export interface IUnitWiseAdminList {
  id: number;
  title: string;
  user_list: UserList[];
}

export interface UserList {
  user_id: number;
  name: string;
  employee_id: string;
}
