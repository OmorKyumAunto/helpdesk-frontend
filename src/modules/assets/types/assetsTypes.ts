/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IAsset {
  id: number;
  name: string;
  category: string;
  purchase_date: Date;
  serial_number: string;
  po_number: string;
  asset_no:string;
  specification: string;
  asset_history: string;
  is_assign: number;
  created_at: Date;
  status: number;
  remarks: string;
  unit_name: string;
  unit_id: string;
  location: number;
  location_name: string;
  designation:string;
  department:string;
  email:string;
  device_remarks:string;
  contact_no:string;
  employee_unit_name:string;
}
export interface IAssetDetails {
  id: number;
  name: string;
  category: string;
  purchase_date: Date;
  serial_number: string;
  po_number: string;
  asset_no:string;
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
  price: number;
  warranty: string;
  specification: string;
  location: number;
  location_name: string;
  device_remarks:string;
  history: History[];
  
}

export interface IAssetParams {
  limit?: number;
  offset?: number;
  key?: string;
  unit?: number | null;
  location?: number;
  type?: string;
  status?: number;
}

export interface IDistributedSingle {
  id: number;
  asset_name: string;
  category: string;
  purchase_date: string;
  serial_number: string;
  po_number: string;
  asset_no:string;
  asset_create_date: string;
  remarks: string;
  asset_unit_id: string;
  model: string;
  specification: string;
  asset_unit_name: string;
  employee_id: number;
  employee_name: string;
  user_id_no: string;
  designation: string;
  department: string;
  email: string;
  contact_no: string;
  joining_date: string;
  employee_unit_name: string;
  licenses: string;
  status: number;
  location: number;
  location_name: string;
  device_remarks:string;
  history: History[];
  
}

export interface History {
  id: number;
  history: string;
  status: number;
  created_at: string;
}
