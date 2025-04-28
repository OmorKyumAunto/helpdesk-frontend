export interface ILogHistory {
  id: number;
  status: string;
  operation_date: string;
  operation_time: string;
  operation_method: string;
  get_zing_data: number;
  total_update: number;
  total_add: number;
  created_at: string;
}
export interface ILogHistoryParams {
  offset?: number;
  limit?: number;
  from_date?: string;
  to_date?: string;
  status?: string;
  operation_method?: string;
}
