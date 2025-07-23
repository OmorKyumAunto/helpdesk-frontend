import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Card, Button, Input, Dropdown, Select, Space, Table } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { CreateButton } from "../../../common/CommonButton";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import { generatePagination } from "../../../common/TablePagination copy";
import { useGetEmployeesQuery } from "../api/employeeEndPoint";
import CreateEmployee from "../components/CreateEmployee";
import { IEmployeeParams } from "../types/employeeTypes";
import { EmployeeTableColumns } from "../utils/EmployeeTableColumns";
import EmployeeFileUpdate from "./EmployeeFileUpdate";
const { Option } = Select;

const EmployeeList = () => {
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
  });

  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    pageSize: "50",
  });
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "50";
  const skipValue = (Number(page) - 1) * Number(pageSize);

  const [filter, setFilter] = useState<IEmployeeParams>({
    limit: Number(pageSize),
    offset: skipValue,
  });

  useEffect(() => {
    setFilter({
      ...filter,
      limit: Number(pageSize),
      offset: skipValue,
    });
  }, [page, pageSize, skipValue]);

  const { data, isLoading, isFetching } = useGetEmployeesQuery({ ...filter });
  // const { data: allEmployees } = useGetOverallEmployeesQuery();

  const showModal = () => {
    dispatch(
      setCommonModal({
        title: "Create Employee",
        content: <CreateEmployee />,
        show: true,
        width: 678,
      })
    );
  };

  return (
    <>
      <div>
        <Card
          title={`Employee List`}
          style={{
            boxShadow: "0 0 0 1px rgba(0,0,0,.05)",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: "12px",
            }}
          >

            <div>
              <Input
                style={{ width: "160px" }}
                prefix={<SearchOutlined />}
                onChange={(e) =>
                  setFilter({ ...filter, key: e.target.value, offset: 0 })
                }
                placeholder="Search..."
              />
            </div>
            <Select
              style={{ width: "160px", marginBottom: 8 }}
              onChange={(e) => setFilter({ ...filter, unit_name: e, offset: 0 })}
              placeholder="Select Unit Name"
            >
              <Option value="">All</Option>
              {[
                'Sylhet EZ',
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
                'Mawna Fashions Ltd',
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
            <Dropdown
              trigger={["hover"]}
              dropdownRender={() => (
                <div
                  style={{
                    padding: 16,
                    background: "#fff",
                    borderRadius: 8,
                    width: "160px",
                    border: "1px solid #f2f2f2",
                  }}
                >


                  <Select
                    style={{ width: "160px", marginBottom: 8 }}
                    onChange={(e) => setFilter({ ...filter, status: e, offset: 0 })}
                    placeholder="Select Status"
                  >
                    <Option value="">All</Option>
                    <Option value={1}>Active</Option>
                    <Option value={2}>Inactive</Option>
                  </Select>
                  <Select
                    style={{ width: "160px", marginBottom: 8 }}
                    onChange={(e) =>
                      setFilter({ ...filter, employee_type: e, offset: 0 })
                    }
                    placeholder="Employee Type"
                  >
                    <Option value="">All</Option>
                    <Option value={"management"}>Management</Option>
                    <Option value={"non-management"}>Non Management</Option>
                  </Select>


                  <Select
                    style={{ width: "160px", marginBottom: 8 }}
                    onChange={(e) =>
                      setFilter({ ...filter, blood_group: e, offset: 0 })
                    }
                    placeholder="Select Blood Group"
                  >
                    <Option value="">All</Option>
                    <Option value="A+">A+</Option>
                    <Option value="A-">A-</Option>
                    <Option value="B+">B+</Option>
                    <Option value="B-">B-</Option>
                    <Option value="AB+">AB+</Option>
                    <Option value="AB-">AB-</Option>
                    <Option value="O+">O+</Option>
                    <Option value="O-">O-</Option>
                  </Select>
                </div>
              )}
            >
              <Button icon={<FilterOutlined />}>Filters</Button>
            </Dropdown>



            <>
              {/* <PDFDownload
                PDFFileName="employee_list"
                fileHeader="EMPLOYEE LIST"
                PDFHeader={[
                  "Employee ID",
                  "Employee Name",
                  "Department",
                  "Designation",
                  "Email",
                  "Contact No",
                  "Blood Group",
                  "Date of Joining",
                  "Unit Name",
                  "Business Type",
                  "Line of Business",
                  "Grade",
                  "PABX",
                ]}
                PDFData={
                  data?.data?.length
                    ? data?.data?.map(
                        ({
                          employee_id,
                          name,
                          department,
                          designation,
                          email,
                          contact_no,
                          joining_date,
                          unit_name,
                          blood_group,
                          business_type,
                          line_of_business,
                          grade,
                          pabx,
                        }: any) => {
                          const data = {
                            "Employee ID": employee_id,
                            "Employee Name": name,
                            Department: department,
                            Designation: designation,
                            Email: email,
                            "Contact No": contact_no,
                            "Blood Group": blood_group,
                            "Date of Joining":
                              dayjs(joining_date).format("DD-MM-YYYY"),
                            "Unit Name": unit_name,
                            "Business Type": business_type,
                            "Line of Business": line_of_business,
                            Grade: grade,
                            PABX: pabx,
                          };
                          return data;
                        }
                      )
                    : []
                }
              /> */}
            </>

              <ExcelDownload
                excelName={"employee_list"}
                excelTableHead={[
                  "Employee ID",
                  "Employee Name",
                  "Department",
                  "Designation",
                  "Email",
                  "Contact No",
                  "Blood Group",
                  "Date of Joining",
                  "Location",
                  "Business Type",
                  "Line of Business",
                  "Grade",
                  "PABX",
                ]}
                excelData={
                  data?.data?.length
                    ? data?.data?.map(
                      ({
                        employee_id,
                        name,
                        department,
                        designation,
                        email,
                        contact_no,
                        joining_date,
                        unit_name,
                        licenses,
                        blood_group,
                        business_type,
                        line_of_business,
                        grade,
                        pabx,
                      }: any) => {
                        const data = {
                          "Employee ID": employee_id,
                          "Employee Name": name,
                          Department: department,
                          Designation: designation,
                          Email: email,
                          "Contact No": contact_no,
                          "Blood Group": blood_group,
                          "Date of Joining":
                            dayjs(joining_date).format("DD-MM-YYYY"),
                          Location: unit_name,
                          Licenses: licenses,
                          "Business Type": business_type,
                          "Line of Business": line_of_business,
                          Grade: grade,
                          PABX: pabx,
                        };
                        return data;
                      }
                    )
                    : []
                }
              />
            <CreateButton
              name="Upload"
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Upload Employee",
                    content: <EmployeeFileUpdate />,
                    show: true,
                    width: 400,
                  })
                );
              }}
            />
            <CreateButton name="Create" onClick={showModal} />
          </div>
          <div>
            <Table
              rowKey={"id"}
              size="small"
              bordered
              loading={isLoading || isFetching}
              dataSource={data?.data?.length ? data.data : []}
              columns={EmployeeTableColumns()}
              scroll={{ x: true }}
              pagination={{
                ...generatePagination(
                  Number(data?.total),
                  setPagination,
                  pagination
                ),
                current: Number(page),
                showSizeChanger: true,
                defaultPageSize: 50,
                pageSizeOptions: ["50", "100", "200", "300", "500", "1000", "3000"],
                total: data ? Number(data?.total) : 0,
                showTotal: (total) => `Total ${total} `,
              }}
              onChange={(pagination) => {
                setSearchParams({
                  page: String(pagination.current),
                  pageSize: String(pagination.pageSize),
                });
                setFilter({
                  ...filter,
                  offset:
                    ((pagination.current || 1) - 1) *
                    (pagination.pageSize || 50),
                  limit: pagination.pageSize!,
                });
              }}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default EmployeeList;
