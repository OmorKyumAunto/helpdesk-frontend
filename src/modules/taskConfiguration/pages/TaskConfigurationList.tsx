import { Card, Table } from "antd";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { CreateButton } from "../../../common/CommonButton";
import { useGetLicensesQuery } from "../api/licenseEndPoint";
import CreateLicense from "../components/CreateLicense";
import { LicenseTableColumns } from "../utils/LicenseTableColumns";

const TaskConfigurationList = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isFetching } = useGetLicensesQuery({});

  return (
    <>
      <div>
        <Card
          title={`Task List`}
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
            <CreateButton
              name="Create New List"
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Create New List",
                    content: <CreateLicense />,
                    show: true,
                    width: 500,
                  })
                );
              }}
            />
          </div>
          <div>
            <Table
              rowKey={"id"}
              size="small"
              bordered
              loading={isLoading || isFetching}
              dataSource={[]}
              // dataSource={data?.data?.length ? data.data : []}
              // columns={LicenseTableColumns()}
              scroll={{ x: true }}
              pagination={false}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default TaskConfigurationList;
