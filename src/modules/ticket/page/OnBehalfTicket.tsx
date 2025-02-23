import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  Row,
  Col,
  Card,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useGetCategoryActiveListQuery } from "../../Category/api/categoryEndPoint";
import { useGetEmployeeAllDistributedAssetQuery } from "../../assets/api/assetsEndPoint";
import { useCreateRaiseTicketMutation } from "../api/ticketEndpoint";
import { useGetOverallEmployeesQuery } from "../../employee/api/employeeEndPoint";
import { IEmployee } from "../../employee/types/employeeTypes";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const { Option } = Select;
const { TextArea } = Input;

const RaiseTicketForm = () => {
  const [form] = Form.useForm();
  const [isCcVisible, setIsCcVisible] = useState(false); // State to manage CC Select visibility
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });
  const { data: allEmployee, isLoading: empLoading } =
    useGetOverallEmployeesQuery();
  const { data, isLoading } = useGetEmployeeAllDistributedAssetQuery({});
  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoryActiveListQuery({});
  const [create, { isSuccess }] = useCreateRaiseTicketMutation();
  const editor = useRef(null);
  const handleSubmit = (values: any) => {
    const formData = new FormData();
    for (const key in values) {
      if (values[key]) {
        if (key === "attachment") {
          if (values[key][0]?.originFileObj) {
            formData.append(key, values[key][0]?.originFileObj);
          }
        } else {
          formData.append(key, values[key]);
        }
      }
    }

    create(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      setIsCcVisible(false); // Reset CC visibility on form success
    }
  }, [isSuccess, form]);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleCcButtonClick = () => {
    setIsCcVisible(!isCcVisible); // Toggle CC Select visibility
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ maxWidth: "100%", margin: "auto" }}
    >
      <Row gutter={[16, 16]}>
        {/* Left Card */}
        <Col xs={24} md={8}>
          <Card
            bordered
            hoverable
            style={{
              borderRadius: "8px",
              padding: "3px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Form.Item
              label="Select Employee"
              name="employee_id"
              rules={[{ required: true, message: "Please select Employee" }]}
              style={{ marginBottom: "8px" }}
            >
              <Select
                loading={empLoading}
                placeholder="Search Employee"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={allEmployee?.data?.map((item: IEmployee) => ({
                  value: item.id,
                  label: `[${item.employee_id}] ${item.name} (${item.email})`,
                }))}
                allowClear
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label="Select Unit"
              name="unit_id"
              rules={[{ required: true, message: "Please select a unit!" }]}
              style={{ marginBottom: "8px" }}
            >
              <Select
                loading={unitIsLoading}
                placeholder="Select Unit Name"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={unitData?.data?.map((unit: any) => ({
                  value: unit.id,
                  label: unit.title,
                }))}
                allowClear
              />
            </Form.Item>

            <Form.Item
              label="Select Category"
              name="category_id"
              style={{ marginBottom: "8px" }}
              rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Select
                loading={categoryLoading}
                placeholder="Select Category"
                showSearch
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={categoryData?.data?.map((item) => ({
                  value: item.id,
                  label: item.title,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Select Priority"
              name="priority"
              style={{ marginBottom: "8px" }}
              rules={[{ required: true, message: "Please select a priority!" }]}
            >
              <Select placeholder="Select Priority">
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
                <Option value="urgent">Urgent</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Select Asset" name="asset_id">
              <Select
                loading={isLoading}
                placeholder="Select Asset Name"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={data?.data?.map((item: any) => ({
                  value: item.id,
                  label: `${item.asset_name} (${item.serial_number})`,
                }))}
                allowClear
              />
            </Form.Item>
          </Card>
        </Col>

        {/* Right Card */}
        <Col xs={24} md={16}>
          <Card
            bordered
            hoverable
            style={{
              borderRadius: "8px",
              padding: "3px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Form.Item
              label="Subject"
              name="subject"
              style={{ marginBottom: "8px" }}
              rules={[{ required: true, message: "Please enter a subject!" }]}
            >
              <Input placeholder="Enter Subject" />
            </Form.Item>

            <Button
              onClick={handleCcButtonClick}
              size="small"
              style={{ marginBottom: "8px" }}
            >
              CC
            </Button>
            {isCcVisible && (
              <Form.Item name="cc" style={{ marginBottom: "8px" }}>
                <Select
                  loading={empLoading}
                  placeholder="Select Employee"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={allEmployee?.data?.map((item: IEmployee) => ({
                    value: item.id,
                    label: `${item.name} (${item.email})`,
                  }))}
                  allowClear
                  style={{ width: "100%" }}
                />
              </Form.Item>
            )}

            {/* <Form.Item
              label="Message"
              name="description"
              style={{ marginBottom: "8px" }}
              rules={[
                { required: true, message: "Please enter a description!" },
              ]}
            >
              <TextArea rows={4} placeholder="Enter Description" />
            </Form.Item> */}
            <Form.Item
              label="Message"
              name="description"
              style={{ marginBottom: "8px" }}
              rules={[
                { required: true, message: "Please enter a description!" },
              ]}
            >
              <ReactQuill theme="snow" placeholder="Enter Description..." />
            </Form.Item>

            <Form.Item
              name="attachment"
              label="Attachment (Optional)"
              valuePropName="fileList"
              style={{ marginBottom: "8px" }}
              getValueFromEvent={normFile}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                listType="picture"
                accept="image/*,.pdf"
                showUploadList={{ showRemoveIcon: true }}
              >
                <Button style={{ width: "100%" }} icon={<PlusOutlined />}>
                  Click to Upload
                </Button>
                <span style={{ fontSize: "12px", color: "#888" }}>
                  Only JPG, JPEG, PNG, and PDF files are allowed. Maximum size:
                  2MB.
                </span>
              </Upload>
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                backgroundColor: "#1775bb",
                borderColor: "#1775bb",
                fontWeight: "bold",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#144b8b")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#1775bb")
              }
            >
              Raise a Ticket
            </Button>
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default RaiseTicketForm;
