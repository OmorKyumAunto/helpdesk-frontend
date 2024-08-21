import { Card, Col, Input, Row, Space, Table } from "antd";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { IEmployeeParams } from "../types/employeeTypes";
import { useGetEmployeesQuery } from "../api/employeeEndPoint";
import { setCommonModal } from "../../../app/slice/modalSlice";
import CreateEmployee from "../components/CreateEmployee";
import { EmployeeTableColumns } from "../utils/EmployeeTableColumns";
import { CreateButton } from "../../../common/CommonButton";
import { SearchOutlined } from "@ant-design/icons";
import { tablePagination } from "../../../common/TablePagination copy";
import EmployeeFileUpdate from "./EmployeeFileUpdate";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "",
    pageSize: "",
  });
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "20";
  const skipValue = Number(page) * Number(pageSize);
  const [filter, setFilter] = useState<IEmployeeParams>({
    limit: 20,
    offset: skipValue - 20,
  });
  const { data, isLoading } = useGetEmployeesQuery({ ...filter });
  console.log(data);

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
      {/* <div
        style={{
          display: "flex",
          justifyContent: "end",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        <CreateButton name=" Create employee" onClick={showModal} />
        <CreateButton name=" Create employee" onClick={showModal} />
        <CreateButton name=" Create employee" onClick={showModal} />
        <CreateButton name=" Create employee" onClick={showModal} />
        <CreateButton name=" Create employee" onClick={showModal} />
        <CreateButton name=" Create employee" onClick={showModal} />
        <CreateButton name=" Create employee" onClick={showModal} />
        <CreateButton name=" Create employee" onClick={showModal} />
      </div> */}
      <div>
        <Card
          title={`Employee List`}
          style={{
            boxShadow: "0 0 0 1px rgba(0,0,0,.05)",
            marginBottom: "1rem",
          }}
          extra={
            <Row gutter={[16, 24]}>
              <Col xs={24} md={8}>
                <Input
                  prefix={<SearchOutlined />}
                  onChange={(e) =>
                    setFilter({ ...filter, key: e.target.value })
                  }
                  placeholder="Search..."
                />
              </Col>
              <Col xs={24} md={8}>
                <CreateButton
                  name="Upload employee"
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
              </Col>
              <Col xs={24} md={8}>
                <CreateButton name=" Create employee" onClick={showModal} />
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
              columns={EmployeeTableColumns()}
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

export default EmployeeList;
