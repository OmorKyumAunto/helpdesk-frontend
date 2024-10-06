import pdf1 from "../../../../public/IT SOP/2. SOP 1.0.6_FIREWALL CONFIGURATION/SOP 1.0.6 FIREWALL CONFIGURATION.pdf";

import PDFView from "../components/PDFView";

const PageSix = () => {
  const pdf = [
    {
      id: 1,
      name: "SOP 1.0.6 FIREWALL CONFIGURATION.pdf",
      path: pdf1,
    },
  ];
  return (
    <>
      <PDFView pdf={pdf} />
    </>
  );
};

export default PageSix;
