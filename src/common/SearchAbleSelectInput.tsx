import { Select, Form } from "antd";

interface IProps {
  options: any[];
  placeholder?: string;
  label?: string;
  name?: string | any[];
  rules?: any;
  onSelect?: any;
  mode?: "multiple";
  disable?: boolean;
}

export const SearchAbleSelectInput = ({
  options,
  placeholder,
  label,
  name,
  rules,
  onSelect,
  mode,
  disable,
}: IProps) => {
  //   const [form] = Form.useForm();
  return (
    <Form.Item label={label} name={name} rules={rules}>
      <Select
        mode={mode}
        allowClear
        disabled={disable || false}
        showSearch
        onSelect={onSelect}
        placeholder={placeholder}
        style={{ width: "100%" }}
        options={options}
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input)
        }
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? "")
            .toLowerCase()
            .localeCompare((optionB?.label ?? "").toLowerCase())
        }
      />
    </Form.Item>
  );
};
