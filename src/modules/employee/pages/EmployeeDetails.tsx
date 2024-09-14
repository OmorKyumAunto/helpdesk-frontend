import React, { useEffect } from "react";
import { IEmployee } from "../types/employeeTypes";
import { Button, Descriptions, Divider, Popconfirm, Tag } from "antd";
import dayjs from "dayjs";
import { useEmployeeAssignToAdminMutation } from "../api/employeeEndPoint";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useDispatch } from "react-redux";

const EmployeeDetails = ({ employee }: { employee: IEmployee }) => {
  // console.log(employee);
  const dispatch = useDispatch();
  const [assignToAdmin, { isSuccess }] = useEmployeeAssignToAdminMutation();
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
    licenses,
    role_id,
  } = employee || {};
  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal());
    }
  }, [isSuccess, dispatch]);
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
          {
            key: "10",
            label: "Licenses",
            children: licenses,
            span: 2,
          },
          ...(role_id === 3
            ? [
                {
                  key: "11",
                  label: "Make Admin",
                  children: (
                    <>
                      <Popconfirm
                        title="Assign to admin"
                        description="Are you sure to assign this employee as an admin?"
                        onConfirm={() => assignToAdmin(id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button size="small" type="primary">
                          Confirm Admin
                        </Button>
                      </Popconfirm>
                    </>
                  ),
                  span: 2,
                },
              ]
            : []),
        ]}
      />
    </div>
  );
};

export default EmployeeDetails;
