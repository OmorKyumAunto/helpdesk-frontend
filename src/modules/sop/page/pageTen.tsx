import pdf1 from "../../../../public/IT SOP/4. SOP 1.0.10_DATA BACKUP AND RECOVERY/APPENDIX-A LIST OF STANDALONE SYSTEM.pdf";
import pdf2 from "../../../../public/IT SOP/4. SOP 1.0.10_DATA BACKUP AND RECOVERY/APPENDIX-B DATA BACKUP REQUEST FORM.pdf";
import pdf3 from "../../../../public/IT SOP/4. SOP 1.0.10_DATA BACKUP AND RECOVERY/APPENDIX-C DATA RESTORE FORM.pdf";
import pdf4 from "../../../../public/IT SOP/4. SOP 1.0.10_DATA BACKUP AND RECOVERY/APPENDIX-D QUARTERLY, HALF YEARLY & YEARLY DATA BACKUP RECORD.pdf";
import pdf5 from "../../../../public/IT SOP/4. SOP 1.0.10_DATA BACKUP AND RECOVERY/APPENDIX-E  LOGBOOK FOR STANDALONE SYSTEMUSER DATA RETENTION.pdf";
import pdf6 from "../../../../public/IT SOP/4. SOP 1.0.10_DATA BACKUP AND RECOVERY/SOP 1.0.10_DATA BACKUP AND RECOVERY.pdf";
import PDFView from "../components/PDFView";

const PageTen = () => {
  const pdf = [
    {
      id: 1,
      name: "APPENDIX-A LIST OF STANDALONE SYSTEM.pdf",
      path: pdf1,
    },
    {
      id: 2,
      name: "APPENDIX-B DATA BACKUP REQUEST FORM.pdf",
      path: pdf2,
    },
    {
      id: 3,
      name: "APPENDIX-C DATA RESTORE FORM.pdf",
      path: pdf3,
    },
    {
      id: 4,
      name: "APPENDIX-D QUARTERLY, HALF YEARLY & YEARLY DATA BACKUP RECORD.pdf",
      path: pdf4,
    },
    {
      id: 5,
      name: "APPENDIX-E  LOGBOOK FOR STANDALONE SYSTEMUSER DATA RETENTION.pdf",
      path: pdf5,
    },
    {
      id: 6,
      name: "SOP 1.0.10_DATA BACKUP AND RECOVERY.pdf",
      path: pdf6,
    },
  ];
  return (
    <>
      <PDFView pdf={pdf} />
    </>
  );
};

export default PageTen;
