import { Card, Table } from "antd";
import { useDispatch } from "react-redux";
import { useGetUnitsQuery } from "../api/unitEndPoint";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { UnitTableColumns } from "../utils/UnitTableColumns";
import { CreateButton } from "../../../common/CommonButton";
import CreateUnit from "../components/CreateUnit";

const UnitList = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isFetching } = useGetUnitsQuery({});

  return (
    <>
      <div>
        <Card
          title={`Asset Unit`}
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
              name="Create Unit"
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Create Unit",
                    content: <CreateUnit />,
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
              dataSource={data?.data?.length ? data.data : []}
              columns={UnitTableColumns()}
              scroll={{ x: true }}
              pagination={false}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default UnitList;
