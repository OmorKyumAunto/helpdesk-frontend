import { Card, Col, Row } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import AssetReportModal from "../components/AssetReportModal";
import DisbursementReportModal from "../components/DisbursementReportModal";
import TaskReportModal from "../components/TaskReportModal";
import TicketReportModal from "../components/TicketReportModal";

const ReportsPage: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <Card>
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={24} md={12} lg={6}>
          <Card
            style={{ cursor: "pointer" }}
            onClick={() => {
              dispatch(
                setCommonModal({
                  title: "Asset Report Query",
                  content: <AssetReportModal />,
                  show: true,
                  width: 500,
                })
              );
            }}
            title="Asset Report"
          >
            This is asset report
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={6}>
          <Card
            style={{ cursor: "pointer" }}
            onClick={() => {
              dispatch(
                setCommonModal({
                  title: "Disbursement Report Query",
                  content: <DisbursementReportModal />,
                  show: true,
                  width: 500,
                })
              );
            }}
            title="Disbursement Report"
          >
            This is asset report
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={6}>
          <Card
            style={{ cursor: "pointer" }}
            onClick={() => {
              dispatch(
                setCommonModal({
                  title: "Ticket Report Query",
                  content: <TicketReportModal />,
                  show: true,
                  width: 500,
                })
              );
            }}
            title="Ticket Report"
          >
            This is ticket report
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={6}>
          <Card
            style={{ cursor: "pointer" }}
            onClick={() => {
              dispatch(
                setCommonModal({
                  title: "Task Report Query",
                  content: <TaskReportModal />,
                  show: true,
                  width: 500,
                })
              );
            }}
            title="Task Report"
          >
            This is task report
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default ReportsPage;
