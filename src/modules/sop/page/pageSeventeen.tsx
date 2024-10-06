import pdf1 from "../../../../public/IT SOP/SOP Saftey & Security.pdf";

import PDFView from "../components/PDFView";

const PageSeventeen = () => {
  const pdf = [
    {
      id: 1,
      name: "SOP Saftey & Security.pdf",
      path: pdf1,
    },
  ];
  return (
    <>
      <PDFView pdf={pdf} />
    </>
  );
};

export default PageSeventeen;
