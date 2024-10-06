import pdf1 from "../../../../public/IT SOP/12. SOP 1.0.7 NETWORK CONFIGURATION/Appendix-A Switch Configuration.pdf";
import pdf2 from "../../../../public/IT SOP/12. SOP 1.0.7 NETWORK CONFIGURATION/SOP 1.0.7_Network Configuration.pdf";

import PDFView from "../components/PDFView";

const PageSeven = () => {
  const pdf = [
    {
      id: 1,
      name: "Appendix-A Switch Configuration.pdf",
      path: pdf1,
    },
    {
      id: 2,
      name: "SOP 1.0.7_Network Configuration.pdf",
      path: pdf2,
    },
  ];
  return (
    <>
      <PDFView pdf={pdf} />
    </>
  );
};

export default PageSeven;
