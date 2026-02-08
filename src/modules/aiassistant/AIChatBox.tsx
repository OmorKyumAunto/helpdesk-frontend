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

function defaultWelcome(): ChatMessage[] {
  return [{ id: uid(), role: "assistant", content: "Hi! I’m DBL AI Assistant 👋", ts: Date.now() }];
}

function storageKey(userId: string) {
  return `dbl_ai_chat_${userId}`;
}
function isSopCommand(text: string) {
      return text.trim().toLowerCase().startsWith("/sop");
    }

function isAssetQuery(text: string) {
  const t = text.toLowerCase();
  return (
    t.includes("asset") ||
    t.includes("serial") ||
    t.includes("employee id") ||
    t.includes("emp id") ||
    t.includes("eid") ||
    /\b\d{3,10}\b/.test(t)
  );
}

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
        `- \`/ticket\` generate a ticket template\n`,
    };
  }

  if (t === "/clear") {
    return { handled: true, assistantText: "✅ Cleared. How can I help?", alsoClear: true };
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

/** --- Web Speech API types (no extra deps) --- */
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

export default function AIChatBox({
  open,
  minimized,
  maximized,
  onMinimize,
  onMaximize,
  onRestore,
  onClose,
  userId,
}: {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onRestore: () => void;
  onClose: () => void;
  userId: string;
}) {
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState<ChatMessage[]>(defaultWelcome);

  const [isAdmin] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // -------------------- ✅ Voice Input (TicketChatBox style) --------------------
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceBaseTextRef = useRef<string>(""); // text before current listen session
  const suppressVoiceEndToastRef = useRef(false);

  const [voiceSupported, setVoiceSupported] = useState(false);
  const [listening, setListening] = useState(false);

  const stopVoice = () => {
    try {
      recognitionRef.current?.stop();
    } catch { }
  };

  useEffect(() => {
    const Ctor = getSpeechRecognitionCtor();
    setVoiceSupported(!!Ctor);
    if (!Ctor) return;

    const rec: SpeechRecognitionLike = new Ctor();
    rec.lang = "en-US"; // change if you want: "bn-BD"
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

      // Keep silent (or enable if you want)
      // antdMsg.info("Voice input stopped.");
    };

    rec.onerror = (e: any) => {
      setListening(false);
      const code = e?.error || "unknown";

      if (code === "not-allowed" || code === "service-not-allowed") {
        antdMsg.error("Microphone permission denied. Please allow mic access in the browser.");
      } else if (code === "no-speech") {
        antdMsg.info("No speech detected.");
      } else if (code === "aborted") {
        // ignore (common on stop/abort)
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
      } catch { }
      recognitionRef.current = null;
    };
  }, []);

  const startVoice = () => {
    if (!voiceSupported) return antdMsg.warning("Voice input is not supported in this browser.");
    if (listening) return;

    voiceBaseTextRef.current = input.trim();

    try {
      recognitionRef.current?.start();
    } catch (e: any) {
      // Some browsers throw if already started; abort then retry once
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

  // Silent stop mic when chat closes/minimized
  useEffect(() => {
    if (!open || minimized) {
      suppressVoiceEndToastRef.current = true;
      stopVoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, minimized]);
  // ---------------------------------------------------------------------------

  // Load persisted chat per user
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(userId));
      if (!raw) return;
      const parsed = JSON.parse(raw) as ChatMessage[];
      if (Array.isArray(parsed) && parsed.length) setMsgs(parsed);
    } catch { }
  }, [userId]);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(userId), JSON.stringify(msgs));
    } catch { }
  }, [msgs, userId]);

  // Convert UI messages -> model history format
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

  const clearChat = () => {
    setMsgs(defaultWelcome());
    setInput("");
    try {
      localStorage.removeItem(storageKey(userId));
    } catch { }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || typing) return;

    // ✅ stop mic on send (silent)
    if (listening) {
      suppressVoiceEndToastRef.current = true;
      stopVoice();
    }

    // client-side tools
    const tool = runClientTool(text);
    if (tool.handled) {
      if (tool.alsoClear) {
        clearChat();
        setMsgs((p) => [...p, { id: uid(), role: "assistant", content: tool.assistantText, ts: Date.now() }]);
      } else {
        setMsgs((p) => [
          ...p,
          { id: uid(), role: "user", content: text, ts: Date.now() },
          { id: uid(), role: "assistant", content: tool.assistantText, ts: Date.now() },
        ]);
      }
      setInput("");
      return;
    }

    setMsgs((p) => [...p, { id: uid(), role: "user", content: text, ts: Date.now() }]);
    setInput("");

    const assistantId = uid();
    setMsgs((p) => [...p, { id: assistantId, role: "assistant", content: "…", ts: Date.now() }]);

    stopStreaming();
    abortRef.current = new AbortController();

    setTyping(true);
    let full = "";
    const isSop = isSopCommand(text);

// remove "/sop" from message before sending
const finalMessage = isSop ? text.replace(/^\/sop\s*/i, "").trim() : text;

const assetMode = !isSop && isAssetQuery(text) ? "assets" : undefined;
const mode = isSop ? "sop" : assetMode;



    

    await streamChatWithGemini({
      url: STREAM_URL,
      message: finalMessage,
      userId,
      conversationHistory: historyForFn.slice(-10),
      systemPrompt: SYSTEM_PROMPT,
      mode,
      isAdmin,
      files: [], // keep empty
      signal: abortRef.current.signal,
      onText: (chunk) => {
        full += chunk;
        setMsgs((p) => p.map((m) => (m.id === assistantId ? { ...m, content: full || "…" } : m)));
      },
      onDone: () => {
        setTyping(false);
      },
      onError: (e) => {
        setTyping(false);
        setMsgs((p) =>
          p.map((m) => (m.id === assistantId ? { ...m, content: `⚠️ ${e?.message || "Stream error"}` } : m))
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
              // silent stop mic
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
