import { Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface Props {
  data: any;
}

const CombineReportPrint: React.FC<Props> = ({ data }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Combine_Report_Print",
  });

  return (
    <>
      <div style={{ display: "none" }}>
        <div ref={printRef}>
          <h2 style={{ textAlign: "center", marginBottom: 16 }}>Combined Report</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {Object.entries(data).map(([key, value]) => (
                <tr key={key}>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      fontWeight: 500,
                      background: "#fafafa",
                    }}
                  >
                    {key}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {value as string}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Button
        icon={<PrinterOutlined />}
        onClick={handlePrint}
        style={{ background: "#1677ff", color: "white", fontWeight: 500 }}
      >
        Print Report
      </Button>
    </>
  );
};

export default CombineReportPrint;
