import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Upload } from 'antd';
type IProps = {
  name: string;
  label: string;
  size?: number | string;
  required?: boolean;
};

function UploadFile({ size, name, label, required }: IProps) {
  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <Col
      span={6}
      xs={24}
      sm={12}
      md={24}
      lg={size ? size : 12}
    >
      <Form.Item
        name={name}
        label={label}
        valuePropName='fileList'
        getValueFromEvent={normFile}
        rules={[{ required: required, message: `${label} is mandatory!!` }]}
      >
        <Upload beforeUpload={() => false} name={name} listType='picture'>
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>
    </Col>
  );
}

export default UploadFile;
