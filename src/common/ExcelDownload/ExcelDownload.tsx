import Excel from "exceljs";
import { saveAs } from "file-saver";
import { Button } from "antd";
import moment from "moment";
import { SiMicrosoftexcel } from "react-icons/si";

interface Props {
  excelName: string;
  excelTableHead: string[]; // Ensure headers are strings for clarity.
  excelData: any[];
  isLoading?: boolean;
  width?: string;
}

const ExcelDownload: React.FC<Props> = ({
  excelName,
  excelTableHead,
  excelData,
  isLoading,
  width = "auto",
}) => {
  const date_time = moment().format("DD-MM-YYYY");

  const saveExcel = async () => {
    try {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet(excelName);

      // Determine which headers have associated data
      const headersWithData = excelTableHead.filter((header) =>
        excelData.some((row) => row[header] !== undefined && row[header] !== "")
      );

      // Add Header Row with conditional coloring
      const titleRow = worksheet.addRow(excelTableHead);
      titleRow.eachCell((cell, colNumber) => {
        const header = excelTableHead[colNumber - 1]; // Adjust index for 1-based cell numbering
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "1775BB" }, // Blue background
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Auto-adjust column widths based on header and data length
      worksheet.columns = excelTableHead.map((header) => {
        const maxDataLength = Math.max(
          header.length,
          ...excelData.map((row) =>
            row[header] ? row[header].toString().length : 0
          )
        );
        return {
          header,
          key: header,
          width: maxDataLength + 2, // Add a small buffer to the width
        };
      });

      // Add Data Rows
      excelData.forEach((rowData) => {
        const values = excelTableHead.map((header) => rowData[header] || "");
        const row = worksheet.addRow(values);
        row.eachCell((cell) => {
          cell.alignment = {
            vertical: "middle",
            horizontal: "left",
            wrapText: true,
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      // Generate Excel File
      const excelDataGenerate = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([excelDataGenerate]), `${date_time}_${excelName}.xlsx`);
    } catch (error: any) {
      console.error("Error generating Excel file:", error.message);
    }
  };

  return (
    <Button
      type="primary"
      style={{
        backgroundColor: "#00994d", // Light green
        borderColor: "#7cb342",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: width,
      }}
      icon={<SiMicrosoftexcel />}
      onClick={saveExcel}
      loading={isLoading}
    >
      Excel
    </Button>
  );
};

export default ExcelDownload;
