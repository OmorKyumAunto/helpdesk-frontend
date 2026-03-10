// src/modules/chat/pages/ChatPage.tsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import { Input, Button, Spin, Select, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  CheckOutlined,
  SendOutlined,
  MessageOutlined,
  UserOutlined,
  MoreOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  PlusOutlined,
  SearchOutlined,
  MenuOutlined,
  InboxOutlined,
} from "@ant-design/icons";

import {
  useCreateOrGetDmMutation,
  useGetChatInboxQuery,
  useLazyGetChatMessagesPageQuery,
  useDeleteConversationForMeMutation,
  useMarkConversationUnreadMutation,
  useArchiveConversationForMeMutation,
  useUnarchiveConversationForMeMutation,
  useMarkConversationReadMutation,
} from "../api/chatEndPoints";
import { useGetOverallEmployeesQuery } from "../../employee/api/employeeEndPoint";
import { useAppDispatch, useAppSelector } from "../../../hooks/appHooks";
import {
  appendMessage,
  seedMessages,
  prependMessages,
  setActiveConversationId,
  setOnlineMap,
  updateOnline,
  setTyping,
  setLastSeen,
  markDelivered,
  markReadUpTo,
  setLoadingConversation,
  clearConversationMessages,
} from "../store/chatSlice";
import {
  connectChatSocket,
  onChatMessage,
  onPresenceStatus,
  onPresenceUpdate,
  subscribePresence,
  onTyping,
  onStopTyping,
  emitTyping,
  emitStopTyping,
  onReceipt,
  emitRead,
  sendChatMessage,
} from "../services/chatSocket";

/* ─────────────────────────── helpers ────────────────────────────────────── */
const fmt = (ts?: string | null) =>
  ts ? new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

const ini = (name?: string | null) => {
  const n = (name || "").trim();
  if (!n) return "";
  return n
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
};

const ago = (iso?: string | null) => {
  if (!iso) return "";
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const COLORS = ["#4f46e5", "#7c3aed", "#0284c7", "#059669", "#d97706", "#dc2626", "#db2777", "#0d9488"];
const hue = (id?: string | number | null) => {
  let h = 0;
  for (const c of String(id || "")) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return COLORS[h % COLORS.length];
};

const dateSep = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso).toDateString();
  const today = new Date().toDateString();
  const yest = new Date(Date.now() - 864e5).toDateString();
  if (d === today) return "Today";
  if (d === yest) return "Yesterday";
  return new Date(iso).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
};

/* ─────────────────────────── tiny atoms ─────────────────────────────────── */
function Avatar({
  name,
  id,
  size = 38,
  online = false,
}: {
  name?: string | null;
  id?: string | number | null;
  size?: number;
  online?: boolean;
}) {
  const bg = hue(id);
  return (
    <div style={{ position: "relative", flexShrink: 0, width: size, height: size }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.36,
          fontWeight: 700,
          color: "#fff",
          fontFamily: "'Sora',sans-serif",
          letterSpacing: "-.5px",
          userSelect: "none",
        }}
      >
        {ini(name) || <UserOutlined style={{ fontSize: size * 0.42, color: "#fff" }} />}
      </div>
      {online !== undefined && (
        <span
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: Math.max(9, size * 0.27),
            height: Math.max(9, size * 0.27),
            borderRadius: "50%",
            background: online ? "#22c55e" : "#d1d5db",
            border: "2.5px solid #fff",
            boxShadow: online ? "0 0 0 2px rgba(34,197,94,.2)" : "none",
            transition: "background .4s ease",
          }}
        />
      )}
    </div>
  );
}

function Ticks({ m, isMe }: { m: any; isMe: boolean }) {
  if (!isMe) return null;
  const read = !!m.read_at,
    delivered = !!m.delivered_at;
  return (
    <span
      style={{
        display: "inline-flex",
        gap: 1.5,
        color: read ? "#818cf8" : "rgba(255,255,255,.55)",
        transition: "color .3s",
      }}
    >
      <CheckOutlined style={{ fontSize: 10 }} />
      {delivered && <CheckOutlined style={{ fontSize: 10 }} />}
    </span>
  );
}

function TypingIndicator() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "20px 20px 20px 4px",
        padding: "10px 15px",
        boxShadow: "0 2px 12px rgba(0,0,0,.06)",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#c7d2fe",
            display: "block",
            animation: `typDot 1.2s ${i * 0.18}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────── CSS ─────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #f4f6fb;
  --surface:   #ffffff;
  --border:    #e8ecf3;
  --border2:   #f0f2f8;
  --txt:       #111827;
  --txt2:      #6b7280;
  --txt3:      #9ca3af;
  --accent:    #4f46e5;
  --accent2:   #6d28d9;
  --accentRgb: 79,70,229;
  --radius:    14px;
}

html, body, #root { height: 100%; }

.chat-shell {
  font-family: 'Sora', sans-serif;
  display: flex;
  height: 100dvh;
  max-height: 100dvh;
  background: var(--bg);
  overflow: hidden;
  color: var(--txt);
}

/* Scrollbars */
* { scrollbar-width: thin; scrollbar-color: #dde1ee transparent; }
*::-webkit-scrollbar { width: 4px; height: 4px; }
*::-webkit-scrollbar-thumb { background: #dde1ee; border-radius: 99px; }
*::-webkit-scrollbar-track { background: transparent; }

/* Sidebar */
.sidebar {
  width: 300px;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border-right: 1px solid var(--border);
  transition: transform .3s cubic-bezier(.4,0,.2,1);
  z-index: 50;
  flex-shrink: 0;
  position: relative;
}

.sb-header {
  padding: 20px 18px 16px;
  border-bottom: 1px solid var(--border2);
}

.sb-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--txt);
  letter-spacing: -.5px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sb-title-badge {
  width: 28px; height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 13px;
  box-shadow: 0 3px 10px rgba(var(--accentRgb),.35);
}

/* search */
.sb-search {
  position: relative;
  margin-bottom: 10px;
}
.sb-search-icon {
  position: absolute; left: 12px; top: 50%;
  transform: translateY(-50%);
  color: var(--txt3); font-size: 13px; pointer-events: none;
}
.sb-search input {
  width: 100%;
  padding: 9px 12px 9px 34px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-size: 13px;
  font-family: inherit;
  background: var(--bg);
  color: var(--txt);
  outline: none;
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.sb-search input:focus {
  border-color: rgba(var(--accentRgb),.5);
  box-shadow: 0 0 0 3px rgba(var(--accentRgb),.08);
  background: #fff;
}
.sb-search input::placeholder { color: var(--txt3); }

/* new DM select */
.sb-newdm .ant-select-selector {
  background: var(--bg) !important;
  border: 1.5px solid var(--border) !important;
  border-radius: 10px !important;
  height: 38px !important;
  align-items: center !important;
  font-family: inherit !important;
  font-size: 13px !important;
  color: var(--txt) !important;
  transition: border-color .2s, box-shadow .2s !important;
}
.sb-newdm .ant-select-selector:focus-within,
.sb-newdm.ant-select-focused .ant-select-selector {
  border-color: rgba(var(--accentRgb),.5) !important;
  box-shadow: 0 0 0 3px rgba(var(--accentRgb),.08) !important;
  background: #fff !important;
}
.sb-newdm .ant-select-selection-placeholder { color: var(--txt3) !important; font-size:13px !important; }
.sb-newdm .ant-select-arrow { color: var(--accent) !important; }

/* inbox list */
.sb-list {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0 40px;
}

.ci {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 18px;
  cursor: pointer;
  border-left: 3px solid transparent;
  position: relative;
  animation: ciIn .2s ease both;
  transition: background .15s;
}
@keyframes ciIn { from { opacity:0; transform:translateX(-10px); } to { opacity:1; transform:none; } }
.ci:hover { background: var(--bg); }
.ci.is-active { background: #eef2ff; border-left-color: var(--accent); }

.ci-body { flex:1; min-width:0; }
.ci-top { display:flex; align-items:center; justify-content:space-between; gap:6px; margin-bottom:3px; }
.ci-name { font-size:13.5px; font-weight:600; color:var(--txt); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; }
.ci-time { font-size:11px; color:var(--txt3); white-space:nowrap; flex-shrink:0; }
.ci-preview { font-size:12px; color:var(--txt2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

.ci-badge {
  min-width:18px; height:18px; padding:0 5px;
  border-radius:99px; background:var(--accent);
  color:#fff; font-size:10px; font-weight:700;
  display:inline-flex; align-items:center; justify-content:center;
  animation: badgeIn .25s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes badgeIn { from { transform:scale(0); } to { transform:scale(1); } }

.ci-menu-btn {
  background: transparent !important;
  border: none !important;
  color: var(--txt3) !important;
  height: 24px !important; width: 24px !important;
  padding: 0 !important;
  border-radius: 6px !important;
  opacity: 0;
  transition: opacity .15s, background .15s, color .15s !important;
  display: flex !important; align-items: center !important; justify-content: center !important;
}
.ci:hover .ci-menu-btn { opacity: 1 !important; }
.ci-menu-btn:hover { background: #e0e7ff !important; color: var(--accent) !important; }

/* MAIN PANEL */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

/* header */
.main-head {
  padding: 0 20px;
  height: 64px;
  min-height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  z-index: 10;
}
.head-name { font-size:15px; font-weight:700; color:var(--txt); letter-spacing:-.3px; }
.head-status {
  font-size:11.5px; color:var(--txt3); margin-top:2px;
  display:flex; align-items:center; gap:5px;
}
.head-online-dot {
  width:7px; height:7px; border-radius:50%;
  background:#22c55e;
  box-shadow:0 0 0 2.5px rgba(34,197,94,.2);
  animation:pulse 2.2s ease-in-out infinite;
}
@keyframes pulse {
  0%,100% { box-shadow:0 0 0 2.5px rgba(34,197,94,.2); }
  50%      { box-shadow:0 0 0 6px   rgba(34,197,94,0); }
}

/* messages scroll */
.msgs-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(ellipse at 20% 10%, rgba(79,70,229,.04) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 90%, rgba(109,40,217,.03) 0%, transparent 50%),
    var(--bg);
}
.msgs-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px 20px 8px;
  gap: 2px;
  min-height: 100%;
}

.date-divider {
  display: flex; align-items: center; gap: 10px;
  margin: 16px 0 10px;
  font-size: 10.5px; font-weight: 700; letter-spacing: .8px;
  text-transform: uppercase; color: var(--txt3);
}
.date-divider::before, .date-divider::after {
  content: ''; flex:1; height:1px; background: var(--border);
}

/* message rows */
.msg-row {
  display: flex;
  margin-bottom: 2px;
  animation: msgIn .22s cubic-bezier(.22,1,.36,1) both;
}
@keyframes msgIn { from { opacity:0; transform:translateY(10px) scale(.97); } to { opacity:1; transform:none; } }
.msg-row.from-me   { justify-content: flex-end; }
.msg-row.from-them { justify-content: flex-start; }

.bubble {
  max-width: min(480px, 68vw);
  padding: 9px 13px 8px;
  border-radius: 18px;
  font-size: 13.5px;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-word;
  transition: box-shadow .2s;
  position: relative;
}
.bubble:hover { box-shadow: 0 6px 22px rgba(0,0,0,.1); }

.bubble.me {
  background: linear-gradient(140deg, #4f46e5 0%, #6d28d9 100%);
  color: #fff;
  border-radius: 18px 18px 4px 18px;
  box-shadow: 0 3px 14px rgba(79,70,229,.28);
}
.bubble.them {
  background: var(--surface);
  color: var(--txt);
  border: 1px solid var(--border);
  border-radius: 18px 18px 18px 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,.05);
}

.bubble-meta {
  font-size: 10px;
  font-weight: 700;
  display: flex; align-items: center; gap: 6px;
  margin-bottom: 4px;
  letter-spacing: .1px;
}
.bubble.me   .bubble-meta { opacity:.65; }
.bubble.them .bubble-meta { color: var(--txt3); }

/* empty states */
.msg-empty {
  flex: 1;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 12px; padding: 40px;
  text-align: center;
}
.msg-empty-icon {
  width: 72px; height: 72px; border-radius: 50%;
  background: linear-gradient(135deg, #eef2ff, #ede9fe);
  display: flex; align-items: center; justify-content: center;
  font-size: 30px; color: var(--accent);
  box-shadow: 0 0 0 0 rgba(var(--accentRgb),.15);
  animation: iconPulse 2.8s ease-in-out infinite;
}
@keyframes iconPulse {
  0%,100% { box-shadow:0 0 0 0 rgba(var(--accentRgb),.15); }
  50%      { box-shadow:0 0 0 14px rgba(var(--accentRgb),0); }
}
.msg-empty h3 { font-size:16px; font-weight:700; color:var(--txt2); letter-spacing:-.3px; }
.msg-empty p  { font-size:13px; color:var(--txt3); line-height:1.5; }

/* typing indicator */
.typing-row {
  display: flex;
  align-items: flex-end;
  padding: 4px 20px 8px;
  min-height: 46px;
  flex-shrink: 0;
  animation: msgIn .2s ease both;
}
@keyframes typDot {
  0%,60%,100% { transform:translateY(0); opacity:.35; }
  30%          { transform:translateY(-5px); opacity:1; }
}

/* composer */
.composer {
  flex-shrink: 0;
  min-height: 0;
  padding: 12px 18px 16px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.composer-box {
  flex: 1;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: 14px;
  transition: border-color .2s, box-shadow .2s, background .2s;
  overflow: hidden;
}
.composer-box:focus-within {
  border-color: rgba(var(--accentRgb),.5);
  box-shadow: 0 0 0 3px rgba(var(--accentRgb),.08);
  background: #fff;
}
.composer-box .ant-input {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  font-family: 'Sora', sans-serif !important;
  font-size: 13.5px !important;
  color: var(--txt) !important;
  resize: none !important;
  padding: 11px 14px !important;
  line-height: 1.55 !important;
}
.composer-box .ant-input::placeholder { color: var(--txt3) !important; }

.send-btn {
  height: 44px !important;
  padding: 0 20px !important;
  border-radius: 12px !important;
  background: linear-gradient(140deg, #4f46e5, #6d28d9) !important;
  border: none !important;
  color: #fff !important;
  font-family: 'Sora', sans-serif !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  display: flex !important;
  align-items: center !important;
  gap: 7px !important;
  box-shadow: 0 4px 14px rgba(var(--accentRgb),.35) !important;
  transition: transform .18s, box-shadow .18s, opacity .18s !important;
  white-space: nowrap !important;
}
.send-btn:hover:not([disabled]) {
  transform: translateY(-1px) !important;
  box-shadow: 0 7px 22px rgba(var(--accentRgb),.45) !important;
}
.send-btn:active:not([disabled]) { transform: scale(.96) !important; }
.send-btn[disabled] {
  opacity: .38 !important;
  box-shadow: none !important;
  background: #e5e7eb !important;
  color: #9ca3af !important;
}

/* Ant overrides */
.ant-dropdown-menu {
  background: #fff !important;
  border: 1px solid var(--border) !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 32px rgba(0,0,0,.1) !important;
  padding: 4px !important;
}
.ant-dropdown-menu-item {
  color: #374151 !important;
  font-family: 'Sora',sans-serif !important;
  font-size: 13px !important;
  border-radius: 8px !important;
}
.ant-dropdown-menu-item:hover { background: #f3f4f6 !important; }
.ant-dropdown-menu-item-danger { color: #dc2626 !important; }
.ant-dropdown-menu-item-divider { background: var(--border2) !important; margin: 4px 0 !important; }

.ant-select-dropdown {
  background: #fff !important;
  border: 1px solid var(--border) !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 32px rgba(0,0,0,.1) !important;
  padding: 4px !important;
}
.ant-select-item {
  color: #374151 !important;
  font-family: 'Sora',sans-serif !important;
  font-size: 13px !important;
  border-radius: 8px !important;
}
.ant-select-item-option-active { background: #eef2ff !important; }
.ant-select-item-option-selected { background: #e0e7ff !important; color: var(--accent) !important; font-weight:600 !important; }
.ant-spin-dot-item { background: var(--accent) !important; }

/* FAB mobile */
.mobile-fab {
  display: none !important;
  position: fixed; bottom: 22px; left: 22px; z-index: 200;
  width: 50px !important; height: 50px !important;
  border-radius: 50% !important;
  background: linear-gradient(135deg, #4f46e5, #6d28d9) !important;
  border: none !important; color: #fff !important;
  box-shadow: 0 6px 20px rgba(var(--accentRgb),.4) !important;
  align-items: center !important; justify-content: center !important;
}
.mob-overlay {
  display: none; position: fixed; inset: 0;
  background: rgba(17,24,39,.18);
  backdrop-filter: blur(4px);
  z-index: 49;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    position: fixed; inset: 0 auto 0 0;
    width: 86vw !important; max-width: 310px;
    transform: translateX(-110%);
    box-shadow: 16px 0 48px rgba(0,0,0,.1);
  }
  .sidebar.open { transform: none; }
  .mob-overlay.open { display: block; }
  .mobile-fab { display: flex !important; }
  .bubble { max-width: 82vw; }
  .composer { padding: 10px 14px 16px; }
  .send-btn { height: 40px !important; padding: 0 16px !important; font-size:0 !important; }
  .send-btn .anticon { font-size: 16px !important; }
}
@media (min-width: 769px) and (max-width: 1100px) {
  .sidebar { width: 260px !important; }
}
@media (min-width: 1300px) {
  .sidebar { width: 320px !important; }
}
`;

/* ─────────────────────────── COMPONENT ──────────────────────────────────── */
export default function ChatPage() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.userSlice.token);

  const myEmpId = useAppSelector((s) =>
    String(
      (s.userSlice as any)?.employee_id ||
        (s.userSlice as any)?.user?.employee_id ||
        (s.userSlice as any)?.profile?.employee_id ||
        ""
    )
  );

  const activeConvId = useAppSelector((s) => (s.chat as any).activeConversationId);
  const loadingConvId = useAppSelector((s) => (s.chat as any).loadingConvId);
  const isLoading = !!activeConvId && Number(loadingConvId) === Number(activeConvId);

  const messages = useAppSelector((s) =>
    activeConvId ? (s.chat as any).messagesByConv?.[Number(activeConvId)] || [] : []
  );
  const onlineMap = useAppSelector((s) => (s.chat as any).onlineMap || {});
  const typing = useAppSelector((s) =>
    activeConvId ? !!(s.chat as any).typingByConv?.[Number(activeConvId)] : false
  );

  // ✅ Inbox mode: show archived or normal inbox
  const [showArchived, setShowArchived] = useState(false);

  const {
    data: inboxRes,
    isFetching: inboxLoading,
    refetch: refetchInbox,
  } = useGetChatInboxQuery(showArchived ? { archived: true } : undefined);

  const inbox = inboxRes?.data || [];

  const { data: empRes, isFetching: empLoading } = useGetOverallEmployeesQuery();
  const employees = empRes?.data || [];

  const [createDm, { isLoading: startingDm }] = useCreateOrGetDmMutation();
  const [deleteConversationForMe] = useDeleteConversationForMeMutation();
  const [markUnread] = useMarkConversationUnreadMutation();

  // ✅ archive/unarchive endpoints
  const [archiveConv] = useArchiveConversationForMeMutation();
  const [unarchiveConv] = useUnarchiveConversationForMeMutation();

  // ✅ mark-read endpoint (optional; we still emitRead via socket)
  const [markRead] = useMarkConversationReadMutation();

  const [search, setSearch] = useState("");
  const [quickDm, setQuickDm] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [pendingChat, setPendingChat] = useState<{
    conversation_id: number;
    other_employee_id: string;
    other_name?: string;
  } | null>(null);

  /* ── scroll refs ── */
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomAnchor = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [getPage] = useLazyGetChatMessagesPageQuery();

  const activeConvRef = useRef<number | null>(null);
  useEffect(() => {
    activeConvRef.current = activeConvId ? Number(activeConvId) : null;
  }, [activeConvId]);

  /* ── SCROLL TO BOTTOM ── */
  const scrollToBottom = useCallback((instant = false) => {
    if (!bottomAnchor.current) return;
    bottomAnchor.current.scrollIntoView({
      behavior: instant ? ("instant" as any) : "smooth",
      block: "end",
    });
  }, []);

  useLayoutEffect(() => {
    if (stickToBottom.current) scrollToBottom(true);
  }, [messages.length, typing, scrollToBottom]);

  useEffect(() => {
    if (!isLoading && activeConvId) {
      stickToBottom.current = true;
      setTimeout(() => scrollToBottom(true), 30);
    }
  }, [isLoading, activeConvId, scrollToBottom]);

  const onScrollMsg = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 180;
    if (el.scrollTop < 80) loadOlder();
  };

  /* ✅ presence subscription (FIX: depend on inbox, not inbox.length) */
  useEffect(() => {
    if (!inbox.length) return;
    subscribePresence(inbox.map((c: any) => String(c.other_employee_id)).filter(Boolean));
  }, [inbox]);

  /* active chat (or pending) */
  const activeChat =
    inbox.find((x: any) => Number(x.conversation_id) === Number(activeConvId)) ||
    (pendingChat && Number(pendingChat.conversation_id) === Number(activeConvId) ? pendingChat : null);

  const otherId = (activeChat as any)?.other_employee_id ? String((activeChat as any).other_employee_id) : "";
  const lastSeen = useAppSelector((s) => (otherId ? (s.chat as any).lastSeenMap?.[otherId] : null));
  const otherOnline = otherId ? !!onlineMap[otherId] : false;

  /* clear pending when inbox catches up */
  useEffect(() => {
    if (!pendingChat?.conversation_id) return;
    if (inbox.find((x: any) => Number(x.conversation_id) === Number(pendingChat.conversation_id)))
      setPendingChat(null);
  }, [inbox, pendingChat?.conversation_id]);

  /* filtered inbox */
  const filteredInbox = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return inbox;
    return inbox.filter((c: any) => {
      return (
        (c.other_name || "").toLowerCase().includes(q) ||
        (c.other_employee_id || "").toLowerCase().includes(q) ||
        (c.last_message || "").toLowerCase().includes(q)
      );
    });
  }, [search, inbox]);

  /* context menu */
  const menuFor = (cid: number): MenuProps => ({
    items: [
      {
        key: "unread",
        icon: <EyeInvisibleOutlined />,
        label: "Mark as unread",
        onClick: async () => {
          await markUnread(cid).unwrap().catch(() => null);
          refetchInbox();
        },
      },
      {
        key: "read",
        icon: <CheckOutlined />,
        label: "Mark as read",
        onClick: async () => {
          // If the conversation is currently open, use last message id from UI
          const isActive = Number(activeConvId) === Number(cid);
          const lastId = isActive ? messages[messages.length - 1]?.id : undefined;

          if (lastId) emitRead(cid, lastId); // ✅ socket read (best for receipts)
          await markRead({ conversationId: cid, lastReadMessageId: lastId }).unwrap().catch(() => null); // optional REST
          refetchInbox();
        },
      },
      { type: "divider" },
      showArchived
        ? {
            key: "unarchive",
            icon: <InboxOutlined />,
            label: "Unarchive",
            onClick: async () => {
              await unarchiveConv(cid).unwrap().catch(() => null);
              // if unarchiving while archived view is open, refresh list
              refetchInbox();
            },
          }
        : {
            key: "archive",
            icon: <InboxOutlined />,
            label: "Archive",
            onClick: async () => {
              await archiveConv(cid).unwrap().catch(() => null);
              if (Number(activeConvId) === Number(cid)) dispatch(setActiveConversationId(null));
              refetchInbox();
            },
          },
      { type: "divider" },
      {
        key: "delete",
        icon: <DeleteOutlined />,
        danger: true,
        label: "Delete chat",
        onClick: async () => {
          await deleteConversationForMe({ conversationId: cid }).unwrap().catch(() => null);
          if (Number(activeConvId) === Number(cid)) dispatch(setActiveConversationId(null));
          refetchInbox();
        },
      },
    ],
  });

  /* load latest messages for conversation */
  async function loadLatest(cid: number) {
    dispatch(clearConversationMessages(cid));
    dispatch(setLoadingConversation(cid));
    stickToBottom.current = true;

    const page: any = await getPage({ conversationId: cid, limit: 30 }).unwrap().catch(() => null);
    const data = page?.data || [];
    dispatch(seedMessages({ conversationId: cid, messages: data }));
    setHasMore(data.length >= 30);
    dispatch(setLoadingConversation(null));

    const last = data.slice(-1)[0];
    if (last?.id) {
      emitRead(cid, last.id); // socket read
      // optional REST read:
      markRead({ conversationId: cid, lastReadMessageId: last.id }).unwrap().catch(() => null);
    }

    setTimeout(() => scrollToBottom(true), 40);
    setTimeout(() => scrollToBottom(true), 120);
  }

  /* start DM */
  async function startDm(empId?: string | null) {
    const toId = String(empId || quickDm || "").trim();
    if (!toId) return;
    const res: any = await createDm({ toEmployeeId: toId }).unwrap().catch(() => null);
    if (!res?.success) return;
    const cid = Number(res?.conversationId || res?.data?.conversationId);
    dispatch(setActiveConversationId(cid));
    const sel = employees.find((e: any) => String(e.employee_id) === String(toId));
    setPendingChat({
      conversation_id: cid,
      other_employee_id: String(toId),
      other_name: sel?.name || String(toId),
    });
    setQuickDm(null);
    setSidebarOpen(false);
    setTimeout(() => refetchInbox(), 0);
    await loadLatest(cid);
  }

  /* open conversation */
  async function openConversation(cid: number) {
    if (!cid) return;
    dispatch(setActiveConversationId(cid));
    dispatch(setTyping({ conversation_id: cid, typing: false }));
    setSidebarOpen(false);
    await loadLatest(cid);
  }

  /* typing emit */
  const typingTimer = useRef<any>(null);
  const onDraftChange = (val: string) => {
    setDraft(val);
    const cid = activeConvRef.current;
    if (!cid) return;
    emitTyping(cid);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => emitStopTyping(cid), 800);
  };

  /* send */
  const send = () => {
    const cid = activeConvRef.current;
    if (!cid || !draft.trim()) return;
    sendChatMessage(cid, draft.trim());
    setDraft("");
    emitStopTyping(cid);
    stickToBottom.current = true;
    setTimeout(() => refetchInbox(), 0);
    setTimeout(() => scrollToBottom(true), 20);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  /* load older messages */
  async function loadOlder() {
    const cid = activeConvRef.current;
    if (!cid || loadingMore || !hasMore) return;
    const oldest = messages[0]?.id;
    if (!oldest) return;
    setLoadingMore(true);
    const res: any = await getPage({ conversationId: cid, limit: 30, beforeId: oldest })
      .unwrap()
      .catch(() => null);
    if (res?.success) {
      dispatch(prependMessages({ conversationId: cid, messages: res.data || [] }));
      setHasMore((res.data || []).length >= 30);
      const el = scrollRef.current;
      if (el) {
        const sh = el.scrollHeight;
        requestAnimationFrame(() => {
          el.scrollTop += el.scrollHeight - sh;
        });
      }
    }
    setLoadingMore(false);
  }

  /* socket */
  useEffect(() => {
    if (!token) return;
    const typHide: { t: any } = { t: null };
    connectChatSocket(token);

    const o1 = onChatMessage((m: any) => {
      dispatch(appendMessage(m));

      // ✅ Always refetch inbox so:
      // - deleted chats re-appear when someone messages you
      // - archived chats move correctly when new message arrives
      setTimeout(() => refetchInbox(), 0);

      const cid = activeConvRef.current;
      if (cid && Number(m.conversation_id) === cid) {
        emitRead(cid, m.id);
        markRead({ conversationId: cid, lastReadMessageId: m.id }).unwrap().catch(() => null);
        stickToBottom.current = true;
        setTimeout(() => scrollToBottom(false), 20);
      }
    });

    const o2 = onPresenceStatus((arr: any[]) => {
      dispatch(setOnlineMap(arr));
      arr.forEach((p) =>
        dispatch(setLastSeen({ employee_id: p.employee_id, last_seen_at: p.last_seen_at ?? null }))
      );
    });

    const o3 = onPresenceUpdate((p: any) => {
      dispatch(updateOnline(p));
      dispatch(setLastSeen({ employee_id: p.employee_id, last_seen_at: p.last_seen_at ?? null }));
    });

    const o4 = onTyping((p: any) => {
      const cid = activeConvRef.current;
      if (cid && Number(p.conversation_id) === cid) {
        dispatch(setTyping({ conversation_id: cid, typing: true }));
        clearTimeout(typHide.t);
        typHide.t = setTimeout(() => dispatch(setTyping({ conversation_id: cid, typing: false })), 1600);
      }
    });

    const o5 = onStopTyping((p: any) => {
      const cid = activeConvRef.current;
      if (cid && Number(p.conversation_id) === cid)
        dispatch(setTyping({ conversation_id: cid, typing: false }));
    });

    const o6 = onReceipt((p: any) => {
      if (p?.type === "delivered" && p?.message_id && p?.delivered_at)
        dispatch(markDelivered({ message_id: p.message_id, delivered_at: p.delivered_at }));
      if (p?.type === "read" && p?.conversation_id && p?.last_read_message_id && p?.read_at)
        dispatch(
          markReadUpTo({
            conversation_id: Number(p.conversation_id),
            last_read_message_id: Number(p.last_read_message_id),
            read_at: p.read_at,
          })
        );
    });

    return () => {
      o1?.();
      o2?.();
      o3?.();
      o4?.();
      o5?.();
      o6?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, showArchived]);

  /* group by date */
  const grouped = useMemo(() => {
    const out: { sep: string; msgs: any[] }[] = [];
    let cur = "";
    messages.forEach((m: any) => {
      const d = m.created_at ? new Date(m.created_at).toDateString() : "";
      if (d !== cur) {
        cur = d;
        out.push({ sep: dateSep(m.created_at), msgs: [] });
      }
      out[out.length - 1]?.msgs.push(m);
    });
    return out;
  }, [messages]);

  /* status line */
  const statusLine = typing ? (
    <>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818cf8", display: "inline-block" }} />{" "}
      typing…
    </>
  ) : otherOnline ? (
    <>
      <span className="head-online-dot" /> Active now
    </>
  ) : lastSeen ? (
    `Last seen ${ago(lastSeen)}`
  ) : (
    "Offline"
  );

  /* ── RENDER ── */
  return (
    <>
      <style>{STYLES}</style>

      <div className="chat-shell">
        {/* Mobile overlay */}
        <div className={`mob-overlay${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} />

        {/* ══════════════ SIDEBAR ══════════════ */}
        <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
          <div className="sb-header">
            <div className="sb-title">
              <div className="sb-title-badge">
                <MessageOutlined />
              </div>
              Messages

              {/* ✅ Inbox / Archived toggle */}
              <Button
                size="small"
                style={{ marginLeft: "auto", borderRadius: 10 }}
                icon={showArchived ? <InboxOutlined /> : <InboxOutlined />}
                onClick={() => {
                  setShowArchived((v) => !v);
                  // keep UI clean
                  setSearch("");
                  setSidebarOpen(false);
                  setTimeout(() => refetchInbox(), 0);
                }}
              >
                {showArchived ? "Inbox" : "Archived"}
              </Button>
            </div>

            <div className="sb-search">
              <SearchOutlined className="sb-search-icon" />
              <input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="sb-newdm">
              <Select
                showSearch
                allowClear
                loading={empLoading || startingDm}
                placeholder={startingDm ? "Opening…" : "New message…"}
                style={{ width: "100%" }}
                value={quickDm}
                optionFilterProp="label"
                suffixIcon={<PlusOutlined style={{ color: "#4f46e5" }} />}
                onChange={(val) => {
                  const v = val ? String(val) : null;
                  setQuickDm(v);
                  if (v) setTimeout(() => startDm(v), 0);
                }}
                options={employees
                  .filter((e: any) => String(e.employee_id) !== String(myEmpId))
                  .map((e: any) => ({ value: String(e.employee_id), label: `${e.name} · ${e.employee_id}` }))}
              />
            </div>
          </div>

          <div className="sb-list">
            {inboxLoading && !inbox.length && (
              <div style={{ display: "flex", justifyContent: "center", padding: "28px 0" }}>
                <Spin size="small" />
              </div>
            )}

            {!inboxLoading && filteredInbox.length === 0 && (
              <div style={{ textAlign: "center", padding: "36px 20px", color: "#9ca3af", fontSize: 13 }}>
                {search ? "No results" : showArchived ? "No archived conversations" : "No conversations yet"}
              </div>
            )}

            {filteredInbox.map((c: any, i: number) => {
              const active = Number(c.conversation_id) === Number(activeConvId);
              const online = !!onlineMap[String(c.other_employee_id)];
              const unread = Number(c.unread_count || 0);
              return (
                <div
                  key={c.conversation_id}
                  className={`ci${active ? " is-active" : ""}`}
                  style={{ animationDelay: `${i * 0.03}s` }}
                  onClick={() => openConversation(c.conversation_id)}
                >
                  <Avatar name={c.other_name} id={c.other_employee_id} online={online} size={44} />
                  <div className="ci-body">
                    <div className="ci-top">
                      <span className="ci-name">{c.other_name || c.other_employee_id}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                        <span className="ci-time">{fmt(c.last_message_at)}</span>
                        {unread > 0 && <span className="ci-badge">{unread}</span>}
                        <Dropdown trigger={["click"]} menu={menuFor(Number(c.conversation_id))} getPopupContainer={() => document.body}>
                          <Button className="ci-menu-btn" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
                        </Dropdown>
                      </div>
                    </div>
                    <div className="ci-preview">{c.last_message || "—"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ══════════════ MAIN ══════════════ */}
        <div className="main">
          {/* Header */}
          <div className="main-head">
            <Button
              style={{
                display: "none",
                background: "#f3f4f6",
                border: "none",
                borderRadius: 10,
                color: "#4b5563",
                height: 34,
                width: 34,
                alignItems: "center",
                justifyContent: "center",
              }}
              className="mob-back-btn"
              icon={<MenuOutlined />}
              onClick={() => setSidebarOpen(true)}
            />

            {activeChat ? (
              <>
                <Avatar
                  name={(activeChat as any).other_name}
                  id={(activeChat as any).other_employee_id}
                  online={otherOnline}
                  size={42}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="head-name">{(activeChat as any).other_name || (activeChat as any).other_employee_id}</div>
                  <div className="head-status">
                    {statusLine}
                    <span style={{ marginLeft: "auto", fontSize: 11, fontFamily: "monospace", color: "#d1d5db" }}>
                      {(activeChat as any).other_employee_id}
                    </span>
                    {isLoading && <Spin size="small" style={{ marginLeft: 6 }} />}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#eef2ff,#ede9fe)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4f46e5",
                    fontSize: 20,
                  }}
                >
                  <MessageOutlined />
                </div>
                <div>
                  <div className="head-name">Messages</div>
                  <div className="head-status">Select a conversation to start</div>
                </div>
              </>
            )}
          </div>

          {/* Messages scroll area */}
          <div ref={scrollRef} className="msgs-scroll" onScroll={onScrollMsg}>
            {!activeConvId ? (
              <div className="msgs-inner" style={{ justifyContent: "center" }}>
                <div className="msg-empty">
                  <div className="msg-empty-icon">
                    <MessageOutlined />
                  </div>
                  <h3>No conversation open</h3>
                  <p>
                    Select a chat from the sidebar
                    <br />
                    or start a new message
                  </p>
                </div>
              </div>
            ) : isLoading ? (
              <div className="msgs-inner" style={{ justifyContent: "center", alignItems: "center" }}>
                <Spin size="large" />
              </div>
            ) : (
              <div className="msgs-inner">
                {loadingMore && (
                  <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 4px" }}>
                    <Spin size="small" />
                  </div>
                )}

                {messages.length === 0 ? (
                  <div className="msg-empty" style={{ flex: "unset", marginTop: "auto" }}>
                    <div className="msg-empty-icon" style={{ fontSize: 34 }}>
                      👋
                    </div>
                    <h3>Say hello!</h3>
                    <p>This is the beginning of your conversation.</p>
                  </div>
                ) : (
                  grouped.map((g, gi) => (
                    <React.Fragment key={gi}>
                      <div className="date-divider">{g.sep}</div>
                      {g.msgs.map((m: any) => {
                        const isMe = myEmpId && String(m.sender_employee_id) === String(myEmpId);
                        return (
                          <div key={m.id} className={`msg-row ${isMe ? "from-me" : "from-them"}`}>
                            <div className={`bubble ${isMe ? "me" : "them"}`}>
                              <div className="bubble-meta">
                                <span>{m.sender_name || m.sender_employee_id}</span>
                                <span style={{ marginLeft: "auto" }}>{fmt(m.created_at)}</span>
                                <Ticks m={m} isMe={!!isMe} />
                              </div>
                              {m.message}
                            </div>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))
                )}

                {typing && (
                  <div className="msg-row from-them" style={{ marginTop: 4 }}>
                    <TypingIndicator />
                  </div>
                )}

                <div ref={bottomAnchor} style={{ height: 1, flexShrink: 0 }} />
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="composer">
            <div className="composer-box">
              <Input.TextArea
                value={draft}
                onChange={(e) => onDraftChange(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={!activeConvId || isLoading}
                placeholder={
                  activeConvId
                    ? "Write a message…  (Enter to send, Shift+Enter for new line)"
                    : "Select a conversation to start typing"
                }
                autoSize={{ minRows: 1, maxRows: 6 }}
              />
            </div>
            <Button
              className="send-btn"
              icon={<SendOutlined />}
              disabled={!activeConvId || !draft.trim() || isLoading}
              onClick={send}
            >
              Send
            </Button>
          </div>
        </div>

        {/* Mobile FAB */}
        <Button className="mobile-fab" icon={<MenuOutlined />} onClick={() => setSidebarOpen((v) => !v)} />
      </div>
    </>
  );
}