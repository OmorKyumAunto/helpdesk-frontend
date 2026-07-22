import {
  ArrowDownOutlined,
  FileExcelOutlined,
  FileOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FolderOpenOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Card, Empty, Input } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import "../forms-ui.css";

const AssetTemplate = "https://www.dropbox.com/scl/fi/imgj89bt92k5315lwg4pg/Asset-Upload-Template.xlsx?rlkey=z5bw0jtxnvt4kljv4jsfu2xrq&st=etij609g&raw=1";
const CsTemplate = "https://www.dropbox.com/scl/fi/evr2hkeyp8d4ynltvivki/cs-template.xlsx?rlkey=qwk6rzn1owtkkfsxkwm0bf6uk&st=zful9ih9&raw=1";
const DemandSlip = "https://www.dropbox.com/scl/fi/j9j91q0757s6px9xm3ymr/demand-slip-bandhan.xlsx?rlkey=f8uzmsciqvwnd022jmuz75ptd&st=54578r5z&raw=1";
const Emailrequisition = "https://www.dropbox.com/scl/fi/fpdg51xtrdbo50getei63/EMAIL-REQUISITION-FORM.pdf?rlkey=akt9zfq4ua1sfqckj4c9uyo1g&st=g7ubo668&raw=1";
const EmployeeTemplate = "https://www.dropbox.com/scl/fi/y7d6361qlvbcrsdx64t3y/Employee-Upload-Template.xlsx?rlkey=oxkjp8q47xkr98ts49koil4m8&st=2xtm4u25&raw=1";
const HardwareRequisition = "https://www.dropbox.com/scl/fi/zq9ai6gqavklsxxtqewth/HARDWARE-REQUISITION-FORM.pdf?rlkey=qpakrj651onwp6qhdww9yb59q&st=tfg289rc&raw=1";
const MonthlyAchivements = "https://www.dropbox.com/scl/fi/r2j3t228ptdrwa4hmgnoz/monthly-achivement-template.pptx?rlkey=oxgdhlfyhdkhr03t23hgh3vj3&st=74wte32s&raw=1";
const StationaryReq = "https://www.dropbox.com/scl/fi/rju8bhgl70sukkt75objf/stationary-requisition.xlsx?rlkey=3d6aa0e6f4b45bup28py13n27&st=2rnbhcj2&raw=1";

type Template = { title: string; description: string; file: string };

const templates: Template[] = [
  {
    title: "Hardware Requisition Form",
    description: "Request new hardware or replacements for your department.",
    file: HardwareRequisition,
  },
  {
    title: "Email Requisition Form",
    description: "Request creation or modification of a company email account.",
    file: Emailrequisition,
  },
  {
    title: "Stationary Requisition Form",
    description: "Request office stationary and consumable supplies.",
    file: StationaryReq,
  },
  {
    title: "CS Template",
    description: "Comparative statement template for procurement.",
    file: CsTemplate,
  },
  {
    title: "Monthly Achievements",
    description: "Presentation deck for reporting monthly achievements.",
    file: MonthlyAchivements,
  },
  {
    title: "Employee Upload Template",
    description: "Bulk-upload spreadsheet for adding employee records.",
    file: EmployeeTemplate,
  },
  {
    title: "Asset Upload Template",
    description: "Bulk-upload spreadsheet for adding assets to inventory.",
    file: AssetTemplate,
  },
  {
    title: "Demand Slip For Bandhan",
    description: "Demand slip used for Bandhan requisitions.",
    file: DemandSlip,
  },
];

type Tone = "pdf" | "xls" | "ppt" | "other";

/** Derives the file type from the URL (query string stripped). */
const fileMeta = (
  url: string
): { tone: Tone; label: string; icon: JSX.Element } => {
  const path = url.split("?")[0].toLowerCase();
  if (path.endsWith(".pdf"))
    return { tone: "pdf", label: "PDF", icon: <FilePdfOutlined /> };
  if (path.endsWith(".xlsx") || path.endsWith(".xls"))
    return { tone: "xls", label: "Excel", icon: <FileExcelOutlined /> };
  if (path.endsWith(".pptx") || path.endsWith(".ppt"))
    return { tone: "ppt", label: "PowerPoint", icon: <FilePptOutlined /> };
  return { tone: "other", label: "File", icon: <FileOutlined /> };
};

const FILTERS: { key: Tone | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pdf", label: "PDF" },
  { key: "xls", label: "Excel" },
  { key: "ppt", label: "PowerPoint" },
];

/** Feeds the cursor position into CSS vars so the card spotlight follows it. */
const trackPointer = (e: React.MouseEvent<HTMLDivElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const Forms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tone, setTone] = useState<Tone | "all">("all");

  const withMeta = useMemo(
    () => templates.map((t) => ({ ...t, meta: fileMeta(t.file) })),
    []
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: withMeta.length };
    withMeta.forEach((t) => {
      c[t.meta.tone] = (c[t.meta.tone] || 0) + 1;
    });
    return c;
  }, [withMeta]);

  const visible = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return withMeta.filter((t) => {
      const matchesTone = tone === "all" || t.meta.tone === tone;
      const matchesQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);
      return matchesTone && matchesQuery;
    });
  }, [withMeta, searchTerm, tone]);

  return (
    <div className="tpl-ui">
      <Card
        style={{ boxShadow: "0 0 0 1px rgba(0,0,0,.05)", borderRadius: 14 }}
        styles={{ body: { padding: 20 } }}
      >
        {/* Hero */}
        <div className="tpl-hero">
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div className="tpl-hero__title">
                <FolderOpenOutlined style={{ marginRight: 10 }} />
                Forms &amp; Templates
              </div>
              <div className="tpl-hero__sub">
                Download the standard DBL IT forms and bulk-upload templates you
                need — requisitions, comparative statements and reporting decks.
              </div>
            </div>
            <Input
              allowClear
              size="large"
              style={{ width: 260, borderRadius: 10 }}
              prefix={<SearchOutlined style={{ color: "#98a2b3" }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
            />
          </div>
        </div>

        {/* Type filters */}
        <div className="tpl-filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`tpl-chip ${tone === f.key ? "tpl-chip--on" : ""}`}
              onClick={() => setTone(f.key)}
              aria-pressed={tone === f.key}
            >
              {tone === f.key && (
                <motion.span
                  layoutId="tplChipOn"
                  className="tpl-chip__bg"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              {f.label}
              <span className="tpl-chip__count">{counts[f.key] || 0}</span>
            </button>
          ))}
        </div>

        {/* Cards */}
        {visible.length ? (
          <motion.div className="tpl-grid" layout>
            <AnimatePresence mode="popLayout">
              {visible.map((template, i) => (
                <motion.div
                  key={template.title}
                  className="tpl-card"
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    duration: 0.32,
                    delay: Math.min(i * 0.035, 0.28),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -4 }}
                  onMouseMove={trackPointer}
                >
                  <div className="tpl-card__head">
                    <span className={`tpl-icon tpl-icon--${template.meta.tone}`}>
                      {template.meta.icon}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div className="tpl-title">{template.title}</div>
                      <span
                        className={`tpl-format tpl-format--${template.meta.tone}`}
                      >
                        {template.meta.label}
                      </span>
                    </div>
                  </div>

                  <div className="tpl-desc">{template.description}</div>

                  <div className="tpl-card__foot">
                    <a
                      className="tpl-download"
                      href={template.file}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ArrowDownOutlined className="tpl-download__icon" />
                      Download
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <Empty
            style={{ padding: "42px 0" }}
            description={
              searchTerm
                ? `No templates match "${searchTerm}"`
                : "No templates in this category"
            }
          />
        )}
      </Card>
    </div>
  );
};

export default Forms;
