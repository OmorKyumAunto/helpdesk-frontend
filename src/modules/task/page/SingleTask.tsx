import { Descriptions, Tag } from "antd";
import {
  useGetSingleSuperAdminTaskQuery,
  useGetSingleTaskQuery,
} from "../api/taskEndpoint";
import dayjs from "dayjs";
import { useGetMeQuery } from "../../../app/api/userApi";

const SingleTask = ({
  id,
  user_name,
  user_employee_id,
}: {
  id: number;
  user_name?: string;
  user_employee_id?: string;
}) => {
  const { data: profile } = useGetMeQuery();
  const roleID = profile?.data?.role_id;
  const { data } = useGetSingleTaskQuery(id || 0);
  const { data: superAdminData } = useGetSingleSuperAdminTaskQuery(id);

  const singleData = roleID === 1 ? superAdminData?.data : data?.data;

  const {
    category_title,
    task_code,
    task_status,
    start_time,
    sub_list_details,
    start_date,
    description,
    task_end_date,
    task_end_time,
  } = singleData || {};

  const add6hours = dayjs(start_date).add(6, "hours");
  const startTime = dayjs(
    dayjs(add6hours).format("YYYY-MM-DD") + "T" + start_time
  );
  const add6hoursEnd = dayjs(task_end_date).add(6, "hours");
  const endTime = dayjs(
    dayjs(add6hoursEnd).format("YYYY-MM-DD") + "T" + task_end_time
  );

  const getTagName = () => {
    if (task_status === "incomplete") {
      return "Incomplete";
    } else if (task_status === "complete") {
      return "Complete";
    } else {
      return "Inprogress";
    }
  };
  const getTagColor = () => {
    if (task_status === "incomplete") {
      return "red";
    } else if (task_status === "complete") {
      return "success";
    } else {
      return "processing";
    }
  };

  return (
    <div>
      <Descriptions
        bordered
        size="small"
        column={{ sm: 1, md: 2 }}
        labelStyle={{
          fontWeight: "bold",
          backgroundColor: "#e6f2ff",
          color: "#000000",
          height: 60,
        }}
        contentStyle={{ backgroundColor: "#ffffff" }}
        items={[
          {
            key: "1",
            label: "Task Code",
            children: task_code,
            span: 2,
          },
          {
            key: "2",
            label: "Category Title",
            children: category_title,
            span: 2,
          },

          {
            key: "3",
            label: "Start Time",
            children: dayjs(startTime).format("DD MMM YYYY hh:mm A"),
            span: 2,
          },
          ...(task_end_date && task_end_time
            ? [
                {
                  key: "7",
                  label: "End Time",
                  children: dayjs(endTime).format("DD MMM YYYY hh:mm A"),
                  span: 2,
                },
              ]
            : []),
          ...(user_name && user_employee_id
            ? [
                {
                  key: "8",
                  label: "Admin Name",
                  children: user_name,
                  span: 2,
                },
                {
                  key: "9",
                  label: "Admin ID",
                  children: user_employee_id,
                  span: 2,
                },
              ]
            : []),
          {
            key: "4",
            label: "Status",
            children: <Tag color={getTagColor()}>{getTagName()}</Tag>,
            span: 2,
          },
          {
            key: "5",
            label: "Sub Category List",
            children: sub_list_details
              ?.filter((item) => item.is_checked === 1)
              .map((item) =>
                Array.isArray(item.title) ? item.title.join(", ") : item.title
              )
              .join(", "),
            span: 4,
          },

          {
            key: "6",
            label: "Description",
            children: description,
            span: 4,
          },
        ]}
      />
    </div>
  );
};

export default SingleTask;
