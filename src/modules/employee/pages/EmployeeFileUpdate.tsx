import { PlusOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Upload } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useCreateEmployeeUploadFileMutation } from "../api/employeeEndPoint";

const EmployeeFileUpdate = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [upload, { isLoading, isSuccess }] =
    useCreateEmployeeUploadFileMutation();

  const onFinish = (values: any) => {
    const submittedData: any = new FormData();

    for (const key in values) {
      if (values[key]) {
        if (key === "file") {
          if (values[key][0]?.originFileObj) {
            submittedData.append(key, values[key][0]?.originFileObj);
          }
        } else {
          submittedData.append(key, values[key]);
        }
      }
    }

    console.log(submittedData);
    upload({ data: submittedData });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal());
      form.resetFields();
    }
  }, [isSuccess]);
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Card
        className="border"
        style={{
          marginBottom: "1rem",
          marginTop: "1rem",
        }}
      >
        <Col xs={24} sm={24} md={24}>
          <Form.Item
            name="file"
            label="Upload Employee File"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              listType="picture"
              //   accept=""
              showUploadList={{ showRemoveIcon: true }}
            >
              <Button style={{ width: "100%" }} icon={<PlusOutlined />}>
                Click to Upload
              </Button>
            </Upload>
          </Form.Item>
        </Col>
      </Card>
      <Form.Item style={{ marginTop: "1rem" }}>
        <div style={{ textAlign: "end" }}>
          <Button
            htmlType="submit"
            type="primary"
            icon={<SendOutlined />}
            loading={isLoading}
          >
            Upload
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default EmployeeFileUpdate;
