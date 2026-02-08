import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Space, Typography, Tooltip } from "antd";
import { motion, useReducedMotion } from "framer-motion";
import type { Transition } from "framer-motion";
import {
  PaperPlaneTilt,
  X,
  Stop,
  ArrowsOutSimple,
  ArrowsInSimple,
  Microphone,
} from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const { Text } = Typography;
const { TextArea } = Input;

export type ChatRole = "user" | "assistant";
export type ChatMessage = { id: string; role: ChatRole; content: string; ts: number };

export const fmtTime = (ts: number) => {
  try {
    return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(ts));
  } catch {
    const d = new Date(ts);
    const hh = d.getHours();
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }
};

function MarkdownBubble({ content }: { content: string }) {
  return (
    <div className="dbl-md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children, ...props }) => (
            <a {...props} target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
          code: ({ children, className, ...props }) => {
            const isBlock = /language-/.test(className || "");
            return isBlock ? (
              <pre className="dbl-codeblock">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="dbl-code-inline" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  );
}

export default function ChatShell({
  open,
  title,
  icon,
  extraHeader,
  messages,
  typing,
  inputValue,
  inputPlaceholder,
  onInputChange,
  onSend,
  onStop,
  onMinimize,
  maximized,
  onMaximize,
  onRestore,
  onClose,

  // ✅ Voice props
  voiceSupported,
  listening,
  onToggleVoice,
}: {
  open: boolean;
  title: string;
  icon: React.ReactNode;
  extraHeader?: React.ReactNode;
  messages: ChatMessage[];
  typing: boolean;
  inputValue: string;
  inputPlaceholder: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  onStop?: () => void;
  onMinimize: () => void;
  onClose: () => void;

  maximized?: boolean;
  onMaximize?: () => void;
  onRestore?: () => void;

  voiceSupported: boolean;
  listening: boolean;
  onToggleVoice: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  const spring: Transition = prefersReducedMotion
    ? { type: "tween", duration: 0 }
    : { type: "spring", stiffness: 520, damping: 36 };

  const bodyRef = useRef<HTMLDivElement>(null);

  // Keep “stick to bottom” only when user is near bottom
  const stickRef = useRef(true);

  const [showJump, setShowJump] = useState(false);
  const [focused, setFocused] = useState(false);

  const isNearBottom = () => {
    const el = bodyRef.current;
    if (!el) return true;
    const threshold = 90;
    return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  };

  const scrollToBottom = () => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  // Message grouping
  const groupPos = (idx: number) => {
    const cur = messages[idx];
    const prev = messages[idx - 1];
    const next = messages[idx + 1];
    const starts = !prev || prev.role !== cur.role;
    const ends = !next || next.role !== cur.role;
    return { starts, ends };
  };

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    const onScroll = () => {
      const near = isNearBottom();
      stickRef.current = near;
      setShowJump(!near);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (stickRef.current) scrollToBottom();
  }, [messages.length, typing]);

  useEffect(() => {
    scrollToBottom();
    stickRef.current = true;
    setShowJump(false);
  }, [maximized]);

  // ESC to close expanded
  useEffect(() => {
    if (!maximized || !onRestore) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onRestore();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [maximized, onRestore]);

  if (!open) return null;

  // Enter = send, Shift+Enter = newline
  const onComposerKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return;
    if (e.shiftKey) return;
    e.preventDefault();
    if (typing) onStop?.();
    else onSend();
  };

  // Hide placeholder assistant message like "…" while typing
  const isPlaceholderAssistant = (m: ChatMessage) => {
    if (m.role !== "assistant") return false;
    const c = (m.content || "").trim();
    return c === "…" || c === "..." || c === "." || c === "";
  };

  const ChatCard = useMemo(
    () => (
      <>
        <div className="dbl-chat-header">
          <div className="dbl-chat-title">
            <div className="dbl-chat-icon">{icon}</div>
            <div className="dbl-chat-title-text">
              <Text strong className="dbl-title">
                {title}
              </Text>
              <div className="dbl-subtitle">DBL Group IT • Assistant</div>
            </div>
          </div>

          <div className="dbl-header-actions">
            {extraHeader}
            <Space>
              {onMaximize && onRestore && (
                <Tooltip title={maximized ? "Restore" : "Expand"} placement="bottom">
                  <Button
                    size="small"
                    className="dbl-control"
                    onClick={maximized ? onRestore : onMaximize}
                    aria-label={maximized ? "Restore" : "Expand"}
                  >
                    {maximized ? <ArrowsInSimple size={14} /> : <ArrowsOutSimple size={14} />}
                  </Button>
                </Tooltip>
              )}

              <Tooltip title="Minimize" placement="bottom">
                <Button size="small" className="dbl-control" onClick={onMinimize} disabled={!!maximized}>
                  —
                </Button>
              </Tooltip>

              <Tooltip title="Close" placement="bottom">
                <Button size="small" className="dbl-control" onClick={onClose} icon={<X size={14} />} />
              </Tooltip>
            </Space>
          </div>
        </div>

        <div className="dbl-chat-body" ref={bodyRef}>
          <div className="dbl-chat-inner">
            {messages.map((m, idx) => {
              if (typing && isPlaceholderAssistant(m)) return null;

              const { starts, ends } = groupPos(idx);

              return (
                <div key={m.id} className={`dbl-msg-row ${m.role}`}>
                  <div className="dbl-msg-col">
                    <div className={`dbl-bubble ${m.role} ${starts ? "start" : ""} ${ends ? "end" : ""}`}>
                      {m.role === "assistant" ? <MarkdownBubble content={m.content} /> : <span>{m.content}</span>}
                    </div>

                    {ends && <div className={`dbl-ts ${m.role}`}>{fmtTime(m.ts)}</div>}
                  </div>
                </div>
              );
            })}

            {typing && (
              <div className="dbl-msg-row assistant">
                <div className="dbl-msg-col">
                  <div className="dbl-bubble assistant dbl-typing-bubble" aria-label="Assistant typing">
                    <span className="dbl-typing-dots">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </span>
                    <span className="dbl-typing-label">Thinking</span>
                  </div>
                  <div className="dbl-ts assistant">{fmtTime(Date.now())}</div>
                </div>
              </div>
            )}
          </div>

          {showJump && (
            <button className="dbl-jump" onClick={scrollToBottom} aria-label="Jump to latest">
              ↓ New
            </button>
          )}
        </div>

        <div className="dbl-chat-footer">
          <div className="dbl-composer">
            {/* ✅ Voice button */}
            <Tooltip
              title={
                !voiceSupported ? "Voice not supported" : listening ? "Stop voice input" : "Voice input"
              }
              placement="top"
            >
              <Button
                className={`dbl-composer-btn ${listening ? "dbl-voice-stop" : ""}`}
                onClick={onToggleVoice}
                disabled={!voiceSupported || typing}
                aria-label={listening ? "Stop voice input" : "Start voice input"}
              >
                {listening ? <Stop size={18} weight="bold" /> : <Microphone size={18} weight="bold" />}
              </Button>
            </Tooltip>

            <div className={`dbl-composer-box ${focused ? "is-focus" : ""}`}>
              <TextArea
                className="dbl-input"
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={onComposerKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={inputPlaceholder}
                autoSize={{ minRows: 1, maxRows: maximized ? 6 : 4 }}
                allowClear={false}
              />

              {focused && (
                <div className="dbl-composer-hint">
                  <span>Enter</span> send • <span>Shift+Enter</span> new line
                </div>
              )}
            </div>

            <Tooltip title={typing ? "Stop" : "Send"} placement="top">
              <Button
                type="primary"
                className="dbl-send"
                onClick={typing ? onStop : onSend}
                aria-label={typing ? "Stop" : "Send"}
                disabled={typing ? !onStop : false}
              >
                {typing ? <Stop size={18} weight="fill" /> : <PaperPlaneTilt size={18} weight="fill" />}
              </Button>
            </Tooltip>
          </div>
        </div>
      </>
    ),
    [
      icon,
      title,
      extraHeader,
      messages,
      typing,
      inputValue,
      inputPlaceholder,
      maximized,
      focused,
      voiceSupported,
      listening,
      onToggleVoice,
      onClose,
      onInputChange,
      onMaximize,
      onMinimize,
      onRestore,
      onSend,
      onStop,
    ]
  );

  return (
    <>
      <style>{`
        :root{
          --card: rgba(255,255,255,0.78);
          --card2: rgba(255,255,255,0.64);
          --border: rgba(15,23,42,0.10);
          --text: rgba(15,23,42,0.92);
          --muted: rgba(15,23,42,0.58);

          --shadow: 0 26px 90px rgba(2,6,23,0.18);
          --shadow2: 0 10px 28px rgba(2,6,23,0.10);
          --overlay: rgba(2,6,23,0.26);

          --radius: 22px;
          --blue1:#3b82f6;
          --blue2:#2563eb;

          --glass-blur: 16px;
        }

        @media (prefers-color-scheme: dark){
          :root{
            --card: rgba(17,24,39,0.64);
            --card2: rgba(17,24,39,0.52);
            --border: rgba(255,255,255,0.14);
            --text: rgba(255,255,255,0.92);
            --muted: rgba(255,255,255,0.66);

            --shadow: 0 34px 110px rgba(0,0,0,0.62);
            --shadow2: 0 14px 34px rgba(0,0,0,0.35);
            --overlay: rgba(0,0,0,0.44);
          }
        }

        .dbl-chat{
          position: fixed;
          right: 18px;
          bottom: 18px;
          width: min(420px, 94vw);
          height: min(640px, 82vh);

          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow);

          overflow: hidden;
          display:flex;
          flex-direction:column;
          z-index: 2600;

          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
        }

        .dbl-chat::before{
          content:"";
          position:absolute;
          inset:0;
          pointer-events:none;
          border-radius: var(--radius);
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.55),
            rgba(255,255,255,0.10) 38%,
            rgba(255,255,255,0.06)
          );
          opacity: 0.40;
        }
        @media (prefers-color-scheme: dark){
          .dbl-chat::before{
            background: linear-gradient(
              180deg,
              rgba(255,255,255,0.14),
              rgba(255,255,255,0.04) 38%,
              rgba(255,255,255,0.02)
            );
            opacity: 0.55;
          }
        }

        .dbl-chat-overlay{
          position: fixed;
          inset: 0;
          z-index: 2599;
          background: var(--overlay);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          display:flex;
          align-items:center;
          justify-content:center;
          padding: 24px;
        }
        .dbl-chat--max{
          position: relative;
          width: min(920px, 94vw);
          height: min(740px, 84vh);
          right:auto;
          bottom:auto;
        }

        @media (max-width: 640px){
          .dbl-chat{ right: 12px; bottom: 12px; width: min(420px, 96vw); height: min(620px, 84vh); }
          .dbl-chat-overlay{ padding: 12px; }
          .dbl-chat--max{ width: min(560px, 96vw); height: min(720px, 92vh); border-radius: 18px; }
        }

        .dbl-chat-header{
          height: 66px;
          padding: 0 14px;
          background: var(--card2);
          border-bottom: 1px solid var(--border);
          display:flex;
          align-items:center;
          justify-content:space-between;
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          position: relative;
          z-index: 1;
        }

        .dbl-chat-title{ display:flex; align-items:center; gap: 12px; min-width:0; }
        .dbl-chat-icon{
          width: 42px; height: 42px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--blue1), var(--blue2));
          color: #fff;
          display:flex; align-items:center; justify-content:center;
          box-shadow: 0 16px 30px rgba(37,99,235,0.22);
          flex: 0 0 auto;
          position: relative;
          overflow:hidden;
        }
        .dbl-chat-icon::after{
          content:"";
          position:absolute;
          inset:-40%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.45), transparent 55%);
          transform: rotate(12deg);
          opacity: 0.65;
        }

        .dbl-title{ color: var(--text); letter-spacing: -0.2px; font-size: 14px; }
        .dbl-subtitle{ font-size: 12px; color: var(--muted); font-weight: 700; margin-top: 2px; opacity: 0.92; }

        .dbl-header-actions{ display:flex; align-items:center; gap: 10px; position: relative; z-index: 1; }

        .dbl-control.ant-btn{
          border: 1px solid rgba(15,23,42,0.06);
          border-radius: 14px;
          background: rgba(255,255,255,0.36);
          box-shadow: none;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .dbl-control.ant-btn:hover{ background: rgba(255,255,255,0.52); }
        @media (prefers-color-scheme: dark){
          .dbl-control.ant-btn{
            border: 1px solid rgba(255,255,255,0.10);
            background: rgba(255,255,255,0.08);
            color: rgba(255,255,255,0.92);
          }
          .dbl-control.ant-btn:hover{ background: rgba(255,255,255,0.12); }
        }

        .dbl-chat-body{
          flex: 1;
          overflow-y: auto;
          padding: 14px 12px;
          position: relative;
          background:
            radial-gradient(1100px 520px at 14% -10%, rgba(59,130,246,0.14), transparent 60%),
            radial-gradient(900px 420px at 92% 8%, rgba(147,197,253,0.10), transparent 62%),
            linear-gradient(180deg, rgba(248,250,252,0.70), rgba(248,250,252,0.52));
        }
        @media (prefers-color-scheme: dark){
          .dbl-chat-body{
            background:
              radial-gradient(1100px 520px at 14% -10%, rgba(59,130,246,0.18), transparent 60%),
              radial-gradient(900px 420px at 92% 8%, rgba(147,197,253,0.12), transparent 62%),
              linear-gradient(180deg, rgba(2,6,23,0.16), rgba(2,6,23,0.12));
          }
        }

        .dbl-msg-row{ display:flex; margin: 8px 0; }
        .dbl-msg-row.user{ justify-content:flex-end; }
        .dbl-msg-row.assistant{ justify-content:flex-start; }

        .dbl-msg-col{ max-width: 82%; min-width: 0; }
        .dbl-chat--max .dbl-msg-col{ max-width: 72%; }

        .dbl-bubble{
          max-width: 100%;
          border-radius: 18px;
          padding: 10px 12px;
          line-height: 1.65;
          font-size: 14px;
          box-shadow: var(--shadow2);
          overflow: hidden;
          word-break: break-word;
        }
        .dbl-chat--max .dbl-bubble{ font-size: 15px; }

        .dbl-bubble.user{
          color: #fff;
          background: linear-gradient(135deg, var(--blue1), var(--blue2));
          box-shadow: 0 16px 34px rgba(37,99,235,0.22);
          border: 1px solid rgba(255,255,255,0.16);
        }
        .dbl-bubble.assistant{
          color: var(--text);
          background: rgba(255,255,255,0.62);
          border: 1px solid rgba(15,23,42,0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        @media (prefers-color-scheme: dark){
          .dbl-bubble.assistant{
            background: rgba(255,255,255,0.07);
            border: 1px solid rgba(255,255,255,0.12);
          }
        }

        /* Grouping */
        .dbl-bubble.user.start { border-top-right-radius: 18px; }
        .dbl-bubble.user.end   { border-bottom-right-radius: 12px; }
        .dbl-bubble.user:not(.start){ border-top-right-radius: 12px; }
        .dbl-bubble.user:not(.end){ border-bottom-right-radius: 12px; }

        .dbl-bubble.assistant.start { border-top-left-radius: 18px; }
        .dbl-bubble.assistant.end   { border-bottom-left-radius: 12px; }
        .dbl-bubble.assistant:not(.start){ border-top-left-radius: 12px; }
        .dbl-bubble.assistant:not(.end){ border-bottom-left-radius: 12px; }

        .dbl-ts{
          font-size: 11px;
          opacity: 0.55;
          margin-top: 6px;
          padding: 0 2px;
          user-select:none;
        }
        .dbl-ts.user{ text-align:right; color: rgba(255,255,255,0.86); }
        .dbl-ts.assistant{ text-align:left; color: var(--muted); }

        .dbl-typing-bubble{
          display:inline-flex;
          align-items:center;
          gap: 10px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.54) !important;
        }
        @media (prefers-color-scheme: dark){
          .dbl-typing-bubble{ background: rgba(255,255,255,0.08) !important; }
        }
        .dbl-typing-label{
          font-size: 12px;
          font-weight: 800;
          color: var(--muted);
        }
        .dbl-typing-dots{ display:inline-flex; gap: 6px; align-items:center; }
        .dbl-typing-dots .dot{
          width: 6px; height: 6px;
          border-radius: 999px;
          background: rgba(15,23,42,0.45);
          animation: dotUp 1.05s infinite ease-in-out;
        }
        @media (prefers-color-scheme: dark){
          .dbl-typing-dots .dot{ background: rgba(255,255,255,0.74); }
        }
        .dbl-typing-dots .dot:nth-child(2){ animation-delay: 0.14s; }
        .dbl-typing-dots .dot:nth-child(3){ animation-delay: 0.28s; }
        @keyframes dotUp{
          0%, 80%, 100%{ transform: translateY(0); opacity: 0.55; }
          40%{ transform: translateY(-6px); opacity: 1; }
        }

        .dbl-jump{
          position: sticky;
          bottom: 10px;
          margin-left: auto;
          margin-right: 6px;
          z-index: 5;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.62);
          color: var(--text);
          padding: 8px 12px;
          border-radius: 999px;
          box-shadow: var(--shadow2);
          cursor: pointer;
          font-weight: 850;
          font-size: 12px;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: transform .18s ease;
        }
        .dbl-jump:hover{ transform: translateY(-1px); }
        @media (prefers-color-scheme: dark){
          .dbl-jump{ background: rgba(17,24,39,0.54); }
        }

        .dbl-chat-footer{
          padding: 12px;
          background: var(--card2);
          border-top: 1px solid var(--border);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          position: relative;
          z-index: 1;
        }

        .dbl-composer{
          display:flex;
          gap: 10px;
          align-items:flex-end;
        }

        .dbl-composer-btn.ant-btn{
          height: 48px;
          width: 52px;
          border-radius: 16px;
          border: 1px solid rgba(15,23,42,0.06);
          background: rgba(255,255,255,0.34);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display:flex;
          align-items:center;
          justify-content:center;
        }
        .dbl-composer-btn.ant-btn:hover{ background: rgba(255,255,255,0.52); }
        @media (prefers-color-scheme: dark){
          .dbl-composer-btn.ant-btn{
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.12);
            color: rgba(255,255,255,0.92);
          }
          .dbl-composer-btn.ant-btn:hover{ background: rgba(255,255,255,0.12); }
        }

        /* ✅ voice stop state */
        .dbl-voice-stop.ant-btn{
          background: rgba(239,68,68,0.16) !important;
          border-color: rgba(239,68,68,0.40) !important;
          color: rgba(185,28,28,0.95) !important;
        }
        @media (prefers-color-scheme: dark){
          .dbl-voice-stop.ant-btn{
            background: rgba(239,68,68,0.22) !important;
            border-color: rgba(239,68,68,0.42) !important;
          }
        }

        .dbl-composer-box{
          flex: 1;
          padding: 10px 12px;
          border-radius: 18px;
          border: 1px solid rgba(15,23,42,0.12);
          background: rgba(255,255,255,0.58);
          box-shadow: 0 12px 28px rgba(2,6,23,0.10);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: box-shadow .18s ease, transform .18s ease, border-color .18s ease;
        }
        @media (prefers-color-scheme: dark){
          .dbl-composer-box{
            background: rgba(255,255,255,0.07);
            border: 1px solid rgba(255,255,255,0.12);
            box-shadow: 0 14px 34px rgba(0,0,0,0.28);
          }
        }
        .dbl-composer-box.is-focus{
          border-color: rgba(37,99,235,0.40);
          box-shadow:
            0 14px 34px rgba(2,6,23,0.12),
            0 0 0 4px rgba(37,99,235,0.12);
          transform: translateY(-1px);
        }

        .dbl-input .ant-input{
          border: none !important;
          box-shadow: none !important;
          background: transparent !important;
          color: var(--text);
          font-weight: 650;
          padding: 0 !important;
          resize: none;
        }
        .dbl-input .ant-input::placeholder{ color: rgba(15,23,42,0.45); }
        @media (prefers-color-scheme: dark){
          .dbl-input .ant-input::placeholder{ color: rgba(255,255,255,0.45); }
        }

        .dbl-composer-hint{
          margin-top: 6px;
          font-size: 11px;
          color: var(--muted);
          opacity: 0.85;
          user-select:none;
        }
        .dbl-composer-hint span{ font-weight: 900; color: var(--text); }

        .dbl-send.ant-btn{
          height: 48px;
          width: 58px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.14);
          display:flex;
          align-items:center;
          justify-content:center;
          background: linear-gradient(135deg, var(--blue1), var(--blue2));
          box-shadow: 0 14px 30px rgba(37,99,235,0.22);
        }

        /* Markdown */
        .dbl-md { color: var(--text); }
        .dbl-md :where(p, ul, ol, pre, table){ margin: 0; }
        .dbl-md p + p{ margin-top: 8px; }
        .dbl-md ul, .dbl-md ol{ padding-left: 18px; margin-top: 6px; }
        .dbl-md a{ text-decoration: underline; }

        .dbl-codeblock{
          margin-top: 10px;
          padding: 12px;
          border-radius: 14px;
          background: rgba(2,6,23,0.06);
          border: 1px solid rgba(2,6,23,0.10);
          overflow-x: auto;
          max-width: 100%;
        }
        @media (prefers-color-scheme: dark){
          .dbl-codeblock{
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.12);
          }
        }
        .dbl-codeblock code{
          white-space: pre-wrap;
          word-break: break-word;
        }

        .dbl-code-inline{
          background: rgba(2,6,23,0.06);
          border-radius: 8px;
          padding: 2px 6px;
        }
        @media (prefers-color-scheme: dark){
          .dbl-code-inline{ background: rgba(255,255,255,0.10); }
        }

        @media (prefers-reduced-motion: reduce){
          .dbl-typing-dots .dot{ animation: none !important; }
          .dbl-composer-box, .dbl-jump{ transition: none !important; }
        }
      `}</style>

      {maximized ? (
        <div className="dbl-chat-overlay" onClick={onRestore}>
          <motion.div
            className="dbl-chat dbl-chat--max"
            onClick={(e) => e.stopPropagation()}
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.985, y: 10 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985, y: 10 }}
            transition={spring}
          >
            {ChatCard}
          </motion.div>
        </div>
      ) : (
        <motion.div
          className="dbl-chat"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16, scale: 0.985 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.985 }}
          transition={spring}
        >
          {ChatCard}
        </motion.div>
      )}
    </>
  );
}
