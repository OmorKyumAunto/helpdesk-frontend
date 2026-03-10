export type EmployeeId = string;

export interface IConversation {
  conversation_id: number;
  updated_at: string;
  other_employee_id: string;
  other_name?: string | null;
  other_email?: string | null;
  last_message?: string | null;
  last_message_at?: string | null;
  unread_count?: number; // ✅
  archived_at?: string | null;
}

export interface IMessage {
  id: number;
  conversation_id: number;
  sender_employee_id: string;
  sender_name?: string | null;
  message: string;
  created_at: string;
archived_at?: string | null;
  delivered_at?: string | null;
  read_at?: string | null;
}

export interface CreateDmRequest {
  toEmployeeId: EmployeeId;
}

export interface CreateDmResponse {
  success: boolean;
  conversationId: number;
}