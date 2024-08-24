import Excel from "exceljs";
import { saveAs } from "file-saver";
import { Button } from "antd";
import moment from "moment";
import { SiMicrosoftexcel } from "react-icons/si";

interface Props {
  excelName: string;
  excelTableHead: any[];
  excelData: any;
}

const ExcelDownload: React.FC<Props> = ({
  excelName,
  excelTableHead,
  excelData,
}) => {
  const date_time = moment().format("DD-MM-YYYY");

  const saveExcel = async () => {
    try {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet(excelName);

      const titleRow = worksheet.addRow(excelTableHead);

      titleRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center" };
      });

      worksheet.columns.forEach((column) => {
        column.width = 25;
      });

      excelData.forEach((rowData: any) => {
        const values = excelTableHead.map((header: any) => rowData[header]);
        const row = worksheet.addRow(values);
        row.height = 25;
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "left" };
        });
      });

      const excelDataGenerate = await workbook.xlsx.writeBuffer();

      saveAs(new Blob([excelDataGenerate]), `${date_time}_${excelName}.xlsx`);
    } catch (error: any) {
      console.error("Something Went Wrong", error.message);
    }
  };

  return (
    <Button
      type="primary"
      style={{ backgroundColor: "#33B786" }}
      icon={<SiMicrosoftexcel />}
      onClick={saveExcel}
    >
      Excel Download
    </Button>
  );
};

export default ExcelDownload;
