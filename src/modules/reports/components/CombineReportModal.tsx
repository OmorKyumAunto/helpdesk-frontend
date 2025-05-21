import { Col, DatePicker, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { useGetMeQuery } from "../../../app/api/userApi";
import { rangePreset } from "../../../common/rangePreset";

import dayjs from "dayjs";
import {
  useGetAdminWiseUnitsQuery,
  useGetUnitsQuery,
} from "../../Unit/api/unitEndPoint";
import { UserList } from "../../Unit/types/unitTypes";
import { useGetCombineReportQuery } from "../api/reportsEndPoints";
import CombineReportPDFDownload from "./PDFDownloadForCombineReport";

const CombineReportModal = () => {
  const [filter, setFilter] = useState<any>({});
  useEffect(() => {
    setFilter({});
  }, []);

  const { data: profile } = useGetMeQuery();
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });
  const { data: allAdmin, isLoading: adminLoading } = useGetAdminWiseUnitsQuery(
    filter.unit || 0,
    { skip: !filter.unit }
  );
  const unitOptionForAdmin = unitData?.data?.filter((unit) =>
    profile?.data?.searchAccess?.some((item: any) => item?.unit_id === unit?.id)
  );
  const unitOption =
    profile?.data?.role_id === 2 ? unitOptionForAdmin : unitData?.data;
  const { data } = useGetCombineReportQuery({
    ...filter,
  });
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Select
            loading={unitIsLoading}
            style={{ width: "100%" }}
            placeholder="Select Unit Name"
            showSearch
            optionFilterProp="children"
            onChange={(e) => setFilter({ ...filter, unit: e })}
            options={unitOption?.map((unit: any) => ({
              value: unit.id,
              label: unit.title,
            }))}
            allowClear
          />
        </Col>
        <Col span={24}>
          <Select
            loading={adminLoading}
            placeholder="Search Admin"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={allAdmin?.data?.user_list?.map((item: UserList) => ({
              value: item.user_id,
              label: `[${item.employee_id}] ${item.name}`,
            }))}
            onChange={(e) => setFilter({ ...filter, user_id: e })}
            allowClear
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={24}>
          <DatePicker.RangePicker
            presets={rangePreset}
            style={{ width: "100%" }}
            onChange={(_, e) =>
              setFilter({
                ...filter,
                start_date: e[0],
                end_date: e[1],
              })
            }
          />
        </Col>
        <Col span={24}>
          <CombineReportPDFDownload
            PDFFileName="combine_report_query_data"
            fileHeader="Combined Report"
            queryData={data?.query_data!}
            PDFHeader={[
              "Average Ticket Time",
              "Average Task Time",
              "Total Avgerage Time",
              "Total Ticket Solved",
              "Total Task Completed",
              "Total Ticket and Task Solved",
              "From Date",
              "To Date",
              "Assigned Unit",
            ]}
            PDFData={{
              "Average Ticket Time":
                data?.data?.total_avg_ticket || "Not Applied",
              "Average Task Time": data?.data?.total_avg_task || "Not Applied",
              "Total Avgerage Time":
                data?.data?.total_avg_ticket_task || "Not Applied",
              "Total Ticket Solved": data?.data?.total_ticket || "Not Applied",
              "Total Task Completed": data?.data?.total_task || "Not Applied",
              "Total Ticket and Task Solved":
                data?.data?.total_ticket_task || "Not Applied",
              "From Date": data?.query_data?.start_date
                ? dayjs(data?.query_data?.start_date).format("DD-MM-YYYY")
                : "Not Applied",
              "To Date": data?.query_data?.end_date
                ? dayjs(data?.query_data?.end_date).format("DD-MM-YYYY")
                : "Not Applied",
              "Assigned Unit":
                data?.query_data?.admin_assign_unit_name || "Not Applied",
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default CombineReportModal;
