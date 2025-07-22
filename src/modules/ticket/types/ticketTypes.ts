export interface IRaiseTicketList {
  id: number;
  unit_id: number;
  category_id: number;
  priority: string;
  subject: string;
  cc: string;
  description: string;
  attachment: string;
  status: number;
  ticket_status: string;
  ticket_id: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  asset_id: number;
  unit_name: string;
  serial_number: string;
  category_name: string;
  asset_name: string;
  asset_category: string;
  ticket_solved_employee_id: number;
  ticket_solved_employee_name: string;
  solved_employee_department: string;
  solved_employee_desiganation: string;
  solved_employee_email: string;
  solved_employee_contact_no: string;
  solved_employee_unit_name: string;
  created_employee_designation: string;
  created_employee_department: string;
  action_by_unit_name: string,
  action_by_contact_no: string,
  action_by_email: string,
  action_by_department: string,
  action_by_designation: string,
  action_by_name: string,
  action_by_employee_id: number,
  forward_details: string,
  forward_remarks: string,
  forward_date: string;
  response_time_value:number;
  response_time_unit:string;
  resolve_time_value:number;
  resolve_time_unit:string;
  is_re_raise: number;
  is_on_behalf: number;

}
export interface IAdminTicketList {
  user_id: number;
  
  employee_id: string;
  name: string;
  email: string;
  serial_number: string;
  asset_unit_id: number;
  asset_unit_title: string;
  ticket_category_id: number;
  ticket_category_title: string;
  ticket_table_id: number;
  asset_id: number;
  ticket_id: string;
  priority: string;
  subject: string;
  cc: string;
  description: string;
  attachment: string;
  ticket_status: string;
  ticket_created_by: number;
  ticket_created_at: string;
  ticket_updated_at: string;
  asset_name: string;
  asset_category: string;
  asset_serial_number: string;
  asset_purchase_date: string;
  ticket_created_employee_id: string;
  ticket_created_employee_name: string;
  created_employee_designation: string;
  created_employee_department: string;
  ticket_created_employee_email: string;
  ticket_solved_employee_id: number;
  ticket_solved_employee_name: string;
  solved_employee_department: string;
  solved_employee_designation: string;
  solved_employee_email: string;
  solved_employee_contact_no: string;
  solved_employee_unit_name: string;
  created_employee_contact_no: string;
  created_employee_unit_name: string;
  action_by_unit_name: string,
  action_by_contact_no: string,
  action_by_email: string,
  action_by_department: string,
  action_by_designation: string,
  action_by_name: string,
  action_by_employee_id: number,
  forward_details: string,
  forward_remarks: string,
  forward_date: string;
  response_time_value:number;
  response_time_unit:string;
  resolve_time_value:number;
  resolve_time_unit:string;
   is_re_raise: number;
  is_on_behalf: number;




}
export interface ICommentList {
  id: number;
  ticket_id: number;
  employee_id: string;
  admin_id: number;
  comment_text: string;
  is_edit: number;
  created_at: string;
  updated_at: string;
  user_name: string;
}
export interface ITicketDashboardCount {
  total_ticket: number;
  total_solve: number;
  total_unsolved: number;
  total_forward: number;
  total_inprogress: number;
  total_avg_time:number;
}
export interface ICategoryWiseDashboard {
  category_id: number;
  category_title: string;
  ticket_count: number;
  percentage: string;
}
export interface IRaiseSolvedDashboard {
  total_ticket: number;
  total_ticket_percent: number;
  total_solved: number;
  total_solved_percent: number;
  total_unsolved: number;
  total_unsolved_percent: number;
}
export interface IPriorityWiseDashboard {
  priority_high: number;
  priority_low: number;
  priority_medium: number;
  priority_urgent: number;
}
export interface IDashboardBarChart {
  month: string;
  total_solve: number;
  total_raise: number;
}
export interface ITicketDashboardReport {
  ticket_table_id: number;
  ticket_id: string;
  ticket_status: string;
  subject: string;
  priority: string;
  ticket_category_title: string;
  asset_serial_number: string;
  ticket_created_employee_name: string;
  ticket_created_employee_id: string;
  created_employee_designation: string;
  created_employee_department: string;
  ticket_solved_employee_name: string;
  ticket_solved_employee_id: string;
  solved_employee_department: string;
  solved_employee_desiganation: string;
  solved_employee_email: string;
  solved_employee_contact_no: string;
  solved_employee_unit_name: string;
  asset_unit_title: string;
  ticket_updated_at: Date;
  asset_unit_id: number;
  ticket_created_at: Date;
  
}
