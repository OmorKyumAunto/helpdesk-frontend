/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IAsset {
  id: number;
  name: string;
  category: string;
  purchase_date: Date;
  serial_number: string;
  po_number: string;
  asset_history: string;
  is_assign: number;
  created_at: Date;
  status: number;
  remarks: string;
  unit_name: string;
}
export interface IAssetDetails {
  id: number;
  name: string;
  category: string;
  purchase_date: Date;
  serial_number: string;
  po_number: string;
  asset_history: string;
  licenses: string;
  is_assign: number;
  created_at: Date;
  status: number;
  remarks: string;
  unit_name: string;
  unit_id: string;
  user_id: number;
  assign_date: Date;
  employee_name: string;
  employee_id_no: string;
  employee_department: string;
  employee_designation: string;
  employee_unit: string;
  model: string;
  specification: string;
  history: History[];
}

export interface IAssetParams {
  limit?: number;
  offset?: number;
  key?: string;
  unit?: string;
  type?: string;
}

export interface IDistributedSingle {
  id: number;
  asset_name: string;
  category: string;
  purchase_date: string;
  serial_number: string;
  po_number: string;
  asset_create_date: string;
  remarks: string;
  asset_unit_id: string;
  model: string;
  specification: string;
  asset_unit_name: string;
  employee_id: number;
  employee_name: string;
  employee_id_no: string;
  designation: string;
  department: string;
  email: string;
  contact_no: string;
  joining_date: string;
  employee_unit_name: string;
  licenses: string;
  status: number;
  history: History[];
}

export interface History {
  id: number;
  history: string;
  status: number;
  created_at: string;
}
