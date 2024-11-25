export interface ILocation {
  id: number;
  location: string;
  unit_id: number;
  unit_name: string;
  status: number;
}
export interface ICreateLocation {
  unit_id: number;
  location: string;
}
export interface ILocationParams {
  limit?: number;
  offset?: number;
  key?: string;
}
