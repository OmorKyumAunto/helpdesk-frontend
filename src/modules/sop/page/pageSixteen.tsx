import pdf1 from "../../../../public/IT SOP/SOP INDEX.pdf";

import PDFView from "../components/PDFView";

const PageSixteen = () => {
  const pdf = [
    {
      id: 1,
      name: "SOP INDEX.pdf",
      path: pdf1,
    },
  ];
  return (
    <>
      <PDFView pdf={pdf} />
    </>
  );
};

export default PageSixteen;
