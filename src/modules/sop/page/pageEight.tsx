import pdf1 from "../../../../public/IT SOP/8. SOP 1.0.8_CHANGE MANAGEMENT/APPENDIX-A Change Management Board.pdf";
import pdf2 from "../../../../public/IT SOP/8. SOP 1.0.8_CHANGE MANAGEMENT/APPENDIX-B Change Advisory Board.pdf";
import pdf3 from "../../../../public/IT SOP/8. SOP 1.0.8_CHANGE MANAGEMENT/APPENDIX-C Change Manager.pdf";
import pdf4 from "../../../../public/IT SOP/8. SOP 1.0.8_CHANGE MANAGEMENT/APPENDIX-D Change Request Submission Form.pdf";
import pdf5 from "../../../../public/IT SOP/8. SOP 1.0.8_CHANGE MANAGEMENT/SOP 1.0.8_CHANGE MANAGEMENT.pdf";
import PDFView from "../components/PDFView";

const PageEight = () => {
  const pdf = [
    {
      id: 1,
      name: "APPENDIX-A Change Management Board.pdf",
      path: pdf1,
    },
    {
      id: 2,
      name: "APPENDIX-B Change Advisory Board.pdf",
      path: pdf2,
    },
    {
      id: 3,
      name: "APPENDIX-C Change Manager.pdf",
      path: pdf3,
    },
    {
      id: 4,
      name: "APPENDIX-D Change Request Submission Form.pdf",
      path: pdf4,
    },
    {
      id: 5,
      name: "SOP 1.0.8_CHANGE MANAGEMENT.pdf",
      path: pdf5,
    },
  ];
  return (
    <>
      <PDFView pdf={pdf} />
    </>
  );
};

export default PageEight;
