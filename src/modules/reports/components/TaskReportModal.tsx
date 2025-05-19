import { SearchOutlined } from "@ant-design/icons";
import { Col, DatePicker, Input, Row, Select } from "antd";
import { useState } from "react";
import { useGetMeQuery } from "../../../app/api/userApi";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import { rangePreset } from "../../../common/rangePreset";
import { useGetCategoryListQuery } from "../../Category/api/categoryEndPoint";
import { useGetTicketReportQuery } from "../../ticket/api/ticketEndpoint";
import {
  useGetAdminWiseUnitsQuery,
  useGetUnitsQuery,
} from "../../Unit/api/unitEndPoint";
import { UserList } from "../../Unit/types/unitTypes";
import { useGetTaskReportQuery } from "../api/reportsEndPoints";
import dayjs from "dayjs";
const { Option } = Select;

const TaskReportModal = () => {
  const [filter, setFilter] = useState<any>({});
  const { data: profile } = useGetMeQuery();
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });
  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoryListQuery({ status: "active" });
  const { data: allAdmin, isLoading: adminLoading } = useGetAdminWiseUnitsQuery(
    filter.unit_id || 0,
    { skip: !filter.unit_id }
  );
  const { data, isLoading, isFetching } = useGetTaskReportQuery({
    ...filter,
  });
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Input
            prefix={<SearchOutlined />}
            onChange={(e) => setFilter({ ...filter, key: e.target.value })}
            placeholder="Search..."
            allowClear
          />
        </Col>
        <Col span={24}>
          <Select
            loading={unitIsLoading}
            style={{ width: "100%" }}
            placeholder="Select Unit Name"
            showSearch
            optionFilterProp="children"
            onChange={(e) => setFilter({ ...filter, unit_id: e })}
            options={unitData?.data?.map((unit: any) => ({
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
          <Select
            allowClear
            placeholder="Select Status"
            style={{ width: "100%" }}
            onChange={(e) => setFilter({ ...filter, task_status: e })}
            options={[
              { label: "Incomplete", value: "incomplete" },
              { label: "Complete", value: "complete" },
              { label: "Inprogress", value: "inprogress" },
              // {label:'Overdue',value:'overdue'},
            ]}
          />
        </Col>

        {/* <Col span={24}>
          <Select
            style={{ width: "100%", marginBottom: 8 }}
            loading={categoryLoading}
            placeholder="Select Category"
            showSearch
            optionFilterProp="children"
            onChange={(e) => setFilter({ ...filter, category: e, offset: 0 })}
            options={categoryData?.data?.map((item: any) => ({
              value: item.id,
              label: item.title,
            }))}
            allowClear
          />
        </Col> */}
        <Col span={24}>
          <ExcelDownload
            isLoading={isLoading || isFetching}
            width="100%"
            excelName={"Task Report"}
            excelTableHead={[
              "Category Title",
              "Description",
              "Set Time",
              "Total Set Time",
              "Format",
              "Start Date",
              "Start Time",
              "Task Code",
              "Task Status",
              "Starred",
              "Task Start Date",
              "Task End Date",
              "Task Start Time",
              "Task End Time",
              "Quantity",
              "User Name",
              "User Employee ID",
              "Created At",
              "Overdue",
            ]}
            excelData={
              data?.data?.length
                ? data?.data?.map(
                    ({
                      category_title,
                      description,
                      set_time,
                      total_set_time,
                      format,
                      start_date,
                      start_time,
                      task_code,
                      task_status,
                      starred,
                      task_start_date,
                      task_end_date,
                      task_start_time,
                      task_end_time,
                      quantity,
                      user_name,
                      user_employee_id,
                      created_at,
                      overdue,
                    }) => {
                      return {
                        "Category Title": category_title,
                        Description: description,
                        "Set Time": set_time,
                        "Total Set Time": total_set_time,
                        Format: format,
                        "Start Date": dayjs(start_date).format("DD-MM-YYYY"),
                        "Start Time": start_time,
                        "Task Code": task_code,
                        "Task Status": task_status,
                        Starred: starred,
                        "Task Start Date":
                          dayjs(task_start_date).format("DD-MM-YYYY"),
                        "Task End Date":
                          dayjs(task_end_date).format("DD-MM-YYYY"),
                        "Task Start Time": task_start_time,
                        "Task End Time": task_end_time,
                        Quantity: quantity,
                        "User Name": user_name,
                        "User Employee ID": user_employee_id,
                        "Created At": created_at,
                        Overdue: overdue,
                      };
                    }
                  )
                : []
            }
          />
        </Col>
      </Row>
    </div>
  );
};

export default TaskReportModal;
