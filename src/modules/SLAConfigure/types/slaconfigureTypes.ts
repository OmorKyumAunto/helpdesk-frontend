export interface ISLAConfig {
  id: number;
  priority: string;
  response_time_unit: string;
  resolve_time_unit: string;
  response_time_value: number; // ✅ This must exist at the top level
  resolve_time_value: number; // ✅ This must exist at the top level
  response: ISLAValue;
  resolve: ISLAValue;
}
export interface ISLAValue {
  time: number;
  unit: string;
  response_time_value?: number | undefined;
  resolve_time_value?: number | undefined;
}
