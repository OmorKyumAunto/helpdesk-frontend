import React, { useEffect, useRef } from "react";
import { Button, Input, Space, Typography, Tooltip } from "antd";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import { PaperPlaneTilt, X, Stop, Paperclip, Trash } from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const { Text } = Typography;

export type ChatRole = "user" | "assistant";
export type ChatMessage = { id: string; role: ChatRole; content: string; ts: number };

export const fmtTime = (ts: number) => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(ts));
  } catch {
    const d = new Date(ts);
    const hh = d.getHours();
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }
};

function MarkdownBubble({ content }: { content: string }) {
  // Render markdown safely-ish (no HTML). GFM adds tables/strikethrough/task-lists.
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
              <pre className="dbl-code">
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
  onClose,
  // ✅ File attachments
  files,
  onFilesChange,
  onClearFiles,
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

  files?: File[];
  onFilesChange?: (files: File[]) => void;
  onClearFiles?: () => void;
}) {
  const spring: Transition = { type: "spring", stiffness: 520, damping: 34 };

  const bodyRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!bodyRef.current) return;
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages.length, typing]);

  if (!open) return null;

  const attachEnabled = !!onFilesChange;

  return (
    <>
      <style>{`
        .dbl-chat {
          position: fixed;
          right: 18px;
          bottom: 18px;
          width: min(420px,94vw);
          height: min(640px,82vh);
          background: rgba(255,255,255,0.22);
          backdrop-filter: blur(22px) saturate(160%);
          -webkit-backdrop-filter: blur(22px) saturate(160%);
          border-radius: 22px;
          display: flex;
          flex-direction: column;
          z-index: 2600;
          border: 1px solid rgba(255,255,255,0.28);
          box-shadow:
            0 30px 90px rgba(0,0,0,0.38),
            inset 0 1px 0 rgba(255,255,255,0.40);
          overflow: hidden;
        }

        .dbl-chat-header {
          height: 66px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background:
            radial-gradient(900px 260px at 30% 0%, rgba(59,130,246,0.18), transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0.22) 100%);
          border-bottom: 1px solid rgba(255,255,255,0.22);
        }

        .dbl-chat-title { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .dbl-chat-icon {
          width: 42px; height: 42px; border-radius: 16px;
          background: linear-gradient(135deg,#3b82f6,#2563eb);
          color: white; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 16px 40px rgba(59,130,246,0.28), inset 0 1px 0 rgba(255,255,255,0.38);
          flex: 0 0 auto;
        }
        .dbl-title-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .dbl-header-actions { display: flex; gap: 10px; align-items: center; }

        .dbl-control.ant-btn {
          border-radius: 14px;
          border: none;
          background: rgba(255,255,255,0.70);
          box-shadow: 0 10px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.55);
        }

        .dbl-chat-body {
          flex: 1;
          padding: 14px 12px;
          overflow-y: auto;
          background:
            radial-gradient(1200px 520px at 50% 0%, rgba(59,130,246,0.12), transparent 60%),
            linear-gradient(180deg, rgba(248,250,252,0.55), rgba(255,255,255,0.12));
        }

        .dbl-msg-row { display: flex; margin: 10px 0; min-width: 0; }
        .dbl-msg-row.user { justify-content: flex-end; }
        .dbl-msg-row.assistant { justify-content: flex-start; }
        .dbl-msg-col { max-width: 82%; min-width: 0; }

        .dbl-bubble {
          position: relative;
          width: fit-content;
          max-width: 100%;
          padding: 12px 12px;
          border-radius: 18px;
          line-height: 1.45;
          font-size: 13px;
          box-shadow: 0 10px 26px rgba(0,0,0,0.08);
          white-space: pre-wrap;
          overflow-wrap: break-word;
        }

        .dbl-bubble.user {
          background: linear-gradient(135deg,#3b82f6,#2563eb);
          color: white;
          border-bottom-right-radius: 10px;
          padding-right: 14px;
        }

        .dbl-bubble.assistant {
          background: rgba(255,255,255,0.90);
          color: rgba(15,23,42,0.92);
          border: 1px solid rgba(15,23,42,0.06);
          border-bottom-left-radius: 10px;
          padding-left: 14px;
        }

        .dbl-bubble.user::after {
          content: "";
          position: absolute;
          right: -6px;
          bottom: 10px;
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg,#3b82f6,#2563eb);
          transform: rotate(45deg);
          border-radius: 3px;
        }

        .dbl-bubble.assistant::after {
          content: "";
          position: absolute;
          left: -6px;
          bottom: 10px;
          width: 12px;
          height: 12px;
          background: rgba(255,255,255,0.90);
          transform: rotate(45deg);
          border-radius: 3px;
          border-left: 1px solid rgba(15,23,42,0.06);
          border-bottom: 1px solid rgba(15,23,42,0.06);
        }

        .dbl-ts {
          font-size: 11px;
          opacity: 0.55;
          margin-top: 6px;
          padding: 0 2px;
          user-select: none;
        }
        .dbl-ts.user { text-align: right; color: rgba(255,255,255,0.88); }
        .dbl-ts.assistant { text-align: left; color: rgba(15,23,42,0.70); }

        .dbl-chat-footer {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.20) 100%);
          border-top: 1px solid rgba(255,255,255,0.22);
        }

        .dbl-footer-row {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .dbl-input .ant-input {
          height: 46px;
          border-radius: 16px !important;
          border: 1px solid rgba(15,23,42,0.08);
          background: rgba(255,255,255,0.88);
          font-weight: 600;
        }

        .dbl-send-btn.ant-btn {
          height: 46px;
          width: 54px;
          border-radius: 16px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg,#3b82f6,#2563eb);
          box-shadow: 0 16px 40px rgba(59,130,246,0.30), inset 0 1px 0 rgba(255,255,255,0.35);
        }

        .dbl-attach-btn.ant-btn {
          height: 46px;
          width: 54px;
          border-radius: 16px;
          border: none;
          background: rgba(255,255,255,0.72);
          box-shadow: 0 10px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dbl-file-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .dbl-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(15,23,42,0.08);
          font-weight: 700;
          font-size: 12px;
          color: rgba(15,23,42,0.86);
        }

        .dbl-chip-btn.ant-btn {
          height: 24px;
          width: 28px;
          border-radius: 999px;
          border: none;
          background: rgba(15,23,42,0.06);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        /* Markdown basics */
        .dbl-md :where(p, ul, ol, pre, table) { margin: 0; }
        .dbl-md p + p { margin-top: 8px; }
        .dbl-md ul, .dbl-md ol { padding-left: 18px; margin-top: 6px; }
        .dbl-md a { text-decoration: underline; }

        .dbl-code {
          margin-top: 8px;
          background: rgba(15,23,42,0.06);
          border: 1px solid rgba(15,23,42,0.10);
          border-radius: 14px;
          padding: 10px;
          overflow: auto;
        }
        .dbl-code-inline {
          background: rgba(15,23,42,0.07);
          border-radius: 8px;
          padding: 2px 6px;
        }
      `}</style>

      <motion.div
        className="dbl-chat"
        initial={{ opacity: 0, y: 16, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.985 }}
        transition={spring}
      >
        <div className="dbl-chat-header">
          <div className="dbl-chat-title">
            <div className="dbl-chat-icon">{icon}</div>
            <Text className="dbl-title-text" strong>
              {title}
            </Text>
          </div>

          <div className="dbl-header-actions">
            {extraHeader}
            <Space>
              <Button size="small" className="dbl-control" onClick={onMinimize}>
                —
              </Button>
              <Button size="small" className="dbl-control" onClick={onClose} icon={<X size={14} />} />
            </Space>
          </div>
        </div>

        <div className="dbl-chat-body" ref={bodyRef}>
          {messages.map((m) => (
            <div key={m.id} className={`dbl-msg-row ${m.role}`}>
              <div className="dbl-msg-col">
                <div className={`dbl-bubble ${m.role}`}>
                  {m.role === "assistant" ? (
                    <MarkdownBubble content={m.content} />
                  ) : (
                    <span>{m.content}</span>
                  )}
                </div>
                <div className={`dbl-ts ${m.role}`}>{fmtTime(m.ts)}</div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="dbl-msg-row assistant">
              <div className="dbl-msg-col">
                <div className="dbl-bubble assistant">Typing…</div>
                <div className="dbl-ts assistant">{fmtTime(Date.now())}</div>
              </div>
            </div>
          )}
        </div>

        <div className="dbl-chat-footer">
          {/* File chips */}
          {attachEnabled && (files?.length || 0) > 0 && (
            <div className="dbl-file-chips">
              {files!.map((f, idx) => (
                <span key={`${f.name}-${idx}`} className="dbl-chip" title={`${f.name} (${f.size} bytes)`}>
                  {f.name}
                  <Button
                    className="dbl-chip-btn"
                    size="small"
                    onClick={() => {
                      const next = files!.filter((_, i) => i !== idx);
                      onFilesChange?.(next);
                    }}
                    aria-label="Remove file"
                  >
                    <X size={12} />
                  </Button>
                </span>
              ))}

              <Tooltip title="Clear all attachments">
                <Button className="dbl-chip-btn" size="small" onClick={onClearFiles} aria-label="Clear files">
                  <Trash size={12} />
                </Button>
              </Tooltip>
            </div>
          )}

          <div className="dbl-footer-row">
            {/* Attach */}
            {attachEnabled && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  multiple
                  onChange={(e) => {
                    const next = Array.from(e.target.files || []);
                    if (!next.length) return;
                    onFilesChange?.([...(files || []), ...next]);
                    // reset so selecting same file again triggers change
                    e.currentTarget.value = "";
                  }}
                />
                <Tooltip title="Attach files">
                  <Button
                    className="dbl-attach-btn"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Attach"
                  >
                    <Paperclip size={20} weight="bold" />
                  </Button>
                </Tooltip>
              </>
            )}

            <Input
              className="dbl-input"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onPressEnter={typing ? onStop : onSend}
              placeholder={inputPlaceholder}
              allowClear
              // ✅ allow typing while streaming (better UX)
              disabled={false}
            />

            <Button
              type="primary"
              className="dbl-send-btn"
              onClick={typing ? onStop : onSend}
              aria-label={typing ? "Stop" : "Send"}
              disabled={typing ? !onStop : false}
            >
              {typing ? <Stop size={20} weight="fill" /> : <PaperPlaneTilt size={20} weight="fill" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
