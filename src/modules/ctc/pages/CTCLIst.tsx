import { SearchOutlined } from "@ant-design/icons";
import { Card, Input, Select, Space, Table } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import PDFDownload from "../../../common/PDFDownload/PDFDownload";
import { generatePagination } from "../../../common/TablePagination copy";
import { useGetAllCTCQuery } from "../api/ctcEndPoint";
import { ICTCParams } from "../types/ctcTypes";
import { CTCTableColumns } from "../utils/CTCTableColumns";
const { Option } = Select;

const CTCList = () => {
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

  const [filter, setFilter] = useState<ICTCParams>({
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

  const { data, isLoading, isFetching } = useGetAllCTCQuery({ ...filter });

  return (
    <>
      <div>
        <Card
          title={`CTC List`}
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
            {/* <Select
              style={{ width: "180px" }}
              onChange={(e) => setFilter({ ...filter, unit: e, offset: 0 })}
              placeholder="Select Unit Name"
            >
              <Option value="">All</Option>
              <Option value="JTML">JTML</Option>
              <Option value="DIPL">DIPL</Option>
              <Option value="Corporate Office">Corporate Office</Option>
            </Select> */}
            <>
              <PDFDownload
                PDFFileName="CTC_list"
                fileHeader="CTC LIST"
                PDFHeader={[
                  "CTC ID",
                  "CTC Name",
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
                            "CTC ID": employee_id,
                            "CTC Name": name,
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
            </>

            <Space>
              <ExcelDownload
                excelName={"CTC_list"}
                excelTableHead={[
                  "CTC ID",
                  "CTC Name",
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
                            "CTC ID": employee_id,
                            "CTC Name": name,
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
              columns={CTCTableColumns()}
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

export default CTCList;
