import React, { useState, useEffect } from "react";
import { Card, InputNumber, Select, Button, Row, Col, message } from "antd";
import { useGetSLAConfigListQuery, useUpdateSLAConfigMutation } from "../api/slaconfigureEndPoint";
import { ISLAConfig } from "../types/slaconfigureTypes";

const { Option } = Select;

const priorities = [
  { name: "low", displayName: "Low", color: "#e6f7e6", border: "#52c41a" },
  { name: "medium", displayName: "Medium", color: "#e6f0ff", border: "#1890ff" },
  { name: "high", displayName: "High", color: "#fff3e6", border: "#faad14" },
  { name: "urgent", displayName: "Urgent", color: "#ffe6e6", border: "#ff4d4f" },
];

const timeUnits = { minutes: 1, hours: 60, day: 1440 };

const SLAConfigurePage = () => {
  const { data: slaConfigList, isLoading } = useGetSLAConfigListQuery();
  const [updateSLAConfig] = useUpdateSLAConfigMutation();
  const [slaConfig, setSlaConfig] = useState<ISLAConfig[]>([]);

  useEffect(() => {
    if (slaConfigList?.data) {
      setSlaConfig(
        slaConfigList.data.map((item) => ({
          ...item,
          response_time_value: item.response_time_value ?? 1, // ✅ Ensure it exists
          resolve_time_value: item.resolve_time_value ?? 1, // ✅ Ensure it exists
          response: {
            time: item.response_time_value ?? 1,
            unit: item.response_time_unit?.toLowerCase() ?? "hours",
          },
          resolve: {
            time: item.resolve_time_value ?? 1,
            unit: item.resolve_time_unit?.toLowerCase() ?? "days",
          },
        }))
      );
    }
  }, [slaConfigList]);
  

  const handleChange = (id: number, type: "response" | "resolve", value: any, field: "time" | "unit") => {
    setSlaConfig((prevState) =>
      prevState.map((item) =>
        item.id === id
          ? {
            ...item,
            [type]: {
              ...item[type],
              [field]: value,
            },
          }
          : item
      )
    );
  };

  const handleSave = async (id: number) => {
    const updatedItem = slaConfig.find((item) => item.id === id);
    if (!updatedItem) {
      message.error("No SLA Configuration found!");
      return;
    }

    if (!updatedItem.response.time || !updatedItem.resolve.time) {
      message.error("Response and Resolve time cannot be empty!");
      return;
    }

    const responseUnit = updatedItem.response.unit as keyof typeof timeUnits;
    const resolveUnit = updatedItem.resolve.unit as keyof typeof timeUnits;

    const responseTimeMinutes = updatedItem.response.time * timeUnits[responseUnit];
    const resolveTimeMinutes = updatedItem.resolve.time * timeUnits[resolveUnit];

    if (resolveTimeMinutes <= responseTimeMinutes) {
      message.error("Resolve time must be greater than response time!");
      return;
    }
    try {
      await updateSLAConfig({
        id,
        priority: updatedItem.priority,
        response_time_unit: updatedItem.response.unit,
        resolve_time_unit: updatedItem.resolve.unit,
        response_time_value: updatedItem.response.response_time_value, // ✅ Correct placement
        resolve_time_value: updatedItem.resolve.resolve_time_value, // ✅ Correct placement
        response: {
          time: updatedItem.response.time,
          unit: responseUnit,
        },
        resolve: {
          time: updatedItem.resolve.time,
          unit: resolveUnit,
        },
      }).unwrap();
    
    
    } catch (error) {
      console.error("PUT request failed:", error);
      message.error("Failed to save SLA Configuration");
    }
    
    


  };

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        {slaConfig.map(({ id, priority, response, resolve }) => {
          const priorityData = priorities.find((p) => p.name === priority.toLowerCase()) || { color: "#fff", border: "#000" };

          const displayName = (priorityData as { displayName: string }).displayName || priority.charAt(0).toUpperCase() + priority.slice(1);


          return (
            <Col xs={24} sm={12} md={8} lg={6} key={id}>
              <Card
                title={displayName}
                bordered={false}
                style={{
                  backgroundColor: priorityData.color,
                  borderLeft: `5px solid ${priorityData.border}`,
                  borderRadius: "12px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                  transition: "transform 0.3s ease-in-out",
                  cursor: "pointer",
                  padding: "15px",
                  transform: "scale(1)",
                }}
                className="sla-card"
              >
                <div>
                  <strong>Response within:</strong>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "5px" }}>
                    <InputNumber
                      min={1}
                      value={response.time}
                      onChange={(value) => handleChange(id, "response", value, "time")}
                      style={{ width: "60px", borderRadius: "8px" }}
                    />
                    <Select
                      value={response.unit}
                      onChange={(value) => handleChange(id, "response", value, "unit")}
                      style={{ width: "100px", borderRadius: "8px" }}
                    >
                      <Option value="minutes">Minutes</Option>
                      <Option value="hours">Hours</Option>
                      <Option value="day">Day</Option>
                    </Select>
                  </div>
                </div>

                <div style={{ marginTop: "10px" }}>
                  <strong>Resolve within:</strong>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "5px" }}>
                    <InputNumber
                      min={1}
                      value={resolve.time}
                      onChange={(value) => handleChange(id, "resolve", value, "time")}
                      style={{ width: "60px", borderRadius: "8px" }}
                    />
                    <Select
                      value={resolve.unit}
                      onChange={(value) => handleChange(id, "resolve", value, "unit")}
                      style={{ width: "100px", borderRadius: "8px" }}
                    >
                      <Option value="minutes">Minutes</Option>
                      <Option value="hours">Hours</Option>
                      <Option value="day">Day</Option>
                    </Select>
                  </div>
                </div>

                <Button
                  type="primary"
                  style={{
                    marginTop: "15px",
                    width: "100%",
                    borderRadius: "8px",
                    backgroundColor: priorityData.border,
                    borderColor: priorityData.border,
                    transition: "background-color 0.3s ease",
                  }}
                  onClick={() => handleSave(id)}
                  className="save-button"
                >
                  Save Configuration
                </Button>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Hover effect for cards */}
      <style>
        {`
          .sla-card:hover {
            transform: scale(1.05);
            transition: transform 0.3s ease-in-out;
          }
          .save-button:hover {
            background-color: #000 !important;
          }
        `}
      </style>
    </div>
  );
};

export default SLAConfigurePage;
