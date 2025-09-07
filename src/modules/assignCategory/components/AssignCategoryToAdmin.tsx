/* eslint-disable @typescript-eslint/no-explicit-any */
import { SendOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Row, Select } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import {
  useAssignCategoryMutation,
  useGetUserWiseTicketCategoryQuery,
} from "../api/assignCategoryEndPoint";
import { useGetCategoryActiveListQuery } from "../../Category/api/categoryEndPoint";
import { IAssignCategory } from "../types/assignCategoryTypes";
import { skipToken } from "@reduxjs/toolkit/query";

const AssignCategoryToAdmin = ({
  id,
  assign_category,
}: {
  id?: number;
  assign_category: IAssignCategory[];
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [assign, { isLoading, isSuccess }] = useAssignCategoryMutation();

  // Fetch active category list
  const { data: categories } = useGetCategoryActiveListQuery({});

  // Fetch user-wise assigned categories
  const { data: userCategories } = useGetUserWiseTicketCategoryQuery(
    id ? id : skipToken
  );

  // Handle form submit
  const onFinish = (value: { category_id: number[] }) => {
    if (!id) {
      console.error("User ID is missing! Cannot assign categories.");
      return;
    }
    assign({ body: value, id });
  };

  // Pre-fill form when API or prop data is available
  useEffect(() => {
    if (userCategories?.data?.length) {
      // ✅ Map API response 'id' to form field
      form.setFieldValue(
        "category_id",
        userCategories.data.map((item: any) => item.id)
      );
    } else if (assign_category?.length > 0) {
      form.setFieldValue(
        "category_id",
        assign_category.map((item) => item.category_id)
      );
    } else {
      form.setFieldValue("category_id", []);
    }
  }, [userCategories, assign_category, form]);

  // Close modal on success
  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal());
      form.resetFields();
    }
  }, [isSuccess, dispatch, form]);

  return (
    <Row justify="center" align="middle" style={{ maxWidth: "auto" }}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Card
            className="border"
            style={{ marginBottom: "1rem", marginTop: "1rem" }}
          >
            <Row align="middle" gutter={[5, 16]}>
              <Col xs={24} sm={24} md={24}>
                <Form.Item
                  label="Category"
                  name="category_id"
                  rules={[{ required: true, message: "Please select category" }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select Category"
                    style={{ width: "100%" }}
                    options={categories?.data?.map((item) => ({
                      value: item.id,
                      label: item.title,
                    }))}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Form.Item>
            <div style={{ textAlign: "end" }}>
              <Button
                htmlType="submit"
                type="primary"
                icon={<SendOutlined />}
                loading={isLoading}
                disabled={!id} // prevent submit if user ID is missing
              >
                Assign
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default AssignCategoryToAdmin;
