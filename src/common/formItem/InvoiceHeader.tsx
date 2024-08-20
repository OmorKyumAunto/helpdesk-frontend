/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Row, Typography } from "antd";
// import TOAB_LOGO from "../../assets/m360.jfif";
import { useGetMeQuery } from "../../app/api/userApi";
import logo from "../../assets/amcham.png";
export const GetInfo = () => {
  return {
    logoProp: {
      height: 70,
      padding: 10,
      borderRadius: 12,
    },
  };
};

export const ReceiptHeader = () => {
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div style={{ flex: 1 }}>
        {/* <img style={GetInfo().logoProp} src={TOAB_LOGO} alt={"LOGO"} /> */}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {/* <QRCode
            size={110}
            color='black'
            iconSize={25}
            bordered={false}
            // icon={orgInfo?.org_logo || '/m360Ict_Logo.png'}
            value={`
Name: ${'BAB'}
Address: ${''}
Mobile No: ${''}
`}
          /> */}
          <div style={{ marginLeft: "15px" }}>
            <Typography.Title
              style={{
                display: "block",
                fontFamily: "'Source Sans Pro', sans-serif",
                fontSize: "14px",
              }}
            >
              {"Tour Operators Association of Bangladesh (TOAB)"}
            </Typography.Title>

            <Typography.Text
              style={{
                display: "block",
                fontSize: "12px",
                fontFamily: "'Source Sans Pro', sans-serif",
              }}
            >
              {" "}
              <strong> Address :</strong>
              {
                "2nd FLOOR, Azam Khan Business Center, 105/E West Agargaon, Kamal Soroni Rd, Dhaka 1207"
              }
            </Typography.Text>
            <Typography.Text
              style={{
                display: "block",
                fontSize: "12px",
                fontFamily: "'Source Sans Pro', sans-serif",
              }}
            >
              <strong> Mobile :</strong> {"01933-331522"}
            </Typography.Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InvoiceHeader = () => {
  const { data: profile } = useGetMeQuery();
  return (
    <Row
      style={{
        fontFamily: "'Source Sans Pro', sans-serif",
        borderBottom: "1px solid #ccc",
        marginBottom: "15px",
      }}
      justify={"space-between"}
      align="middle"
    >
      <Col style={{ display: "flex", alignItems: "center", maxWidth: "80%" }}>
        <img src={logo} alt={"LOGO"} style={{ height: "120px" }} />
      </Col>

      <Col
        style={{
          display: "flex",
          alignItems: "center",
          maxWidth: "50%",
        }}
      >
        <div
          className="info"
          style={{
            textAlign: "right",
            marginBottom: "1rem",
          }}
        >
          <Typography.Title level={5} style={{}}>
            {profile?.data?.username}
          </Typography.Title>
          {/* 
          <Typography.Text

          {/* <Typography.Text
            style={{
              display: "block",
              fontSize: "14px",
              fontFamily: "'Source Sans Pro', sans-serif",
            }}
          >
            <strong>Address: </strong>
            {profile?.data?.image}
          </Typography.Text> */}

          <Typography.Text
            style={{
              display: "block",
              fontSize: "14px",
              fontFamily: "'Source Sans Pro', sans-serif",
            }}
          >
            <strong>Email:</strong> {profile?.data?.email}
          </Typography.Text>
          <Typography.Text
            style={{
              display: "block",
              fontSize: "14px",
              fontFamily: "'Source Sans Pro', sans-serif",
            }}
          >
            {" "}
            <strong>Mobile:</strong> {profile?.data?.phone_number}
          </Typography.Text>
        </div>
      </Col>
    </Row>
  );
};
