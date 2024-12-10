import { Card, Table } from "antd";
import { useGetRaiseTicketUserWiseQuery } from "../api/ticketEndpoint";
import { RaiseTicketTableColumn } from "../utils/TicketColumns";

const RaiseTicketList = () => {
  const { data, isLoading, isFetching } = useGetRaiseTicketUserWiseQuery({});

  return (
    <>
      <div>
        <Card
          title={`Raise Ticket List`}
          style={{
            boxShadow: "0 0 0 1px rgba(0,0,0,.05)",
            marginBottom: "1rem",
          }}
        >
          <div>
            <Table
              rowKey={"id"}
              size="small"
              bordered
              loading={isLoading || isFetching}
              dataSource={data?.data?.length ? data.data : []}
              columns={RaiseTicketTableColumn()}
              scroll={{ x: true }}
              pagination={false}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default RaiseTicketList;
