import { Form, Select } from "antd";
import { useGetCommonGroupQuery } from "../../modules/report/accounts/api/AccountEndPoints";
import { commonProps } from "../types/CommonTypes";

export const SelectAccountGroup = ({ name, label, required }: commonProps) => {
  const { data: accountGroup } = useGetCommonGroupQuery();
  // console.log(accountGroup);
  const selectGroup = accountGroup?.data;
  const accountGroupChildren: React.ReactNode[] = [];
  if (selectGroup) {
    for (let i = 0; i < selectGroup.length; i++) {
      accountGroupChildren.push(
        <Select.Option
          title="Select Account"
          key={selectGroup[i].id + " " + selectGroup[i].name}
          value={selectGroup[i].code}
        >
          {selectGroup[i].name} [{selectGroup[i].code}]
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
        placeholder={"Select account"}
        showSearch
        allowClear
        style={{ padding: "0", margin: "0", border: "0", width: "100%" }}
        optionFilterProp="roleMobile"
        popupMatchSelectWidth={170}
        filterOption={(input, option) =>
          (option!.children as unknown as string).includes(input.toLowerCase())
        }
      >
        {accountGroupChildren}
      </Select>
    </Form.Item>
  );
};
