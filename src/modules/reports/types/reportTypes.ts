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
  total_ticket: number | string; // "Total Ticket Solved"
  total_task: number | string; // "Total Task Completed"
  total_ticket_task: number | string; // "Total Ticket and Task Solved"

  // Average Times
  avg_ticket_time: string; // "Average Ticket Time"
  avg_task_time: string; // "Average Task Time"
  avg_ticket_task_time: string; // "Total Average Time"
  combine_avg_sla_time: string; // "SLA Maintained Time"
  total_actual_time: string; // "Actual Time Taken"
  expected_work_time_8h_per_day: string; // "Expected Time"
  avg_work_hours_per_day: string; // "Avg Work Time Per Day"
  avg_work_hours_per_day_sla_wise: string; // "Avg SLA Work Time Per Day"

  // Dates
  from_date: string; // "From Date"
  to_date: string; // "To Date"

  // Assignment Info
  assigned_unit: string; // "Assigned Unit"

  // Optional: previous ticket/task count breakdown if you still need
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
  unit: number | null;
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
  data: ICombineReport;
  query_data: ICombineReportQueryData;
  message: string;
  status: number;
  success: boolean;
  count?: number;
}
