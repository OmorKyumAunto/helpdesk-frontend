import { SearchOutlined } from "@ant-design/icons";
import { Card, Input, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { generatePagination } from "../../../common/TablePagination copy";
import { useGetEmployeesQuery } from "../api/employeeEndPoint";
import { IEmployeeParams } from "../types/employeeTypes";
import { EmployeeTableColumnsForEmployeePanel } from "../utils/EmployeeTableColumnsForEmployeePanel";
const { Option } = Select;

const EmployeeListForEmployeePanel = () => {
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

  const { data, isLoading, isFetching } = useGetEmployeesQuery({
    ...filter,
  });

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
            <Select
              style={{ width: "180px" }}
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
            {/* <>
              <PDFDownload
                PDFFileName="employee_list"
                fileHeader="EMPLOYEE LIST"
                PDFHeader={[
                  "Employee ID",
                  "Employee Name",
                  "Department",
                  "Designation",
                  "Email",
                  "Contact No",
                  "Date of Joining",
                  "Unit Name",
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
                        }: any) => {
                          const data = {
                            "Employee ID": employee_id,
                            "Employee Name": name,
                            Department: department,
                            Designation: designation,
                            Email: email,
                            "Contact No": contact_no,
                            "Date of Joining":
                              dayjs(joining_date).format("DD-MM-YYYY"),
                            "Unit Name": unit_name,
                          };
                          return data;
                        }
                      )
                    : []
                }
              />
            </> */}
            {/* <Space>
              <ExcelDownload
                excelName={"employee_list"}
                excelTableHead={[
                  "Employee ID",
                  "Employee Name",
                  "Department",
                  "Designation",
                  "Email",
                  "Contact No",
                  "Date of Joining",
                  "Unit Name",
                  "Licenses",
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
                        }: any) => {
                          const data = {
                            "Employee ID": employee_id,
                            "Employee Name": name,
                            Department: department,
                            Designation: designation,
                            Email: email,
                            "Contact No": contact_no,
                            "Date of Joining":
                              dayjs(joining_date).format("DD-MM-YYYY"),
                            "Unit Name": unit_name,
                            Licenses: licenses,
                          };
                          return data;
                        }
                      )
                    : []
                }
              />
            </Space> */}
          </div>
          <div>
            <Table
              rowKey={"id"}
              size="small"
              bordered
              loading={isLoading || isFetching}
              dataSource={data?.data?.length ? data.data : []}
              columns={EmployeeTableColumnsForEmployeePanel()}
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
                pageSizeOptions: ["50", "100", "200", "300", "500"],
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

export default EmployeeListForEmployeePanel;
