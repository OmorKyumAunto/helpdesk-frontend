import { Typography } from "antd";

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
      <p
        // strong
        style={{
          paddingTop: "22px",
          width: "85%",
          margin: "0 auto",
          fontWeight: 600,
        }}
      >
        DBL Group is a family owned business which started in 1991. The first
        company was named Dulal Brothers Limited. Over the years, the
        organization evolved into a diversified conglomerate in Bangladesh. The
        businesses include Apparel, Textiles, Textile Printing, Washing,
        Garments Accessories, Packaging, Ceramic Tiles, Pharmaceuticals,
        Dredging, Retail, and Digital Transformation Services. <br /> <br /> UN
        Development Program Business Call to Action has recognized our
        activities to be aligned with UN Sustainable Development Goals. In
        addition to working with international development organizations such as
        CARE, DEG, IFC, GIZ, ILO, and UNICEF, DBL has a diverse set of
        sustainability programs.
      </p>
    </>
  );
};

export default About;
