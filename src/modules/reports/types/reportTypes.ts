// types/reportTypes.ts
export interface IAssetReport {
  id: number;
  name: string;
  category: string;
  purchase_date: string;
  serial_number: string;
  po_number: string | null;
  price: number;
  unit_id: number;  // Change this from string to number
  unit_name: string;
  model: string;
  specification: string;
  asset_no: string | null;
  remarks: string;
  location_id: number;
  title:string;
  location_name: string;
}

export interface IAssetReportParams {
  unit?: number;
  title?:string;
  unit_name?: string;
  start_date?: string | null;
  end_date?: string | null;
  category?: string | string[];  // Allow both single and multiple values
  remarks?: string | null;
  [key: string]: any;
}

export interface IAssetReportQueryData {
  unit: number;
  title:string;
  start_date: string | null;
  end_date: string | null;
  category: string;
  remarks: string | null;
  unit_name: string;
  total_count: number;
}

export interface IAssetReportResponse {
  data: IAssetReport[];
  query_data: IAssetReportQueryData;
  count: number;
  message: string;
  status: number;
  success: boolean;
}

// ✅ New type for active unit list
export interface IUnit {
  id: number;
  unit_id: number;
  unit_name: string;
  title:string;
  location: string;
  status: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}
