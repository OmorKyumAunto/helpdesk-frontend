import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
} from "antd";
import { Rule } from "antd/es/form";
import { ValidateStatus } from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import { UploadListType } from "antd/es/upload/interface";
import { UploadFile } from "antd/lib";
import { NamePath } from "antd/lib/form/interface";
import dayjs from "dayjs";
import { Dispatch, SetStateAction } from "react";

type Props = {
  value?: any;
  color?: "green" | "red" | "gray";
  defaultValue?: string | number;
  dialCodeName?: NamePath;
  disabled?: boolean;
  help?: string;
  icon?: boolean;
  label?: string;
  loading?: boolean;
  maxAmount?: number;
  mdSize?: number;
  name?: NamePath;
  min?: string;
  max?: string | number;
  offset?: number;
  onChange?: any;
  placeholder?: string;
  rangePicker?: boolean;
  readOnly?: boolean;
  required?: boolean;
  smSize?: number;
  size?: number;
  small?: boolean;
  style?: React.CSSProperties;
  setShowTable?: any;
  inputType?: "text" | "email" | "tel";
  type?:
    | "dashed"
    | "default"
    | "ghost"
    | "link"
    | "text"
    | "primary"
    | undefined;
  validateStatus?: ValidateStatus;
  year?: boolean;
  rules?: Rule[] | undefined;
  className?: string;
  autoSize?: boolean;

  textAlign?: "right" | "left" | "center" | "start" | "end";
  dependencies?: NamePath[];
  onSearch?: (value: string) => void;
  format?: any;
  picker?: "time" | "date" | "year" | "week" | "month" | "quarter" | undefined;
  maxCount?: number;
  namePrefix?: string;
  prefix?: string;
  helperText?: string;
  hasFeedback?: boolean;
  numberType?: boolean;
  data?: any;
  handleQuantity?: ((value?: any) => void) | undefined;
  handleAttribute?: (value?: any) => void;
  quantity?: number;
  accept?: string;
  picture?: UploadListType;
  fileList?: UploadFile[];
  setFileList?: Dispatch<SetStateAction<UploadFile[]>>;
  rows?: number | undefined;
  mode?: "multiple" | "tags" | undefined;
  onBlur?: any;
  onSelect?: any;
  onClear?: any;
};

// FORM DATE INPUT ITEM
export function DateInput({
  name,
  label,
  size,
  mdSize,
  required,
  year,
  placeholder,
  disabled,
  rangePicker,
  smSize,
  readOnly,
  dependencies,
  rules,
  onChange,
}: Props) {
  // const today = new Date().toISOString().slice(0, 10);
  const { RangePicker } = DatePicker;
  return (
    <Col xs={24}>
      <Form.Item
        dependencies={dependencies}
        rules={[
          {
            required: required,
            message: `${label} is required!`,
            type: !rangePicker ? "date" : "array",
          },
          ...(rules || []),
        ]}
        name={name}
        label={label}
      >
        {!rangePicker ? (
          <DatePicker
            // defaultValue={dayjs()}
            picker={year ? "year" : "date"}
            format={year ? "YYYY" : "DD-MM-YYYY"}
            placeholder={placeholder || "Select date"}
            style={{ width: "100%" }}
            disabled={disabled}
          />
        ) : (
          <RangePicker
            style={{ width: "100%" }}
            disabled={disabled}
            picker={year ? "year" : "date"}
            format={year ? "YYYY" : "DD-MM-YYYY"}
            onChange={onChange}
          />
        )}
      </Form.Item>
    </Col>
  );
}

// FORM INPUT ITEM
export const FormInputItem = ({
  name,
  label,
  required,
  size,
  placeholder,
  readOnly,
  onChange,
  help,
  offset,
  validateStatus,
  inputType,
  dependencies,
  rules,
}: Props) => {
  return (
    <Col xs={24} sm={12} md={8} lg={{ span: size || 8, offset: offset || 0 }}>
      <Form.Item
        dependencies={dependencies}
        rules={[
          {
            required: required || false,
            message: `${label} is required!`,
          },

          ...(rules || []),
        ]}
        name={name}
        label={label}
        validateStatus={validateStatus ? "error" : "validating"}
        help={validateStatus ? help : null}
      >
        <Input
          readOnly={readOnly}
          type={inputType || "text"}
          placeholder={placeholder || label}
          onChange={(e) => {
            onChange && onChange(e.target.value);
          }}
        />
      </Form.Item>
    </Col>
  );
};

// TEXTAREA INPUT ITEM
export function TextAreaInput({ name, label, size, offset, autoSize }: Props) {
  return (
    <Col
      span={6}
      xs={24}
      sm={24}
      md={24}
      lg={size || 16}
      offset={offset ? offset : 0}
    >
      <Form.Item name={name} label={label}>
        <TextArea
          rows={3}
          placeholder="Note something"
          autoSize={autoSize}
          maxLength={255}
        />
      </Form.Item>
    </Col>
  );
}

export const NumberInput = ({
  name,
  label,
  mdSize,
  required,
  smSize,
  size,
  small,
  readOnly,
  color,
  maxAmount,
  placeholder,
  style,
  defaultValue,
  onChange,
  min,
  offset,
  max,
  rules,
  value,
}: Props) => {
  return (
    <Col
      xs={24}
      sm={smSize || 12}
      md={mdSize || 8}
      lg={{ span: size || 8 }}
      offset={offset ? offset : 0}
    >
      <Form.Item
        name={name}
        label={label}
        rules={
          readOnly
            ? [...(rules || [])]
            : [
                ({ getFieldValue }) => ({
                  validator: (_, value) => {
                    if (getFieldValue("invoice_due") < value) {
                      return Promise.reject();
                    } else {
                      return Promise.resolve();
                    }
                  },
                  message: "Error",
                }),
                ...(rules || []),
              ]
        }
      >
        <InputNumber
          size={small ? "small" : "middle"}
          placeholder={placeholder ? placeholder : label}
          style={{
            width: "100%",
            border: `1px solid ${color}`,
            color,
            ...style,
          }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          min={min || undefined}
          max={max || undefined}
          // type={'number'}
          readOnly={readOnly || false}
          defaultValue={defaultValue ? defaultValue : undefined}
          onChange={(e) => onChange && onChange(Number(e))}
        />
      </Form.Item>
    </Col>
  );
};

export const FormInput = ({
  name,
  size,
  label,
  numberType,
  rules,
  disabled,
  placeholder,
  required,
  onChange,
  prefix,
}: Props) => {
  return (
    <Col xs={24} sm={24} md={12} lg={size || 12}>
      <Form.Item required={required} label={label} name={name} rules={rules}>
        {numberType ? (
          <Input
            type="number"
            prefix={prefix}
            placeholder={placeholder}
            style={{ width: "100%" }}
            disabled={disabled || false}
            onChange={onChange}
          />
        ) : (
          <Input
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled || false}
          />
        )}
      </Form.Item>
    </Col>
  );
};

export const FormFileInput = ({
  name,
  label,
  size,
  rules,
  required,
  accept,
  picture,
  fileList,
  setFileList,
  maxCount,
  disabled,
  validateStatus,
  help,
}: Props) => {
  return (
    <Form.Item
      label={label}
      required={required}
      name={name}
      help={help}
      validateStatus={validateStatus}
      valuePropName="fileList"
      getValueFromEvent={(e) => {
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
      }}
      rules={
        rules
        // ?? [
        // 	{
        // 		validator: (
        // 			_rules: any,
        // 			value: {
        // 				file: File;
        // 				fileList: UploadFile[];
        // 			}
        // 		) => {
        // 			if (required) {
        // 				if (!value || !value.fileList.length) {
        // 					return Promise.reject(new Error(`${label} is required`));
        // 				}
        // 			}
        // 			if (
        // 				value &&
        // 				value.fileList.length &&
        // 				value.fileList[0].size! <= 5120
        // 			) {
        // 				return Promise.reject(
        // 					new Error('File size is too large (max size is 5MB)')
        // 				);
        // 			}
        // 		},
        // 	},
        // ]
      }
    >
      <Upload
        fileList={fileList}
        onChange={({ fileList: newFileList }: { fileList: any }) =>
          setFileList && setFileList(newFileList)
        }
        style={{ width: "100%" }}
        listType={picture}
        action={""}
        // disabled={disabled || false}
        accept={accept ?? "image/*"}
        beforeUpload={() => false}
        maxCount={maxCount || 1}
      >
        <Button
          style={{ width: "100%" }}
          icon={<UploadOutlined />}
          disabled={disabled || false}
        >
          Click to Upload
        </Button>
      </Upload>
    </Form.Item>
  );
};
export const FormNumberInput = ({
  name,
  label,
  size,
  rules,
  disabled,
  placeholder,
  required,
  onChange,
  value,
  validateStatus,
  helperText,
  hasFeedback,
}: Props) => {
  return (
    <Col xs={24} sm={24} md={12} lg={size || 12}>
      <Form.Item
        required={required}
        label={label}
        name={name}
        rules={rules}
        hasFeedback={hasFeedback || false}
        validateStatus={validateStatus}
        help={helperText}
      >
        <InputNumber
          type="number"
          name={name}
          placeholder={placeholder}
          disabled={disabled || false}
          style={{ width: "100%" }}
          onChange={onChange}
          defaultValue={value}
          value={value}
        />
      </Form.Item>
    </Col>
  );
};

export const FormTextArea = ({
  name,
  label,
  size,
  rules,
  disabled,
  placeholder,
  required,
  rows,
}: Props) => {
  return (
    <Col xs={24} sm={24} md={12} lg={size || 12}>
      <Form.Item required={required} label={label} name={name} rules={rules}>
        <Input.TextArea
          showCount
          rows={rows}
          maxLength={100}
          placeholder={placeholder}
          disabled={disabled || false}
        />
      </Form.Item>
    </Col>
  );
};

const { Option } = Select;
export const FormSelectInput = ({
  name,
  label,
  size,
  disabled,
  placeholder,
  data,
  loading,
  style,
  required,
}: Props) => {
  return (
    <Col xs={24} sm={24} md={12} lg={size || 12}>
      <Form.Item
        name={name}
        label={label}
        rules={[
          { required: required ?? false, message: `Please select ${label}!` },
        ]}
        style={style}
      >
        <Select
          loading={loading}
          disabled={disabled || false}
          placeholder={placeholder}
        >
          {data &&
            data.map((item: any, index: number) => (
              <Option key={item.name + index} value={item.value}>
                {item.name}
              </Option>
            ))}
        </Select>
      </Form.Item>
    </Col>
  );
};

export const FormCommonInput = ({
  name,
  label,
  size,
  rules,
  disabled,
  placeholder,
}: Props) => {
  return (
    <Col xs={24} sm={24} md={12} lg={size || 12}>
      <Form.Item label={label} name={name} rules={rules}>
        <Input placeholder={placeholder} disabled={disabled || false} />
      </Form.Item>
    </Col>
  );
};

export const FormSelect = ({
  name,
  label,
  size,
  rules,
  disabled,
  placeholder,
  required,
  onChange,
  value,
  data,
  mode,
  onBlur,
  onSelect,
  onClear,
  defaultValue,
  onSearch,
}: Props) => {
  return (
    <Col xs={24} sm={24} md={12} lg={size || 12}>
      <Form.Item required={required} label={label} name={name} rules={rules}>
        <Select
          onSearch={onSearch}
          optionFilterProp="children"
          showSearch
          onBlur={onBlur}
          mode={mode}
          allowClear
          style={{ width: "100%" }}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          onClear={onClear}
          options={data}
          disabled={disabled || false}
          onSelect={onSelect}
          defaultValue={defaultValue}
          filterOption={(input, option: any) =>
            option?.label?.toLowerCase().includes(input?.toLowerCase())
          }
        />
      </Form.Item>
    </Col>
  );
};

export const FormSelect2 = ({
  name,
  label,
  size,
  rules,
  disabled,
  placeholder,
  required,
  onChange,
  value,
  data,
  mode,
  onBlur,
  onSelect,
  onClear,
}: Props) => {
  return (
    <Col xs={24} sm={24} md={12} lg={size || 12}>
      <Form.Item required={required} label={label} name={name} rules={rules}>
        <Select
          onBlur={onBlur}
          mode={mode}
          allowClear
          style={{ width: "100%" }}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          onClear={onClear}
          options={data}
          disabled={disabled || false}
          onSelect={onSelect}
        />
      </Form.Item>
    </Col>
  );
};

export const FormInputNamePrefix = ({
  name,
  label,
  size,
  rules,
  placeholder,
  required,
  disabled,
  namePrefix,
}: Props) => {
  const selectBefore = (
    <Form.Item name={namePrefix} noStyle>
      <Select disabled={disabled || false}>
        <Option value="Mr.">Mr.</Option>
        <Option value="Ms.">Ms.</Option>
        <Option value="Mrs.">Mrs.</Option>
      </Select>
    </Form.Item>
  );
  return (
    <Col xs={24} sm={24} md={12} lg={size || 12}>
      <Form.Item required={required} label={label} name={name} rules={rules}>
        <Input
          disabled={disabled || false}
          addonBefore={selectBefore}
          placeholder={placeholder}
        />
      </Form.Item>
    </Col>
  );
};

export const FormDate = ({
  name,
  label,
  size,
  rules,
  placeholder,
  required,
  disabled,
  format,
  picker,
  onChange,
}: Props) => {
  function disabledYear(currentYear: any) {
    // Disable future years (next year and beyond)
    const currentYearInt = currentYear.year();
    const currentYearNow = dayjs().year();
    return currentYearInt > currentYearNow;
  }
  return (
    <Col xs={24} sm={24} md={12} lg={size}>
      <Form.Item required={required} label={label} name={name} rules={rules}>
        <DatePicker
          disabled={disabled || false}
          disabledDate={disabledYear}
          style={{ width: "100%" }}
          format={format}
          picker={picker}
          onChange={onChange}
          placeholder={placeholder}
        />
      </Form.Item>
    </Col>
  );
};
