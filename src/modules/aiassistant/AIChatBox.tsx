
import React, { useEffect, useMemo, useRef, useState } from "react";
import ChatShell, { ChatMessage } from "./ChatShell";
import { ChatCircleDots } from "@phosphor-icons/react";
import { streamChatWithGemini, type FuncMsg } from "./api/geminiStream";
import { Button, Tooltip, message as antdMsg } from "antd";

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const STREAM_URL = import.meta.env.VITE_GEMINI_STREAM_URL as string;

const SYSTEM_PROMPT = `
You are DBL AI Assistant for DBL Group IT.
Be concise, helpful, and practical.
When asked to draft a ticket, format it with: Title, Description, Steps to Reproduce, Expected, Actual, Impact, Priority.
`.trim();

/** 🔐 CHANGE THIS to your actual login key */
const TOKEN_KEY = "token"; // e.g. "TOKEN" or "access_token" etc.

type Mode = "chat" | "assets" | "sop";

function defaultWelcome(): ChatMessage[] {
  return [
    {
      id: uid(),
      role: "assistant",
      content: "Hi! I’m DBL AI Assistant 👋",
      ts: Date.now(),
    },
  ];
}

function storageKey(userId: string) {
  return `dbl_ai_chat_${userId}`;
}

/** ==================== MODE DETECTION ==================== */

function getForcedMode(text: string): Mode | null {
  const t = text.trim().toLowerCase();
  if (t.startsWith("/chat")) return "chat";
  if (t.startsWith("/assets")) return "assets";
  if (t.startsWith("/sop")) return "sop";
  if (t.startsWith("/employee")) return "assets";
  return null;
}

function stripModePrefix(text: string) {
  return text.replace(/^\/(chat|assets|sop|employee)\s*/i, "").trim();
}

function parseSopCategoryAndQuery(text: string) {
  // supports: /sop [Email] reset password
  const m = text.trim().match(/^\/sop\s*(?:\[(.+?)\])?\s*(.*)$/i);
  if (!m)
    return { category: null as string | null, query: stripModePrefix(text) };
  return { category: m[1]?.trim() || null, query: (m[2] || "").trim() };
}

/** ==================== INTENTS ==================== */

function isMyAssetsIntent(text = "") {
  const s = text.toLowerCase();
  return (
    s.includes("my asset") ||
    s.includes("my assets") ||
    s.includes("my laptop") ||
    s.includes("my device") ||
    s.includes("assigned to me") ||
    s.includes("given to me") ||
    s.includes("what assets do i have") ||
    // Banglish
    s.includes("amar asset") ||
    s.includes("amar assets") ||
    s.includes("amar kache ki ache") ||
    s.includes("amar ki ki asset") ||
    // Bangla
    s.includes("আমার অ্যাসেট") ||
    s.includes("আমার কাছে কি") ||
    s.includes("আমাকে দেয়া")
  );
}

function isAssetQuery(text: string) {
  const t = text.toLowerCase();

  const hasAssetWords =
    t.includes("asset") ||
    t.includes("serial") ||
    t.includes("laptop") ||
    t.includes("desktop") ||
    t.includes("monitor") ||
    t.includes("po ") ||
    t.includes("purchase order") ||
    t.includes("employee id") ||
    t.includes("emp id") ||
    t.includes("eid") ||
    t.includes("@");

  const hasEmpIdLike = /\b\d{5,12}\b/.test(t);

  // serial-like token must contain both letters+digits
  const hasSerialLike =
    /\b[a-z0-9]{4,}\b/i.test(text) && /[a-z]/i.test(text) && /\d/.test(text);

  return hasAssetWords || hasEmpIdLike || hasSerialLike;
}

function isEmployeeQuery(text: string) {
  const t = text.toLowerCase().trim();

  // direct employee indicators only
  const hasExplicitEmployeeWords =
    t.startsWith("who is ") ||
    t.includes("employee id") ||
    t.includes("emp id") ||
    t.includes("profile of") ||
    t.includes("designation of") ||
    t.includes("department of") ||
    t.includes("line manager of");

  const hasEmail = /\S+@\S+\.\S+/.test(t);
  const hasEmpId = /\b\d{5,12}\b/.test(t);

  return hasExplicitEmployeeWords || hasEmail || hasEmpId;
}

/** ==================== CLIENT TOOLS ==================== */

type ToolResult =
  | { handled: false }
  | { handled: true; assistantText: string; alsoClear?: boolean };

function runClientTool(text: string): ToolResult {
  const t = text.trim();

  if (t === "/help") {
    return {
      handled: true,
      assistantText:
        `**Commands**\n` +
        `- \`/help\` show commands\n` +
        `- \`/clear\` clear chat\n` +
        `- \`/ticket\` generate a ticket template\n` +
        `- \`/chat <msg>\` force chat\n` +
        `- \`/assets <msg>\` force assets\n` +
        `- \`/employee <msg>\` (alias) employee/profile lookup\n` +
        `- \`/sop [Category] <msg>\` SOP search\n`,
    };
  }

  if (t === "/clear") {
    return {
      handled: true,
      assistantText: "✅ Cleared. How can I help?",
      alsoClear: true,
    };
  }

  if (t.startsWith("/ticket")) {
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
        `**Priority:** Low / Medium / High / Critical\n`,
    };
  }

  return { handled: false };
}

/** ==================== VOICE TYPES ==================== */

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: null | (() => void);
  onend: null | (() => void);
  onerror: null | ((event: any) => void);
  onresult: null | ((event: any) => void);
};

function getSpeechRecognitionCtor(): any | null {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

function toPlainText(text: string) {
  return (text || "").replace(/\s+/g, " ").trim();
}

function getAuthHeader() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? `Bearer ${token}` : undefined;
}

/** ==================== COMPONENT ==================== */

export default function AIChatBox({
  open,
  minimized,
  maximized,
  onMinimize,
  onMaximize,
  onRestore,
  onClose,
  userId,
  roleId,
}: {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onRestore: () => void;
  onClose: () => void;
  userId: string;
  roleId?: string | number;
}) {
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState<ChatMessage[]>(defaultWelcome);

  const [isAdmin] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // -------------------- Voice Input --------------------
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceBaseTextRef = useRef<string>("");
  const suppressVoiceEndToastRef = useRef(false);

  const [voiceSupported, setVoiceSupported] = useState(false);
  const [listening, setListening] = useState(false);

  const stopVoice = () => {
    try {
      recognitionRef.current?.stop();
    } catch {}
  };

  useEffect(() => {
    const Ctor = getSpeechRecognitionCtor();
    setVoiceSupported(!!Ctor);
    if (!Ctor) return;

    const rec: SpeechRecognitionLike = new Ctor();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);

    rec.onend = () => {
      setListening(false);
      if (suppressVoiceEndToastRef.current) {
        suppressVoiceEndToastRef.current = false;
        return;
      }
    };

    rec.onerror = (e: any) => {
      setListening(false);
      const code = e?.error || "unknown";

      if (code === "not-allowed" || code === "service-not-allowed") {
        antdMsg.error(
          "Microphone permission denied. Please allow mic access in the browser."
        );
      } else if (code === "no-speech") {
        antdMsg.info("No speech detected.");
      } else if (code === "aborted") {
        // ignore
      } else {
        antdMsg.error(`Voice input error: ${code}`);
      }
    };

    rec.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const txt = res?.[0]?.transcript ?? "";
        if (res.isFinal) finalText += txt;
        else interimText += txt;
      }

      const base = voiceBaseTextRef.current || "";
      const combined = toPlainText(`${base} ${finalText} ${interimText}`);
      setInput(combined);
    };

    recognitionRef.current = rec;

    return () => {
      try {
        rec.onstart = null;
        rec.onend = null;
        rec.onerror = null;
        rec.onresult = null;
        rec.abort();
      } catch {}
      recognitionRef.current = null;
    };
  }, []);

  const startVoice = () => {
    if (!voiceSupported)
      return antdMsg.warning("Voice input is not supported in this browser.");
    if (listening) return;

    voiceBaseTextRef.current = input.trim();

    try {
      recognitionRef.current?.start();
    } catch {
      try {
        recognitionRef.current?.abort();
        recognitionRef.current?.start();
      } catch {
        antdMsg.error("Could not start microphone. Try again.");
      }
    }
  };

  const toggleVoice = () => {
    if (listening) stopVoice();
    else startVoice();
  };

  useEffect(() => {
    if (!open || minimized) {
      suppressVoiceEndToastRef.current = true;
      stopVoice();
    }
  }, [open, minimized]);

  // Load persisted chat per user
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(userId));
      if (!raw) return;
      const parsed = JSON.parse(raw) as ChatMessage[];
      if (Array.isArray(parsed) && parsed.length) setMsgs(parsed);
    } catch {}
  }, [userId]);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(userId), JSON.stringify(msgs));
    } catch {}
  }, [msgs, userId]);

  // Convert UI messages -> model history format (skip "…")
  const historyForFn = useMemo<FuncMsg[]>(
    () =>
      msgs
        .filter(
          (m) =>
            (m.role === "user" || m.role === "assistant") &&
            (m.content || "").trim() !== "…"
        )
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

  const clearChat = () => {
    setMsgs(defaultWelcome());
    setInput("");
    try {
      localStorage.removeItem(storageKey(userId));
    } catch {}
  };

  const send = async () => {
    const rawText = input.trim();
    if (!rawText || typing) return;

    // stop mic silently
    if (listening) {
      suppressVoiceEndToastRef.current = true;
      stopVoice();
    }

    // tools
    const tool = runClientTool(rawText);
    if (tool.handled) {
      if (tool.alsoClear) {
        clearChat();
        setMsgs((p) => [
          ...p,
          {
            id: uid(),
            role: "assistant",
            content: tool.assistantText,
            ts: Date.now(),
          },
        ]);
      } else {
        setMsgs((p) => [
          ...p,
          { id: uid(), role: "user", content: rawText, ts: Date.now() },
          {
            id: uid(),
            role: "assistant",
            content: tool.assistantText,
            ts: Date.now(),
          },
        ]);
      }
      setInput("");
      return;
    }

    setMsgs((p) => [
      ...p,
      { id: uid(), role: "user", content: rawText, ts: Date.now() },
    ]);
    setInput("");

    const assistantId = uid();
    setMsgs((p) => [
      ...p,
      { id: assistantId, role: "assistant", content: "…", ts: Date.now() },
    ]);

    stopStreaming();
    abortRef.current = new AbortController();
    setTyping(true);

    // ✅ AUTH header for all modes
    const authToken = getAuthHeader();

    // ✅ Decide mode/message/category
    const forcedMode = getForcedMode(rawText);

    let mode: Mode = "chat";
    let category: string | null = null;
    let finalMessage = rawText;

    if (forcedMode) {
      mode = forcedMode;

      if (mode === "sop") {
        const sopParsed = parseSopCategoryAndQuery(rawText);
        category = sopParsed.category;
        finalMessage = sopParsed.query;
      } else {
        finalMessage = stripModePrefix(rawText);
      }
    } else {
      if (rawText.toLowerCase().startsWith("/sop")) {
        mode = "sop";
        const sopParsed = parseSopCategoryAndQuery(rawText);
        category = sopParsed.category;
        finalMessage = sopParsed.query;
      } else if (isEmployeeQuery(rawText)) {
        mode = "assets";
      } else if (isAssetQuery(rawText)) {
        mode = "assets";
      } else {
        mode = "chat";
      }
    }

    const roleIdStr = roleId != null ? String(roleId) : "";

    // ✅ Role 3 (Employee): Chat + My Assets only
    if (roleIdStr === "3") {
      const msg = stripModePrefix(rawText);

      if (isMyAssetsIntent(msg)) {
        mode = "assets";
        category = null;
        finalMessage = msg;
      } else {
        mode = "chat";
        category = null;
        finalMessage = msg;
      }
    }

    let full = "";

    await streamChatWithGemini({
      url: STREAM_URL,
      message: finalMessage,
      userId,
      roleId,
      conversationHistory: historyForFn.slice(-10),
      systemPrompt: SYSTEM_PROMPT,
      mode,
      category,
      isAdmin,
      authToken,
      files: [],
      signal: abortRef.current.signal,
      onText: (chunk) => {
        full += chunk;
        setMsgs((p) =>
          p.map((m) =>
            m.id === assistantId ? { ...m, content: full || "…" } : m
          )
        );
      },
      onDone: () => setTyping(false),
      onError: (e) => {
        setTyping(false);
        setMsgs((p) =>
          p.map((m) =>
            m.id === assistantId
              ? { ...m, content: `⚠️ ${e?.message || "Stream error"}` }
              : m
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
      maximized={maximized}
      onMaximize={onMaximize}
      onRestore={onRestore}
      title="DBL AI Assistant"
      icon={<ChatCircleDots size={18} weight="fill" />}
      extraHeader={
        <Tooltip title="Clear chat">
          <Button
            size="small"
            className="dbl-control"
            onClick={() => {
              suppressVoiceEndToastRef.current = true;
              stopVoice();
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
      inputPlaceholder={listening ? "Listening… speak now" : "Ask me anything…"}
      onInputChange={setInput}
      onSend={send}
      onStop={stopStreaming}
      onMinimize={() => {
        suppressVoiceEndToastRef.current = true;
        stopVoice();
        stopStreaming();
        onMinimize();
      }}
      onClose={() => {
        suppressVoiceEndToastRef.current = true;
        stopVoice();
        stopStreaming();
        onClose();
      }}
      voiceSupported={voiceSupported}
      listening={listening}
      onToggleVoice={toggleVoice}
    />
  );
}

