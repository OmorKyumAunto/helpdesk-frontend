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
  created_by: number;
  created_at: string;
  updated_at: string;
  asset_id: number;
  unit_name: string;
  category_name: string;
  asset_name: string;
  asset_category: string;
}
