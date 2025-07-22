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
  Radio,
  Descriptions,
  Tooltip,
  Modal,
  message
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
import { TiArrowLoop } from "react-icons/ti";
import { BsFillPeopleFill } from "react-icons/bs";
import CountdownTimer from "../components/Countdown"
import relativeTime from "dayjs/plugin/relativeTime";
import { formatTimeDifference } from "../utils/timeFormat";
dayjs.extend(relativeTime);
import { useTicketReRaiseMutation } from "../api/ticketEndpoint";
const { Option } = Select;


const RaiseTicketList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [reRaiseComment, setReRaiseComment] = useState("");
  const showReRaiseModal = (ticketId: number) => {
    setSelectedTicketId(ticketId);
    setReRaiseComment("");
    setIsModalVisible(true);
  };
  const handleReRaiseSubmit = () => {
    if (!reRaiseComment.trim()) {
      message.warning("Please enter a reason before submitting.");
      return;
    }

    const body = {
      comment: reRaiseComment,
    };

    ticketReRaise({ id: selectedTicketId!, body })
      .unwrap()
      .then(() => {
        setIsModalVisible(false);
        setSelectedTicketId(null);

      })
      .catch(() => {
        message.error("Failed to re-raise ticket.");
      });
  };
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedTicketId(null);
    setReRaiseComment("");
  };


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


  const [ticketReRaise] = useTicketReRaiseMutation();

  // const handleTicketReRaise = (ticketId: number) => {
  //   const body = {
  //     ticket_id: ticketId, // Re-raise ticket by passing ticket_id in body
  //   };

  //   ticketReRaise({ id: ticketId, body }) // Ensure this matches the mutation's expected format
  //     .unwrap()
  //     .then((response) => {
  //       console.log('Ticket re-raised successfully:', response);
  //     })
  //     .catch((error) => {
  //       console.error('Error re-raising ticket:', error);
  //     });
  // };

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
      style={{ width: "100%",}}
      title="Ticket List"
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
                    <h3 style={{ display: "flex", alignItems: "center", color: "#1890ff" }}>
                      <span>{`Ticket ID: ${ticket.ticket_id}`}</span>
                      <Space
                        size="small"
                        style={{
                          marginLeft: 10,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {ticket.is_re_raise === 1 && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              backgroundColor: "#fff7e6",
                              color: "#fa8c16",
                              border: "1px solid #ffd591",
                              borderRadius: "6px",
                              padding: "2px 8px",
                              fontSize: "13px",
                              fontWeight: 500,
                              lineHeight: "16px",
                              height: "22px",
                            }}
                          >
                            <TiArrowLoop size={16} style={{ marginRight: 4 }} />
                            Re-Raised
                          </div>
                        )}
                        {ticket.is_on_behalf === 1 && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              backgroundColor: "#f9f0ff",
                              color: "#722ed1",
                              border: "1px solid #d3adf7",
                              borderRadius: "6px",
                              padding: "2px 8px",
                              fontSize: "13px",
                              fontWeight: 500,
                              lineHeight: "16px",
                              height: "22px",
                            }}
                          >
                            <BsFillPeopleFill size={15} style={{ marginRight: 4 }} />
                            On Behalf
                          </div>
                        )}
                      </Space>


                    </h3>

                    <h3
                      style={{ color: "#000000" }}
                    >{`Title: ${ticket.subject}`}</h3>


                    <div>
                      {ticket.ticket_status === "solved" && (
                        <strong>
                          Solved By: {ticket.ticket_solved_employee_name} (
                          {ticket.ticket_solved_employee_id})
                        </strong>
                      )}
                    </div>
                    <strong>
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
                              Forwarded By: {ticket.action_by_name || "Unknown"}{" "}
                              ({ticket.action_by_employee_id || "Unknown"})
                            </span>
                          </Tooltip>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap", // optional, helps in small screens
                        }}
                      >
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
                        {ticket.ticket_status === "solved" && (
                          <Button
                            type="text"
                            size="small"
                            onClick={() => showReRaiseModal(ticket.id)}
                            style={{
                              backgroundColor: "#fff7e6",          // matches Tag orange-inverse
                              color: "#fa8c16",                    // text color like tag
                              border: "1px solid #ffd591",         // border similar to tag
                              fontWeight: 600,                     // bold text
                              fontSize: "12px",                    // slightly smaller font size
                              borderRadius: "4px",                 // same as default Tag
                              padding: "1px 6px",                  // slightly smaller padding
                              height: "22px",                      // slightly reduced height
                              lineHeight: "22px",                  // centers the text vertically
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",            // ensure both text and icon are centered
                            }}
                            icon={<TiArrowLoop size={16} />}
                          >
                            Re-Raise
                          </Button>


                        )}
                      </div>

                    </strong>
                  </div>

                  <div>
                    <CountdownTimer
                      ticketCreatedAt={ticket.created_at}
                      ticketUpdatedAt={ticket.updated_at}
                      responseTimeValue={ticket.response_time_value}
                      responseTimeUnit={ticket.response_time_unit}
                      resolveTimeValue={ticket.resolve_time_value}
                      resolveTimeUnit={ticket.resolve_time_unit}
                      ticketStatus={ticket.ticket_status}
                    />


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
                          {
                            key: "1",
                            label: "CC Person",
                            children: ticket.cc ? ticket.cc : "N/A",
                            span: 2,
                          },
                          {
                            key: "2",
                            label: "Assign Date",
                            children: dayjs(ticket.created_at).format(
                              "DD MMM YYYY h:mm A"
                            ),
                            span: 2,
                          },
                          {
                            key: "3",
                            label: "Last Updated at",
                            children: dayjs(ticket.created_at).isSame(
                              dayjs(ticket.updated_at)
                            )
                              ? "Not Updated Yet"
                              : `${dayjs(ticket.updated_at).format(
                                "DD MMM YYYY h:mm A"
                              )} (${dayjs(ticket.updated_at).fromNow()})`,
                            span: 2,
                          },
                          ...(ticket.ticket_status === "solved"
                            ? [
                              {
                                key: "4",
                                label: "Time Taken",
                                children: formatTimeDifference(
                                  dayjs(ticket.created_at),
                                  dayjs(ticket.updated_at)
                                ),
                                span: 2,
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
                                      : `${imageURLNew}/uploads/${ticket.attachment.includes("ticket\\")
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
                                    src={`${imageURLNew}/uploads/${ticket.attachment.includes("ticket\\")
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
                                    color: "black", // Ensure all text is black
                                    backgroundColor:
                                      profile?.employee_id ===
                                        comment.employee_id
                                        ? "#DCF8C6" // Light green for logged-in user's comment
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

                                      return <span key={idx}>{part}</span>;
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
      <Modal
        title="Re-Raise Ticket"
        open={isModalVisible}
        onCancel={handleModalCancel}
        onOk={handleReRaiseSubmit}
        okText="Submit"
        cancelText="Cancel"
      >
        <p>Please provide a reason for re-raising this ticket:</p>
        <Input.TextArea
          rows={4}
          value={reRaiseComment}
          onChange={(e) => setReRaiseComment(e.target.value)}
          placeholder="Type your reason here..."
        />
      </Modal>
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
