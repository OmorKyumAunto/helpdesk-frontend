import { Button, Descriptions, Popconfirm, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { RootState } from "../../../app/store/store";
import { useEmployeeAssignToAdminMutation } from "../api/employeeEndPoint";
import { IEmployee } from "../types/employeeTypes";

const EmployeeDetails = ({ employee }: { employee: IEmployee }) => {
  // console.log(employee);
  const { roleId } = useSelector((state: RootState) => state.userSlice);
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
    blood_group,
    grade,
    line_of_business,
    business_type,
    pabx,
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
        column={{ sm: 1, md: 2 }}
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
            key: "11",
            label: "Blood Group",
            children: blood_group,
          },
          {
            key: "7",
            label: "Unit Name",
            children: unit_name,
          },
          // {
          //   key: "8",
          //   label: "Joining Date",
          //   children: joining_date
          //     ? dayjs(joining_date).format("DD-MM-YYYY")
          //     : "N/A",
          // },
          {
            key: "12",
            label: "Business Type",
            children: business_type,
          },
          {
            key: "13",
            label: "Line of Business",
            children: line_of_business,
          },
          {
            key: "14",
            label: "Grade",
            children: grade,
          },
          {
            key: "15",
            label: "PABX",
            children: pabx,
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
          ...(roleId !== 3
            ? [
                {
                  key: "10",
                  label: "Licenses",
                  children: licenses?.map((item) => item?.title).join(", "),
                  span: 2,
                },
              ]
            : []),
          ...(role_id === 3 && roleId === 1
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
