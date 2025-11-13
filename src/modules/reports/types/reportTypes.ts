// features/reports/types/reportTypes.ts

// ==================== COMMON TYPES ====================
export interface IReportParams {
  limit?: number;
  offset?: number;
  unit?: number;
  title?: string;
  key?: string;
  unit_name?: string;
  start_date?: string;
  end_date?: string;
  start_purchase_date?: string;
  end_purchase_date?: string;
  category?: string | number[] | any;
  remarks?: string;
  user_id?: number;
  unit_id?: number;
  task_status?: string;
  from_date?: string;
  to_date?: string;
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

// ==================== ASSET REPORT TYPES ====================
export interface IAssetReportList {
  id: number;
  name: string;
  category: string;
  purchase_date: string;
  serial_number: string;
  po_number: string | null;
  price: number;
  unit_id: string | number;
  unit_name: string;
  model: string;
  specification: string;
  asset_no: string | null;
  remarks: string;
  location_id: number;
  status?: number;
  title?: string;
  location_name: string;
  department?: string;
  designation?: string;
  user_id_no?: string;
  user_name?: string;
  asset_created_name: string | null;
  asset_created_employee_id: string | null;
  asset_created_department: string | null;
  asset_created_designation: string | null;
  asset_created_contact_no: string | null;
  assign_by_name?: string;
  assign_by_employee_id?: string;
  assign_by_designation?: string;
  assign_by_contact_no?: string;
}

export interface IAssetReportQueryData {
  unit: number | null;
  title?: string;
  start_date: string | null;
  end_date: string | null;
  start_purchase_date: string | null;
  end_purchase_date: string | null;
  category: string | null;
  remarks: string | null;
  key: string | null;
  unit_name: string;
  employee_type?: string;
  report_generate_employee_name: string;
  report_generate_employee_id: string;
  report_generate_department: string;
  report_generate_designation: string;
  total_count: number;
}

export interface ICategoryData {
  total_laptop: number;
  total_desktop: number;
  total_monitor: number;
  accessories_count: number;
  tv_count: number;
  tab_count: number;
  projector_count: number;
  attendance_machine_count: number;
  speaker_count: number;
  scanner_count: number;
  camera_count: number;
  nvr_drv_count: number;
  ups_count: number;
  conference_system_count: number;
  firewall_count: number;
  core_router_count: number;
  access_point_count: number;
  server_count: number;
  network_rack_count: number;
  "24_port_switch_count": number;
  "48_port_switch_count": number;
  non_managable_switch_count: number;
  printer_count: number;
}

export interface IAssetReportResponse {
  success: boolean;
  status: number;
  message: string;
  count: number;
  data: IAssetReportList[];
  query_data: IAssetReportQueryData;
  category_data: ICategoryData[];
}

// ==================== TASK REPORT TYPES ====================
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
  key: string | null;
  start_date: string | null;
  end_date: string | null;
  user_id: number | null;
  task_status: string | null;
  unit_name: string;
  user_name: string | null;
  unit_id: number | null;
  overdue: string | null;
  report_generate_employee_name: string;
  report_generate_employee_id: string;
  report_generate_department: string;
  report_generate_designation: string;
  category_name: string[];
  total_count: number;
}

export interface ITaskReportResponse {
  success: boolean;
  status: number;
  message: string;
  count: number;
  data: ITaskReportList[];
  query_data: ITaskReportQueryData;
}

// ==================== COMBINE REPORT TYPES ====================
export interface ITicketTaskCount {
  total_ticket: number;
  total_task: number;
  total_ticket_task: number;
  ticket_overdue_count: number;
  task_overdue_count: number;
  total_ticket_task_overdue_count: number;
  in_time_ticket: number;
  in_time_task: number;
  total_ticket_time_sum: string;
  total_task_time_sum: string;
  total_ticket_task_time_sum: string;
  avg_ticket_time: string;
  avg_task_time: string;
  avg_ticket_task_time: string;
}

export interface ITicketTimeCalculation {
  total_ticket: number;
  total_ticket_sla_time_sum: string;
  total_ticket_sla_time_avg: string;
}

export interface ITaskTimeCalculation {
  total_task: number;
  total_task_sla_time_sum: string;
  total_task_sla_time_avg: string;
}

export interface ICombineReport {
  // Ticket & Task Counts
  total_ticket: number | string;
  total_task: number | string;
  total_ticket_task: number | string;

  // Average Times
  total_avg_ticket: string;
  total_avg_task: string;
  total_avg_ticket_task: string;
  avg_ticket_time: string;
  avg_task_time: string;
  avg_ticket_task_time: string;
  combine_avg_sla_time?: string;
  total_actual_time?: string;
  expected_work_time_8h_per_day?: string;
  avg_work_hours_per_day?: string;
  avg_work_hours_per_day_sla_wise?: string;

  // Dates
  from_date?: string;
  to_date?: string;

  // Assignment Info
  assigned_unit?: string;

  // Optional: previous ticket/task count breakdown
  ticket_task_count?: ITicketTaskCount;
  ticket_time_calculation?: ITicketTimeCalculation;
  task_time_calculation?: ITaskTimeCalculation;

  // Optional: other total summaries
  per_day_wise_work?: string;
  per_day_wise_sla?: string;
  total_working_day?: number;
  total_sla_sum?: string;
  total_work_sum?: string;
}

export interface ICombineReportQueryData {
  start_date: string | null;
  end_date: string | null;
  unit: number | string | null;
  unit_name: string | null;
  user_id: number | null;
  employee_name: string | null;
  employee_id: string | null;
  designation?: string;
  department?: string;
  admin_assign_unit_name?: string;
  admin_unit_name?: string;
  report_generate_employee_name: string;
  report_generate_employee_id: string;
  report_generate_department: string;
  report_generate_designation: string;
  total_count: number;
}

export interface ICombineReportResponse {
  success: boolean;
  status: number;
  message: string;
  count?: number;
  data: ICombineReport;
  query_data: ICombineReportQueryData;
}

// ==================== DEFAULT VALUES ====================
export const defaultCategoryData: ICategoryData = {
  total_laptop: 0,
  total_desktop: 0,
  total_monitor: 0,
  accessories_count: 0,
  tv_count: 0,
  tab_count: 0,
  projector_count: 0,
  attendance_machine_count: 0,
  speaker_count: 0,
  scanner_count: 0,
  camera_count: 0,
  nvr_drv_count: 0,
  ups_count: 0,
  conference_system_count: 0,
  firewall_count: 0,
  core_router_count: 0,
  access_point_count: 0,
  server_count: 0,
  network_rack_count: 0,
  "24_port_switch_count": 0,
  "48_port_switch_count": 0,
  non_managable_switch_count: 0,
  printer_count: 0,
};