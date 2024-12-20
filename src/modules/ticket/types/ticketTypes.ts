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
  ticket_created_employee_email: string;
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
  total_inprocess: number;
}
