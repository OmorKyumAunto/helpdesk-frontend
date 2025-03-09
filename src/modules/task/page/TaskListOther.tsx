import { EllipsisOutlined } from "@ant-design/icons";
import { Button, Card, Col, Flex, Popover, Row, Space } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import {
  useDeleteTaskMutation,
  useEndTaskMutation,
  useGetTaskItemsQuery,
  useStartedTaskMutation,
  useStartTaskMutation,
} from "../api/taskEndpoint";

const ListTaskOther = () => {
  const [starValue, setStarValue] = useState(false);
  const { data: taskItems } = useGetTaskItemsQuery();
  const [removeTask] = useDeleteTaskMutation();
  const [starTask] = useStartedTaskMutation();
  const [startedTask] = useStartTaskMutation();
  const [endedTask] = useEndTaskMutation();

  return (
    <div className="h-screen flex flex-col">
      <Row gutter={[14, 14]}>
        {taskItems?.data?.map((item) => (
          <Col key={item.id} xs={24} sm={24} md={12} lg={8}>
            <Card
              bordered={false}
              style={{
                backgroundColor: "#e6f0ff",
                borderLeft: `5px solid #1890ff`,
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                transition: "transform 0.3s ease-in-out",
                cursor: "pointer",
                transform: "scale(1)",
                height: "100%",
              }}
              className="sla-card"
            >
              <div>
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-base font-bold">
                      Task ID: {item.task_code}
                    </h1>
                  </div>
                  <Flex gap={4} justify="center" align="center">
                    <div>
                      {starValue ? (
                        <FaStar
                          onClick={() => {
                            starTask({
                              body: { starred: starValue ? 1 : 0 },
                              id: item.id,
                            }),
                              setStarValue(!starValue);
                          }}
                          size={20}
                          color="gold"
                        />
                      ) : (
                        <FaRegStar
                          onClick={() => {
                            starTask({
                              body: { starred: starValue ? 1 : 0 },
                              id: item.id,
                            }),
                              setStarValue(!starValue);
                          }}
                          size={20}
                        />
                      )}
                    </div>
                    <Popover
                      content={
                        <Space direction="vertical">
                          <Button
                            size="small"
                            type="primary"
                            style={{ width: "60px" }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            type="primary"
                            danger
                            style={{ width: "60px" }}
                            onClick={() => removeTask(item.id)}
                          >
                            Delete
                          </Button>
                        </Space>
                      }
                      trigger="hover"
                    >
                      <Button type="text" icon={<EllipsisOutlined />} />
                    </Popover>
                  </Flex>
                </div>
                <div>
                  <div>
                    <span className="text-xl  font-bold">{item.title}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>
                <div className="mb-3 mt-1 flex items-center text-base text-gray-700 font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  End: {dayjs(item.end_date).format("DD MMM YYYY")}{" "}
                  {item.end_time}
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  {item.task_status}
                </span>
                {item.task_status === "incomplete" && (
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => startedTask(item.id)}
                  >
                    Start
                  </Button>
                )}
                {item.task_status === "inprogress" && (
                  <Button
                    size="small"
                    danger
                    type="primary"
                    onClick={() => endedTask(item.id)}
                  >
                    End
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ListTaskOther;
