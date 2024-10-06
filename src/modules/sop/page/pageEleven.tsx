import pdf1 from "../../../../public/IT SOP/13. SOP 1.0.11 IT ACCESS CONTROL/APPENDIX A_USER ACCESS AUTHORIZATION FORM.pdf";
import pdf2 from "../../../../public/IT SOP/13. SOP 1.0.11 IT ACCESS CONTROL/IT ACCESS CONTROL POLICY.pdf";
import pdf3 from "../../../../public/IT SOP/13. SOP 1.0.11 IT ACCESS CONTROL/SOP 1.0.11_IT ACCESS CONTROL.pdf";

import PDFView from "../components/PDFView";

const PageEleven = () => {
  const pdf = [
    {
      id: 1,
      name: "APPENDIX A_USER ACCESS AUTHORIZATION FORM.pdf",
      path: pdf1,
    },
    {
      id: 2,
      name: "IT ACCESS CONTROL POLICY.pdf",
      path: pdf2,
    },
    {
      id: 3,
      name: "SOP 1.0.11_IT ACCESS CONTROL.pdf",
      path: pdf3,
    },
  ];
  return (
    <>
      <PDFView pdf={pdf} />
    </>
  );
};

export default PageEleven;
