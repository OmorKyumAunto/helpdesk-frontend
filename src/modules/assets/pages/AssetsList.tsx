import { Card, Col, Input, Row, Select, Table } from "antd";
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
          title={`Assets List (${data?.total || 0})`}
          style={{
            boxShadow: "0 0 0 1px rgba(0,0,0,.05)",
            marginBottom: "1rem",
          }}
          extra={
            <Row gutter={[16, 24]}>
              <Col xs={24} md={8}>
                <Input
                  style={{ width: "100%" }}
                  prefix={<SearchOutlined />}
                  onChange={(e) =>
                    setFilter({ ...filter, key: e.target.value })
                  }
                  placeholder="Search..."
                />
              </Col>
              <Col xs={24} md={8}>
                <Select
                  style={{ width: "100%" }}
                  onChange={(e) => setFilter({ ...filter, unit: e })}
                  placeholder="Select Unit Name"
                >
                  <Option value="JTML">JTML</Option>
                  <Option value="DIPL">DIPL</Option>
                  <Option value="Corporate Office">Corporate Office</Option>
                </Select>
              </Col>
              <Col xs={24} md={8}>
                <CreateButton name=" Create Assets" onClick={showModal} />
              </Col>
            </Row>
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
