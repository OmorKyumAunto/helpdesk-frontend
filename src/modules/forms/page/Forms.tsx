import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Typography } from "antd";
import { saveAs } from "file-saver";
import { useState } from "react";

const Forms = () => {
  const handleDemandSlip = () => {
    const pdfUrl = "/templates/demand-slip-bandhan.xlsx";
    const pdfName = "demand-slip.xlsx";

    saveAs(pdfUrl, pdfName);
  };

  const [searchTerm, setSearchTerm] = useState("");
  // Updated dummy template data
  const templates = [
    {
      title: "Demand Slip For Bandhan",
      description: "Form for Purchasing Product from Bandhan.",
      file: "/templates/demand-slip-bandhan.xlsx",
    },
    {
      title: "CS Template",
      description: "Template for CS.",
      file: "/templates/cs-template.xlsx",
    },
    {
      title: "Stationary Requisition Form",
      description: "Template for Stationary requisition.",
      file: "/templates/stationary-requisition.xlsx",
    },
    {
      title: "Monthly Achievements PPtx template",
      description: "Template for monthly Achivements.",
      file: "/templates/monthly-achivement-template.pptx",
    },
  ];

  // Filter templates based on search term
  const filteredTemplates = templates.filter((template) =>
    template.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Card
      title="Downloadable Forms and Templates"
      extra={
        <>
          <Input
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
        </>
      }
    >
      <Typography.Title level={5} style={{ marginBottom: "18px" }}>
        Select and download the necessary Templates and Forms.
      </Typography.Title>
      <Row gutter={[12, 12]}>
        {filteredTemplates.map((template, index) => (
          <Col xs={24} sm={24} md={12} lg={8} key={index}>
            <Card className="shadow-lg">
              <Typography.Title level={4}>{template.title}</Typography.Title>
              <Typography.Text style={{ fontSize: "15px" }}>
                {template.description}
              </Typography.Text>{" "}
              <br />
              <a
                href={template.file}
                download
                className="inline-block px-4 py-1 mt-2 bg-[#8cc63f] text-white hover:text-white rounded hover:bg-[#7ab536] transition-colors duration-300"
              >
                Download
              </a>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default Forms;
