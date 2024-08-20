import { Button, Col, DatePicker, Form, Select, Upload } from "antd";
import { useGetEmployeesQuery } from "../../modules/employee/api/employeeEndPoint";
import { commonProps } from "../types/CommonTypes";
import { useGetCommonExpenseHeadQuery } from "../CommonEndPoint/CommonEndPoint";

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
export const SelectExpenseHead = ({ name, label, required }: commonProps) => {
  const { data: expenseHead } = useGetCommonExpenseHeadQuery();
  const selectExpenseHead = expenseHead?.data;
  const expenseHeadChildren: React.ReactNode[] = [];
  if (selectExpenseHead) {
    for (let i = 0; i < selectExpenseHead.length; i++) {
      expenseHeadChildren.push(
        <Select.Option
          title="Select Expense Head"
          key={selectExpenseHead[i].id + " " + selectExpenseHead[i].name}
          value={selectExpenseHead[i].id}
        >
          {selectExpenseHead[i].name} [{selectExpenseHead[i].expense_head_id}]
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
        placeholder={"Select Expense Head"}
        showSearch
        allowClear
        // style={{ padding: "0", margin: "0", border: "0", width: "100%" }}
        optionFilterProp="roleMobile"
        filterOption={(input, option) =>
          (option!.children as unknown as string).includes(input.toLowerCase())
        }
      >
        {expenseHeadChildren}
      </Select>
    </Form.Item>
  );
};
