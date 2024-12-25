import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Divider,
  Tag,
  Row,
  Col,
  Dropdown,
  Select,
  Space,
  Image,
  Empty,
  Pagination,
} from "antd";
import {
  useCreateCommentMutation,
  useGetRaiseTicketUserWiseQuery,
  useLazyGetCommentDataQuery,
} from "../api/ticketEndpoint";
import { IRaiseTicketList } from "../types/ticketTypes";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { imageURLNew } from "../../../app/slice/baseQuery";
import noImage from "../../../assets/No_Image.jpg";
import noUser from "../../../assets/avatar2.png";
import { useGetMeQuery } from "../../../app/api/userApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { formatTimeDifference } from "../utils/timeFormat";
dayjs.extend(relativeTime);

const { Option } = Select;
const RaiseTicketList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const skipValue = (page - 1) * pageSize;
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [newComment, setNewComment] = useState<string>("");
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
  const { data, isLoading } = useGetRaiseTicketUserWiseQuery({ ...filter });
  const [getComments, { data: commentData, isLoading: commentLoader }] =
    useLazyGetCommentDataQuery();
  const { data: { data: profile } = {} } = useGetMeQuery();

  const [createComment, { isSuccess }] = useCreateCommentMutation();
  const handleExpand = (id: number): void => {
    setExpandedCard(expandedCard === id ? null : id);
  };
  const handlePaginationChange = (current: number, size: number) => {
    setPage(current);
    setPageSize(size);
    setFilter({ ...filter, offset: (current - 1) * size, limit: size });
  };
  const handleAddComment = (id: number): void => {
    const body = {
      ticket_id: id,
      comment_text: newComment,
    };
    createComment(body);
  };

  useEffect(() => {
    if (isSuccess) {
      setNewComment("");
    }
  }, [isSuccess]);

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

  return (
    <Card
      loading={isLoading}
      style={{ width: "100%", padding: "1rem", backgroundColor: "#f5f5f5" }}
      title="Ticket List"
      extra={
        <Space>
          <Input
            prefix={<SearchOutlined />}
            style={{ width: "180px" }}
            onChange={(e) =>
              setFilter({ ...filter, key: e.target.value, offset: 0 })
            }
            placeholder="Search..."
          />
          <Dropdown
            trigger={["hover"]}
            dropdownRender={() => (
              <div
                style={{
                  padding: 16,
                  background: "#fff",
                  borderRadius: 8,
                  width: "190px",
                  border: "1px solid #f2f2f2",
                }}
              >
                <Select
                  allowClear
                  style={{ width: "180px", marginBottom: 8 }}
                  onChange={(e) =>
                    setFilter({ ...filter, status: e, offset: 0 })
                  }
                  placeholder="Select Status"
                >
                  <Option value="">All</Option>
                  <Option value="inprogress">IN PROGRESS</Option>
                  <Option value="solved">SOLVED</Option>
                  <Option value="unsolved">UNSOLVED</Option>
                  <Option value="forward">FORWARD</Option>
                </Select>
                <Select
                  allowClear
                  style={{ width: "180px", marginBottom: 8 }}
                  onChange={(e) =>
                    setFilter({ ...filter, priority: e, offset: 0 })
                  }
                  placeholder="Select Priority"
                >
                  <Option value="">All</Option>
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                  <Option value="urgent">Urgent</Option>
                </Select>
              </div>
            )}
          >
            <Button icon={<FilterOutlined />}>Filters</Button>
          </Dropdown>
        </Space>
      }
    >
      {data?.data?.length ? (
        <>
          {data?.data?.map((ticket: IRaiseTicketList, index: number) => {
            const isPDF = ticket?.attachment?.endsWith(".pdf");
            return (
              <Card
                key={ticket.id}
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
                onClick={(e) => handleCardClick(e, ticket.id)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h3 style={{ color: "#1890ff" }}>{`Ticket ID: ${ticket.ticket_id
                      }`}</h3>
                    <h3 style={{ color: "#000000" }}>{`Title: ${ticket.subject}`}</h3>
                    <div>
                      {ticket.ticket_status === "solved" && (
                        <strong>
                          Solved By: {ticket.ticket_solved_employee_name} ({ticket.ticket_solved_employee_id})
                        </strong>
                      )}
                    </div>
                  </div>
                  <div>
                    {ticket.ticket_status === "unsolved" && (
                      <Tag color="error">UNSOLVED</Tag>
                    )}
                    {ticket.ticket_status === "solved" && (
                      <Tag color="success">SOLVED</Tag>
                    )}
                    {ticket.ticket_status === "forward" && (
                      <Tag color="pink">FORWARD</Tag>
                    )}
                    {ticket.ticket_status === "inprogress" && (
                      <Tag color="processing">IN PROGRESS</Tag>
                    )}
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
                      <p>{ticket.serial_number || "N/A"}</p>
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
                          <Tag color="pink-inverse">HIGHT</Tag>
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
                      <p>{ticket.category_name}</p>
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
                      <p>{ticket.unit_name}</p>
                    </div>
                  </Col>
                </Row>
                <div>
                  {expandedCard === ticket.id && (
                    <div
                      style={{
                        marginTop: "1rem",
                        backgroundColor: "#f9f9f9",
                        padding: "1rem",
                        borderRadius: "8px",
                      }}
                    >
                      <p style={{ color: "#444" }}>
                        <strong>CC Person : {ticket.cc}</strong> 
                      </p>
                      <p style={{ color: "#444" }}>
                        <strong>
                          Assign Date :{" "}
                          {dayjs(ticket.created_at).format("DD MMM YYYY HH:mm")}{" "}
                          ({dayjs(ticket.created_at).fromNow()})
                        </strong>{" "}
                      </p>
                      <p style={{ color: "#444" }}>
                        <strong>
                          Last Updated at :{" "}
                          {dayjs(ticket.updated_at).format("DD MMM YYYY HH:mm")}{" "}
                          ({dayjs(ticket.updated_at).fromNow()})
                        </strong>{" "}
                      </p>
                      {ticket.ticket_status === "solved" && (
                        <p style={{ color: "#444" }}>
                          <strong>
                            Time Taken :{" "}
                            {formatTimeDifference(
                              dayjs(ticket.created_at),
                              dayjs(ticket.updated_at)
                            )}
                          </strong>{" "}
                        </p>
                      )}
                      <p style={{ color: "#444" }}>
                        <strong>Message:</strong> {ticket.description}
                      </p>
                      <p style={{ color: "#444" }}>
                        <strong>Attachment:</strong>
                        {isPDF ? (
                          <a
                            href={`${imageURLNew}/uploads/${ticket?.attachment?.split("ticket\\")[1]
                              }`}
                            target="_blank"
                          >
                            <Button size="small">View PDF</Button>
                          </a>
                        ) : (
                          <Image
                            src={
                              ticket.attachment
                                ? `${imageURLNew}/uploads/${ticket?.attachment?.split("ticket\\")[1]
                                }`
                                : noImage
                            }
                            alt="attachment"
                            width={30}
                            style={{ maxHeight: "30px" }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </p>
                      <Card
                        style={{
                          marginTop: "1rem",
                          // width: "50%",
                          // margin: "0 auto",
                        }}
                        title="Comments"
                      >
                        <div>
                          {commentData?.data?.map((comment, index) => (
                            <>
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
                                      color:
                                        profile?.employee_id ===
                                          comment.employee_id
                                          ? "white"
                                          : "black",
                                      backgroundColor:
                                        profile?.employee_id ===
                                          comment.employee_id
                                          ? "#1775BB"
                                          : "#E8E8E8",
                                      padding: "6px 12px",
                                      borderRadius: "16px",
                                    }}
                                  >
                                    <p
                                      style={{
                                        fontWeight: "bold",
                                        marginBottom: "0px",
                                      }}
                                    >
                                      {comment.user_name} ({comment.employee_id}
                                      )
                                    </p>
                                    {comment.comment_text}
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
                            </>
                          ))}
                        </div>
                        <Input.TextArea
                          rows={2}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment"
                          style={{
                            marginBottom: "0.2rem",
                            borderRadius: "6px",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                          type="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddComment(ticket.id);
                          }}
                        >
                          Add Comment
                        </Button>
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

export default RaiseTicketList;
