import pdf1 from "../../../../public/IT SOP/6. SOP 1.0.12_IT ASSET MANAGEMENT/APPENDIX-A_Fixed Asset Policy.pdf";
import pdf2 from "../../../../public/IT SOP/6. SOP 1.0.12_IT ASSET MANAGEMENT/APPENDIX-B_IT Policy Device and Reimbursement.pdf";
import pdf3 from "../../../../public/IT SOP/6. SOP 1.0.12_IT ASSET MANAGEMENT/APPENDIX-C Vendor RFP Template.pdf";
import pdf4 from "../../../../public/IT SOP/6. SOP 1.0.12_IT ASSET MANAGEMENT/SOP 1.0.12_IT ASSET MANAGEMENT.pdf";

import PDFView from "../components/PDFView";

const PageTwelve = () => {
  const pdf = [
    {
      id: 1,
      name: "APPENDIX-A_Fixed Asset Policy.pdf",
      path: pdf1,
    },
    {
      id: 2,
      name: "APPENDIX-B_IT Policy Device and Reimbursement.pdf",
      path: pdf2,
    },
    {
      id: 3,
      name: "APPENDIX-C Vendor RFP Template.pdf",
      path: pdf3,
    },
    {
      id: 4,
      name: "SOP 1.0.12_IT ASSET MANAGEMENT.pdf",
      path: pdf4,
    },
  ];
  return (
    <>
      <PDFView pdf={pdf} />
    </>
  );
};

export default PageTwelve;
