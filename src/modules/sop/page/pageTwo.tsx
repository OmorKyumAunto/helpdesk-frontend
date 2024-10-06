import pdf1 from "../../../../public/IT SOP/1. SOP 1.0.2_IT SUPPORT/APPENDIX-A FIRST LEVEL IT SUPPORT.pdf";
import pdf2 from "../../../../public/IT SOP/1. SOP 1.0.2_IT SUPPORT/APPENDIX-B HARDWARE REQUISITION FORM.pdf";
import pdf3 from "../../../../public/IT SOP/1. SOP 1.0.2_IT SUPPORT/APPENDIX-C DEVICE PROVISIONING.pdf";
import pdf4 from "../../../../public/IT SOP/1. SOP 1.0.2_IT SUPPORT/APPENDIX-D ESCLATION MATRIX.pdf";
import pdf5 from "../../../../public/IT SOP/1. SOP 1.0.2_IT SUPPORT/APPENDIX-E IT HARDWARE REQUEST.pdf";
import pdf6 from "../../../../public/IT SOP/1. SOP 1.0.2_IT SUPPORT/APPENDIX-F TID FORMAT.pdf";
import pdf7 from "../../../../public/IT SOP/1. SOP 1.0.2_IT SUPPORT/SOP 1.0.2 IT SUPPORT.pdf";
import PDFView from "../components/PDFView";

const PageTwo = () => {
  const pdf = [
    {
      id: 1,
      name: "APPENDIX-A FIRST LEVEL IT SUPPORT.pdf",
      path: pdf1,
    },
    {
      id: 2,
      name: "APPENDIX-B HARDWARE REQUISITION FORM.pdf",
      path: pdf2,
    },
    {
      id: 3,
      name: "APPENDIX-C DEVICE PROVISIONING.pdf",
      path: pdf3,
    },
    {
      id: 4,
      name: "APPENDIX-D ESCLATION MATRIX.pdf",
      path: pdf4,
    },
    {
      id: 5,
      name: "APPENDIX-E IT HARDWARE REQUEST.pdf",
      path: pdf5,
    },
    {
      id: 6,
      name: "APPENDIX-F TID FORMAT.pdf",
      path: pdf6,
    },
    {
      id: 7,
      name: "SOP 1.0.2 IT SUPPORT.pdf",
      path: pdf7,
    },
  ];
  return (
    <>
      <PDFView pdf={pdf} />
    </>
  );
};

export default PageTwo;
