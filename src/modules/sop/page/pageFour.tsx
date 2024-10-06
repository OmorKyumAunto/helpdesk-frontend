import pdf1 from "../../../../public/IT SOP/7. SOP 1.0.4_EMAIL ARCHIVING/SOP 1.0.4_EMAIL ARCHIVING.pdf";

import PDFView from "../components/PDFView";

const PageFour = () => {
  const pdf = [
    {
      id: 1,
      name: "SOP 1.0.4_EMAIL ARCHIVING.pdf",
      path: pdf1,
    },
  ];
  return (
    <>
      <PDFView pdf={pdf} />
    </>
  );
};

export default PageFour;
