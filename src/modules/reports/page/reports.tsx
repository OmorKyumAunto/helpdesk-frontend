import React from "react";
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

const summaryCards = [
  { label: "Total Tickets", value: 128, icon: <Ticket size={22} />, color: "text-blue-600" },
  { label: "Total Tasks", value: 97, icon: <ClipboardList size={22} />, color: "text-green-600" },
  { label: "Avg Response Time", value: "2h 40m", icon: <Timer size={22} />, color: "text-yellow-600" },
  { label: "Avg Solve Time", value: "5h 10m", icon: <Timer size={22} />, color: "text-purple-600" },
  { label: "Completed Tasks", value: 82, icon: <ListChecks size={22} />, color: "text-emerald-600" },
  { label: "Open Tickets", value: 14, icon: <ListTodo size={22} />, color: "text-rose-600" },
];

const reportsData = {
  combined: [
    { title: "Overall System Insights", icon: <Layers size={26} /> },
    { title: "Tickets vs Tasks Trend", icon: <BarChart3 size={26} /> },
    { title: "Custom Combined Reports", icon: <FileText size={26} /> },
  ],
  tickets: [
    { title: "Ticket Volume & Status", icon: <Ticket size={26} /> },
    { title: "Avg Ticket Resolution", icon: <BarChart3 size={26} /> },
    { title: "Ticket Report Download", icon: <FileText size={26} /> },
  ],
  tasks: [
    { title: "Task Completion Rates", icon: <ClipboardList size={26} /> },
    { title: "Task Duration Metrics", icon: <BarChart3 size={26} /> },
    { title: "Export Task Reports", icon: <FileText size={26} /> },
  ],
};

const Section = ({ title, cards }: { title: string; cards: any[] }) => (
  <div className="mb-10">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center justify-center text-center hover:shadow-xl hover:scale-[1.03] transition cursor-pointer"
        >
          <div className="text-indigo-500 mb-3">{card.icon}</div>
          <span className="text-sm font-medium text-gray-700">{card.title}</span>
        </div>
      ))}
    </div>
  </div>
);

const ReportsPage = () => {
  return (
    <div className="p-4 sm:p-6 md:p-10 bg-gradient-to-br from-white via-gray-50 to-gray-100 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Reports Dashboard</h1>
        <p className="text-gray-500 mt-2 max-w-2xl text-sm md:text-base">
          View combined insights, detailed ticket & task reports, and track your team's performance all in one place.
        </p>
      </div>

      {/* Responsive Summary Cards */}
      <div className="flex flex-wrap justify-between items-stretch gap-1 mb-12">
        {summaryCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 shadow flex items-center gap-2 transition hover:shadow-md hover:scale-[1.02]"
            style={{
              flexBasis: '16.66%',
              flexGrow: 1,
              minWidth: '120px',
              maxWidth: '15.66%',
            }}
          >
            <div className={`rounded-full bg-gray-100 p-2 ${card.color}`}>{card.icon}</div>
            <div>
              <div className="text-base font-bold text-gray-800">{card.value}</div>
              <div className="text-xs text-gray-500">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Combined Report Section */}
      <Section title="📊 Combined Reports" cards={reportsData.combined} />

      {/* Ticket Reports */}
      <Section title="🎫 Ticket Reports" cards={reportsData.tickets} />

      {/* Task Reports */}
      <Section title="📋 Task Reports" cards={reportsData.tasks} />
    </div>
  );
};

export default ReportsPage;
