import React from "react";
import { IEmployee } from "../types/adminTypes";
import { Descriptions, Tag } from "antd";
import dayjs from "dayjs";

const EmployeeDetails = ({ employee }: { employee: IEmployee }) => {
  console.log(employee);
  const {
    id,
    employee_id,
    name,
    designation,
    department,
    email,
    contact_no,
    joining_date,
    unit_name,
    status,
  } = employee || {};
  return (
    <div>
      <Descriptions
        size="middle"
        bordered
        column={2}
        items={[
          {
            key: "2",
            label: "Employee Name",
            children: name,
            span: 2,
          },
          {
            key: "1",
            label: "Employee id",
            children: employee_id,
          },
          {
            key: "3",
            label: "Designation",
            children: designation,
          },
          {
            key: "4",
            label: "Department",
            children: department,
          },
          {
            key: "5",
            label: "Email",
            children: email,
          },
          {
            key: "6",
            label: "Contact No",
            children: contact_no,
          },
          {
            key: "7",
            label: "Unit Name",
            children: unit_name,
          },
          {
            key: "8",
            label: "Joining Date",
            children: joining_date
              ? dayjs(joining_date).format("DD-MM-YYYY")
              : "N/A",
          },
          {
            key: "9",
            label: "Status",
            children:
              status === 1 ? (
                <Tag color="success">Active</Tag>
              ) : (
                <Tag color="error">Inactive</Tag>
              ),
          },
        ]}
      />
    </div>
  );
};

export default EmployeeDetails;
