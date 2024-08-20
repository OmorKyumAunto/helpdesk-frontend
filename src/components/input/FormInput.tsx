import { Col, Form, Input, InputNumber } from "antd";
import { Rule } from "antd/es/form";
import { NamePath } from "antd/es/form/interface";

type Props = {
  name: NamePath;
  label: string;
  required?: boolean;
  size?: number;
  numberType?: boolean;
  disabled?: boolean;
  rules?: any;
  placeholder?: string;
  handleQuantity?: ((value?: any) => void) | undefined;
  handleAttribute?: (value?: any) => void;
  quantity?: number;
  value?: any;
  onChange?: any;
  defaultValue?: any;
};

const FormInput = ({
  name,
  label,
  required,
  size,
  numberType,
  rules,
  disabled,
  placeholder,
  quantity,
  handleQuantity,
  handleAttribute,
  value,
  onChange,
  defaultValue,
}: Props) => {
  return (
    <Col xs={24} sm={24} md={12} lg={size || 12}>
      <Form.Item label={label} name={name} rules={rules}>
        {numberType ? (
          <InputNumber
            controls={false}
            onChange={onChange}
            // onChange={(e: any) => {
            //   handleQuantity && handleQuantity(e);
            //   handleAttribute && handleAttribute(e);
            // }}
            defaultValue={defaultValue}
            value={value}
            type={"number"}
            placeholder={placeholder}
            style={{ width: "100%" }}
            disabled={disabled || false}
          />
        ) : (
          <Input disabled={disabled || false} value={value} />
        )}
      </Form.Item>
    </Col>
  );
};

export default FormInput;
