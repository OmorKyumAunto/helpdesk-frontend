import React, { useState } from "react";
import { Card, InputNumber, Select, Button, Row, Col, Divider, message } from "antd";

const { Option } = Select;

const priorities = [
  { name: "Low", color: "#e6f7e6" }, // Light Green
  { name: "Medium", color: "#e6f0ff" }, // Light Blue
  { name: "High", color: "#fff3e6" }, // Light Orange
  { name: "Urgent", color: "#ffe6e6" }, // Light Red
];

const SLAConfigure = () => {
  const [slaConfig, setSlaConfig] = useState({
    Low: { response: { time: 4, unit: "HOURS" }, resolve: { time: 1, unit: "DAY" } },
    Medium: { response: { time: 3, unit: "HOURS" }, resolve: { time: 5, unit: "HOURS" } },
    High: { response: { time: 40, unit: "MINUTES" }, resolve: { time: 50, unit: "MINUTES" } },
    Urgent: { response: { time: 30, unit: "MINUTES" }, resolve: { time: 40, unit: "MINUTES" } },
  });

  const timeUnits = { MINUTES: 1, HOURS: 60, DAY: 1440 };

  const handleChange = (priority: string, type: "response" | "resolve", value: any, field: "time" | "unit") => {
    setSlaConfig((prevState) => {
      const newConfig = {
        ...prevState,
        [priority]: {
          ...prevState[priority],
          [type]: {
            ...prevState[priority][type],
            [field]: value,
          },
        },
      };

      // Convert times to minutes for validation
      const responseInMinutes = newConfig[priority].response.time * timeUnits[newConfig[priority].response.unit];
      const resolveInMinutes = newConfig[priority].resolve.time * timeUnits[newConfig[priority].resolve.unit];

      // Validation: Resolve time must be greater than response time
      if (resolveInMinutes <= responseInMinutes) {
        message.error("Resolve time must be greater than response time!");
      }

      return newConfig;
    });
  };

  return (
    <Card title="SLA Configuration" style={{ boxShadow: "0 0 0 1px rgba(0,0,0,.05)", marginBottom: "1rem" }}>
      <Row gutter={[16, 16]}>
        {priorities.map(({ name, color }) => (
          <Col span={6} key={name}>
            
            <Card
              title={name}
              bordered={false}
              style={{
                backgroundColor: color,
                transition: "transform 0.3s ease-in-out",
                cursor: "pointer",
              }}
              className="zoom-card"
            >
              
              
              <div style={{ marginBottom: "10px" }}>
                <strong>Response within:</strong>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "5px" }}>
                  <InputNumber
                    min={1}
                    value={slaConfig[name].response.time}
                    onChange={(value) => handleChange(name, "response", value, "time")}
                  />
                  <Select
                    defaultValue={slaConfig[name].response.unit}
                    onChange={(value) => handleChange(name, "response", value, "unit")}
                    style={{ width: "80px" }}
                  >
                    <Option value="MINUTES">Minutes</Option>
                    <Option value="HOURS">Hours</Option>
                    <Option value="DAY">Day</Option>
                  </Select>
                </div>
              </div>

              

              <div>
                <strong>Resolve within:</strong>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "5px" }}>
                  <InputNumber
                    min={1}
                    value={slaConfig[name].resolve.time}
                    onChange={(value) => handleChange(name, "resolve", value, "time")}
                  />
                  <Select
                    defaultValue={slaConfig[name].resolve.unit}
                    onChange={(value) => handleChange(name, "resolve", value, "unit")}
                    style={{ width: "80px" }}
                  >
                    <Option value="MINUTES">Minutes</Option>
                    <Option value="HOURS">Hours</Option>
                    <Option value="DAY">Day</Option>
                  </Select>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <Button type="primary" onClick={() => console.log(slaConfig)}>
          Save Configurations
        </Button>
      </div>

      {/* Zoom effect CSS */}
      <style>
        {`
          .zoom-card {
            transition: transform 0.3s ease-in-out;
          }
          .zoom-card:hover {
            transform: scale(1.05);
            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15);
          }
        `}
      </style>
    </Card>
  );
};

export default SLAConfigure;
