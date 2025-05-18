import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Layers,
  BarChart3,
  FileText,
  Ticket,
  ClipboardList,
  PackageCheck,
  PackageOpen,
  Box,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StockReportModal from "../components/StockReportModal";

// Animation Variants
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } },
};

const pageVariants = {
  hidden: { opacity: 0.5, filter: "blur(8px)" },
  show: { opacity: 1, filter: "blur(0px)", transition: { duration: 1, ease: "easeOut" } },
};

// Report Data with Colorful Cards and Icons
const reportsData = {
  combined: [
    { title: "Overall System Insights", icon: <Layers size={22} />, color: "text-indigo-500", bg: "bg-indigo-50", path: "/reports/system" },
    { title: "Tickets vs Tasks Trend", icon: <BarChart3 size={22} />, color: "text-blue-500", bg: "bg-blue-50", path: "/reports/trend" },
    { title: "Custom Report 1", icon: <FileText size={22} />, color: "text-amber-500", bg: "bg-amber-50", path: "/reports/custom1" },
    { title: "Custom Report 2", icon: <FileText size={22} />, color: "text-amber-500", bg: "bg-yellow-50", path: "/reports/custom2" },
  ],
  tickets: [
    { title: "Ticket Volume & Status", icon: <Ticket size={22} />, color: "text-pink-500", bg: "bg-pink-50", path: "/reports/ticket-volume" },
    { title: "Avg Ticket Resolution", icon: <BarChart3 size={22} />, color: "text-green-600", bg: "bg-green-50", path: "/reports/ticket-resolution" },
    { title: "Ticket Report 1", icon: <FileText size={22} />, color: "text-violet-500", bg: "bg-violet-50", path: "/reports/ticket-report1" },
    { title: "Ticket Report 2", icon: <FileText size={22} />, color: "text-purple-500", bg: "bg-purple-50", path: "/reports/ticket-report2" },
  ],
  tasks: [
    { title: "Task Completion Rates", icon: <ClipboardList size={22} />, color: "text-cyan-600", bg: "bg-cyan-50", path: "/reports/task-completion" },
    { title: "Task Duration Metrics", icon: <BarChart3 size={22} />, color: "text-emerald-600", bg: "bg-emerald-50", path: "/reports/task-duration" },
    { title: "Task Report 1", icon: <FileText size={22} />, color: "text-orange-500", bg: "bg-orange-50", path: "/reports/task-report1" },
    { title: "Task Report 2", icon: <FileText size={22} />, color: "text-yellow-500", bg: "bg-yellow-50", path: "/reports/task-report2" },
  ],
  assets: [
    { title: "Stock Report", icon: <PackageCheck size={22} />, color: "text-blue-600", bg: "bg-blue-50", path: "/reports/asset-stock", isStockReport: true },
    { title: "Disbursement Report", icon: <PackageOpen size={22} />, color: "text-rose-500", bg: "bg-rose-50", path: "/reports/asset-disbursement" },
    { title: "Asset Count", icon: <Box size={22} />, color: "text-teal-500", bg: "bg-teal-50", path: "/reports/asset-count" },
  ],
};

// Section Component
const Section = ({ title, cards, onCardClick }: { title: string; cards: any[], onCardClick: (card: any) => void }) => {
  return (
    <motion.div
      className="mb-10"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <motion.h2
        className="text-lg font-semibold text-gray-700 mb-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {title}
      </motion.h2>
      <div className="h-1 w-10 bg-indigo-400 rounded mb-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            className={`rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer shadow-sm hover:shadow-md transition ${card.bg}`}
            variants={cardVariants}
            whileHover={{ scale: 1.04 }}
            onClick={() => onCardClick(card)}
            role="button"
            aria-label={card.title}
            title={card.title}
          >
            <div className={`${card.color} mb-2`}>{card.icon}</div>
            <span className="text-xs font-medium text-gray-700 tracking-wide">
              {card.title}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Main Reports Page
const ReportsPage = () => {
  const [isStockReportModalOpen, setIsStockReportModalOpen] = useState(false);
  const [stockReportCard, setStockReportCard] = useState(null);

  const openStockReportModal = (card: any) => {
    setStockReportCard(card);
    setIsStockReportModalOpen(true);
  };

  const closeStockReportModal = () => {
    setIsStockReportModalOpen(false);
  };

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], ["#ffffff", "#f0f4f8"]); // Dynamic background color change

  return (
    <motion.div
      className="relative overflow-hidden min-h-screen rounded-xl"
      style={{ backgroundColor: backgroundY }} // Scroll-triggered background color change
    >
      {/* Foreground Content */}
      <motion.div
        className="relative p-4 sm:p-6 md:p-10"
        variants={pageVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
              <p className="text-gray-500 mt-2 max-w-2xl text-xs md:text-sm leading-relaxed">
                View detailed ticket, task, and asset insights – all in one place.
              </p>
            </div>
            <img
              src="/reportlogo.svg"
              alt="Report Logo"
              className="mt-4 sm:mt-0 sm:ml-4 w-28 h-auto"
            />
          </div>
        </motion.div>

        {/* Sections */}
        <Section title="💼 Asset Reports" cards={reportsData.assets} onCardClick={openStockReportModal} />
        <Section title="📊 Ticket & Task Combined Reports" cards={reportsData.combined} onCardClick={() => {}} />
        <Section title="🎫 Ticket Reports" cards={reportsData.tickets} onCardClick={() => {}} />
        <Section title="📋 Task Reports" cards={reportsData.tasks} onCardClick={() => {}} />
      </motion.div>

      {/* Stock Report Modal */}
      {isStockReportModalOpen && (
        <StockReportModal
          isOpen={isStockReportModalOpen}
          onClose={closeStockReportModal}
          card={stockReportCard}
        />
      )}
    </motion.div>
  );
};

export default ReportsPage;
