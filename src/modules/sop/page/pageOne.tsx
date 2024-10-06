import pdf1 from "../../../../public/IT SOP/14. SOP1.0.1 ROLES AND RESPONSIBILITIES/SOP 1.0.1_ROLES AND RESPONSIBILITIES.pdf";

import PDFView from "../components/PDFView";

const PageOne = () => {
  const pdf = [
    {
      id: 1,
      name: "SOP 1.0.1_ROLES AND RESPONSIBILITIES.pdf",
      path: pdf1,
    },
  ];
  return (
    <>
      <PDFView pdf={pdf} />
    </>
  );
};

export default PageOne;
