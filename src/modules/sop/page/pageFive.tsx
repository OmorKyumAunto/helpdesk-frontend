import pdf1 from "../../../../public/IT SOP/11. SOP 1.0.5 NETWORK AND INFRASTRUCTURE MANAGEMENT/SOP 1.0.5 Network and Infrastructure Management.pdf";

import PDFView from "../components/PDFView";

const PageFive = () => {
  const pdf = [
    {
      id: 1,
      name: "SOP 1.0.5 Network and Infrastructure Management.pdf",
      path: pdf1,
    },
  ];
  return (
    <>
      <PDFView pdf={pdf} />
    </>
  );
};

export default PageFive;
