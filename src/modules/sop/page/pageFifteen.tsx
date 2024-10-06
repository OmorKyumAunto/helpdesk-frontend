import pdf1 from "../../../../public/IT SOP/15. SOP 1.0.15_IT Procurement (Approved)/SOP 1.0.15_IT Procurement.pdf";

import PDFView from "../components/PDFView";

const PageFifteen = () => {
  const pdf = [
    {
      id: 1,
      name: "SOP 1.0.15_IT Procurement.pdf",
      path: pdf1,
    },
  ];
  return (
    <>
      <PDFView pdf={pdf} />
    </>
  );
};

export default PageFifteen;
