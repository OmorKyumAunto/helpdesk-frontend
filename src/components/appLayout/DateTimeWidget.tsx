import { Row, theme } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import styled from "styled-components";

const DateTimeWidgetStyle = styled.div`
  // background: #fff;
  padding: 5px 0;
  border-radius: 5px;
  //   margin-bottom: 10px;
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  margin: 10px 0;
  color: #fff;
`;

const Day = styled.div`
  margin-right: 4px;
  font-weight: 500;
  font-family: "Orbitron", sans-serif;
`;

const TimeContainer = styled.div`
  display: flex;
  font-size: 15px;
  width: 110px;
`;

const TimeNumber = styled.div`
  font-size: 15px;
  // color: white;
  font-weight: 500;
  color: #013b79;
  font-family: "Orbitron", sans-serif;
`;

const DateTimeWidget = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [currentDateTime, setCurrentDateTime] = useState(moment());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(moment());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Row justify={"center"}>
        <DateContainer
          style={{
            color: colorBgContainer == "#ffffff" ? "#141414" : "#ffffff",
          }}
        >
          <Day>
            {currentDateTime.format("ddd") + ", "}
            {currentDateTime.format("MMM") + " "}
            {currentDateTime.format("D") + ", "}
            {currentDateTime.format("YYYY")}
          </Day>
        </DateContainer>
      </Row>
      <Row justify={"center"}>
        <TimeContainer>
          <TimeNumber>
            {currentDateTime.format("h:mm:ss")} {currentDateTime.format("A")}
          </TimeNumber>
        </TimeContainer>
      </Row>
    </div>
  );
};

export default DateTimeWidget;
