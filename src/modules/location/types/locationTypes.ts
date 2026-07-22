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
  // number = a single unit; string = comma-separated unit ids (used to scope
  // a Unit Super Admin to only the units in their searchAccess).
  unit?: number | string;
}
