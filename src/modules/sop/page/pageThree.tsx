import pdf1 from "../../../../public/IT SOP/3. SOP 1.0.3_EMAIL USER CREATION AND DEACTIVATION/APPENDIX-A NEW JOINER'S EMAIL ID REQUEST- HR-TO-IT PROCESS FLOW.pdf";
import pdf2 from "../../../../public/IT SOP/3. SOP 1.0.3_EMAIL USER CREATION AND DEACTIVATION/APPENDIX-B EMAIL REQUISITION FORM.pdf";
import pdf3 from "../../../../public/IT SOP/3. SOP 1.0.3_EMAIL USER CREATION AND DEACTIVATION/HR LAPTOP-DESKTOP REQUEST TO IT PROCESS FLOW.pdf";
import pdf4 from "../../../../public/IT SOP/3. SOP 1.0.3_EMAIL USER CREATION AND DEACTIVATION/SOP 1.0.3 EMAIL USER CREATION AND DEACTIVATION.pdf";

import PDFView from "../components/PDFView";

const PageThree = () => {
  const pdf = [
    {
      id: 1,
      name: "APPENDIX-A NEW JOINER'S EMAIL ID REQUEST- HR-TO-IT PROCESS FLOW.pdf",
      path: pdf1,
    },
    {
      id: 2,
      name: "APPENDIX-B EMAIL REQUISITION FORM.pdf",
      path: pdf2,
    },
    {
      id: 3,
      name: "HR LAPTOP-DESKTOP REQUEST TO IT PROCESS FLOW.pdf",
      path: pdf3,
    },
    {
      id: 4,
      name: "SOP 1.0.3 EMAIL USER CREATION AND DEACTIVATION.pdf",
      path: pdf4,
    },
  ];
  return (
    <>
      <PDFView pdf={pdf} />
    </>
  );
};

export default PageThree;
