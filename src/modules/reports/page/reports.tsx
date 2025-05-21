import { Card, Col, Row, Typography } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import {
  BarChartOutlined,
  FileDoneOutlined,
  FundProjectionScreenOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { setCommonModal } from "../../../app/slice/modalSlice";
import AssetReportModal from "../components/AssetReportModal";
import DisbursementReportModal from "../components/DisbursementReportModal";
import TaskReportModal from "../components/TaskReportModal";
import TicketReportModal from "../components/TicketReportModal";
import CombineReportModal from "../components/CombineReportModal";

const { Title, Text } = Typography;

const ReportsPage: React.FC = () => {
  const dispatch = useDispatch();

  const handleOpenModal = (
    title: string,
    content: JSX.Element,
    width: number = 520
  ) => {
    dispatch(
      setCommonModal({
        title,
        content,
        show: true,
        width,
      })
    );
  };

  const cards = [
    {
      title: "Asset Report",
      description: "Monitor assets & equipment lifecycle.",
      icon: <FundProjectionScreenOutlined />,
      color: "#3B82F6",
      bgColor: "linear-gradient(135deg, #E0F2FE, #F0F9FF)",
      modal: () => <AssetReportModal key={Date.now()} />,
    },
    {
      title: "Disbursement Report",
      description: "Track item issue & handovers.",
      icon: <FileDoneOutlined />,
      color: "#F97316",
      bgColor: "linear-gradient(135deg, #FFF7ED, #FFF4E5)",
      modal: () => <DisbursementReportModal key={Date.now()} />,
    },
    {
      title: "Ticket Report",
      description: "Review support trends & logs.",
      icon: <ProfileOutlined />,
      color: "#22C55E",
      bgColor: "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
      modal: () => <TicketReportModal key={Date.now()} />,
    },
    {
      title: "Task Report",
      description: "Evaluate task timelines & owners.",
      icon: <BarChartOutlined />,
      color: "#8B5CF6",
      bgColor: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
      modal: () => <TaskReportModal key={Date.now()} />,
    },
    {
      title: "Combine Report",
      description: "Evaluate task timelines & owners.",
      icon: <BarChartOutlined />,
      color: "#8B5CF6",
      bgColor: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
      modal: () => <CombineReportModal key={Date.now()} />,
    },
  ];

  return (
    <Card style={{ minHeight: "80vh" }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        📊 Reports Dashboard
      </Title>
      <Row gutter={[24, 24]}>
        {cards.map((card, index) => (
          <Col xs={24} sm={12} md={12} lg={6} key={index}>
            <Card
              hoverable
              onClick={() =>
                handleOpenModal(`${card.title} Query`, card.modal())
              }
              style={{
                borderRadius: 16,
                background: card.bgColor,
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              bodyStyle={{ padding: 20, height: 170 }}
              className="report-card"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Title level={5} style={{ margin: 0 }}>
                    {card.title}
                  </Title>
                  <div
                    style={{
                      fontSize: 28,
                      color: card.color,
                      transition: "transform 0.3s",
                    }}
                    className="icon-bounce"
                  >
                    {card.icon}
                  </div>
                </div>
                <Text
                  type="secondary"
                  style={{ fontSize: 13, lineHeight: 1.5 }}
                >
                  {card.description}
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <style>
        {`
          .report-card:hover {
            transform: scale(1.035);
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
          }

          .report-card:hover .icon-bounce {
            transform: scale(1.2) rotate(3deg);
          }
        `}
      </style>
    </Card>
  );
};

export default ReportsPage;
