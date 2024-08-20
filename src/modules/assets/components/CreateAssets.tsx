/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Form, Input, Button, Select } from "antd";
import { SendOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { IFromData } from "../types/assetsTypes";
import { useEffect } from "react";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { validateMobileNumber } from "../../../common/phoneNumberValidator";
import { DateInput } from "../../../common/formItem/FormItems";
import { useCreateAssetsMutation } from "../api/assetsEndPoint";
import TextArea from "antd/es/input/TextArea";
const { Option } = Select;

const CreateAsset = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const assignType = Form.useWatch("assign", form);

  const [create, { isLoading, isSuccess }] = useCreateAssetsMutation();

  const onFinish = (values: IFromData) => {
    const formattedData: any = {};

    for (const key in values) {
      if (values[key]) {
        if (key === "joining_date") {
          formattedData[key] = dayjs(values[key]).format("YYYY-MM-DD");
        } else {
          formattedData[key] = values[key];
        }
      }
    }

    console.log(formattedData);
    create({ data: formattedData });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal());
      form.resetFields();
    }
  }, [isSuccess]);

  return (
    <Row justify="center" align="middle" style={{ maxWidth: "auto" }}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{
            category: "Laptop",
            unit: "JTML",
            assign: false,
            purchase_date: dayjs(),
          }}
        >
          <Card
            className="border"
            style={{
              marginBottom: "1rem",
              marginTop: "1rem",
            }}
          >
            <Row align={"middle"} gutter={[5, 16]}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="asset_name"
                  rules={[{ required: true }]}
                  label="Asset Name"
                  required
                >
                  <Input placeholder="Enter Asset Name" type="text" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="Category"
                  name="category"
                  rules={[{ required: true, message: "Please Category" }]}
                >
                  <Select placeholder="Select Category">
                    <Option value="Laptop">Laptop</Option>
                    <Option value="Desktop">Desktop</Option>
                    <Option value="Pinter">Pinter</Option>
                    <Option value="Accessories">Accessories</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <DateInput
                  label="Purchase Date"
                  name="purchase_date"
                  placeholder="Select Purchase Date"
                  rules={[{ required: true }]}
                />
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="Serial Number"
                  name="serial_number"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter serial no" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="PO Number"
                  name="po_number"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter serial no" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="Assign Type"
                  name="assign"
                  rules={[
                    { required: true, message: "Please Select Assign Type" },
                  ]}
                >
                  <Select placeholder="Select Assign Type">
                    <Option value={true}>True</Option>
                    <Option value={false}>False</Option>
                  </Select>
                </Form.Item>
              </Col>
              {assignType === true && (
                <>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      name="employee_id"
                      rules={[{ required: true }]}
                      label="Employee ID"
                      required
                    >
                      <Input placeholder="Enter Employee ID" type="text" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label="Unit Name"
                      name="unit"
                      rules={[
                        { required: true, message: "Please Select Unit" },
                      ]}
                    >
                      <Select placeholder="Select Unit Name">
                        <Option value="JTML">JTML</Option>
                        <Option value="DIPL">DIPL</Option>
                        <Option value="Corporate Office">
                          Corporate Office
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </>
              )}

              <Col xs={24} sm={24} md={24}>
                <Form.Item label="Asset History" name="asset_history">
                  <TextArea placeholder="Enter Asset History" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Form.Item style={{ marginTop: "1rem" }}>
            <div style={{ textAlign: "end" }}>
              <Button
                htmlType="submit"
                type="primary"
                icon={<SendOutlined />}
                loading={isLoading}
              >
                Create
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default CreateAsset;
