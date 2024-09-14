/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IEmployee {
  id: number;
  role_id: number;
  employee_id: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  contact_no: string;
  joining_date: string;
  unit_name: string;
  status: number;
  created_at: string;
  licenses: string;
}

export interface IAdjustSalary {
  id: number;
  adjustment_type: string;
  amount: string;
  details: string;
  created_by: number;
  created_at: string;
  employee_id: number;
  salary_statement: string;
}
export interface ISingleEmployee {
  id: number;
  name: string;
  email: string;
  employee_id: string;
  department: string;
  contact_no: string;
  unit_name: string;
  created_at: string;
  phone_number: string;
  designation: string;
  salary: string;
  gross_salary: string;
  tax: string;
  commission: string;
  appointment_date: string;
  joining_date: string;
  address: string;
  status: true;
  blood_group: string;
  created_by: string;
  employee_photo: string;
  employee_cv: string;
  education_certificate: string;
  experience_certificate: string;
  nid_number: string;
  nid_photo: string;
  banking_doc: string;
  bio_data: string;
  nominee_name: string;
  nominee_nid: string;
  nominee_nid_photo: string;
  tin_number: string;
  tin_certificate: string;
  other_documents: string;
  total_casual_leaves: number;
  total_annual_leaves: number;
  total_sick_leaves: number;
  adjustmentSalary: IAdjustSalary[];
}

export interface IFromData {
  [key: string]: any;
  company_id: number | undefined;
  name: string;
  designation: string;
  salary: number | string;
  commission: number | string;
  mobile: string;
  blood_group: any;
  date_of_birth: string;
  joining_date: string;
  appointment_date: string;
  address: string;
  department_id: { value: string; label: number };
}
export type ISubmitData = Partial<{
  [K in keyof IFromData]: K extends "department_id" ? any : IFromData[K];
}>;

export interface IEmployeeParams {
  limit?: number;
  offset?: number;
  key?: string;
  unit_name?: string;
}
