export interface IReportParams {
  unit?: number;
  title?: string;
  unit_name?: string;
  start_date?: string;
  end_date?: string;
  category?: string;
  remarks?: string;
}

export interface IAssetReportList {
  id: number;
  name: string;
  category: string;
  purchase_date: string;
  serial_number: string;
  po_number: string;
  price: number;
  unit_id: number;
  unit_name: string;
  model: string;
  specification: string;
  asset_no: string;
  remarks: string;
  location_id: number;
  title: string;
  location_name: string;
}

export interface IAssetReportQueryData {
  unit: number;
  title: string;
  start_date: string;
  end_date: string;
  category: string;
  remarks: string;
  unit_name: string;
  total_count: number;
}

export interface IAssetReportResponse {
  data: IAssetReportList[];
  query_data: IAssetReportQueryData;
  count: number;
  message: string;
  status: number;
  success: boolean;
}

export interface IUnit {
  id: number;
  unit_id: number;
  unit_name: string;
  title: string;
  location: string;
  status: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}
