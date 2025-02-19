import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Grid,
  Image,
  Input,
  Pagination,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useState } from "react";
import { useGetMeQuery } from "../../../app/api/userApi";
import { imageURLNew } from "../../../app/slice/baseQuery";
import noUser from "../../../assets/avatar2.png";
import {
  useDeleteTicketMutation,
  useGetRaiseTicketSuperAdminWiseQuery,
  useLazyGetCommentDataQuery,
} from "../api/ticketEndpoint";
import { IAdminTicketList } from "../types/ticketTypes";
import { formatTimeDifference } from "../utils/timeFormat";
dayjs.extend(relativeTime);
import CountdownTimer from "../components/Countdown"
const { Option } = Select;
const SuperAdminTicketList = ({
  ticketValue,
  ticketPriorityValue,
}: {
  ticketValue: string;
  ticketPriorityValue: string;
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const skipValue = (page - 1) * pageSize;
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const { sm } = Grid.useBreakpoint();
  const [filter, setFilter] = useState<{
    key?: string;
    priority?: string;
    status?: string;
    limit: number;
    offset: number;
  }>({
    limit: Number(pageSize),
    offset: skipValue,
  });
  const [remove] = useDeleteTicketMutation();
  const { data, isLoading } = useGetRaiseTicketSuperAdminWiseQuery({
    ...filter,
  });
  const [getComments, { data: commentData, isLoading: commentLoader }] =
    useLazyGetCommentDataQuery();
  const { data: { data: profile } = {} } = useGetMeQuery();

  const handleExpand = (id: number): void => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handlePaginationChange = (current: number, size: number) => {
    setPage(current);
    setPageSize(size);
    setFilter({ ...filter, offset: (current - 1) * size, limit: size });
  };

  const handleCardClick = (e: React.MouseEvent, id: number): void => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "BUTTON" ||
      target.tagName === "TEXTAREA" ||
      target.closest("button") ||
      target.closest("textarea")
    ) {
      e.stopPropagation();
      return;
    }
    getComments(id);
    handleExpand(id);
  };
  const options = [
    { label: "All", value: "" },
    { label: "In Progress", value: "inprogress" },
    { label: "Solved", value: "solved" },
    { label: "Unsolved", value: "unsolved" },
    { label: "Forward", value: "forward" },
  ];

  useEffect(() => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      status: ticketValue || prevFilter.status,
      priority: ticketPriorityValue || prevFilter.priority,
      offset: 0,
    }));
  }, [ticketValue, ticketPriorityValue]);

  return (
    <Card
      loading={isLoading}
      style={{ width: "100%", padding: "1rem", backgroundColor: "#f5f5f5" }}
      title="Super Admin Ticket List"
      extra={
        <Space direction={!sm ? "vertical" : "horizontal"}>
          <Radio.Group
            // block
            options={options}
            defaultValue={ticketValue}
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => {
              setFilter({ ...filter, status: e.target.value, offset: 0 });
            }}
          />
          <Input
            prefix={<SearchOutlined />}
            style={{ width: "160px" }}
            onChange={(e) =>
              setFilter({ ...filter, key: e.target.value, offset: 0 })
            }
            placeholder="Search..."
          />
          <Select
            allowClear
            defaultValue={ticketPriorityValue}
            style={{ width: "160px" }}
            onChange={(e) => setFilter({ ...filter, priority: e, offset: 0 })}
            placeholder="Select Priority"
          >
            <Option value="">All</Option>
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
            <Option value="urgent">Urgent</Option>
          </Select>
        </Space>
      }
    >
      {data?.data?.length ? (
        <>
          {data?.data?.map((ticket: IAdminTicketList, index: number) => {
            const isPDF = ticket?.attachment?.endsWith(".pdf");
            return (
              <Card
                key={ticket.ticket_table_id}
                style={{
                  marginBottom: "1rem",
                  borderRadius: "12px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                  backgroundColor: "#fff",
                }}
                hoverable
                onClick={(e) => handleCardClick(e, ticket.ticket_table_id)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h3
                      style={{ color: "#1890ff" }}
                    >{`Ticket ID: ${ticket.ticket_id}`}</h3>
                    <h3
                      style={{ color: "#000000" }}
                    >{`Title : ${ticket.subject}`}</h3>
                    <strong>
                      <Tooltip
                        title={
                          <div>
                            <p>
                              <strong>Name:</strong>{" "}
                              {ticket.ticket_created_employee_name}
                            </p>
                            <p>
                              <strong>ID:</strong>{" "}
                              {ticket.ticket_created_employee_id}
                            </p>
                            <p>
                              <strong>Designation:</strong>{" "}
                              {ticket.created_employee_designation}
                            </p>
                            <p>
                              <strong>Department:</strong>{" "}
                              {ticket.created_employee_department}
                            </p>
                            <p>
                              <strong>Email:</strong>{" "}
                              {ticket.ticket_created_employee_email}
                            </p>
                            <p>
                              <strong>Phone No:</strong>{" "}
                              {ticket.created_employee_contact_no}
                            </p>
                            <p>
                              <strong>Unit:</strong>{" "}
                              {ticket.created_employee_unit_name}
                            </p>
                          </div>
                        }
                      >
                        <span>
                          Ticket Creator: {ticket.ticket_created_employee_name}{" "}
                          ({ticket.ticket_created_employee_id})
                        </span>
                      </Tooltip>
                      <div>
                        {ticket.ticket_status === "solved" && (
                          <Tooltip
                            title={
                              <div>
                                <p>
                                  <strong>Name:</strong>{" "}
                                  {ticket.ticket_solved_employee_name}
                                </p>
                                <p>
                                  <strong>ID:</strong>{" "}
                                  {ticket.ticket_solved_employee_id}
                                </p>
                                <p>
                                  <strong>Designation:</strong>{" "}
                                  {ticket.solved_employee_designation}
                                </p>
                                <p>
                                  <strong>Department:</strong>{" "}
                                  {ticket.solved_employee_department}
                                </p>
                                <p>
                                  <strong>Email:</strong>{" "}
                                  {ticket.solved_employee_email}
                                </p>
                                <p>
                                  <strong>Phone No:</strong>{" "}
                                  {ticket.solved_employee_contact_no}
                                </p>
                                <p>
                                  <strong>Unit:</strong>{" "}
                                  {ticket.solved_employee_unit_name}
                                </p>
                              </div>
                            }
                          >
                            <span>
                              Solved By: {ticket.ticket_solved_employee_name} (
                              {ticket.ticket_solved_employee_id})
                            </span>
                          </Tooltip>
                        )}
                      </div>
                      <div>
                        {ticket.ticket_status === "inprogress" && (
                          <Tooltip
                            title={
                              <div>
                                <p>
                                  <strong>Name:</strong>{" "}
                                  {ticket.action_by_name || "N/A"}
                                </p>
                                <p>
                                  <strong>ID:</strong>{" "}
                                  {ticket.action_by_employee_id || "N/A"}
                                </p>
                                <p>
                                  <strong>Designation:</strong>{" "}
                                  {ticket.action_by_designation || "N/A"}
                                </p>
                                <p>
                                  <strong>Department:</strong>{" "}
                                  {ticket.action_by_department || "N/A"}
                                </p>
                                <p>
                                  <strong>Email:</strong>{" "}
                                  {ticket.action_by_email || "N/A"}
                                </p>
                                <p>
                                  <strong>Phone No:</strong>{" "}
                                  {ticket.action_by_contact_no || "N/A"}
                                </p>
                                <p>
                                  <strong>Unit:</strong>{" "}
                                  {ticket.action_by_unit_name || "N/A"}
                                </p>
                              </div>
                            }
                          >
                            <span>
                              Last Updated By:{" "}
                              {ticket.action_by_name || "Unknown"} (
                              {ticket.action_by_employee_id || "Unknown"})
                            </span>
                          </Tooltip>
                        )}

                        {ticket.ticket_status === "unsolved" && (
                          <Tooltip
                            title={
                              <div>
                                <p>
                                  <strong>No Action has Taken Yet</strong>
                                </p>
                              </div>
                            }
                          >
                            <span>Last Update: No Action has Taken</span>
                          </Tooltip>
                        )}

                        {ticket.ticket_status === "forward" && (
                          <Tooltip
                            title={
                              <div>
                                <p>
                                  <strong>Name:</strong>{" "}
                                  {ticket.action_by_name || "N/A"}
                                </p>
                                <p>
                                  <strong>ID:</strong>{" "}
                                  {ticket.action_by_employee_id || "N/A"}
                                </p>
                                <p>
                                  <strong>Designation:</strong>{" "}
                                  {ticket.action_by_designation || "N/A"}
                                </p>
                                <p>
                                  <strong>Department:</strong>{" "}
                                  {ticket.action_by_department || "N/A"}
                                </p>
                                <p>
                                  <strong>Email:</strong>{" "}
                                  {ticket.action_by_email || "N/A"}
                                </p>
                                <p>
                                  <strong>Phone No:</strong>{" "}
                                  {ticket.action_by_contact_no || "N/A"}
                                </p>
                                <p>
                                  <strong>Unit:</strong>{" "}
                                  {ticket.action_by_unit_name || "N/A"}
                                </p>
                              </div>
                            }
                          >
                            <span>
                              Last Updated By:{" "}
                              {ticket.action_by_name || "Unknown"} (
                              {ticket.action_by_employee_id || "Unknown"})
                            </span>
                          </Tooltip>
                          
                        )}
                      </div>
                      <Space>
                      {ticket.ticket_status === "unsolved" && (
                        <Tag color="red-inverse">UNSOLVED</Tag>
                      )}
                      {ticket.ticket_status === "solved" && (
                        <Tag color="green-inverse">SOLVED</Tag>
                      )}
                      {ticket.ticket_status === "forward" && (
                        <Tag color="pink-inverse">FORWARD</Tag>
                      )}
                      {ticket.ticket_status === "inprogress" && (
                        <Tag color="blue-inverse">IN PROGRESS</Tag>
                      )}
                      <Popconfirm
                        title="Delete the ticket"
                        description="Are you sure to delete this ticket?"
                        onConfirm={() => remove(ticket.ticket_table_id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button size="small" danger style={{ color: "red" }}>
                          <DeleteOutlined />
                        </Button>
                      </Popconfirm>
                    </Space>
                    
                    </strong>
                  </div>

                  <div>
                    <CountdownTimer deadline="2025-02-17T15:30:00"></CountdownTimer>
                  
                   
                  </div>
                </div>
                <Divider style={{ margin: "6px 0px 12px" }} />
                <Row gutter={12}>
                  <Col xs={12} sm={12} md={8} lg={4}>
                    <div
                      style={{
                        textAlign: "left",
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      <p style={{ color: "gray" }}>Asset</p>
                      <p>{ticket.asset_name || "N/A"}</p>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={8} lg={4}>
                    <div
                      style={{
                        textAlign: "left",
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      <p style={{ color: "gray" }}>Serial Number</p>
                      <p>{ticket.asset_serial_number || "N/A"}</p>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={8} lg={4}>
                    <div
                      style={{
                        textAlign: "left",
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      <p style={{ color: "gray" }}>Asset Category</p>
                      <p>{ticket.asset_category || "N/A"}</p>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={8} lg={4}>
                    <div
                      style={{
                        textAlign: "left",
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      <p style={{ color: "gray" }}>Priority</p>
                      <>
                        {ticket.priority === "urgent" && (
                          <Tag color="red-inverse">URGENT</Tag>
                        )}
                        {ticket.priority === "high" && (
                          <Tag color="pink-inverse">HIGH</Tag>
                        )}
                        {ticket.priority === "medium" && (
                          <Tag color="blue-inverse">MEDIUM</Tag>
                        )}
                        {ticket.priority === "low" && (
                          <Tag color="green-inverse">LOW</Tag>
                        )}
                      </>
                    </div>
                  </Col>

                  <Col xs={12} sm={12} md={8} lg={4}>
                    <div
                      style={{
                        textAlign: "left",
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      <p style={{ color: "gray" }}>Category</p>
                      <p>{ticket.ticket_category_title}</p>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={8} lg={4}>
                    <div
                      style={{
                        textAlign: "left",
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      <p style={{ color: "gray" }}>Unit Name</p>
                      <p>{ticket.asset_unit_title}</p>
                    </div>
                  </Col>
                </Row>
                <div>
                  {expandedCard === ticket.ticket_table_id && (
                    <div
                      style={{
                        marginTop: "1rem",
                        backgroundColor: "#f9f9f9",
                        padding: "1rem",
                        borderRadius: "8px",
                      }}
                    >
                      <Descriptions
                        bordered
                        size="small"
                        column={{ sm: 1, md: 2 }}
                        labelStyle={{
                          fontWeight: "bold",
                          backgroundColor: "#e6f2ff",
                          color: "#000000",
                        }}
                        contentStyle={{ backgroundColor: "#ffffff" }}
                        items={[
                          ...(ticket.ticket_status === "forward"
                            ? [
                                {
                                  key: "0",
                                  label: "Forward Details",
                                  children: ticket.forward_details || "N/A",
                                  span: 4,
                                },
                                {
                                  key: "0-1",
                                  label: "Forward Remarks",
                                  children: ticket.forward_remarks || "N/A",
                                  span: 4,
                                },
                                {
                                  key: "0-2",
                                  label: "Forward Date",
                                  children: ticket.forward_date
                                    ? dayjs(ticket.forward_date).format(
                                        "DD MMM YYYY h:mm A"
                                      )
                                    : "N/A",
                                  span: 4,
                                },
                              ]
                            : []),
                          {
                            key: "1",
                            label: "CC Person",
                            children: ticket.cc ? ticket.cc : "N/A",
                            span: 2,
                          },
                          {
                            key: "2",
                            label: "Assign Date",
                            children: dayjs(ticket.ticket_created_at).format(
                              "DD MMM YYYY h:mm A"
                            ),
                            span: 2,
                          },
                          {
                            key: "3",
                            label: "Last Updated at",
                            children: dayjs(ticket.ticket_created_at).isSame(
                              dayjs(ticket.ticket_updated_at)
                            )
                              ? "Not Updated Yet"
                              : `${dayjs(ticket.ticket_updated_at).format(
                                  "DD MMM YYYY h:mm A"
                                )} (${dayjs(
                                  ticket.ticket_updated_at
                                ).fromNow()})`,
                            span: 2,
                          },
                          ...(ticket.ticket_status === "solved"
                            ? [
                                {
                                  key: "4",
                                  label: "Time Taken",
                                  children: formatTimeDifference(
                                    dayjs(ticket.ticket_created_at),
                                    dayjs(ticket.ticket_updated_at)
                                  ),
                                },
                              ]
                            : []),
                        ]}
                      />

                      <Divider />
                      <Descriptions bordered layout="vertical" size="small">
                        <Descriptions.Item
                          style={{ backgroundColor: "#ffffff" }}
                          labelStyle={{
                            fontWeight: "bold",
                            color: "#000000",
                          }}
                          label="Attachment"
                          key="1"
                        >
                          <div
                            style={{ maxWidth: "50px", textAlign: "center" }}
                          >
                            {ticket?.attachment ? (
                              isPDF ? (
                                <a
                                  href={
                                    ticket.attachment.startsWith("https")
                                      ? ticket.attachment
                                      : `${imageURLNew}/uploads/${
                                          ticket.attachment.includes("ticket\\")
                                            ? ticket.attachment.split(
                                                "ticket\\"
                                              )[1]
                                            : ticket.attachment
                                        }`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button
                                    size="small"
                                    style={{
                                      fontSize: "8px",
                                      padding: "0 5px",
                                    }}
                                  >
                                    PDF
                                  </Button>
                                </a>
                              ) : (
                                <a>
                                  <Image
                                    src={`${imageURLNew}/uploads/${
                                      ticket.attachment.includes("ticket\\")
                                        ? ticket.attachment.split("ticket\\")[1]
                                        : ticket.attachment
                                    }`}
                                    alt="attachment"
                                    width={40}
                                    style={{ maxHeight: "40px" }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </a>
                              )
                            ) : (
                              <span>No File</span>
                            )}
                          </div>
                        </Descriptions.Item>
                        <Descriptions.Item
                          style={{ backgroundColor: "#ffffff" }}
                          labelStyle={{
                            fontWeight: "bold",
                            color: "#000000",
                          }}
                          label="Message"
                          key="2"
                        >
                          <div
                            style={{
                              minWidth: "500px",
                              wordWrap: "break-word",
                              whiteSpace: "pre-wrap",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: ticket.description,
                            }}
                          />
                        </Descriptions.Item>
                      </Descriptions>
                      <Card
                        style={{
                          marginTop: "1rem",
                        }}
                        title="Comments"
                      >
                        <div>
                          {commentData?.data?.map((comment, index) => (
                            <Space
                              key={index}
                              style={{
                                display: "flex",
                                gap: 4,
                                alignItems: "start",
                                marginBottom: "0.7rem",
                              }}
                            >
                              <Image
                                src={noUser}
                                alt="user"
                                preview={false}
                                width={30}
                                height={30}
                                style={{ borderRadius: "50%" }}
                              />
                              <div>
                                <p
                                  style={{
                                    color: "black", // Text color always black
                                    backgroundColor:
                                      profile?.employee_id ===
                                      comment.employee_id
                                        ? "#DCF8C6" // Light green for the logged-in user's comment
                                        : "#ECE5DD", // Light grayish background for other users' comments
                                    padding: "8px 12px",
                                    borderRadius: "16px",
                                    maxWidth: "80%", // To ensure it doesn't stretch too much
                                    wordWrap: "break-word", // Wrap text nicely
                                  }}
                                >
                                  <p
                                    style={{
                                      fontWeight: "bold",
                                      marginBottom: "0px",
                                    }}
                                  >
                                    {comment.user_name} ({comment.employee_id})
                                  </p>
                                  {/* Modify the comment text to handle links */}
                                  {comment.comment_text
                                    .split(/(https?:\/\/[^\s]+)/g)
                                    .map((part, idx) => {
                                      if (part.match(/https?:\/\/[^\s]+/)) {
                                        return (
                                          <a
                                            key={idx}
                                            href={part}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                              color: "#007bff", // Link color (blue)
                                              textDecoration: "underline", // Underline the link
                                            }}
                                          >
                                            {part}
                                          </a>
                                        );
                                      }

                                      return <span key={idx}>{part}</span>; // Normal text (black)
                                    })}
                                </p>
                                <span
                                  style={{
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {dayjs(comment.created_at).fromNow()}{" "}
                                  {comment.is_edit === 1 && "(Edited)"}
                                </span>
                              </div>
                            </Space>
                          ))}
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </>
      ) : (
        <Card>
          <Empty />
        </Card>
      )}
      <Pagination
        size="small"
        align="end"
        pageSizeOptions={["10", "20", "30", "50", "100"]}
        current={page}
        pageSize={pageSize}
        total={data?.total || 0}
        showTotal={(total) => `Total ${total}`}
        onChange={handlePaginationChange}
        showSizeChanger
      />
    </Card>
  );
};

export default SuperAdminTicketList;
