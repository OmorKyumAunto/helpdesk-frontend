import { EllipsisOutlined, StarOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Popover, Row, Space } from "antd";

const ListTaskOther = () => {
  return (
    <div className="h-screen flex flex-col">
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={24} md={8}>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <div>
                <div className="flex justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    Yearly Goal
                  </h2>
                  <Flex gap={4} justify="center" align="center">
                    <div>
                      <StarOutlined color="yellow" />
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
                <div className="mt-1">
                  <span className="text-sm font-medium text-gray-700">
                    The Final
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  This is Description
                </p>
              </div>

              <div className="mb-3 mt-1 flex items-center text-sm text-gray-600">
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
                Due: 07 Mar 2025
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
                In Progress
              </span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <div>
                <div className="flex justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    Yearly Goal
                  </h2>
                  <Flex gap={4} justify="center" align="center">
                    <div>
                      <StarOutlined color="yellow" />
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
                <div className="mt-1">
                  <span className="text-sm font-medium text-gray-700">
                    The Final
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  This is Description
                </p>
              </div>

              <div className="mb-3 mt-1 flex items-center text-sm text-gray-600">
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
                Due: 07 Mar 2025
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
                In Progress
              </span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <div>
                <div className="flex justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    Yearly Goal
                  </h2>
                  <Flex gap={4} justify="center" align="center">
                    <div>
                      <StarOutlined color="yellow" />
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
                <div className="mt-1">
                  <span className="text-sm font-medium text-gray-700">
                    The Final
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  This is Description
                </p>
              </div>

              <div className="mb-3 mt-1 flex items-center text-sm text-gray-600">
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
                Due: 07 Mar 2025
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
                In Progress
              </span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <div>
                <div className="flex justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    Yearly Goal
                  </h2>
                  <Flex gap={4} justify="center" align="center">
                    <div>
                      <StarOutlined color="yellow" />
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
                <div className="mt-1">
                  <span className="text-sm font-medium text-gray-700">
                    The Final
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  This is Description
                </p>
              </div>

              <div className="mb-3 mt-1 flex items-center text-sm text-gray-600">
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
                Due: 07 Mar 2025
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
                In Progress
              </span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <div>
                <div className="flex justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    Yearly Goal
                  </h2>
                  <Flex gap={4} justify="center" align="center">
                    <div>
                      <StarOutlined color="yellow" />
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
                <div className="mt-1">
                  <span className="text-sm font-medium text-gray-700">
                    The Final
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  This is Description
                </p>
              </div>

              <div className="mb-3 mt-1 flex items-center text-sm text-gray-600">
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
                Due: 07 Mar 2025
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
                In Progress
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ListTaskOther;
