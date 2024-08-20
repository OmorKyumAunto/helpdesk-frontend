import { Rule } from "antd/es/form";
import { NamePath } from "antd/es/form/interface";

export interface IAccountHead {
  id: number;
  code: string;
  parent_id: number;
  name: string;
  group_name: string;
}

export type commonProps = {
  handleClient?: any;
  handleStaff?: any;
  handleStatusChange?: (value: string) => void;
  staffId?: any;
  selectedValue?: any;
  handleProductQuantity?: (e?: any) => void;
  supplierId?: any;
  productId?: any;
  showAll?: boolean;
  name?: NamePath;
  label?: string;
  disabled?: boolean;
  initialValue?: string;
  defaultValue?: number | string;
  handleCitySelect?: (value?: any) => void;
  handleCategoryChange?: (value?: any) => void;
  handleAttributeChange?: (value?: any) => void;
  handleCityFilterChange?: (value: any, key: any) => void;
  placeholder?: string;
  required?: boolean;
  size?: number;
  smSize?: number;
  xlSize?: number;
  mdSize?: number;
  xsSize?: number;
  small?: boolean;
  rules?: Rule[];
  dependencies?: NamePath[];
  mode?: "multiple" | "tags" | undefined;
  loading?: boolean;
  multiple?: boolean;
  value?: string;
  // data?: IGetAllProvince[] | IGetAllZila[] | IGetAllUpazila[] | IGetAllArea[];
  setgetProducts?: React.Dispatch<React.SetStateAction<undefined>>;
  setstaffId?: React.Dispatch<any>;
  onChange?: (e: any) => any;
  handleSupplier?: (value: any, key: any) => void;
  handleWahrehouse?: (value: any, key: any) => void;
  handleAttValue?: (value: any, key: any) => void;
  handleReceivedChange?: (value: any, key: any) => void;
  setFilterCity?: any;
  // setgetProducts: React.Dispatch<React.SetStateAction<undefined>>;
  // onChange: (value: any, option: any) => void;
  onSelectEmployee?: any;
};

export interface IBilling_information {
  billing_product_id: number;
  billing_quantity: number;
  billing_unit_price: number;
  billing_total_price: number;
}
