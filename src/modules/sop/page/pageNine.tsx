import pdf1 from "../../../../public/IT SOP/5. SOP 1.0.9_INCIDENT RESPONSE/APPENDIX0-A INCIDENT RESPONSE TEAM.pdf";
import pdf2 from "../../../../public/IT SOP/5. SOP 1.0.9_INCIDENT RESPONSE/APPENDIX0-B IT DRIVEN BUSINESS APPLICATION LIST.pdf";
import pdf3 from "../../../../public/IT SOP/5. SOP 1.0.9_INCIDENT RESPONSE/SOP 1.0.9_INCIDENT RESPONSE.pdf";

import PDFView from "../components/PDFView";

const PageNine = () => {
  const pdf = [
    {
      id: 1,
      name: "APPENDIX0-A INCIDENT RESPONSE TEAM.pdf",
      path: pdf1,
    },
    {
      id: 2,
      name: "APPENDIX0-B IT DRIVEN BUSINESS APPLICATION LIST.pdf",
      path: pdf2,
    },
    {
      id: 3,
      name: "SOP 1.0.9_INCIDENT RESPONSE.",
      path: pdf3,
    },
  ];
  return (
    <>
      <PDFView pdf={pdf} />
    </>
  );
};

export default PageNine;
