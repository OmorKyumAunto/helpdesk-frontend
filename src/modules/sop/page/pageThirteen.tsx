import pdf1 from "../../../../public/IT SOP/9. SOP 1.0.13_IT VENDOR MANAGEMENT/APPENDIX-C VENDOR RFP TEMPLATE.pdf";
import pdf2 from "../../../../public/IT SOP/9. SOP 1.0.13_IT VENDOR MANAGEMENT/APPENDIX-D VVENDOR SCORING TEMPLATE.pdf";
import pdf3 from "../../../../public/IT SOP/9. SOP 1.0.13_IT VENDOR MANAGEMENT/APPENDIX-E IT VENDOR EXIT STRATEGY.pdf";
import pdf4 from "../../../../public/IT SOP/9. SOP 1.0.13_IT VENDOR MANAGEMENT/SOP 1.0.13_IT VENDOR MANAGEMENT.pdf";

import PDFView from "../components/PDFView";

const PageThirteen = () => {
  const pdf = [
    {
      id: 1,
      name: "APPENDIX-C VENDOR RFP TEMPLATE.pdf",
      path: pdf1,
    },
    {
      id: 2,
      name: "APPENDIX-D VVENDOR SCORING TEMPLATE.pdf",
      path: pdf2,
    },
    {
      id: 3,
      name: "APPENDIX-E IT VENDOR EXIT STRATEGY.pdf",
      path: pdf3,
    },
    {
      id: 4,
      name: "SOP 1.0.13_IT VENDOR MANAGEMENT.pdf",
      path: pdf4,
    },
  ];
  return (
    <>
      <PDFView pdf={pdf} />
    </>
  );
};

export default PageThirteen;
