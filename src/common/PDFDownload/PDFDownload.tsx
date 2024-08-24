import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import moment from "moment";
// import { useGetProfileQuery } from "../../modules/Profile/api/profileEndpoint";
import { Button } from "antd";
import { useGetMeQuery } from "../../app/api/userApi";
// import { Icon } from "@iconify-icon/react";

interface Props {
  PDFFileName: string;
  fileHeader: string;
  PDFHeader: string[];
  PDFData: any;
}

const PDFDownload: React.FC<Props> = ({
  PDFFileName,
  fileHeader,
  PDFHeader,
  PDFData,
}) => {
  const date_time = moment().format("DD-MM-YYYY");

  const { data } = useGetMeQuery();

  const { name } = data?.data || {};

  const savePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      format: "a4",
    });

    doc.setFontSize(16);
    doc.text(name as string, 14, 16, {
      align: "left",
    });

    // doc.setFontSize(11);
    // doc.text(Address: ${restaurant_address}, 14, 24, {
    //   align: "left",
    // });

    // doc.setFontSize(11);
    // doc.text(Hotline: ${restaurant_hotline}, 14, 30, {
    //   align: "left",
    // });

    // doc.setFontSize(11);
    // doc.text(Date: ${moment().format("DD MMMM, YYYY")}, 14, 36, {
    //   align: "left",
    // });

    doc.setFontSize(11);
    doc.text(fileHeader, doc.internal.pageSize.getWidth() / 2, 45, {
      align: "center",
      renderingMode: "fill",
    });

    const tableRows = PDFData.map((obj: any) => Object.values(obj));
    autoTable(doc, {
      styles: { halign: "center" },
      headStyles: { fillColor: "#0079FF" },
      startY: 50,
      head: [PDFHeader],
      body: tableRows,
      theme: "grid",
      didDrawPage: ({ pageNumber }) => {
        doc.setFontSize(9);
        doc.text(
          `Page - ${pageNumber}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      },
    });

    doc.save(`${date_time}_${PDFFileName}.pdf`);
  };

  return (
    <Button
      onClick={savePDF}
      type="primary"
      style={{ backgroundColor: "#E74F5B" }}
      //   icon={<Icon icon="bxs:file-pdf" />}
    >
      PDF Download
    </Button>
  );
};

export default PDFDownload;
