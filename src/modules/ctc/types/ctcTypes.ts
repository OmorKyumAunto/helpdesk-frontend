/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICTC {
  id: number;
  role_id: number;
  profile_id: number;
  employee_id: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  contact_no: string;
  joining_date: Date;
  unit_name: string;
  licenses: License[];
  blood_group: string;
  business_type: string;
  line_of_business: string;
  grade: string;
  status: number;
  assets: Asset[];
  total_asset_price: number;
  monthly_asset_cost: number;
  montly_licenses_price: number;
  total_ctc_per_month: number;
  total_ctc_per_year: number;
}

export interface Asset {
  id: number;
  name: string;
  serial_number: string;
  price: number;
  category: string; 
}

export interface License {
  id: number;
  title: string;
  price: number;
}
export interface ICTCParams {
  limit?: number;
  offset?: number;
  key?: string;
  unit_name?: string;
}
