export interface ITaskCategoryList {
  id: number;
  title: string;
  set_time: number;
  format: string;
  status: number;
  tsc: Tsc[];
}

export interface Tsc {
  id: number;
  title: string;
}
export interface ICreateTaskCategory {
  title: string;
  set_time: number;
  format: string;
}
export interface ICreateSubTaskCategory {
  title: string[];
  categories_id: number;
}
export interface IUpdateSubTaskCategory {
  title: string[];
}
