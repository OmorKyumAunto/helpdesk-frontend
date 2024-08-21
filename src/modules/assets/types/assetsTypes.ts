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
  is_assign: number;
  created_at: Date;
  status: number;
  remarks: string;
  unit_name: string;
  employee_id: number;
  assign_date: Date;
  employee_name: string;
  employee_id_no: string;
  employee_department: string;
  employee_designation: string;
  employee_unit: string;
  model: string;
  specification: string;
}

export interface IAssetParams {
  limit?: number;
  offset?: number;
  key?: string;
  unit?: string;
}
