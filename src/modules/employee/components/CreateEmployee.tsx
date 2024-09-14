/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Form, Input, Button, Select } from "antd";
import { SendOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { IFromData } from "../types/employeeTypes";
import { useCreateEmployeeMutation } from "../api/employeeEndPoint";
import { useEffect } from "react";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { validateMobileNumber } from "../../../common/phoneNumberValidator";
import { DateInput } from "../../../common/formItem/FormItems";
import TextArea from "antd/es/input/TextArea";
const { Option } = Select;

const CreateEmployee = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const licenseType = Form.useWatch("need_license", form);
  const [createEmployee, { isLoading, isSuccess }] =
    useCreateEmployeeMutation();

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

    // console.log(formattedData);
    createEmployee({ data: formattedData });
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
            joining_date: dayjs(),
            need_license: "No",
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
                  name="name"
                  rules={[{ required: true }]}
                  label="Employee Name"
                  required
                >
                  <Input placeholder="Enter Employee Name" type="text" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="designation"
                  label="Employee Designation"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter Employee Designation" type="text" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="contact_no"
                  label="Contact No"
                  rules={[{ required: true, validator: validateMobileNumber }]}
                >
                  <Input
                    addonBefore="+88"
                    placeholder="Enter Contact No"
                    type="number"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="Employee Email"
                  name="email"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter employee email" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="Employee Department"
                  name="department"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter employee department" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <DateInput
                  label="Date of Joining"
                  name="joining_date"
                  placeholder="Select Joining Date"
                  rules={[{ required: true }]}
                />
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="Unit Name"
                  name="unit_name"
                  rules={[{ required: true, message: "Please Select Unit" }]}
                >
                  <Select placeholder="Select Unit Name">
                    <Option value="JTML">JTML</Option>
                    <Option value="DIPL">DIPL</Option>
                    <Option value="Corporate Office">Corporate Office</Option>
                  </Select>
                </Form.Item>
              </Col>
              {/* <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="Unit Name"
                  name="unit_id"
                  rules={[{ required: true, message: "Please Select Unit" }]}
                >
                  <Select
                    className="w-full"
                    loading={unitIsLoading}
                    placeholder="Select Unit Name"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(
                      input: string,
                      option?: { label: string; value: string }
                    ) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={data?.data?.map((unit: any) => ({
                      value: unit.id,
                      label: unit.title,
                    }))}
                    allowClear
                  />
                </Form.Item>
              </Col> */}
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="Need License"
                  name="need_license"
                  rules={[
                    { required: true, message: "Please Select License Type" },
                  ]}
                >
                  <Select placeholder="Select License Type">
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                  </Select>
                </Form.Item>
              </Col>
              {licenseType === "Yes" && (
                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label="Licenses"
                    name="licenses"
                    // rules={[
                    //   { required: true, message: "Please Select License Type" },
                    // ]}
                  >
                    <TextArea placeholder="Enter licenses" />
                  </Form.Item>
                </Col>
              )}
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

export default CreateEmployee;
