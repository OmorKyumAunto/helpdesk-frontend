import { Col, Radio, Form } from 'antd';
import { Rule } from 'antd/es/form';
import { NamePath } from 'antd/es/form/interface';
import { RadioChangeEvent, RadioChangeEventTarget } from 'antd/es/radio';

type Props = {
  name: NamePath;
  label: string;
  required?: boolean;
  size?: number;
  disabled?: boolean;
  rules?: Rule;
  defaultValue: string | number;
  values: (string | number)[][];
  onChange: (value: RadioChangeEvent) => void;
};

const RadioButton = ({
  name,
  label,
  required,
  size,
  disabled,
  rules,
  defaultValue,
  values,
  onChange,
}: Props) => {
  return (
    <Col xs={24} sm={24} md={24} lg={size || 24}>
      <Form.Item
        label={label}
        name={name}
        initialValue={defaultValue}
        rules={[
          { required: required, message: `${label} is Mandatory!!` },
          rules as Rule,
        ]}
      >
        <Radio.Group onChange={onChange}>
          {values.map((value) => {
            return (
              <Radio disabled={disabled} value={value[0]}>
                {value[1]}
              </Radio>
            );
          })}
        </Radio.Group>
      </Form.Item>
    </Col>
  );
};

export default RadioButton;
