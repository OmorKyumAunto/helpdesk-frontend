import { SearchOutlined } from "@ant-design/icons";
import { Card, Input, Select, Space, Table } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import { generatePagination } from "../../../common/TablePagination copy";
import { useGetUnitAdminListQuery } from "../api/adminEndPoint";
import { IAdminParams } from "../types/adminTypes";
import { UnitAdminTableColumns } from "../utils/UnitAdminTableColumns";
const { Option } = Select;

const UnitAdmin = () => {
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

  const [filter, setFilter] = useState<IAdminParams>({
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

  const { data, isLoading, isFetching } = useGetUnitAdminListQuery({ ...filter });

  return (
    <>
      <div>
        <Card
          title={`Admin List`}
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
              style={{ width: "180px" }}
              onChange={(e) => setFilter({ ...filter, unit: e, offset: 0 })}
              placeholder="Select Unit Name"
            >
            <Option value="">All</Option>
                 <Option value="FFL2">FFL2</Option>
                  <Option value="Mawna Fashions Ltd">Mawna Fashions Ltd</Option>
                    <Option value="JTML">JTML</Option>
                    <Option value="DIPL">DIPL</Option>
                    <Option value="Corporate Office">Corporate Office</Option>
                    <Option value="DBTrims Plant">DBTrims Plant</Option>
                    <Option value="PPPL Plant">PPPL Plant</Option>
                    <Option value="EUDB">EUDB</Option>
                    <Option value="Thanbee Complex">Thanbee Complex</Option>
                    <Option value="Flamingo2">Flamingo2</Option>
            </Select>
            <Space>
              <ExcelDownload
                excelName={"Admin_list"}
                excelTableHead={[
                  "Admin ID",
                  "Admin Name",
                  "Department",
                  "Designation",
                  "Email",
                  "Contact No",
                  "Date of Joining",
                  "Unit Name",
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
                        }: any) => {
                          const data = {
                            "Admin ID": employee_id,
                            "Admin Name": name,
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
            </Space>
          </div>
          <div>
            <Table
              rowKey={"id"}
              size="small"
              bordered
              loading={isLoading || isFetching}
              dataSource={data?.data?.length ? data.data : []}
              columns={UnitAdminTableColumns()}
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

export default UnitAdmin;
