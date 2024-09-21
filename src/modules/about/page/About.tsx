import { Card, Col, Row, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import image1 from "../../../assets/chairman-sir-photo.2e16d0ba.fill-385x482-c0.format-webp.jpg";
import image2 from "../../../assets/Managing_Director_.2e16d0ba.fill-385x482-c0.format-webp.jpg";
import image3 from "../../../assets/vc-sign-photo.2e16d0ba.fill-385x482-c0.format-webp.jpg";
import image4 from "../../../assets/dmd-sir-photo.2e16d0ba.fill-385x482-c0.format-webp.jpg";

const { Meta } = Card;

const teamMembers = [
  {
    name: "Abdul Wahed",
    designation: "Chairman",
    image: image1,
  },
  {
    name: "M. A. Jabbar",
    designation: "Managing Director",
    image: image2,
  },
  {
    name: "M. A. Rahim",
    designation: "Vice Chairman",
    image: image3,
  },
  {
    name: "M. A. Quader",
    designation: "Deputy Managing Director & Group CEO",
    image: image4,
  },
];
const About = () => {
  return (
    <>
      <div
        className="about-banner"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
          fontSize: "48px",
          color: "white",
        }}
      >
        ABOUT US
      </div>
      <Card
        // strong
        style={{
          marginTop: "20px",
        }}
      >
        <p className="text-lg font-medium text-gray-600">
          DBL Group is a family owned business which started in 1991. The first
          company was named Dulal Brothers Limited. Over the years, the
          organization evolved into a diversified conglomerate in Bangladesh.
          The businesses include Apparel, Textiles, Textile Printing, Washing,
          Garments Accessories, Packaging, Ceramic Tiles, Pharmaceuticals,
          Dredging, Retail, and Digital Transformation Services. <br /> <br />{" "}
          UN Development Program Business Call to Action has recognized our
          activities to be aligned with UN Sustainable Development Goals. In
          addition to working with international development organizations such
          as CARE, DEG, IFC, GIZ, ILO, and UNICEF, DBL has a diverse set of
          sustainability programs.
        </p>
        <Row className="my-16">
          <Col
            xs={24}
            sm={12}
            md={6}
            className="border-r border-l-0 border-b-0 border-t-0 border-solid  border-gray-200"
          >
            <div className="flex justify-center items-center">
              <div>
                <h1 className="font-bold text-3xl">33</h1>
                <p className="font-bold text-lg">Years</p>
                <span className="text-2xl font-medium">Experience</span>
              </div>
            </div>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={6}
            className="border-r border-l-0 border-b-0 border-t-0 border-solid  border-gray-200"
          >
            <div className="flex justify-center items-center">
              <div>
                <h1 className="font-bold text-3xl">24</h1>
                <p className="font-bold text-lg">Business</p>
                <span className="text-2xl font-medium">Concerns</span>
              </div>
            </div>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={6}
            className="border-r border-l-0 border-b-0 border-t-0 border-solid  border-gray-200"
          >
            <div className="flex justify-center items-center">
              <div>
                <h1 className="font-bold text-3xl">47K</h1>
                <p className="font-bold text-lg">Dedicated</p>
                <span className="text-2xl font-medium">Personnel</span>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center">
                <div>
                  <h1 className="font-bold text-3xl">1B</h1>
                  <p className="font-bold text-lg">USD Annual</p>
                  <span className="text-2xl font-medium">Turnover</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <div className="team-section">
          <Row gutter={[16, 16]}>
            {teamMembers.map((member, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <div>
                  <div
                    className="image-container"
                    style={{
                      overflow: "hidden",
                    }}
                  >
                    <img
                      alt={member.name}
                      src={member.image}
                      style={{
                        width: "100%",
                        height: "100%",
                        transition: "transform 0.3s ease-in-out",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />
                  </div>

                  <div>
                    <p className="uppercase text-xl font-bold mt-4 mb-0">
                      {member.name}
                    </p>
                    <span className="text-lg text-gray-500 font-medium">
                      {member.designation}
                    </span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Card>
    </>
  );
};

export default About;
