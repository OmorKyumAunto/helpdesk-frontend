import { Card, Col, Input, Row, Select, Space, Table } from "antd";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { IAssetParams } from "../types/assetsTypes";
import { useGetAssetsQuery } from "../api/assetsEndPoint";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { AssetsTableColumns } from "../utils/AssetsTableColumns";
import { CreateButton } from "../../../common/CommonButton";
import CreateAsset from "../components/CreateAssets";
import { tablePagination } from "../../../common/TablePagination copy";
import { SearchOutlined } from "@ant-design/icons";
import UploadAssetFile from "../components/UploadAssetFile";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import PDFDownload from "../../../common/PDFDownload/PDFDownload";

const AssetsList = () => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "",
    pageSize: "",
  });
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "20";
  const offsetValue = Number(page) * Number(pageSize);
  const [filter, setFilter] = useState<IAssetParams>({
    limit: 20,
    offset: offsetValue - 20,
  });
  const { data, isLoading } = useGetAssetsQuery({ ...filter });

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
                onChange={(e) => setFilter({ ...filter, key: e.target.value })}
                placeholder="Search..."
              />

              <Select
                style={{ width: "180px" }}
                onChange={(e) => setFilter({ ...filter, unit: e })}
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
                  data?.data?.length
                    ? data?.data?.map(
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
                  data?.data?.length
                    ? data?.data?.map(
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
              onChange={(pagination) => {
                setSearchParams({
                  page: String(pagination.current),
                  pageSize: String(pagination.pageSize),
                });
                setFilter({
                  ...filter,
                  offset:
                    ((pagination.current || 1) - 1) *
                    (pagination.pageSize || 20),
                  limit: pagination.pageSize!,
                });
              }}
              pagination={
                Number(data?.total) !== undefined && Number(data?.total) > 20
                  ? {
                      ...tablePagination,
                      current: Number(page),
                    }
                  : false
              }
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default AssetsList;
