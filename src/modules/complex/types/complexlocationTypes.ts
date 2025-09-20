export interface IComplexLocation {
  id: number;
  name: string;
  unit_id: number;
  unit_name: string;
  status: number;
}
export interface ICreateComplexLocation {
  unit_id: number;
  name: string;
}
export interface IComplexLocationParams {
  limit?: number;
  offset?: number;
  id?: number;
  key?: string;
  unit_id?: number;
}
