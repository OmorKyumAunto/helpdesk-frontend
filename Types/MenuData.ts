export interface IMenuData {
  label: JSX.Element | string;
  key: string | number;
  icon?: JSX.Element;
  children?: IMenuChild | IMenuChild[]}

interface IMenuChild {
  label: JSX.Element | string;
  key: number | string;
  icon?: JSX.Element;
  children?: IMenuChild[];
}
