import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { Button } from "antd";
import logo from "../../../assets/logo.png";

interface Props {
  PDFFileName: string;
  fileHeader: string;
  PDFHeader: string[];
  PDFData: any;
  queryData: any;
  ticketList?: any[];
}

const TicketReportPDFDownload: React.FC<Props> = ({
  PDFFileName,
  fileHeader,
  PDFHeader,
  PDFData,
  queryData,
  ticketList = [],
}) => {
  const date_time = moment().format("DD-MM-YYYY");
  const {
    employee_name,
    employee_id,
    report_generate_department,
    report_generate_designation,
    unit_name,
    report_generate_employee_name,
  } = queryData || {};

  const convertToMinutes = (value: number | string, unit?: string) => {
    const num = Number(value || 0);
    if (unit === "hours") return num * 60;
    if (unit === "days") return num * 24 * 60;
    return num;
  };

  const formatMinutesToText = (totalMinutes: number) => {
    if (!totalMinutes || totalMinutes <= 0) return "0 min";

    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days} d`);
    if (hours > 0) parts.push(`${hours} hr`);
    if (minutes > 0) parts.push(`${minutes} min`);

    return parts.join(" ");
  };

  const getTicketSolveMinutes = (ticket: any) => {
    if (!ticket?.ticket_created_at || !ticket?.ticket_updated_at) return 0;

    const createdAt = moment(ticket.ticket_created_at);
    const updatedAt = moment(ticket.ticket_updated_at);

    if (!createdAt.isValid() || !updatedAt.isValid()) return 0;

    const diff = updatedAt.diff(createdAt, "minutes");
    return diff > 0 ? diff : 0;
  };

  const getTicketResolveSLAMinutes = (ticket: any) => {
    return convertToMinutes(ticket.resolve_time_value, ticket.resolve_time_unit);
  };

  const getTicketOverdueMinutes = (ticket: any) => {
    const solvingMinutes = getTicketSolveMinutes(ticket);
    const slaMinutes = getTicketResolveSLAMinutes(ticket);
    const overdueMinutes = solvingMinutes - slaMinutes;
    return overdueMinutes > 0 ? overdueMinutes : 0;
  };

  const totalTickets = ticketList.length || Number(PDFData["Total Count"] || 0);

  const solvedTickets = ticketList.filter(
    (item: any) => item.ticket_status === "solved"
  );

  const inProgressTickets = ticketList.filter(
    (item: any) => item.ticket_status === "inprogress"
  ).length;

  const unsolvedTickets = ticketList.filter(
    (item: any) => item.ticket_status === "unsolved"
  ).length;

  const forwardedTickets = ticketList.filter(
    (item: any) => item.ticket_status === "forward"
  ).length;

  const overdueTickets = ticketList.filter((item: any) => {
    const solveMinutes = getTicketSolveMinutes(item);
    const slaMinutes = getTicketResolveSLAMinutes(item);
    return solveMinutes > slaMinutes;
  }).length;

  const solvedWithinSLATickets = solvedTickets.filter((item: any) => {
    const solveMinutes = getTicketSolveMinutes(item);
    const slaMinutes = getTicketResolveSLAMinutes(item);
    return solveMinutes <= slaMinutes;
  }).length;

  const totalResolveSLAMinutes = solvedTickets.reduce(
    (sum: number, ticket: any) => sum + getTicketResolveSLAMinutes(ticket),
    0
  );

  const totalRequiredMinutes = solvedTickets.reduce(
    (sum: number, ticket: any) => sum + getTicketSolveMinutes(ticket),
    0
  );

  const totalSLABreakMinutes = Math.max(
    totalRequiredMinutes - totalResolveSLAMinutes,
    0
  );

  const avgResolveSLAMinutes =
    solvedTickets.length > 0
      ? Math.floor(totalResolveSLAMinutes / solvedTickets.length)
      : 0;

  const avgSolveMinutes =
    solvedTickets.length > 0
      ? Math.floor(totalRequiredMinutes / solvedTickets.length)
      : 0;

  const solvedRate =
    totalTickets > 0 ? Math.round((solvedTickets.length / totalTickets) * 100) : 0;

  const overdueRate =
    totalTickets > 0 ? Math.round((overdueTickets / totalTickets) * 100) : 0;

  const savePDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header background
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, pageWidth, 45, "F");

    // Logo
    const img = new Image();
    img.src = logo;
    await new Promise((resolve) => {
      img.onload = () => {
        doc.addImage(img, "PNG", 10, 10, 30, 30);
        resolve(true);
      };
    });

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(26, 35, 126);
    doc.text(fileHeader, 45, 20);

    // Date
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Report Date: ${date_time}`, 45, 30);

    // Divider
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(10, 45, pageWidth - 10, 45);

    let currentY = 52;

    // ==================
    // KEY METRICS
    // ==================
    currentY += 3;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text("Key Metrics Overview", 10, currentY);
    currentY += 8;

    const metrics = [
      {
        label: "Total Tickets",
        value: totalTickets,
        color: [24, 144, 255] as [number, number, number],
      },
      {
        label: "Solved",
        value: solvedTickets.length,
        color: [82, 196, 26] as [number, number, number],
      },
      {
        label: "Solved Rate",
        value: `${solvedRate}%`,
        color: [114, 46, 209] as [number, number, number],
      },
    ];

    const boxWidth = (pageWidth - 30) / 3;
    const boxHeight = 18;

    metrics.forEach((metric, index) => {
      const xPos = 10 + index * (boxWidth + 5);

      doc.setFillColor(250, 250, 250);
      doc.rect(xPos, currentY, boxWidth, boxHeight, "F");

      doc.setFillColor(metric.color[0], metric.color[1], metric.color[2]);
      doc.rect(xPos, currentY, 2, boxHeight, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(metric.label, xPos + 4, currentY + 6);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(metric.color[0], metric.color[1], metric.color[2]);
      doc.text(String(metric.value || 0), xPos + 4, currentY + 14);
    });

    currentY += boxHeight + 8;

    // ==================
    // STATUS CARDS
    // ==================
    const statusBoxWidth = (pageWidth - 35) / 4;
    const statusBoxHeight = 16;

    const statuses = [
      {
        label: "Overdue Tickets",
        value: overdueTickets,
        color: [255, 77, 79] as [number, number, number],
      },
      {
        label: "In Progress",
        value: inProgressTickets,
        color: [250, 173, 20] as [number, number, number],
      },
      {
        label: "Unsolved",
        value: unsolvedTickets,
        color: [24, 144, 255] as [number, number, number],
      },
      {
        label: "Solved Within SLA",
        value: solvedWithinSLATickets,
        color: [82, 196, 26] as [number, number, number],
      },
    ];

    statuses.forEach((status, index) => {
      const xPos = 10 + index * (statusBoxWidth + 5);

      doc.setFillColor(250, 250, 250);
      doc.rect(xPos, currentY, statusBoxWidth, statusBoxHeight, "F");

      doc.setFillColor(status.color[0], status.color[1], status.color[2]);
      doc.rect(xPos, currentY, 2, statusBoxHeight, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(120);
      doc.text(status.label, xPos + 3, currentY + 5);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(status.color[0], status.color[1], status.color[2]);
      doc.text(String(status.value || 0), xPos + 3, currentY + 12.5);
    });

    currentY += statusBoxHeight + 8;

    // Optional extra line if you want forward visible somewhere
    if (forwardedTickets > 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Forwarded Tickets: ${forwardedTickets}`, 10, currentY);
      currentY += 6;
    }

    // ==================
    // PERFORMANCE METRICS
    // ==================
    currentY += 3;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text("Performance Metrics", 10, currentY);
    currentY += 7;

    const performanceMetrics = [
      {
        label: "Total Resolve SLA Time",
        value: formatMinutesToText(totalResolveSLAMinutes),
      },
      {
        label: "Required Total Solve Time",
        value: formatMinutesToText(totalRequiredMinutes),
      },
      {
        label: "SLA Break Time",
        value: formatMinutesToText(totalSLABreakMinutes),
      },
      {
        label: "Avg Resolve SLA",
        value: formatMinutesToText(avgResolveSLAMinutes),
      },
      {
        label: "Avg Solve Time",
        value: formatMinutesToText(avgSolveMinutes),
      },
      {
        label: "Overdue Rate",
        value: `${overdueRate}%`,
      },
    ];

    const perfBoxWidth = (pageWidth - 35) / 3;
    const perfBoxHeight = 13;

    performanceMetrics.forEach((perf, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const xPos = 10 + col * (perfBoxWidth + 5);
      const yPos = currentY + row * (perfBoxHeight + 3);

      const metricColors = [
        [24, 144, 255],
        [82, 196, 26],
        [255, 77, 79],
        [250, 140, 22],
        [114, 46, 209],
        [16, 185, 129],
      ];

      const color = metricColors[index];

      doc.setFillColor(230, 230, 230);
      doc.roundedRect(
        xPos + 0.5,
        yPos + 0.5,
        perfBoxWidth,
        perfBoxHeight,
        2,
        2,
        "F"
      );

      const lightColor = [
        Math.min(255, color[0] + 220),
        Math.min(255, color[1] + 220),
        Math.min(255, color[2] + 220),
      ];

      doc.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
      doc.roundedRect(xPos, yPos, perfBoxWidth, perfBoxHeight, 2, 2, "F");

      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(0.5);
      doc.roundedRect(xPos, yPos, perfBoxWidth, perfBoxHeight, 2, 2, "D");

      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(xPos, yPos, 2.5, perfBoxHeight, 2, 2, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(80, 80, 80);
      doc.text(perf.label, xPos + 4, yPos + 5);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(String(perf.value || "N/A"), xPos + 4, yPos + 10.5);
    });

    currentY += perfBoxHeight * 2 + 10;

    // ==================
    // DETAILED INFO TABLE
    // ==================
    currentY += 3;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text("Detailed Information", 10, currentY);
    currentY += 5;

    const detailedData = PDFHeader.map((field) => [
      {
        content: field,
        styles: {
          fontStyle: "bold" as const,
          textColor: [40, 40, 40] as [number, number, number],
        },
      },
      {
        content: String(PDFData[field] ?? "N/A"),
        styles: {
          textColor: [80, 80, 80] as [number, number, number],
        },
      },
    ]);

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
            fillColor: [240, 248, 255] as [number, number, number],
          },
          1: { cellWidth: 112 },
        },
        styles: {
          lineColor: [200, 220, 240] as [number, number, number],
          lineWidth: 0.3,
          font: "helvetica",
        },
        alternateRowStyles: {
          fillColor: [250, 252, 255] as [number, number, number],
        },
        margin: { bottom: 32 },
      });

      currentY = (doc as any).lastAutoTable.finalY + 7;
    }

    // ==================
    // REPORT INFO
    // ==================
    doc.setFillColor(235, 245, 255);
    doc.roundedRect(10, currentY, pageWidth - 20, 22, 2, 2, "F");

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
    doc.text(
      `Employee: ${employee_name || "N/A"} (${employee_id || "N/A"})`,
      15,
      infoY
    );
    doc.text(
      `Designation: ${report_generate_designation || "N/A"}`,
      15,
      infoY + 4.5
    );
    doc.text(
      `Department: ${report_generate_department || "N/A"}`,
      15,
      infoY + 9
    );
    doc.text(`Unit: ${unit_name || "All Units"}`, pageWidth / 2 + 10, infoY);
    doc.text(
      `Date Range: ${PDFData["Start Date"] || "N/A"} to ${
        PDFData["End Date"] || "N/A"
      }`,
      pageWidth / 2 + 10,
      infoY + 4.5
    );

    // ==================
    // FOOTER
    // ==================
    const footerY = pageHeight - 18;

    doc.setFillColor(26, 35, 126);
    doc.rect(0, footerY - 6, pageWidth, 24, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);

    doc.text(
      `Report Generated By: ${report_generate_employee_name || "N/A"}`,
      10,
      footerY
    );

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

export default TicketReportPDFDownload;