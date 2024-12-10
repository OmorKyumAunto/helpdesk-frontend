import React, { useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  message,
  Row,
  Col,
  Card,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useGetCategoryActiveListQuery } from "../../Category/api/categoryEndPoint";
import { useGetEmployeeAllDistributedAssetQuery } from "../../assets/api/assetsEndPoint";
import { useCreateRaiseTicketMutation } from "../api/ticketEndpoint";

const { Option } = Select;
const { TextArea } = Input;

const RaiseTicketForm = () => {
  const [form] = Form.useForm();
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });
  const { data, isLoading } = useGetEmployeeAllDistributedAssetQuery({});
  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoryActiveListQuery({});
  const [create, { isSuccess }] = useCreateRaiseTicketMutation();
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

    // console.table(Object.fromEntries(formData));
    create(formData);
  };
  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
    }
  }, [isSuccess, form]);
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ maxWidth: 1024, margin: "auto" }}
    >
      <Row gutter={16}>
        {/* Left Card */}
        <Col xs={24} md={12}>
          <Card title="Basic Details" bordered>
            <Form.Item
              label="Select Unit"
              name="unit_id"
              rules={[{ required: true, message: "Please select a unit!" }]}
            >
              <Select
                loading={unitIsLoading}
                placeholder="Select Unit Name"
                showSearch
                optionFilterProp="children"
                filterOption={(
                  input: string,
                  option?: { label: string; value: number }
                ) =>
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
              rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Select
                loading={categoryLoading}
                placeholder="Select Category"
                showSearch
                allowClear
                optionFilterProp="children"
                filterOption={(
                  input: string,
                  option?: { label: string; value: number }
                ) =>
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
              rules={[{ required: true, message: "Please select a priority!" }]}
            >
              <Select placeholder="Select Priority">
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Select Asset"
              name="asset_id"
              rules={[{ required: true, message: "Please select a asset!" }]}
            >
              <Select
                loading={isLoading}
                placeholder="Select Asset Name"
                showSearch
                optionFilterProp="children"
                filterOption={(
                  input: string,
                  option?: { label: string; value: number }
                ) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={data?.data?.map((item: any) => ({
                  value: item.id,
                  label: item.asset_name,
                }))}
                allowClear
              />
            </Form.Item>
          </Card>
        </Col>

        {/* Right Card */}
        <Col xs={24} md={12}>
          <Card title="Additional Details" bordered>
            <Form.Item
              label="Subject"
              name="subject"
              rules={[{ required: true, message: "Please enter a subject!" }]}
            >
              <Input placeholder="Enter Subject" />
            </Form.Item>

            <Form.Item label="CC" name="cc">
              <Input placeholder="Enter CC" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please enter a description!" },
              ]}
            >
              <TextArea rows={4} placeholder="Enter Description" />
            </Form.Item>

            <Form.Item
              name="attachment"
              label="Upload Asset File"
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
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Raise a Ticket
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Submit Button */}
      <Row>
        <Col span={24} style={{ textAlign: "center", marginTop: "20px" }}></Col>
      </Row>
    </Form>
  );
};

export default RaiseTicketForm;
