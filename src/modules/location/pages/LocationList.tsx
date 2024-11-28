import { Card, Table } from "antd";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { CreateButton } from "../../../common/CommonButton";
import { useGetLocationsQuery } from "../api/locationEndPoint";
import { LocationTableColumns } from "../utils/LocationTableColumns";
import CreateLocation from "../components/CreateLocation";

const LocationList = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isFetching } = useGetLocationsQuery({});

  return (
    <>
      <div>
        <Card
          title={`Sub Unit List`}
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
              name="Create Sub Unit"
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Create Sub Unit",
                    content: <CreateLocation />,
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
              columns={LocationTableColumns()}
              scroll={{ x: true }}
              pagination={false}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default LocationList;
