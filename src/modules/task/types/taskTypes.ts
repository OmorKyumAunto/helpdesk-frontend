export interface ITaskList {
  id: number;
  category_title: string;
  category_description: string;
  category_status: number;
  category_created_by: number;
  category_created_at: string;
  tasks: Task[];
}

export interface Task {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  task_status: string;
}
export interface PostTask {
  title: string;
  description?: string;
}
export interface ITaskItems {
  id: number;
  category_title: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  task_code: string;
  task_status: string;
  starred: number;
  created_at: string;
  updated_at: string;
  set_time: number;
  quantity: number;
  format: string;
  task_start_date: string;
  task_end_date: string;
  task_start_time: string;
  task_end_time: string;
  user_name: string;
  user_employee_id: string;
  assign_from_employee_id: string;
  assign_from_name: string;
}
export interface ISingleTask {
  id: number;
  description: string;
  start_date: string;
  start_time: string;
  sub_list_details: SubListDetail[];
  is_assign: number;
  user_id: number;
  task_code: string;
  assign_from_id: string;
  verify_to: string;
  is_verify: number;
  verify_remarks: string;
  task_status: string;
  is_forward: number;
  forward_from: string;
  forward_to: string;
  line_manager_id: string;
  task_categories_id: number;
  status: number;
  starred: number;
  task_start_date: string;
  task_end_date: string;
  task_start_time: string;
  task_end_time: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  updated_by: number;
  category_title: string;
  set_time: number;
  format: string;
  user_name: string;
  user_employee_id: number;
  assign_from_name: string;
  assign_from_employee_id: number;
  verify_to_name: string;
  verify_to_employee_id: number;
  forward_from_name: string;
  forward_from_employee_id: number;
  forward_to_name: string;
  forward_to_employee_id: number;
  line_manager_name: string;
  line_manager_employee_id: number;
  created_by_name: string;
  created_by_employee_id: number;
  asset_unit_ids: string;
}

export interface SubListDetail {
  id: number;
  title: string;
  is_checked: number;
}

export interface ITaskPost {
  description: string;
  category_title?: string;
  start_date: string;
  start_time: string;
  sub_list_selected: number[];
  is_assign?: number;
  user_id: number;
  task_categories_id: number;
}
export interface ITaskParams {
  limit?: number;
  offset?: number;
  key?: string;
  start_date?: string;
  end_date?: string;
  starred?: number;
  user_id?: number;
  unit_id?: number;
  task_status?: string;
  category?: number[];
}
export interface IDashboardDataCount {
  total_task: number;
  total_task_incomplete: number;
  total_task_complete: number;
  total_task_inprogress: number;
  avg_task_completion_time_seconds: number;
  total_overdue_tasks: number;
}
export interface IDashboardTaskPercentage {
  total_task: number;
  total_task_percent: number;
  total_complete: number;
  total_complete_percent: number;
  total_incomplete: number;
  total_incomplete_percent: number;
}
export interface IDashboardTodayTask {
  id: number;
  category_title: string;
  description: string;
  start_time: string;
  task_status: string;
  user_name: string;
  user_employee_id: string;
  task_code: string;
  sub_list_details: SubListDetail[];
}

export interface SubListDetail {
  id: number;
  title: string;
  is_checked: number;
}
export interface IDashboardBarChartData {
  month: string;
  name: string;
  totalTask: number;
  completeTask: number;
  incompleteTask: number;
}
export interface IDashboardCategoryWiseData {
  id: number;
  category_title: string;
  task_count: number;
  percentage: number;
}
