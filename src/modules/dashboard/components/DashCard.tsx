import { Row, Col, Card, theme } from "antd";
import { InsertRowBelowOutlined, LineChartOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { globalTheme } from "../../../app/slice/themeSlice";
import { useAppSelector } from "../../../hooks/appHooks";
import { IViewDashboard } from "../types/dashboardTypes";
// import Dashboard from './../Pages/Dashboard';
import { GrResources } from "react-icons/gr";
const StyledCardList = styled.div`
  width: 100%;
  clear: both;
`;

const StyledCard = styled(Card)`
  &&& {
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
    .ant-card-meta-title {
      font-size: 20px;
    }

    .cardHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .box-icon {
      padding: 7px 9px;
      border-radius: 5px;
      &.a {
        background-color: rgb(59, 74, 208);
      }
      &.b {
        background-color: #e7b93a;
      }
      &.c {
        background-color: #c73271;
      }
      &.d {
        background-color: #ed8941;
      }
      &.gray {
        background-color: #a79277;
      }
      &.lemon {
        background-color: #a1c398;
      }
      &.light-green {
        background-color: #2d9596;
      }
      &.purple {
        background-color: #392467;
      }
    }
    .anticon {
      color: white;
      font-size: 22px;
    }

    .stat {
      font-size: 16px;
      color: gray;
      margin-top: 8px;
    }

    .title {
      color: white;
      display: inline-block;
      font-size: 18px;
      padding: 10px 10px 0;
      text-transform: uppercase;
    }

    .value {
      font-size: 28px;
      margin-top: 4px;
      font-weight: 700;
    }

    &.blue {
      border-bottom: 8px solid #3d4cd0;
    }
    &.gray {
      border-bottom: 8px solid #a79277;
    }

    &.green {
      border-bottom: 8px solid #e7b93a;
    }
    &.light-green {
      border-bottom: 8px solid #2d9596;
    }

    &.orange {
      border-bottom: 8px solid #c73271;
    }
    &.lemon {
      border-bottom: 8px solid #a1c398;
    }
    &.purple {
      border-bottom: 8px solid #392467;
    }

    &.red {
      border-bottom: 8px solid #ed8941;
    }
  }
`;

const DashCard = ({ dashboard }: { dashboard: IViewDashboard }) => {
  const navigate = useNavigate();

  const themeGlobal = useAppSelector(globalTheme);
  const handleClick = (status: string) => {
    navigate(`/member/list?memberStatus=${status}`);
  };
  return (
    <div style={{ padding: "25px 0px" }}>
      <StyledCardList>
        <Row gutter={[16, 16]}>
          {" "}
          <Col xs={24} sm={12} md={8} xl={8}>
            {" "}
            {/* <Link
              to={`/member/list`}
              onClick={() => setSearchParams({ memberStatus: "active" })}
            > */}
            <StyledCard
              className="lemon"
              style={{
                backgroundColor:
                  themeGlobal.theme === theme.defaultAlgorithm ? "#E2F4C5" : "",
              }}
              onClick={() => handleClick("active")}
            >
              <div className="cardHeader">
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                  Active member
                </p>

                <div className="box-icon lemon">
                  {/* <Link to={`warehouses/staff`}> */}
                  <LineChartOutlined className="anticon" />
                </div>
              </div>

              <div className="value" style={{ fontSize: "20px" }}>
                {dashboard?.total_member?.total_active}
              </div>
            </StyledCard>
            {/* </Link> */}
          </Col>
          <Col xs={24} sm={12} md={8} xl={8}>
            <StyledCard
              className="gray"
              style={{
                backgroundColor:
                  themeGlobal.theme === theme.defaultAlgorithm ? "#FFF2E1" : "",
              }}
              onClick={() => handleClick("pending")}
            >
              <div className="cardHeader">
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                  Pending Member
                </p>
                {/* <Meta title="Month Expense" style={{ fontSize: "3px" }} /> */}

                <div className="box-icon gray">
                  {/* <Link to={`/products/product`}> */}
                  {/* <ShoppingCartOutlined className="anticon" /> */}
                  <InsertRowBelowOutlined className="anticon" />
                  {/* </Link> */}
                </div>
              </div>
              <div className="value" style={{ fontSize: "20px" }}>
                {dashboard?.total_member?.total_pending}
              </div>
            </StyledCard>
          </Col>
          <Col xs={24} sm={12} md={8} xl={8}>
            <StyledCard
              className="purple"
              style={{
                backgroundColor:
                  themeGlobal.theme === theme.defaultAlgorithm ? "#FFD1E3" : "",
              }}
            >
              <div className="cardHeader">
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>Resource</p>

                {/* <Meta title="" /> */}
                <div className="box-icon purple">
                  {/* <Link to={`warehouses/client`}> */}
                  <GrResources className="anticon" />
                  {/* </Link> */}
                </div>
              </div>

              <div className="value" style={{ fontSize: "20px" }}>
                {0}
              </div>
            </StyledCard>
          </Col>
        </Row>
      </StyledCardList>
    </div>
  );
};

export default DashCard;
