import { SearchOutlined } from "@ant-design/icons";
import { Card, Input, Select, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
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
            <Select
              allowClear
              style={{ width: "160px" }}
              onChange={(e) => setFilter({ ...filter, unit_name: e, offset: 0 })}
              placeholder="Select Unit Name"
            >
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

            <Space>
              <ExcelDownload
                excelName={"ctc_list"}
                excelTableHead={[
                  "Employee ID",
                  "Employee Name",
                  "Department",
                  "Designation",
                  "Assets",
                  "Unit Name",
                  "Total Asset Cost",
                  "Monthly Asset Cost",
                  "Licenses",
                  "Monthly Licenses Cost",
                  "Total CTC Per Month",
                  "Total CTC Per Year",
                ]}
                excelData={
                  data?.data?.length
                    ? data?.data?.map(
                      ({
                        employee_id,
                        name,
                        department,
                        designation,
                        assets = [],
                        unit_name,
                        total_asset_price,
                        monthly_asset_cost,
                        licenses = [],
                        montly_licenses_price,
                        total_ctc_per_month,
                        total_ctc_per_year,
                      }) => {
                        const assetItemCount = assets.reduce<Record<string, number>>((acc, item) => {
                          const category = item?.category;
                          if (category) {
                            acc[category] = (acc[category] || 0) + 1;
                          }
                          return acc;
                        }, {});

                        const assetString = Object.entries(assetItemCount)
                          .map(([category, count]) => `${count}x ${category}`)
                          .join(", ");

                        const licenseString = licenses.map((item) => item?.title).join(", ");

                        return {
                          "Employee ID": employee_id,
                          "Employee Name": name,
                          Department: department,
                          Designation: designation,
                          Assets: assetString,
                          "Unit Name": unit_name,
                          "Total Asset Cost": total_asset_price,
                          "Monthly Asset Cost": monthly_asset_cost,
                          Licenses: licenseString,
                          "Monthly Licenses Cost": montly_licenses_price,
                          "Total CTC Per Month": total_ctc_per_month,
                          "Total CTC Per Year": total_ctc_per_year,
                        };
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
                pageSizeOptions: ["50", "100", "200", "300", "500", "1000", "5000", "7000"],
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
