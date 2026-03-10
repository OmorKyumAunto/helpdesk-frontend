// src/modules/announcements/types/announcementTypes.ts

export interface Announcement {
  id: number;
  title: string;
  description: string;
  announcement_date: string;
  break_time: string;
  unit_id: number;
  priority: "low" | "medium" | "high";
  unit_name: string;
  created_by_name: string;
  created_by_employee_id: string;
}

// Response structure from API
export interface AnnouncementListResponse {
  success: boolean;
  status: number;
  message: string;
  count: number;
  data: Announcement[];
}
