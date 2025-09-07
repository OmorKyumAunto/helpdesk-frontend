export interface IComplex {
  id: number;
  name: string;
  unit_id: number;
  unit_name: string;
  status: number;
}
export interface ICreateComplex {
  unit_id: number;
  name: string;
}
export interface IComplexParams {
  limit?: number;
  offset?: number;
  key?: string;
  id?: number;
  unit?: number | null;
  location?: number;
  type?: string;
  status?: number;
  from_date?: string;
  to_date?: string;
}
export interface IUserUnitBuildingResponse {
  searchAccess: {
    unit_id: number;
    unit_name: string;
  }[];
  seating_location: {
    seating_location_id: number;
    seating_location_name: string;
  }[];
  complex: {
    building_id: number;
    building_name: string;
  }[];
}
