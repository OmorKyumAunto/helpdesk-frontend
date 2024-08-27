export interface IViewDashboard {
  total_member: {
    total_pending: string;
    total_active: string;
    total_inactive: string;
  };
}
export interface IDashboardGraphData {
  month: string;
  total_assign_asset: number;
  total_asset: number;
}
export interface IDashboardCalenderData {
  id: number;
  title: string;
  color: string;
  start_date: string;
  end_date: string;
  created_at: string;
  status: string;
  type: string;
  date: string;
  time: string;
  application_name: string;
  application_id: number;
}
export interface INotification {
  id: number;
  member_id: number;
  notification_type: string;
  related_id: number;
  message: string;
  read_status: boolean;
  created_at: string;
}
