import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Layers,
  BarChart3,
  FileText,
  Ticket,
  ClipboardList,
  Timer,
  ListChecks,
  ListTodo,
} from "lucide-react";

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

const summaryCards = [
  { label: "Total Tickets", value: 128, icon: <Ticket size={22} />, color: "text-blue-500" },
  { label: "Total Tasks", value: 97, icon: <ClipboardList size={22} />, color: "text-green-500" },
  { label: "Avg Ticket Time", value: "2h 40m", icon: <Timer size={22} />, color: "text-yellow-500" },
  { label: "Avg Task Time", value: "5h 10m", icon: <Timer size={22} />, color: "text-purple-500" },
  { label: "Completed Tasks", value: 82, icon: <ListChecks size={22} />, color: "text-emerald-500" },
  { label: "Completed Tickets", value: 14, icon: <ListTodo size={22} />, color: "text-rose-500" },
];


const reportsData = {
  combined: [
    { title: "Overall System Insights", icon: <Layers size={26} /> },
    { title: "Tickets vs Tasks Trend", icon: <BarChart3 size={26} /> },
    { title: "Custom Combined Reports", icon: <FileText size={26} /> },
    { title: "Custom Combined Reports", icon: <FileText size={26} /> },
  ],
  tickets: [
    { title: "Ticket Volume & Status", icon: <Ticket size={26} /> },
    { title: "Avg Ticket Resolution", icon: <BarChart3 size={26} /> },
    { title: "Ticket Report Download", icon: <FileText size={26} /> },
    { title: "Ticket Report Download", icon: <FileText size={26} /> },
  ],
  tasks: [
    { title: "Task Completion Rates", icon: <ClipboardList size={26} /> },
    { title: "Task Duration Metrics", icon: <BarChart3 size={26} /> },
    { title: "Export Task Reports", icon: <FileText size={26} /> },
    { title: "Export Task Reports", icon: <FileText size={26} /> },
  ],
};

const Section = ({ title, cards }: { title: string; cards: any[] }) => (
  <motion.div
    className="mb-12"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={containerVariants}
  >
    <h2 className="text-2xl font-bold text-gray-700 mb-2">{title}</h2>
    <div className="h-1 w-12 bg-indigo-400 rounded mb-6"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center justify-center text-center cursor-pointer"
          variants={cardVariants}
          whileHover={{ scale: 1.05, boxShadow: "0px 8px 24px rgba(0,0,0,0.15)" }}
        >
          <div className="text-indigo-500 mb-3">{card.icon}</div>
          <span className="text-sm font-medium text-gray-700">{card.title}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const ReportsPage = () => {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, -100]); // Slower movement

  return (
    <div className="relative overflow-hidden min-h-screen">

      {/* 🌌 Parallax Background Layer */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-indigo-100 opacity-50 blur-sm"
      />

      {/* 🌟 Foreground Content */}
      <motion.div
        className="relative p-4 sm:p-6 md:p-10"
        variants={pageVariants}
        initial="hidden"
        animate="show"
      >
        {/* Page Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-800">Reports</h1>
              <p className="text-gray-500 mt-3 max-w-2xl text-sm md:text-base">
                View combined insights, detailed ticket & task reports, and track your team's performance all in one place.
              </p>
            </div>
            <img
              src="/reportlogo.svg"
              alt="Report Logo"
              className="mt-6 sm:mt-0 sm:ml-4 w-32 h-auto" // Adjust width as needed
            />
          </div>

        </motion.div>

        {/* Responsive Summary Cards */}
        <motion.div
          className="flex flex-wrap justify-between items-stretch gap-3 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {summaryCards.map((card, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-xl p-4 shadow flex items-center gap-3 cursor-pointer"
              variants={cardVariants}
              whileHover={{ scale: 1.05, boxShadow: "0px 6px 20px rgba(0,0,0,0.1)" }}
              style={{
                flexBasis: 'calc(33.333% - 1rem)',
                flexGrow: 1,
                minWidth: '120px',
                maxWidth: 'calc(33.333% - 1rem)',
              }}
            >
              <div className="rounded-full bg-gray-100 p-2 flex items-center justify-center">
                <div className={`${card.color}`}>{card.icon}</div>
              </div>
              <div>
                <div className="text-base font-bold text-gray-800">{card.value}</div>
                <div className="text-xs text-gray-500">{card.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Combined Report Section */}
        <Section title="📊 Combined Reports" cards={reportsData.combined} />

        {/* Ticket Reports */}
        <Section title="🎫 Ticket Reports" cards={reportsData.tickets} />

        {/* Task Reports */}
        <Section title="📋 Task Reports" cards={reportsData.tasks} />
      </motion.div>
    </div>
  );
};

export default ReportsPage;
