import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { Button } from "antd";
import logo from "../../../assets/logo.png";
import { ICombineReportQueryData } from "../types/reportTypes";

interface Props {
  PDFFileName: string;
  fileHeader: string;
  PDFHeader: string[]; // Field names
  PDFData: any; // Single entry object
  queryData: ICombineReportQueryData;
}

const CombineReportPDFDownload: React.FC<Props> = ({
  PDFFileName,
  fileHeader,
  PDFHeader,
  PDFData,
  queryData,
}) => {
  const date_time = moment().format("DD-MM-YYYY");
  const { employee_name, employee_id, designation, department, unit_name } =
    queryData || {};

  // Format time to remove seconds and make it readable
  const formatTimeNoSeconds = (timeString: string | undefined | null) => {
    if (!timeString && timeString !== "") return "N/A";
    if (typeof timeString !== "string") return String(timeString ?? "N/A");
    const cleaned = timeString.split(".")[0];
    const parts = cleaned.split(":").map((p) => parseInt(p, 10));
    if (parts.length >= 2 && !parts.some(isNaN)) {
      const [h, m] = parts;
      if (h === 0 && m === 0) return "0 min";
      if (h === 0) return `${m} min`;
      if (m === 0) return `${h} hr`;
      return `${h} hr ${m} min`;
    }
    return timeString;
  };

  const savePDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header Background FIRST (so it doesn't cover the logo)
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, pageWidth, 45, "F");

    // Add Logo AFTER background
    const img = new Image();
    img.src = logo;
    await new Promise((resolve) => {
      img.onload = () => {
        doc.addImage(img, "PNG", 10, 10, 30, 30);
        resolve(true);
      };
    });

    // Title (aligned with logo)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(26, 35, 126);
    doc.text(fileHeader, 45, 20);

    // Date Badge
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Report Date: ${date_time}`, 45, 30);

    // Divider line
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(10, 45, pageWidth - 10, 45);

    // ==================
    // KEY METRICS SECTION
    // ==================
    let currentY = 52;

    currentY += 3; // Add upper margin

    // Section Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text("Key Metrics Overview", 10, currentY);
    currentY += 8;

    // Metrics boxes (3 columns)
    const metrics = [
      {
        label: "Total Tickets",
        value: PDFData["Total Tickets"],
        color: [24, 144, 255] as [number, number, number], // Blue
      },
      {
        label: "Total Tasks",
        value: PDFData["Total Tasks"],
        color: [82, 196, 26] as [number, number, number], // Green
      },
      {
        label: "Total Combined",
        value: PDFData["Total Ticket and Task"],
        color: [60, 0, 145] as [number, number, number], // Purple
      },
    ];

    const boxWidth = (pageWidth - 30) / 3;
    const boxHeight = 18;

    metrics.forEach((metric, index) => {
      const xPos = 10 + index * (boxWidth + 5);

      // Box background with colored left border
      doc.setFillColor(250, 250, 250);
      doc.rect(xPos, currentY, boxWidth, boxHeight, "F");

      // Left colored border
      doc.setFillColor(metric.color[0], metric.color[1], metric.color[2]);
      doc.rect(xPos, currentY, 2, boxHeight, "F");

      // Label
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(metric.label, xPos + 4, currentY + 6);

      // Value
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(metric.color[0], metric.color[1], metric.color[2]);
      doc.text(String(metric.value || 0), xPos + 4, currentY + 14);
    });

    currentY += boxHeight + 8;

    // ==================
    // STATUS CARDS (4 boxes)
    // ==================
    const statusBoxWidth = (pageWidth - 35) / 4;
    const statusBoxHeight = 16;

    const statuses = [
      {
        label: "Ticket Overdue",
        value: PDFData["Ticket Overdue"],
        color: [255, 77, 79] as [number, number, number],
      },
      {
        label: "Task Overdue",
        value: PDFData["Task Overdue"],
        color: [250, 173, 20] as [number, number, number],
      },
      {
        label: "In-time Tickets",
        value: PDFData["In-time Solved Ticket"],
        color: [24, 144, 255] as [number, number, number],
      },
      {
        label: "In-time Tasks",
        value: PDFData["In-time Solved Task"],
        color: [82, 196, 26] as [number, number, number],
      },
    ];

    statuses.forEach((status, index) => {
      const xPos = 10 + index * (statusBoxWidth + 5);

      // Box
      doc.setFillColor(250, 250, 250);
      doc.rect(xPos, currentY, statusBoxWidth, statusBoxHeight, "F");

      // Left border
      doc.setFillColor(status.color[0], status.color[1], status.color[2]);
      doc.rect(xPos, currentY, 2, statusBoxHeight, "F");

      // Label
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(120);
      doc.text(status.label, xPos + 3, currentY + 5);

      // Value
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(status.color[0], status.color[1], status.color[2]);
      doc.text(String(status.value || 0), xPos + 3, currentY + 12.5);
    });

    currentY += statusBoxHeight + 8;

    // ==================
    // PERFORMANCE METRICS
    // ==================
   currentY += 3; // Add upper margin
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text("Performance Metrics", 10, currentY);
    currentY += 7;

    const performanceMetrics = [
      { label: "Avg Ticket Time", value: formatTimeNoSeconds(PDFData["Avg Ticket Time"]) },
      { label: "Avg Task Time", value: formatTimeNoSeconds(PDFData["Avg Task Time"]) },
      { label: "Avg Combined Time", value: formatTimeNoSeconds(PDFData["Avg Ticket and Task"]) },
      { label: "Working Time Per Day Without SLA", value: formatTimeNoSeconds(PDFData["Working Time Per Day"]) },
      { label: "Work Should Be Completed With SLA", value: formatTimeNoSeconds(PDFData["SLA Wise Should Be Completed Per Day"]) },
      { label: "Working Days", value: PDFData["Total Working Days"] },
    ];

    const perfBoxWidth = (pageWidth - 35) / 3;
    const perfBoxHeight = 13;

    performanceMetrics.forEach((perf, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const xPos = 10 + col * (perfBoxWidth + 5);
      const yPos = currentY + row * (perfBoxHeight + 3);

      // Define colors for each metric
      const metricColors = [
        [24, 144, 255],   // Blue for Avg Ticket Time
        [82, 196, 26],    // Green for Avg Task Time
        [114, 46, 209],   // Purple for Avg Combined
        [250, 140, 22],   // Orange for Work Time
        [235, 47, 150],   // Pink for SLA
        [16, 185, 129],   // Teal for Working Days
      ];
      const color = metricColors[index];

      // Shadow
      doc.setFillColor(230, 230, 230);
      doc.roundedRect(xPos + 0.5, yPos + 0.5, perfBoxWidth, perfBoxHeight, 2, 2, "F");

      // Box with light colored background (no opacity)
      const lightColor = [
        Math.min(255, color[0] + 220),
        Math.min(255, color[1] + 220),
        Math.min(255, color[2] + 220)
      ];
      doc.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
      doc.roundedRect(xPos, yPos, perfBoxWidth, perfBoxHeight, 2, 2, "F");

      // White overlay border
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(0.5);
      doc.roundedRect(xPos, yPos, perfBoxWidth, perfBoxHeight, 2, 2, "D");

      // Colored left accent
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(xPos, yPos, 2.5, perfBoxHeight, 2, 2, "F");

      // Label
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(80, 80, 80);
      doc.text(perf.label, xPos + 4, yPos + 5);

      // Value
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(String(perf.value || "N/A"), xPos + 4, yPos + 10.5);
    });

    currentY += perfBoxHeight * 2 + 10;

    // ==================
    // DETAILED DATA TABLE
    // ==================
    currentY += 3; // Add upper margin
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text("Detailed Information", 10, currentY);
    currentY += 5;

    // Filter details to avoid duplication
    const excludedFields = [
      "Total Tickets",
      "Total Tasks",
      "Total Ticket and Task",
      "Ticket Overdue",
      "Task Overdue",
      "In-time Solved Ticket",
      "In-time Solved Task",
      "Avg Ticket Time",
      "Avg Task Time",
      "Avg Ticket and Task",
      "Working Time Per Day",
      "SLA Wise Should Be Completed Per Day",
      "Total Working Days",
      "Report Generated By", // Exclude from table since it's in footer
    ];

    const detailedData = PDFHeader.filter((field) => !excludedFields.includes(field)).map(
      (field) => {
        // Format time fields
        const timeFields = ["Avg Ticket Time", "Avg Task Time", "Avg Ticket and Task", "Working Time Per Day", "SLA Wise Should Be Completed Per Day"];
        const value = timeFields.includes(field) 
          ? formatTimeNoSeconds(PDFData[field])
          : String(PDFData[field] ?? "N/A");
        
        return [
          {
            content: field,
            styles: { fontStyle: "bold" as const, textColor: [40, 40, 40] as [number, number, number] },
          },
          {
            content: value,
            styles: { textColor: [80, 80, 80] as [number, number, number] },
          },
        ];
      }
    );

    if (detailedData.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [["Field", "Value"]],
        body: detailedData,
        theme: "grid",
        headStyles: {
          fillColor: [26, 35, 126] as [number, number, number],
          textColor: [255, 255, 255] as [number, number, number],
          fontSize: 9,
          halign: "center",
          fontStyle: "bold",
          lineWidth: 0,
        },
        bodyStyles: {
          halign: "left",
          fontSize: 8.5,
          cellPadding: 2.5,
        },
        columnStyles: {
          0: { 
            cellWidth: 68, 
            fontStyle: "bold",
            fillColor: [240, 248, 255] as [number, number, number], // Light blue for field names
          },
          1: { cellWidth: 112 },
        },
        styles: {
          lineColor: [200, 220, 240] as [number, number, number],
          lineWidth: 0.3,
          font: "helvetica",
        },
        alternateRowStyles: {
          fillColor: [250, 252, 255] as [number, number, number], // Very light blue
        },
        margin: { bottom: 32 }, // Leave space for footer
      });

      currentY = (doc as any).lastAutoTable.finalY + 7;
    }

    // ==================
    // EMPLOYEE INFO SECTION
    // ==================
    // Gradient-like background
    doc.setFillColor(235, 245, 255);
    doc.roundedRect(10, currentY, pageWidth - 20, 22, 2, 2, "F");
    
    // Accent stripe on left
    doc.setFillColor(24, 144, 255);
    doc.roundedRect(10, currentY, 3, 22, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(26, 35, 126);
    doc.text("Report Information", 15, currentY + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);

    const infoY = currentY + 10;
    doc.text(`Employee: ${employee_name || "N/A"} (${employee_id || "N/A"})`, 15, infoY);
    doc.text(`Designation: ${designation || "N/A"}`, 15, infoY + 4.5);
    doc.text(`Department: ${department || "N/A"}`, 15, infoY + 9);
    doc.text(`Unit: ${unit_name || "All Units"}`, pageWidth / 2 + 10, infoY);
    doc.text(`Date Range: ${PDFData["From Date"]} to ${PDFData["To Date"]}`, pageWidth / 2 + 10, infoY + 4.5);

    // ==================
    // FOOTER - REPORT GENERATED BY
    // ==================
    const footerY = pageHeight - 18;
    
    // Footer background bar
    doc.setFillColor(26, 35, 126);
    doc.rect(0, footerY - 6, pageWidth, 24, "F");

    // Report generated by
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    
    const generatedBy = PDFData["Report Generated By"] || "N/A";
    doc.text(`Report Generated By: ${generatedBy}`, 10, footerY);
    
    // Page number and date
    doc.text(
      `Page 1 of 1 | Generated on ${date_time}`,
      pageWidth - 10,
      footerY,
      { align: "right" }
    );

    doc.save(`${date_time}_${PDFFileName}.pdf`);
  };

  return (
    <Button
      onClick={savePDF}
      type="primary"
      style={{
        backgroundColor: "#b40d0d",
        color: "#fff",
        width: "100%",
        fontWeight: 500,
      }}
    >
      Download PDF
    </Button>
  );
};

export default CombineReportPDFDownload;