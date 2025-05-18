import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useGetAssetReportQuery, useGetActiveUnitsQuery } from "../api/reportsEndPoints";
import { IAssetReport } from "../types/reportTypes";
import dayjs from "dayjs";
import { Select, Button } from "antd";
import { jsPDF } from "jspdf";  // Import jsPDF

Modal.setAppElement("#root");

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const { Option } = Select;

const StockReportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [unitId, setUnitId] = useState<number | "All">("All");
  const [category, setCategory] = useState<string | null>(null);
  const [remarks, setRemarks] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { data: units = [], isLoading: unitsLoading, error: unitsError } = useGetActiveUnitsQuery();
  const { data, isLoading, error } = useGetAssetReportQuery({
    unit: unitId !== "All" ? unitId : undefined,
    start_date: startDate ? dayjs(startDate).format("YYYY-MM-DD") : undefined,
    end_date: endDate ? dayjs(endDate).format("YYYY-MM-DD") : undefined,
    category: category || undefined,
    remarks: remarks || undefined,
  });

  // Handle Excel Export
  const handleExcelExport = () => {
    if (!data) return;

    // Format the data for the Excel file
    const formattedData = data.data.map((item: IAssetReport) => ({
      Name: item.name,
      Category: item.category,
      PurchaseDate: dayjs(item.purchase_date).format("YYYY-MM-DD"),
      SerialNumber: item.serial_number,
      PONumber: item.po_number || "N/A",
      Price: item.price || "N/A",
      Unit: item.unit_name,
      Model: item.model,
      Specification: item.specification,
      AssetNumber: item.asset_no || "N/A",
      Remarks: item.remarks,
      Location: item.location_name,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Stock Report");
    const excelBuffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(file, "Stock_Report_with_Logo_and_Styling.xlsx");
  };

  // Handle PDF Export using jsPDF
  const handlePDFExport = () => {
    if (!data) return;

    // Create a new jsPDF instance
    const doc = new jsPDF();
    const formattedData = data.data.map((item: IAssetReport) => ({
      Name: item.name,
      Category: item.category,
      PurchaseDate: dayjs(item.purchase_date).format("YYYY-MM-DD"),
      SerialNumber: item.serial_number,
      PONumber: item.po_number || "N/A",
      Price: item.price || "N/A",
      Unit: item.unit_name,
      Model: item.model,
      Specification: item.specification,
      AssetNumber: item.asset_no || "N/A",
      Remarks: item.remarks,
      Location: item.location_name,
    }));

    // Set up PDF header
    doc.setFontSize(16);
    doc.text("DBL GROUP", 20, 20);
    doc.setFontSize(14);
    doc.text("Stock Report", 20, 30);

    // Define the table column headers
    const headers = ["Name", "Category", "Purchase Date", "Serial Number", "PO Number", "Price", "Unit", "Model", "Specification", "Asset Number", "Remarks", "Location"];
    const rows = formattedData.map(item => [
      item.Name,
      item.Category,
      item.PurchaseDate,
      item.SerialNumber,
      item.PONumber,
      item.Price,
      item.Unit,
      item.Model,
      item.Specification,
      item.AssetNumber,
      item.Remarks,
      item.Location,
    ]);

    // Table styling and content
    doc.autoTable({
      startY: 40,
      head: [headers],
      body: rows,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
    });

    // Save PDF
    doc.save("Stock_Report_with_Logo_and_Styling.pdf");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Stock Report"
      className="p-6 bg-white max-w-md mx-auto rounded-xl shadow-lg mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-start justify-center"
    >
      <h2 className="text-lg font-semibold mb-4">Filter Stock Report</h2>

      <div className="space-y-3 text-sm text-gray-700">
        <div>
          <label className="block mb-1">Unit</label>
          <Select
            value={unitId}
            onChange={(value) => setUnitId(value)}
            className="w-full border p-2 rounded"
          >
            <Option value="All">All</Option>
            {units?.length > 0 ? (
              units.map((unit) => (
                <Option key={unit.id} value={unit.unit_id}>
                  {unit.title}
                </Option>
              ))
            ) : (
              <Option disabled>No units available</Option>
            )}
          </Select>
        </div>

        <div>
          <label className="block mb-1">Category</label>
          <Select
            value={category || ""}
            onChange={(value) => setCategory(value || null)}
            className="w-full border p-2 rounded"
          >
            <Option value="">All</Option>
            <Option value="desktop">Desktop</Option>
            <Option value="laptop">Laptop</Option>
          </Select>
        </div>

        <div>
          <label className="block mb-1">Remarks</label>
          <Select
            value={remarks || ""}
            onChange={(value) => setRemarks(value || null)}
            className="w-full border p-2 rounded"
          >
            <Option value="">All</Option>
            <Option value="assigned">Assigned</Option>
            <Option value="in_stock">In Stock</Option>
          </Select>
        </div>

        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block mb-1">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-end space-x-3">
        <Button onClick={onClose} className="px-4 py-2 border rounded text-gray-700">Cancel</Button>
        <Button onClick={handleExcelExport} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Generate Excel</Button>
        <Button onClick={handlePDFExport} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Generate PDF</Button>
      </div>
    </Modal>
  );
};

export default StockReportModal;
