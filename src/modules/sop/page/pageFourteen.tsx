import pdf1 from "../../../../public/IT SOP/10. SOP 1.0.14_IT INVENTORY MANAGEMENT/SOP 1.0.14_IT INVENTORY MANAGEMENT SOP.pdf";

import PDFView from "../components/PDFView";

const PageFourteen = () => {
  const pdf = [
    {
      id: 1,
      name: "SOP 1.0.14_IT INVENTORY MANAGEMENT SOP.pdf",
      path: pdf1,
    },
  ];
  return (
    <>
      <PDFView pdf={pdf} />
    </>
  );
};

export default PageFourteen;
