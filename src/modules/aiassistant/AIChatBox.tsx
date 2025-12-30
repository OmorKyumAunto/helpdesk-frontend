import React, { useEffect, useMemo, useRef, useState } from "react";
import ChatShell, { ChatMessage } from "./ChatShell";
import { ChatCircleDots } from "@phosphor-icons/react";
import { streamChatWithGemini, type FuncMsg } from "./api/geminiStream";
import { Button, Tooltip } from "antd";

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

// Your stream endpoint
const STREAM_URL = import.meta.env.VITE_GEMINI_STREAM_URL as string;

// ✅ System prompt (sent to backend) + also used for client-side tools
const SYSTEM_PROMPT = `
You are DBL AI Assistant for DBL Group IT.
Be concise, helpful, and practical.
When asked to draft a ticket, format it with: Title, Description, Steps to Reproduce, Expected, Actual, Impact, Priority, Attachments.
If files are attached, reference them under "Attachments".
`.trim();

function defaultWelcome(): ChatMessage[] {
  return [{ id: uid(), role: "assistant", content: "Hi! I’m DBL AI Assistant 👋", ts: Date.now() }];
}

function storageKey(userId: string) {
  return `dbl_ai_chat_${userId}`;
}

type ToolResult =
  | { handled: false }
  | { handled: true; assistantText: string; alsoClear?: boolean };

function runClientTool(text: string, files: File[]): ToolResult {
  const t = text.trim();

  if (t === "/help") {
    return {
      handled: true,
      assistantText:
        `**Commands**\n` +
        `- \`/help\` show commands\n` +
        `- \`/clear\` clear chat\n` +
        `- \`/ticket\` generate a ticket template (uses your last message / attachments)\n\n` +
        `**Tips**\n- Attach screenshots/logs, then describe the issue.`,
    };
  }

  if (t === "/clear") {
    return { handled: true, assistantText: "✅ Cleared. How can I help?", alsoClear: true };
  }

  if (t.startsWith("/ticket")) {
    const attachList =
      files.length > 0 ? files.map((f) => `- ${f.name}`).join("\n") : "_(none)_";
    return {
      handled: true,
      assistantText:
        `### Ticket Draft\n` +
        `**Title:** \n\n` +
        `**Description:** \n\n` +
        `**Steps to Reproduce:**\n1.\n2.\n3.\n\n` +
        `**Expected Result:** \n\n` +
        `**Actual Result:** \n\n` +
        `**Impact:** \n\n` +
        `**Priority:** Low / Medium / High / Critical\n\n` +
        `**Attachments:**\n${attachList}\n`,
    };
  }

  return { handled: false };
}

export default function AIChatBox({
  open,
  minimized,
  onMinimize,
  onRestore,
  onClose,
  userId,
}: {
  open: boolean;
  minimized: boolean;
  onMinimize: () => void;
  onRestore: () => void; // not used; restore happens via minimized pill
  onClose: () => void;
  userId: string;
}) {
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [msgs, setMsgs] = useState<ChatMessage[]>(defaultWelcome);

  const abortRef = useRef<AbortController | null>(null);

  // ✅ Load persisted chat per user
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(userId));
      if (!raw) return;
      const parsed = JSON.parse(raw) as ChatMessage[];
      if (Array.isArray(parsed) && parsed.length) setMsgs(parsed);
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // ✅ Persist on change (simple + safe)
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(userId), JSON.stringify(msgs));
    } catch {
      // ignore
    }
  }, [msgs, userId]);

  // Convert UI messages -> model history format (user/model)
  const historyForFn = useMemo<FuncMsg[]>(
    () =>
      msgs
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          content: m.content,
        })),
    [msgs]
  );

  const stopStreaming = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setTyping(false);
  };

  const clearFiles = () => setFiles([]);

  const clearChat = () => {
    setMsgs(defaultWelcome());
    setInput("");
    clearFiles();
    try {
      localStorage.removeItem(storageKey(userId));
    } catch {
      // ignore
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || typing) return;

    // ✅ client-side tools first
    const tool = runClientTool(text, files);
    if (tool.handled) {
      if (tool.alsoClear) {
        clearChat();
        // after clear, add assistant confirmation
        setMsgs((p) => [...p, { id: uid(), role: "assistant", content: tool.assistantText, ts: Date.now() }]);
      } else {
        setMsgs((p) => [
          ...p,
          { id: uid(), role: "user", content: text, ts: Date.now() },
          { id: uid(), role: "assistant", content: tool.assistantText, ts: Date.now() },
        ]);
      }
      setInput("");
      // keep attachments unless you want auto-clear:
      // clearFiles();
      return;
    }

    // add user message
    setMsgs((p) => [...p, { id: uid(), role: "user", content: text, ts: Date.now() }]);
    setInput("");

    // placeholder assistant message
    const assistantId = uid();
    setMsgs((p) => [...p, { id: assistantId, role: "assistant", content: "…", ts: Date.now() }]);

    // cancel previous stream
    stopStreaming();
    abortRef.current = new AbortController();

    setTyping(true);
    let full = "";

    await streamChatWithGemini({
      url: STREAM_URL,
      message: text,
      userId,
      conversationHistory: historyForFn.slice(-10),
      systemPrompt: SYSTEM_PROMPT,
      files,
      signal: abortRef.current.signal,
      onText: (chunk) => {
        full += chunk;
        setMsgs((p) => p.map((m) => (m.id === assistantId ? { ...m, content: full || "…" } : m)));
      },
      onDone: () => {
        setTyping(false);
        // ✅ auto-clear attachments after a successful send (common UX)
        clearFiles();
      },
      onError: (e) => {
        setTyping(false);
        setMsgs((p) =>
          p.map((m) =>
            m.id === assistantId ? { ...m, content: `⚠️ ${e?.message || "Stream error"}` } : m
          )
        );
      },
    });
  };

  if (!open) return null;
  if (minimized) return null;

  return (
    <ChatShell
      open={open}
      title="DBL AI Assistant"
      icon={<ChatCircleDots size={18} weight="fill" />}

      extraHeader={
        <Tooltip title="Clear chat">
          <Button
            size="small"
            className="dbl-control"
            onClick={() => {
              stopStreaming();
              clearChat();
            }}
          >
            Clear
          </Button>
        </Tooltip>
      }

      messages={msgs}
      typing={typing}
      inputValue={input}
      inputPlaceholder="Ask me anything…"
      onInputChange={setInput}
      onSend={send}
      onStop={stopStreaming} // ✅ Stop button works

      onMinimize={() => {
        // ✅ Minimizing stops stream
        stopStreaming();
        onMinimize();
      }}
      onClose={() => {
        stopStreaming();
        onClose();
      }}

    />
  );
}
