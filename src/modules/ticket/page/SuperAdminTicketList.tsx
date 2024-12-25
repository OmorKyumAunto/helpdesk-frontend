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
  Popconfirm,
  Empty,
  Pagination,
  Radio,
} from "antd";
import {
  useCreateCommentMutation,
  useDeleteTicketMutation,
  useGetRaiseTicketAdminWiseQuery,
  useGetRaiseTicketSuperAdminWiseQuery,
  useLazyGetCommentDataQuery,
} from "../api/ticketEndpoint";
import { IAdminTicketList, IRaiseTicketList } from "../types/ticketTypes";
import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import UpdateTicketStatus from "../components/UpdateTicketStatus";
import { imageURLNew } from "../../../app/slice/baseQuery";
import noImage from "../../../assets/No_Image.jpg";
import { useGetMeQuery } from "../../../app/api/userApi";
import noUser from "../../../assets/avatar2.png";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { formatTimeDifference } from "../utils/timeFormat";
dayjs.extend(relativeTime);

const { Option } = Select;
const SuperAdminTicketList: React.FC = () => {
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
  const [remove] = useDeleteTicketMutation();
  const { data, isLoading } = useGetRaiseTicketSuperAdminWiseQuery({
    ...filter,
  });
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
  const options = [
    { label: "All", value: "" },
    { label: "In Progress", value: "inprogress" },
    { label: "Solved", value: "solved" },
    { label: "Unsolved", value: "unsolved" },
    { label: "Forward", value: "forward" },
  ];

  return (
    <Card
      loading={isLoading}
      style={{ width: "100%", padding: "1rem", backgroundColor: "#f5f5f5" }}
      title="Super Admin Ticket List"
      extra={
        <Space>
          <Radio.Group
            // block
            options={options}
            defaultValue=""
            optionType="button"
            buttonStyle="solid"
            onChange={(e) =>
              setFilter({ ...filter, status: e.target.value, offset: 0 })
            }
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
                    <h3 style={{ color: "#1890ff" }}>{`Ticket Id: ${
                      ticket.ticket_id + 1
                    } - ${ticket.subject}`}</h3>
                    <strong>
                      Created By: {ticket.name} ({ticket.employee_id})
                    </strong>
                  </div>
                  <div>
                    <Space>
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
                      {/* <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    dispatch(
                      setCommonModal({
                        title: "Update Ticket Status",
                        content: <UpdateTicketStatus single={ticket} />,
                        show: true,
                      })
                    );
                  }}
                >
                  <EditOutlined />
                </Button> */}
                    </Space>
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
                  {/* <Col xs={12} sm={12} md={8} lg={4}>
              <div
                style={{
                  textAlign: "left",
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
              >
                <p style={{ color: "gray" }}>Status</p>
                <Tag color={ticket.status === 1 ? "success" : "error"}>
                  {ticket.status === 1 ? "ACTIVE" : "INACTIVE"}
                </Tag>
              </div>
            </Col> */}
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
                      <p style={{ color: "#444" }}>
                        <strong>
                          Ticket Created Time :{" "}
                          {dayjs(ticket.ticket_created_at).format(
                            "DD MMM YYYY HH:mm"
                          )}{" "}
                          ({dayjs(ticket.ticket_created_at).fromNow()})
                        </strong>{" "}
                      </p>
                      <p style={{ color: "#444" }}>
                        <strong>
                          Ticket Last Updated Time :{" "}
                          {dayjs(ticket.ticket_updated_at).format(
                            "DD MMM YYYY HH:mm"
                          )}{" "}
                          ({dayjs(ticket.ticket_updated_at).fromNow()})
                        </strong>{" "}
                      </p>
                      {ticket.ticket_status === "solved" && (
                        <p style={{ color: "#444" }}>
                          <strong>
                            Ticket Solved in:{" "}
                            {formatTimeDifference(
                              dayjs(ticket.ticket_created_at),
                              dayjs(ticket.ticket_updated_at)
                            )}
                          </strong>{" "}
                        </p>
                      )}
                      <p style={{ color: "#444" }}>
                        <strong>Details:</strong> {ticket.description}
                      </p>
                      <p style={{ color: "#444" }}>
                        <strong>Attachment:</strong>
                        {isPDF ? (
                          <a
                            href={`${imageURLNew}/uploads/${
                              ticket?.attachment?.split("ticket\\")[1]
                            }`}
                            target="_blank"
                          >
                            <Button size="small">View PDF</Button>
                          </a>
                        ) : (
                          <Image
                            src={
                              ticket.attachment
                                ? `${imageURLNew}/uploads/${
                                    ticket?.attachment?.split("ticket\\")[1]
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
                        {/* <Input.TextArea
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
                            handleAddComment(ticket.ticket_table_id);
                          }}
                        >
                          Add Comment
                        </Button> */}
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
