export interface IReportParams {
  unit?: number;
  title?: string;
  key?: string;
  unit_name?: string;
  start_date?: string;
  end_date?: string;
  category?: string | any;
  remarks?: string;
  user_id?: number;
  unit_id?: number;
  task_status?: string;
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
  department: string;
  designation: string;
  user_id_no: string;
  user_name: string;
  asset_created_name:string;
  asset_created_employee_id:string;
  asset_created_department:string;
  asset_created_designation:string;
  asset_created_contact_no:string;
}

export interface IAssetReportQueryData {
  unit: number;
  title: string;
  start_date: string;
  end_date: string;
  start_purchase_date:string;
  end_purchase_date:string;
  category: string;
  remarks: string;
  unit_name: string;
  employee_type: string;
  key: string;
  total_count: number;
  report_generate_designation: string;
  report_generate_department: string;
  report_generate_employee_id: string;
  report_generate_employee_name: string;
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
export interface ITaskReportList {
  id: number;
  task_categories_id: number;
  category_title: string;
  set_time: number;
  total_set_time: number;
  format: string;
  description: string;
  start_date: string;
  start_time: string;
  task_code: string;
  task_status: string;
  starred: number;
  task_start_date: string;
  task_end_date: string;
  task_start_time: string;
  task_end_time: string;
  quantity: number;
  user_id: number;
  user_name: string;
  user_employee_id: string;
  created_at: string;
  overdue: number;
}
export interface ITaskReportQueryData {
  key: string;
  start_date: string;
  end_date: string;
  user_id: number;
  task_status: string;
  unit_name: string;
  user_name: string;
  unit_id: number;
  overdue: string;
  report_generate_employee_name: string;
  report_generate_employee_id: string;
  report_generate_department: string;
  report_generate_designation: string;
  category_name: string[];
  total_count: number;
}
export interface ITaskReportResponse {
  data: ITaskReportList[];
  query_data: ITaskReportQueryData;
  count: number;
  message: string;
  status: number;
  success: boolean;
}
