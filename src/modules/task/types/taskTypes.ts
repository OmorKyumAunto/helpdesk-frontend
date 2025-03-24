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
  format: string;
}
export interface ITaskPost {
  description: string;
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
  category?: number[];
}
export interface IDashboardDataCount {
  total_task: number;
  total_task_incomplete: number;
  total_task_complete: number;
  total_task_inprogress: number;
  avg_task_completion_time_seconds: number;
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
