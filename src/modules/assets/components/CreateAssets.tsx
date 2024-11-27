/* eslint-disable @typescript-eslint/no-explicit-any */
import { SendOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { DateInput } from "../../../common/formItem/FormItems";
import { validateMobileNumber } from "../../../common/phoneNumberValidator";
import { useGetOverallEmployeesQuery } from "../../employee/api/employeeEndPoint";
import { useGetLicensesQuery } from "../../Licenses/api/licenseEndPoint";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useCreateAssetsMutation } from "../api/assetsEndPoint";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useGetActiveLocationsQuery } from "../../location/api/locationEndPoint";
const { Option } = Select;

const CreateAsset = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const assignType = Form.useWatch("is_assign", form);
  const employeeType = Form.useWatch("is_new_employee", form);
  const licenseType = Form.useWatch("need_license", form);
  const unitId = Form.useWatch("unit_id", form);
  const { data } = useGetOverallEmployeesQuery();
  const { data: unitData } = useGetUnitsQuery({ status: "active" });
  const { data: licenseData } = useGetLicensesQuery({ status: "active" });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [create, { isLoading, isSuccess }] = useCreateAssetsMutation();
  const { data: profile } = useGetMeQuery();
  const { data: location } = useGetActiveLocationsQuery({});

  const unitOptionForAdmin = unitData?.data?.filter((unit) =>
    profile?.data?.searchAccess?.some((item: any) => item?.unit_id === unit?.id)
  );
  const unitOption =
    profile?.data?.role_id === 2 ? unitOptionForAdmin : unitData?.data;

  const locationOption = location?.data?.filter(
    (item) => item.unit_id === unitId
  );

  const onFinish = (data: any) => {
    const { is_assign, is_new_employee, ...values } = data || {};
    const formattedData: any = {};
    formattedData["is_assign"] = is_assign;
    formattedData["is_new_employee"] = is_new_employee;
    for (const key in values) {
      if (values[key]) {
        if (
          key === "purchase_date" ||
          key === "assign_date" ||
          key === "joining_date"
        ) {
          formattedData[key] = dayjs(values[key]).format("YYYY-MM-DD");
        } else {
          formattedData[key] = values[key];
        }
      }
    }

    // console.log(formattedData);
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
            is_assign: 0,
            purchase_date: dayjs(),
            assign_date: dayjs(),
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
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  name="name"
                  rules={[{ required: true }]}
                  label="Asset Name"
                  required
                >
                  <Input placeholder="Enter Asset Name" type="text" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Category"
                  name="category"
                  rules={[
                    { required: true, message: "Please Select Category" },
                  ]}
                >
                  <Select placeholder="Select Category">
                    <Option value="Laptop">Laptop</Option>
                    <Option value="Desktop">Desktop</Option>
                    <Option value="Monitor">Monitor</Option>
                    <Option value="Printer">Printer</Option>
                    <Option value="Mouse">Mouse</Option>
                    <Option value="Keyboard">Keyboard</Option>
                    <Option value="Accessories">Accessories</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  name="model"
                  rules={[{ required: true }]}
                  label="Model"
                  required
                >
                  <Input placeholder="Enter Model" type="text" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={8}>
                <DateInput
                  label="Purchase Date"
                  name="purchase_date"
                  placeholder="Select Purchase Date"
                  rules={[{ required: true }]}
                />
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Asset Price"
                  name="price"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={0}
                    className="w-full"
                    placeholder="Enter asset price"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Serial Number"
                  name="serial_number"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter serial no" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="PO Number"
                  name="po_number"
                  // rules={[{ required: true }]}
                >
                  <Input placeholder="Enter po number" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Buying Unit"
                  name="unit_id"
                  rules={[{ required: true, message: "Please Select Unit" }]}
                >
                  <Select
                    className="w-full "
                    placeholder="Select Buying Unit"
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
                    options={unitOption?.map((unit: any) => ({
                      value: unit.id,
                      label: unit.title,
                    }))}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Location"
                  name="location"
                  // rules={[
                  //   { required: true, message: "Please Select Location" },
                  // ]}
                >
                  <Select
                    className="w-full "
                    placeholder="Select Location"
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
                    options={locationOption?.map((location: any) => ({
                      value: location.id,
                      label: location.location,
                    }))}
                    allowClear
                  />
                </Form.Item>
              </Col>
              {/* <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Asset History"
                  name="asset_history"
                  rules={[
                    { required: true, message: "Please Select Assign Type" },
                  ]}
                >
                  <Input placeholder="Enter Asset History" />
                </Form.Item>
              </Col> */}
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Assign "
                  name="is_assign"
                  rules={[{ required: true, message: "Please Select Assign " }]}
                >
                  <Select placeholder="Select Assign ">
                    <Option value={1}>Yes</Option>
                    <Option value={0}>No</Option>
                  </Select>
                </Form.Item>
              </Col>
              {assignType === 1 && (
                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    label="Employee Type "
                    name="is_new_employee"
                    rules={[
                      {
                        required: true,
                        message: "Please Select Employee Type ",
                      },
                    ]}
                  >
                    <Select placeholder="Select Employee Type ">
                      <Option value={0}>Old Employee</Option>
                      <Option value={1}>New Employee</Option>
                    </Select>
                  </Form.Item>
                </Col>
              )}
              {employeeType === 0 && (
                <>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      name="user_id"
                      rules={[{ required: true }]}
                      label="Employee ID"
                      required
                    >
                      <Select
                        className="w-full "
                        placeholder="Select Employee"
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
                        options={data?.data?.map((employee: any) => ({
                          value: employee.id,
                          label: `${employee.employee_id} (${employee.name})`,
                        }))}
                        allowClear
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <DateInput
                      label="Assign Date"
                      name="assign_date"
                      placeholder="Select Assign Date"
                      rules={[{ required: true }]}
                    />
                  </Col>
                </>
              )}
              {employeeType === 1 && (
                <>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      name="employee_id"
                      rules={[{ required: true }]}
                      label="Employee ID"
                      required
                    >
                      <Input placeholder="Enter Employee ID" type="text" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      name="employee_name"
                      rules={[{ required: true }]}
                      label="Employee Name"
                      required
                    >
                      <Input placeholder="Enter Employee Name" type="text" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      name="designation"
                      label="Employee Designation"
                      rules={[{ required: true }]}
                    >
                      <Input
                        placeholder="Enter Employee Designation"
                        type="text"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      name="contact_no"
                      label="Contact No"
                      rules={[
                        { required: true, validator: validateMobileNumber },
                      ]}
                    >
                      <Input
                        addonBefore="+88"
                        placeholder="Enter Contact No"
                        type="number"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      label="Employee Email"
                      name="email"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Enter employee email" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      label="Employee Department"
                      name="department"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Enter employee department" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <DateInput
                      label="Assign Date"
                      name="assign_date"
                      placeholder="Select Assign Date"
                      rules={[{ required: true }]}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <DateInput
                      label="Date of Joining"
                      name="joining_date"
                      placeholder="Select Joining Date"
                      rules={[{ required: true }]}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      label="Unit Name"
                      name="employee_unit_name"
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
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      label="Business Type"
                      name="business_type"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Enter business type" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      label="Line of Business"
                      name="line_of_business"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Enter line of business" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      label="Grade"
                      name="grade"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Enter grade" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      label="Blood Group"
                      name="blood_group"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Please select blood group",
                      //   },
                      // ]}
                    >
                      <Select showSearch placeholder="Select Blood Group">
                        <Option value="A+">A+</Option>
                        <Option value="A-">A-</Option>
                        <Option value="B+">B+</Option>
                        <Option value="B-">B-</Option>
                        <Option value="AB+">AB+</Option>
                        <Option value="AB-">AB-</Option>
                        <Option value="O+">O+</Option>
                        <Option value="O-">O-</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item label="PABX" name="pabx">
                      <InputNumber
                        className="w-full"
                        placeholder="Enter pabx"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      label="Need License"
                      name="need_license"
                      rules={[
                        {
                          required: true,
                          message: "Please Select License Type",
                        },
                      ]}
                    >
                      <Select placeholder="Select License Type">
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  {licenseType === "Yes" && (
                    <Col xs={24} sm={24} md={16}>
                      <Form.Item
                        label="Licenses"
                        name="licenses"
                        rules={[
                          {
                            required: true,
                            message: "Please Select License Type",
                          },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          placeholder="Select License"
                          value={selectedItems}
                          onChange={setSelectedItems}
                          style={{ width: "100%" }}
                          filterOption={(
                            input: string,
                            option?: { label: string; value: number }
                          ) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={licenseData?.data?.map((item) => ({
                            value: item.id,
                            label: item.title,
                          }))}
                        />
                      </Form.Item>
                    </Col>
                  )}
                </>
              )}

              <Col xs={24} sm={24} md={24}>
                <Form.Item
                  name="specification"
                  // rules={[{ required: true }]}
                  label="Specification"
                >
                  <TextArea placeholder="Enter Specification" />
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
