/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, Row, Select, Tabs } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetMeQuery } from "../../../app/api/userApi";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { DateInput } from "../../../common/formItem/FormItems";
import { validateMobileNumber } from "../../../common/phoneNumberValidator";
import { useGetLicensesQuery } from "../../Licenses/api/licenseEndPoint";
import { useUpdateEmployeeMutation } from "../api/employeeEndPoint";
import { IEmployee, IFromData } from "../types/employeeTypes";
import { avatarGradient, getAvatarColor, getInitials, LINE } from "../utils/avatar";
const { Option } = Select;

const UpdateEmployee = ({ employee }: { employee: IEmployee }) => {
  const { data: profile } = useGetMeQuery();
  const employeeID = profile?.data?.employee_id;
  const {
    id,
    role_id,
    employee_id,
    name,
    designation,
    department,
    email,
    contact_no,
    joining_date,
    unit_name,
    status,
    licenses,
    blood_group,
    business_type,
    line_of_business,
    grade,
    pabx,
    date_of_birth,
  } = employee || {};
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("basic");

  // Fields that live on each tab — used to jump to the right tab on a
  // validation error that's on a hidden tab.
  const TAB_FIELDS: Record<string, string[]> = {
    basic: [
      "employee_id",
      "name",
      "designation",
      "contact_no",
      "email",
      "department",
      "date_of_birth",
      "blood_group",
    ],
    work: [
      "joining_date",
      "unit_name",
      "business_type",
      "line_of_business",
      "grade",
      "pabx",
      "licenses",
    ],
  };

  const onFinishFailed = ({ errorFields }: any) => {
    const firstField = errorFields?.[0]?.name?.[0];
    if (firstField && !TAB_FIELDS[activeTab].includes(firstField)) {
      setActiveTab(TAB_FIELDS.basic.includes(firstField) ? "basic" : "work");
    }
  };
  const [UpdateEmployee, { isLoading, isSuccess }] =
    useUpdateEmployeeMutation();
  const { data } = useGetLicensesQuery({ status: "active" });
  const { refetch } = useGetMeQuery();
  
  useEffect(() => {
    // FIX: Handle licenses being either array or empty string
    const licenseIds = Array.isArray(licenses) ? licenses?.map((item) => item?.id) : [];
    
    form.setFieldsValue({
      employee_id,
      name,
      department,
      designation,
      email,
      contact_no,
      unit_name,
      status,
      licenses: licenseIds,
      blood_group,
      business_type,
      line_of_business,
      grade,
      pabx,
    });
    if (joining_date) {
      form.setFieldValue("joining_date", dayjs(joining_date));
    } else {
      form.setFieldValue("joining_date", null);
    }
    if (date_of_birth) {
      form.setFieldValue("date_of_birth", dayjs(date_of_birth));
    } else {
      form.setFieldValue("date_of_birth", null);
    }
  }, [
    form,
    employee_id,
    name,
    department,
    designation,
    email,
    contact_no,
    unit_name,
    status,
    joining_date,
    licenses,
    blood_group,
    business_type,
    line_of_business,
    grade,
    pabx,
    date_of_birth,
  ]);

  const onFinish = (values: IFromData) => {
    const formattedData: any = {};

    for (const key in values) {
      if (values[key]) {
        if (key === "joining_date" || key === "date_of_birth") {
          formattedData[key] = dayjs(values[key]).format("YYYY-MM-DD");
        } else {
          formattedData[key] = values[key];
        }
      }
    }

    UpdateEmployee({ data: formattedData, id });
  };
  
  useEffect(() => {
    if (isSuccess) {
      refetch();
      dispatch(setCommonModal());
    }
  }, [isSuccess]);
  
  const headerColor = getAvatarColor(name || employee_id);

  return (
    <Form layout="vertical" form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
      {/* Header band */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: 18,
          borderRadius: 12,
          background: headerColor.bg,
          border: `1px solid ${LINE}`,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 14,
            background: avatarGradient(headerColor),
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 680,
            fontSize: 19,
            flexShrink: 0,
            boxShadow: `0 6px 14px ${headerColor.fg}45`,
          }}
        >
          {getInitials(name)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 680, color: "#101828" }}>{name || "Edit Employee"}</div>
          <div style={{ fontSize: 13, color: "#667085" }}>
            {designation || "—"}
            {employee_id ? ` · ${employee_id}` : ""}
          </div>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "basic",
            label: "Basic Info",
            forceRender: true,
            children: (
              <Row gutter={[16, 4]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="employee_id"
              rules={[{ required: true }]}
              label="Employee ID"
              required
            >
              <Input
                placeholder="Enter Employee ID"
                type="text"
                disabled={employeeID === "Assetteam" || employeeID === "Laxfo"}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="name"
              rules={[{ required: true }]}
              label="Employee Name"
              required
            >
              <Input placeholder="Enter Employee Name" type="text" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="designation"
              label="Employee Designation"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter Employee Designation" type="text" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="contact_no"
              label="Contact No"
              rules={[{ required: true, validator: validateMobileNumber }]}
            >
              <Input addonBefore="+88" placeholder="Enter Contact No" type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Employee Email" name="email" rules={[{ required: true }]}>
              <Input placeholder="Enter employee email" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Employee Department"
              name="department"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter employee department" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <DateInput
              label="Date of Birth"
              name="date_of_birth"
              placeholder="Select Date of Birth"
            />
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Blood Group" name="blood_group">
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
              </Row>
            ),
          },
          {
            key: "work",
            label: "Employment Details",
            forceRender: true,
            children: (
              <Row gutter={[16, 4]}>
          <Col xs={24} sm={12}>
            <DateInput
              label="Date of Joining"
              name="joining_date"
              placeholder="Select Joining Date"
              rules={[{ required: true }]}
            />
          </Col>
          <Col xs={24} sm={12}>
                  <Form.Item
                    label="Payroll Unit"
                    name="unit_name"
                    rules={[{ required: true, message: "Please Select Unit" }]}
                  >
                    <Select placeholder="Select Unit Name">
                      {[
                        'Sylhet EZ',
                        'Laxfo Electronics Ltd',
                        'Corporate Office',
                        'Jinnat Apparels Ltd',
                        'Jinnat Knitwears Ltd',
                        'Jinnat Fashions Ltd',
                        'Matin Spinning Mills PLC',
                        'Thanbee Print World Ltd',
                        'Hamza Textiles Ltd',
                        'Flamingo Fashions Ltd',
                        'DB Tex Ltd',
                        'Dulal Brothers Ltd',
                        'Color City Ltd',
                        'DBL Digital Ltd',
                        'Parkway Packaging and Printing Ltd',
                        'Mymun Textiles Ltd',
                        'DBL Pharmaceuticals Ltd',
                        'DBL Ceramics Ltd',
                        'DBL Telecom Ltd',
                        'DBL Distributions Ltd',
                        'DBL Lifestyles Ltd',
                        'Digital Corporate',
                        'ECO Thread Plant',
                        'DBL Dredging Ltd.',
                        'Farmgate Office',
                        'Mawna Fashions Ltd.',
                        'Ceramics Plant',
                        'DB TRIMS Ltd.',
                        'Jinnat Complex',
                        'Mymun Complex',
                        'Glory Textile and Apparels Limited',
                        'DBL Industrial Park Ltd',
                        'Knitting',
                        'Thanbee Complex',
                        'DBL Textile Recycling Ltd',
                        'Matin Complex',
                        'Jinnat Textile Mills Ltd',
                        'Textile Testing Services Ltd',
                        'Atelier Sourcing Ltd',
                        'Mawna Fashings Ltd',
                        'DBL Tours and Travels Limited',
                        'Chittagong C and F Office',
                        'Ceramics Field',
                        'Flamingo2',
                        'Dredging Office',
                        'JKL2',
                        'Pharma Field',
                        'Pharma Plant',
                        'Lifestyle Corporate',
                        'Pharma Corporate',
                        'ECO Thread Corporate',
                        'DBTrims Plant',
                        'Ceramics Corporate',
                        'PPPL Corporate',
                        'EUDB Accessories Limited',
                        'PPPL Plant',
                        'DBL Healthcare Ltd',
                        'EUDB',
                        'DBLCL',
                        'Jinnat Knitting Ltd',
                        'DBL Pharma',
                        'FFL2',
                        'eco Plant',
                        'MSML Complex',
                        'DTRL (Matin Complex)',
                      ].map((unit) => (
                        <Option key={unit} value={unit}>
                          {unit}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Business Type"
                    name="business_type"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Enter business type" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Line of Business"
                    name="line_of_business"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Enter line of business" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Grade"
                    name="grade"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Enter grade" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="PABX" name="pabx">
                    <InputNumber style={{ width: "100%" }} placeholder="Enter pabx" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Licenses"
                    name="licenses"
                  // rules={[
                  //   { required: true, message: "Please Select License Type" },
                  // ]}
                  >
                    <Select
                      mode="multiple"
                      disabled={
                        role_id === 3 && profile?.data?.role_id === 3
                          ? true
                          : false
                      }
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
                      options={data?.data?.map((item) => ({
                        value: item.id,
                        label: item.title,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
            ),
          },
        ]}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
          marginTop: 4,
        }}
      >
        <Button icon={<CloseOutlined />} onClick={() => dispatch(setCommonModal())}>
          Cancel
        </Button>
        <Button htmlType="submit" type="primary" icon={<SendOutlined />} loading={isLoading}>
          Update Employee
        </Button>
      </div>
    </Form>
  );
};

export default UpdateEmployee;