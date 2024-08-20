import { Button, Card, Descriptions, Space, Tag } from "antd";
import { useParams } from "react-router-dom";
import { DescriptionsProps } from "antd/lib";
import dayjs from "dayjs";
import { useGetSingleEmployeeQuery } from "../api/employeeEndPoint";
import { ISingleEmployee } from "../types/employeeTypes";
import { setCommonModal } from "../../../app/slice/modalSlice";
import UpdateEmployee from "../components/UpdateEmployee";
import { useDispatch } from "react-redux";
import GlobalLoader from "../../../components/loader/GlobalLoader";
import { useGetMeQuery } from "../../../app/api/userApi";
import { imageURL } from "./../../../app/slice/baseQuery";
import { EditButton } from "../../../common/CommonButton";

const SingleEmployee = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleEmployeeQuery(Number(id));
  const singleEmployee = data?.data as ISingleEmployee;
  const dispatch = useDispatch();
  const { data: profile } = useGetMeQuery();

  const showModal = () => {
    dispatch(
      setCommonModal({
        title: "Update Employee",
        content: <UpdateEmployee employee={singleEmployee} />,
        show: true,
        width: 1000,
      })
    );
  };

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Designation",
      children: singleEmployee?.designation || "N/A",
    },
    {
      key: "11",
      label: "Status",
      children: (
        <Tag color={singleEmployee?.status ? "green" : "red"}>
          {singleEmployee?.status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      key: "12",
      label: "Created By",
      children: singleEmployee?.created_by || "N/A",
    },
    {
      key: "3",
      label: "Mobile No",
      children: singleEmployee?.phone_number || "N/A",
    },
    {
      key: "4",
      label: "Email",
      children: singleEmployee?.email || "N/A",
    },
    {
      key: "5",
      label: "Blood Group",
      children: singleEmployee?.blood_group || "N/A",
    },
    {
      key: "5",
      label: "Base salary",
      children: singleEmployee?.salary || "N/A",
    },
    {
      key: "29",
      label: "Gross salary",
      children: singleEmployee?.gross_salary || "N/A",
    },
    {
      key: "30",
      label: "Yearly tax ",
      children: singleEmployee?.tax || "N/A",
    },

    {
      key: "6",
      label: "Commission",
      children: singleEmployee?.commission || "0",
    },
    {
      key: "7",
      label: "Appointment Date",
      children: singleEmployee?.appointment_date
        ? dayjs(singleEmployee?.appointment_date).format("YYYY-MM-DD")
        : "N/A",
    },
    {
      key: "8",
      label: "Joining Date",
      children: singleEmployee?.joining_date
        ? dayjs(singleEmployee?.joining_date).format("YYYY-MM-DD")
        : "N/A",
    },

    {
      key: "10",
      label: "Address",
      children: singleEmployee?.address || "N/A",
    },
    {
      key: "13",
      label: "Employee Photo",
      children: singleEmployee?.employee_photo ? (
        <img
          src={imageURL + singleEmployee.employee_photo}
          alt="Employee Photo"
        />
      ) : (
        "N/A"
      ),
    },
    {
      key: "14",
      label: "Employee CV",
      children: singleEmployee?.employee_cv ? (
        <a href={imageURL + singleEmployee.employee_cv} target="_blank">
          View CV
        </a>
      ) : (
        "N/A"
      ),
    },
    {
      key: "15",
      label: "Education Certificate",
      children: singleEmployee?.education_certificate ? (
        <a
          href={imageURL + singleEmployee.education_certificate}
          target="_blank"
        >
          View Certificate
        </a>
      ) : (
        "N/A"
      ),
    },
    {
      key: "16",
      label: "Experience Certificate",
      children: singleEmployee?.experience_certificate ? (
        <a
          href={imageURL + singleEmployee.experience_certificate}
          target="_blank"
        >
          View Certificate
        </a>
      ) : (
        "N/A"
      ),
    },
    {
      key: "17",
      label: "NID Number",
      children: singleEmployee?.nid_number || "N/A",
    },
    {
      key: "18",
      label: "NID Photo",
      children: singleEmployee?.nid_photo ? (
        <img src={imageURL + singleEmployee.nid_photo} alt="NID Photo" />
      ) : (
        "N/A"
      ),
    },
    {
      key: "19",
      label: "Banking Document",
      children: singleEmployee?.banking_doc ? (
        <a href={imageURL + singleEmployee.banking_doc} target="_blank">
          View Document
        </a>
      ) : (
        "N/A"
      ),
    },
    {
      key: "20",
      label: "Bio Data",
      children: singleEmployee?.bio_data ? (
        <a href={imageURL + singleEmployee.bio_data} target="_blank">
          View Bio Data
        </a>
      ) : (
        "N/A"
      ),
    },
    {
      key: "21",
      label: "Nominee Name",
      children: singleEmployee?.nominee_name || "N/A",
    },
    {
      key: "22",
      label: "Nominee NID",
      children: singleEmployee?.nominee_nid || "N/A",
    },
    {
      key: "23",
      label: "Nominee NID Photo",
      children: singleEmployee?.nominee_nid_photo ? (
        <img
          src={imageURL + singleEmployee.nominee_nid_photo}
          alt="Nominee NID Photo"
        />
      ) : (
        "N/A"
      ),
    },
    {
      key: "24",
      label: "TIN Number",
      children: singleEmployee?.tin_number || "N/A",
    },
    {
      key: "25",
      label: "TIN Certificate",
      children: singleEmployee?.tin_certificate ? (
        <a href={imageURL + singleEmployee.tin_certificate} target="_blank">
          View Certificate
        </a>
      ) : (
        "N/A"
      ),
    },
    {
      key: "26",
      label: "Other Documents",
      children: singleEmployee?.other_documents ? (
        <a href={imageURL + singleEmployee.other_documents} target="_blank">
          View Documents
        </a>
      ) : (
        "N/A"
      ),
    },
    {
      key: "27",
      label: "Casual leave",
      children: `${singleEmployee?.total_casual_leaves}(10)`,
    },
    {
      key: "28",
      label: "Sick leave",
      children: `${singleEmployee?.total_sick_leaves}(14)`,
    },
    {
      key: "27",
      label: "Annual leave",
      children: `${singleEmployee?.total_annual_leaves}(18)`,
    },
  ];

  return (
    <>
      {isLoading ? (
        <GlobalLoader />
      ) : (
        <Card
          title={`Details of employee ${singleEmployee?.name}`}
          extra={
            // <CommonTooltip title={"Edit"}>

            <>
              {profile?.data?.role_id !== 3 && (
                <Space>
                  <EditButton onClick={() => showModal()} />
                </Space>
              )}
            </>

            // </CommonTooltip>
          }
        >
          <Descriptions bordered items={items} size="small" />
        </Card>
      )}
    </>
  );
};

export default SingleEmployee;
