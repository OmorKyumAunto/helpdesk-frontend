import { Card, Col, Row, Table } from "antd";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { IEmployeeParams } from "../types/employeeTypes";
import { useGetEmployeesQuery } from "../api/employeeEndPoint";
import { setCommonModal } from "../../../app/slice/modalSlice";
import CreateEmployee from "../components/CreateEmployee";
import { EmployeeTableColumns } from "../utils/EmployeeTableColumns";
import { CreateButton } from "../../../common/CommonButton";

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
    skip: skipValue - 20,
  });
  const { data, isLoading } = useGetEmployeesQuery({});
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
  // const showModalInc = () => {
  //   dispatch(
  //     setCommonModal({
  //       title: "Create Increment",
  //       content: <CreateIncrement />,
  //       show: true,
  //       width: 1000,
  //     })
  //   );
  // };

  return (
    <>
      <div>
        <Card
          title={`Employee List (${data?.total || 0})`}
          style={{
            boxShadow: "0 0 0 1px rgba(0,0,0,.05)",
            marginBottom: "1rem",
          }}
          extra={
            <Row gutter={[16, 24]}>
              <Col xs={24} md={12} xxl={12}>
                <CreateButton name=" Create employee" onClick={showModal} />
              </Col>
              {/* <Col xs={24} md={12} xxl={12}>
                <Button
                  style={{ background: "blue" }}
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={showModalInc}
                >
                  Increment
                </Button>
              </Col> */}
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
                  skip:
                    ((pagination.current || 1) - 1) *
                    (pagination.pageSize || 20),
                  limit: pagination.pageSize!,
                });
              }}
              // pagination={
              //   Number(data?.total) !== undefined && Number(data?.total) > 20
              //     ? {
              //         ...tablePagination,
              //         current: Number(page),
              //       }
              //     : false
              // }
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default EmployeeList;
