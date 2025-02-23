export interface ISLAConfig {
  id: number;
  priority: string;
  response_time_unit: string;
  resolve_time_unit: string;
  response_time_value: number; // ✅ This must exist at the top level
  resolve_time_value: number; // ✅ This must exist at the top level
  response: {
    time: number;
    unit: string;
  };
  resolve: {
    time: number;
    unit: string;
  };
}
