import { Form, Select } from "antd";
import { useGetEmployeesQuery } from "../../modules/employee/api/employeeEndPoint";
import { commonProps } from "../types/CommonTypes";

/* employee    */
export const SelectEmployee = ({
  name,
  label,
  required,
  onSelectEmployee,
}: commonProps) => {
  const { data: emp } = useGetEmployeesQuery({});
  const selectEmp = emp?.data;
  const empChildren: React.ReactNode[] = [];
  const handleEmployeeSelect = (value: string) => {
    const selectedInvoice = selectEmp?.find(
      (invoice: any) => invoice.id === value
    );
    if (selectedInvoice) {
      onSelectEmployee(selectedInvoice);
    }
  };
  if (selectEmp) {
    for (let i = 0; i < selectEmp.length; i++) {
      empChildren.push(
        <Select.Option
          title="Select Employee"
          key={selectEmp[i].id + " " + selectEmp[i].name}
          value={selectEmp[i].id}
        >
          {selectEmp[i].name}
        </Select.Option>
      );
    }
  }

  return (
    <Form.Item
      name={name}
      label={label}
      rules={[
        {
          required: required || false,
          message: `${label} is required!`,
        },
      ]}
    >
      <Select
        placeholder={"Select Employee"}
        showSearch
        allowClear
        style={{ padding: "0", margin: "0", border: "0", width: "100%" }}
        optionFilterProp="roleMobile"
        filterOption={(input, option) =>
          (option!.children as unknown as string).includes(input.toLowerCase())
        }
        onChange={handleEmployeeSelect}
      >
        {empChildren}
      </Select>
    </Form.Item>
  );
};

/* Expense Head */
