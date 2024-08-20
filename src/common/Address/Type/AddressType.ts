export interface IDivision {
  country_id: number;
  country_name: string;
  division_id: number;
  division_name: string;
}

export interface IDistrict {
  country_id: number;
  country_name: string;
  division_id: number;
  division_name: string;
  district_id: number;
  district_name: string;
}

export interface IThana {
  country_id: number;
  country_name: string;
  division_id: number;
  division_name: string;
  district_id: number;
  district_name: string;
  thana_id: number;
  thana_name: string;
}
export interface IArea {
  country_id: number;
  country_name: string;
  division_id: number;
  division_name: string;
  district_id: number;
  t: string;
  thana_id: number;
  thana_name: string;
  area_id: number;
  area_name: string;
}
