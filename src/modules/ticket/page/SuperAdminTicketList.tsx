import React, { useState } from "react";
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
} from "antd";
import {
  useGetRaiseTicketAdminWiseQuery,
  useGetRaiseTicketSuperAdminWiseQuery,
} from "../api/ticketEndpoint";
import { IAdminTicketList, IRaiseTicketList } from "../types/ticketTypes";
import {
  EditOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import UpdateTicketStatus from "../components/UpdateTicketStatus";

interface CommentsState {
  [key: string]: string[];
}
const { Option } = Select;
const SuperAdminTicketList: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [comments, setComments] = useState<CommentsState>({});
  const [newComment, setNewComment] = useState<string>("");
  const [filter, setFilter] = useState<{
    key: string;
    priority: string;
    status: string;
  }>({
    key: "",
    priority: "",
    status: "",
  });
  const dispatch = useDispatch();
  const { data, isLoading } = useGetRaiseTicketSuperAdminWiseQuery({});
  const handleExpand = (id: number): void => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleAddComment = (id: number): void => {
    setComments((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), newComment],
    }));
    setNewComment("");
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
    handleExpand(id);
  };

  return (
    <Card
      loading={isLoading}
      style={{ width: "100%", padding: "1rem", backgroundColor: "#f5f5f5" }}
      title="Super Admin Ticket List"
      //   extra={
      //     <Space>
      //       <Input
      //         prefix={<SearchOutlined />}
      //         style={{ width: "180px" }}
      //         onChange={(e) => setFilter({ ...filter, key: e.target.value })}
      //         placeholder="Search..."
      //       />
      //       <Dropdown
      //         trigger={["hover"]}
      //         dropdownRender={() => (
      //           <div
      //             style={{
      //               padding: 16,
      //               background: "#fff",
      //               borderRadius: 8,
      //               width: "190px",
      //               border: "1px solid #f2f2f2",
      //             }}
      //           >
      //             <Select
      //               allowClear
      //               style={{ width: "180px", marginBottom: 8 }}
      //               onChange={(e) => setFilter({ ...filter, status: e })}
      //               placeholder="Select Status"
      //             >
      //               <Option value="">All</Option>
      //               <Option value="solved">SOLVED</Option>
      //               <Option value="unsolved">UNSOLVED</Option>
      //               <Option value="forward">FORWARD</Option>
      //             </Select>
      //             <Select
      //               allowClear
      //               style={{ width: "180px", marginBottom: 8 }}
      //               onChange={(e) => setFilter({ ...filter, priority: e })}
      //               placeholder="Select Prioritay"
      //             >
      //               <Option value="">All</Option>
      //               <Option value="low">Low</Option>
      //               <Option value="medium">Medium</Option>
      //               <Option value="high">High</Option>
      //             </Select>
      //           </div>
      //         )}
      //       >
      //         <Button icon={<FilterOutlined />}>Filters</Button>
      //       </Dropdown>
      //     </Space>
      //   }
    >
      {data?.data?.map((ticket: IAdminTicketList, index: number) => (
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
              <h2 style={{ color: "#1890ff" }}>{`#${ticket.ticket_id + 1} - ${
                ticket.subject
              }`}</h2>
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
                  <Tag color="processing">FORWARD</Tag>
                )}
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
                <p style={{ color: "gray" }}>Priortiy</p>
                <>
                  {ticket.priority === "high" && (
                    <Tag color="red-inverse">HIGHT</Tag>
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
                  <strong>Details:</strong> {ticket.description}
                </p>

                <div style={{ marginTop: "1rem" }}>
                  <strong>Comments:</strong>
                  <div style={{ marginBottom: "1rem", color: "#666" }}>
                    {(comments[ticket.ticket_table_id] || []).map(
                      (comment, index) => (
                        <p
                          key={index}
                          style={{
                            marginBottom: "0.5rem",
                            fontStyle: "italic",
                          }}
                        >
                          - {comment}
                        </p>
                      )
                    )}
                  </div>
                  <Input.TextArea
                    rows={2}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                    style={{ marginBottom: "0.5rem", borderRadius: "6px" }}
                    onClick={(e) => e.stopPropagation()} // Prevent card click when interacting with input
                  />
                  <Button
                    type="primary"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleAddComment(ticket.ticket_table_id);
                    }}
                  >
                    Add Comment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </Card>
  );
};

export default SuperAdminTicketList;
