import { SearchOutlined } from "@ant-design/icons";
import { Card, Col, Input, Row, Typography } from "antd";
import { saveAs } from "file-saver";
import { useState } from "react";
const AssetTemplate = "https://www.dropbox.com/scl/fi/u0587ahdf260wux1y21et/Asset-Upload-Template.xlsx?rlkey=910wiu065jwvtf2q7kmchiroh&st=r9qjsow7&raw=1";
const CsTemplate = "https://www.dropbox.com/scl/fi/evr2hkeyp8d4ynltvivki/cs-template.xlsx?rlkey=qwk6rzn1owtkkfsxkwm0bf6uk&st=zful9ih9&raw=1";
const DemandSlip = "https://www.dropbox.com/scl/fi/j9j91q0757s6px9xm3ymr/demand-slip-bandhan.xlsx?rlkey=f8uzmsciqvwnd022jmuz75ptd&st=54578r5z&raw=1";
const Emailrequisition = "https://www.dropbox.com/scl/fi/fpdg51xtrdbo50getei63/EMAIL-REQUISITION-FORM.pdf?rlkey=akt9zfq4ua1sfqckj4c9uyo1g&st=g7ubo668&raw=1";
const EmployeeTemplate = "https://www.dropbox.com/scl/fi/y7d6361qlvbcrsdx64t3y/Employee-Upload-Template.xlsx?rlkey=oxkjp8q47xkr98ts49koil4m8&st=2xtm4u25&raw=1"
const HardwareRequisition = "https://www.dropbox.com/scl/fi/w8kiugw0k3g74rcowx9xg/HARDWARE-REQUISITION-FORM.pdf?rlkey=pfdamk4rth8zbh60zvuwnixo2&st=0q9mjt3e&raw=1";
const MonthlyAchivements = "https://www.dropbox.com/scl/fi/r2j3t228ptdrwa4hmgnoz/monthly-achivement-template.pptx?rlkey=oxgdhlfyhdkhr03t23hgh3vj3&st=74wte32s&raw=1";
const StationaryReq = "https://www.dropbox.com/scl/fi/rju8bhgl70sukkt75objf/stationary-requisition.xlsx?rlkey=3d6aa0e6f4b45bup28py13n27&st=2rnbhcj2&raw=1";

const Forms = () => {
  
  const [searchTerm, setSearchTerm] = useState("");
  // Updated dummy template data
  const templates = [
    {
      title: "Hardware Requisition Form",
      description: "Template for Hardware requisition.",
      file: HardwareRequisition,
    },
    {
      title: "Email Requisition Form",
      description: "Template for Email requisition.",
      file: Emailrequisition,
    },
    {
      title: "Stationary Requisition Form",
      description: "Template for Stationary requisition.",
      file: StationaryReq,
    },
    {
      title: "CS Template",
      description: "Template for CS.",
      file: CsTemplate,
    },
    {
      title: "Monthly Achievements PPTX",
      description: "Template for monthly Achivements.",
      file: MonthlyAchivements,
    },
    {
      title: "Employee Upload Template",
      description: "Template for Employee Upload",
      file: EmployeeTemplate,
    },
    {
      title: "Asset Upload Template",
      description: "Template for Asset Upload",
      file: AssetTemplate,
    },
    {
      title: "Demand Slip For Bandhan",
      description: "Demand Slip for Bandhan.",
      file: DemandSlip,
    },
  ];
  const nums = [1, 2, 3, 4, 5];
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
