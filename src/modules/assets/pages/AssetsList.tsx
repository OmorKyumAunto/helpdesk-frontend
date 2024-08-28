import { Card, Col, Input, Row, Select, Space, Table } from "antd";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IAssetParams } from "../types/assetsTypes";
import {
  useGetAssetsQuery,
  useGetOverallAssetsQuery,
} from "../api/assetsEndPoint";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { AssetsTableColumns } from "../utils/AssetsTableColumns";
import { CreateButton } from "../../../common/CommonButton";
import CreateAsset from "../components/CreateAssets";
import {
  generatePagination,
  tablePagination,
} from "../../../common/TablePagination copy";
import { SearchOutlined } from "@ant-design/icons";
import UploadAssetFile from "../components/UploadAssetFile";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import PDFDownload from "../../../common/PDFDownload/PDFDownload";

const AssetsList = () => {
  const { Option } = Select;
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

  const [filter, setFilter] = useState<IAssetParams>({
    limit: Number(pageSize),
    offset: skipValue,
  });

  useEffect(() => {
    setFilter({
      limit: Number(pageSize),
      offset: skipValue,
    });
  }, [page, pageSize, skipValue]);
  const { data, isLoading } = useGetAssetsQuery({ ...filter });
  const { data: allAsset } = useGetOverallAssetsQuery();

  const showModal = () => {
    dispatch(
      setCommonModal({
        title: "Create Assets",
        content: <CreateAsset />,
        show: true,
        width: 678,
      })
    );
  };

  return (
    <>
      <div>
        <Card
          title={`Assets List `}
          style={{
            boxShadow: "0 0 0 1px rgba(0,0,0,.05)",
            marginBottom: "1rem",
          }}
          extra={
            <Space>
              <Input
                style={{ width: "100%" }}
                prefix={<SearchOutlined />}
                onChange={(e) =>
                  setFilter({ ...filter, key: e.target.value, offset: 0 })
                }
                placeholder="Search..."
              />

              <Select
                allowClear
                style={{ width: "180px" }}
                onChange={(e) => setFilter({ ...filter, type: e, offset: 0 })}
                placeholder="Select Remark Type"
              >
                <Option value="">All</Option>
                <Option value="assigned">Assigned</Option>
                <Option value="in_stock">In Stock</Option>
              </Select>
              <Select
                allowClear
                style={{ width: "180px" }}
                onChange={(e) => setFilter({ ...filter, unit: e, offset: 0 })}
                placeholder="Select Unit Name"
              >
                <Option value="">All</Option>
                <Option value="JTML">JTML</Option>
                <Option value="DIPL">DIPL</Option>
                <Option value="Corporate Office">Corporate Office</Option>
              </Select>

              <PDFDownload
                PDFFileName="asset-list"
                fileHeader="ASSET LIST"
                PDFHeader={[
                  "Category",
                  "Model",
                  "Serial No",
                  "PO No",
                  "Specification",
                  "Remarks",
                  "Unit",
                ]}
                PDFData={
                  allAsset?.data?.length
                    ? allAsset?.data?.map(
                        ({
                          serial_number,
                          remarks,
                          model,
                          category,
                          po_number,
                          specification,
                          unit_name,
                        }: any) => {
                          const data = {
                            Category: category,
                            Model: model,
                            "Serial No": serial_number,
                            "PO No": po_number,
                            Specification: specification,
                            Remarks: remarks,
                            Unit: unit_name,
                          };
                          return data;
                        }
                      )
                    : []
                }
              />

              <ExcelDownload
                excelName={"asset-list"}
                excelTableHead={[
                  "Category",
                  "Model",
                  "Serial No",
                  "PO No",
                  "Specification",
                  "Remarks",
                  "Unit",
                ]}
                excelData={
                  allAsset?.data?.length
                    ? allAsset?.data?.map(
                        ({
                          serial_number,
                          remarks,
                          model,
                          category,
                          po_number,
                          specification,
                          unit_name,
                        }: any) => {
                          const data = {
                            Category: category,
                            Model: model,
                            "Serial No": serial_number,
                            "PO No": po_number,
                            Specification: specification,
                            Remarks: remarks,
                            Unit: unit_name,
                          };
                          return data;
                        }
                      )
                    : []
                }
              />
              <CreateButton
                name="Upload Asset"
                onClick={() => {
                  dispatch(
                    setCommonModal({
                      title: "Upload Asset",
                      content: <UploadAssetFile />,
                      show: true,
                      width: 400,
                    })
                  );
                }}
              />
              <CreateButton name=" Create Assets" onClick={showModal} />
            </Space>
          }
        >
          <div>
            <Table
              rowKey={"id"}
              size="small"
              bordered
              loading={isLoading}
              dataSource={data?.data?.length ? data.data : []}
              columns={AssetsTableColumns()}
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
                pageSizeOptions: [
                  "10",
                  "20",
                  "50",
                  "100",
                  "500",
                  "300",
                  "400",
                  "500",
                ],
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

export default AssetsList;
